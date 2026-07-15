import 'server-only';

import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// Node runtime only. This module must never be imported from middleware.ts or
// any Edge route — firebase-admin depends on Node built-ins and will fail to
// build. Middleware verifies session cookies with `jose` instead.

const ADMIN_APP_NAME = 'bagpackerme-admin';

/**
 * Accepts the service account as either raw JSON or base64-encoded JSON.
 * Vercel's env UI mangles multi-line values, so base64 is the safer format
 * there; .env.local can use either.
 */
function parseServiceAccount(raw: string) {
  const trimmed = raw.trim();
  const json = trimmed.startsWith('{')
    ? trimmed
    : Buffer.from(trimmed, 'base64').toString('utf8');

  const parsed = JSON.parse(json);

  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is missing project_id, client_email, or private_key.'
    );
  }

  // Env vars store newlines escaped; the PEM parser needs them real.
  parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
  return parsed;
}

function getAdminApp(): App {
  const existing = getApps().find((a) => a.name === ADMIN_APP_NAME);
  if (existing) return getApp(ADMIN_APP_NAME);

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY is not set. Generate a key at ' +
        'Firebase Console > Project Settings > Service Accounts and add it to ' +
        '.env.local and your Vercel environment variables.'
    );
  }

  const serviceAccount = parseServiceAccount(raw);

  if (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    serviceAccount.project_id !== process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    throw new Error(
      `Service account project (${serviceAccount.project_id}) does not match ` +
        `NEXT_PUBLIC_FIREBASE_PROJECT_ID (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}).`
    );
  }

  return initializeApp(
    {
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    },
    ADMIN_APP_NAME
  );
}

// Lazy so that a missing key surfaces on the request that needs it, rather
// than crashing the build or unrelated routes.
export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}
