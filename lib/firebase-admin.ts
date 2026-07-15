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
import { ExternalAccountClient } from 'google-auth-library';
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
 * Federated credential for Vercel. Exchanges the request's Vercel OIDC token
 * for a Google access token that impersonates the service account.
 */
function vercelFederatedCredential(): Credential {
  const projectNumber = requireEnv('GCP_PROJECT_NUMBER');
  const poolId = requireEnv('GCP_WORKLOAD_IDENTITY_POOL_ID');
  const providerId = requireEnv('GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID');
  const serviceAccountEmail = requireEnv('GCP_SERVICE_ACCOUNT_EMAIL');

  const providerPath = `projects/${projectNumber}/locations/global/workloadIdentityPools/${poolId}/providers/${providerId}`;

  // These two differ by scheme and both matter:
  //   stsAudience   — identifies the provider to Google's STS endpoint.
  //   tokenAudience — the `aud` claim Vercel stamps into the OIDC token. The
  //                   provider is configured with GCP's "default audience",
  //                   which is the https:// form, so the claim must match it
  //                   exactly or the exchange is rejected.
  const stsAudience = `//iam.googleapis.com/${providerPath}`;
  const tokenAudience = `https://iam.googleapis.com/${providerPath}`;

  const authClient = ExternalAccountClient.fromJSON({
    type: 'external_account',
    audience: stsAudience,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    token_url: 'https://sts.googleapis.com/v1/token',
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccountEmail}:generateAccessToken`,
    subject_token_supplier: {
      getSubjectToken: () => getVercelOidcToken({ audience: tokenAudience }),
    },
  });

  if (!authClient) {
    throw new Error('Could not build the GCP external account client — check the GCP_* env vars.');
  }

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
