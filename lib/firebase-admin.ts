import 'server-only';

import {
  initializeApp,
  getApps,
  getApp,
  applicationDefault,
  type App,
  type Credential,
} from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { ExternalAccountClient, GoogleAuth, type BaseExternalAccountClient } from 'google-auth-library';
import { getVercelOidcToken } from '@vercel/oidc';

// Node runtime only. This module must never be imported from middleware.ts or
// any Edge route — firebase-admin depends on Node built-ins and will fail to
// build. Middleware verifies session cookies with `jose` instead.
//
// There is deliberately no service account key here. Key creation is blocked on
// this project by the org policy iam.disableServiceAccountKeyCreation, and
// long-lived keys are the most commonly leaked cloud credential anyway. Instead:
//
//   Vercel → Workload Identity Federation. Vercel mints a short-lived OIDC
//            token per invocation; GCP trusts it and hands back a short-lived
//            access token. No secret is stored anywhere.
//   Local  → Application Default Credentials, from `gcloud auth application-default login`.

const ADMIN_APP_NAME = 'bagpackerme-admin';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. It is required to authenticate to Google Cloud from Vercel. ` +
        'See .env.example for where to find it in the Cloud Console.'
    );
  }
  return value;
}

/**
 * Workload Identity Federation identifiers, with the live bagpackerme-webb
 * values as defaults.
 *
 * These are identifiers, not secrets. None of them grants anything on its own —
 * the trust lives entirely in the IAM binding on the service account, which is
 * keyed to Vercel's OIDC subject (owner:bagpackerme:project:bagpackerme:
 * environment:production). Knowing the pool name gets an attacker no further
 * than knowing the project ID does.
 *
 * They are defaulted rather than required because four env vars that never
 * change are four chances for a deploy to fail closed. When they were required,
 * a missing one surfaced as a 401 on the admin login with no indication that
 * the cause was configuration rather than a bad password.
 *
 * Setting the env var still wins, so a different project, pool, or service
 * account is a dashboard change and not a code change.
 */
const WIF_DEFAULTS = {
  GCP_PROJECT_NUMBER: '260414714668',
  GCP_SERVICE_ACCOUNT_EMAIL: 'vercel-app@bagpackerme-webb.iam.gserviceaccount.com',
  GCP_WORKLOAD_IDENTITY_POOL_ID: 'vercel',
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: 'vercel',
} as const;

function wifConfig(name: keyof typeof WIF_DEFAULTS): string {
  return process.env[name] || WIF_DEFAULTS[name];
}

let externalAccountClientCache: BaseExternalAccountClient | null = null;

/**
 * The Workload Identity Federation client for Vercel. Exchanges the request's
 * Vercel OIDC token for a Google access token that impersonates the service
 * account.
 *
 * Shared by firebase-admin (wrapped as a Credential below) and the Storage REST
 * calls (via adminAccessToken), so the STS exchange and its token cache are not
 * duplicated per caller. Cached because it is otherwise rebuilt per request.
 */
function vercelExternalAccountClient(): BaseExternalAccountClient {
  if (externalAccountClientCache) return externalAccountClientCache;

  const projectNumber = wifConfig('GCP_PROJECT_NUMBER');
  const poolId = wifConfig('GCP_WORKLOAD_IDENTITY_POOL_ID');
  const providerId = wifConfig('GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID');
  const serviceAccountEmail = wifConfig('GCP_SERVICE_ACCOUNT_EMAIL');

  const providerPath = `projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`;

  // The `audience` here is the STS provider identifier, not the OIDC token's
  // `aud` claim. The GCP provider is configured to accept Vercel's native
  // audience (https://vercel.com/bagpackerme), so getVercelOidcToken() is
  // called with no override and the default token is used as-is.
  const stsAudience = `//iam.googleapis.com/${providerPath}`;

  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: stsAudience,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: () => getVercelOidcToken(),
    },
  });

  if (!authClient) {
    throw new Error('Could not build the GCP external account client — check the GCP_* env vars.');
  }

  externalAccountClientCache = authClient;
  return authClient;
}

/**
 * Federated credential for Vercel, in the shape firebase-admin wants.
 */
function vercelFederatedCredential(): Credential {
  const authClient = vercelExternalAccountClient();

  // firebase-admin wants a Credential, not a google-auth-library client.
  return {
    async getAccessToken() {
      const { token } = await authClient.getAccessToken();
      if (!token) {
        throw new Error('Workload Identity Federation returned no access token.');
      }
      const expiryDate = authClient.credentials?.expiry_date;
      return {
        access_token: token,
        expires_in: expiryDate
          ? Math.max(0, Math.floor((expiryDate - Date.now()) / 1000))
          : 3600,
      };
    },
  };
}

function getAdminApp(): App {
  const existing = getApps().find((a) => a.name === ADMIN_APP_NAME);
  if (existing) return getApp(ADMIN_APP_NAME);

  const projectId = requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID');

  // process.env.VERCEL is set on every Vercel deployment and build.
  const credential = process.env.VERCEL ? vercelFederatedCredential() : applicationDefault();

  return initializeApp({ credential, projectId }, ADMIN_APP_NAME);
}

// Lazy so that a misconfiguration surfaces on the request that needs it, rather
// than crashing the build or unrelated routes.
export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

let localAuthCache: GoogleAuth | null = null;

/**
 * A Google Cloud access token for calling GCS directly over HTTPS
 * (see lib/storage-admin.ts). Scoped to cloud-platform, which covers Storage.
 *
 * Storage is reached by REST rather than through a client library, for two
 * reasons:
 *
 *   1. firebase-admin's getStorage() accepts only a ServiceAccountCredential or
 *      application default credentials, and throws 'invalid-credential' on
 *      anything else — including the federated Credential built above. Because
 *      local dev uses applicationDefault(), it would work on a developer's
 *      machine and throw only on Vercel.
 *   2. @google-cloud/storage pins google-auth-library v9 while firebase-admin
 *      pulls v10, so the two resolve to separate copies with incompatible class
 *      hierarchies. Handing our v10 client to its `authClient` option fails to
 *      typecheck, and would be fragile even cast — the library `instanceof`-checks
 *      credentials, and those checks do not hold across duplicate copies.
 *
 * The REST surface we need is two calls, so this drops a heavy dependency and a
 * version conflict in exchange for a little plumbing. Only the token source
 * branches per environment — mirroring getAdminApp() above.
 */
export async function adminAccessToken(): Promise<string> {
  if (process.env.VERCEL) {
    const { token } = await vercelExternalAccountClient().getAccessToken();
    if (!token) {
      throw new Error('Workload Identity Federation returned no access token.');
    }
    return token;
  }

  // Local: ADC, from `gcloud auth application-default login`.
  localAuthCache ??= new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const token = await localAuthCache.getAccessToken();
  if (!token) {
    throw new Error(
      'Could not get an access token from application default credentials. ' +
        'Run `gcloud auth application-default login`.'
    );
  }
  return token;
}

/** The Cloud Storage bucket these credentials operate on. */
export function adminStorageBucketName(): string {
  return requireEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
}
