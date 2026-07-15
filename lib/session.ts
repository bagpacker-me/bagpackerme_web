// Imported via subpaths, not the `jose` barrel: the barrel pulls in the JWE
// encrypt path, whose deflate helper references CompressionStream and trips an
// Edge Runtime warning on every build. We only verify signed tokens.
import { importX509 } from 'jose/key/import';
import { jwtVerify } from 'jose/jwt/verify';
import { decodeProtectedHeader } from 'jose/decode/protected_header';
// Type-only, so this is erased at compile time and pulls in no runtime code.
import type { JWTPayload } from 'jose';

// Edge-safe. This module is imported by middleware.ts, so it must never pull in
// firebase-admin or any Node built-in. Verification is done against Google's
// published certificates with `jose` instead.

export const SESSION_COOKIE = '__session';

/** Firebase caps session cookie lifetime at 14 days. */
export const SESSION_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

// Session cookies are signed with these keys. Note this is a different endpoint
// from the one used for ID tokens (securetoken@system.gserviceaccount.com).
const SESSION_COOKIE_CERT_URL =
  'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys';

type CertCache = { certs: Record<string, string>; expiresAt: number };
let certCache: CertCache | null = null;

async function fetchCerts(): Promise<Record<string, string>> {
  if (certCache && certCache.expiresAt > Date.now()) {
    return certCache.certs;
  }

  const res = await fetch(SESSION_COOKIE_CERT_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch session cookie certs: ${res.status}`);
  }

  const certs = (await res.json()) as Record<string, string>;

  // Respect Google's cache header so rotated keys are picked up.
  const cacheControl = res.headers.get('cache-control') ?? '';
  const maxAge = Number(/max-age=(\d+)/.exec(cacheControl)?.[1] ?? 3600);

  certCache = { certs, expiresAt: Date.now() + maxAge * 1000 };
  return certs;
}

/**
 * Verifies a Firebase session cookie's signature and claims.
 * Returns the payload, or null if the cookie is missing, forged, or expired.
 */
export async function verifySessionCookie(
  cookie: string | undefined,
  projectId: string | undefined
): Promise<JWTPayload | null> {
  if (!cookie || !projectId) return null;

  try {
    const header = decodeProtectedHeader(cookie);
    if (header.alg !== 'RS256' || !header.kid) return null;

    const certs = await fetchCerts();
    const cert = certs[header.kid];
    if (!cert) return null;

    const key = await importX509(cert, 'RS256');

    const { payload } = await jwtVerify(cookie, key, {
      issuer: `https://session.firebase.google.com/${projectId}`,
      audience: projectId,
    });

    // jwtVerify checks exp/nbf; Firebase additionally requires a real subject.
    if (!payload.sub) return null;

    return payload;
  } catch {
    return null;
  }
}
