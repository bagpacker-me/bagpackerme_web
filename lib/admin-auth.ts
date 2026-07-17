import 'server-only';
import { adminAuth } from '@/lib/firebase-admin';
import { isAdminEmail } from '@/lib/admin';
import { SESSION_COOKIE } from '@/lib/session';

// Node runtime only — this pulls in firebase-admin. Middleware must keep using
// lib/session.ts instead.
//
// Why this exists rather than extending the middleware matcher to /api/admin/*:
//
//   1. Middleware answers an unauthorised request with a redirect to the HTML
//      login page. A fetch() from the admin UI would follow that redirect and
//      receive 200 + HTML, which is a far worse failure than a clean 401.
//   2. lib/session.ts is Edge-safe by design: it verifies the signature and exp
//      with `jose` and nothing else. It CANNOT detect a revoked session. Only
//      verifySessionCookie(cookie, true) hits Firebase's revocation check, and
//      "the admin signed out everywhere but the cookie is valid for 14 more
//      days" matters for a route that serves candidate CVs.
//   3. Defence in depth: a guard inside the route body cannot be lost to a
//      matcher edit later.

export interface AdminSession {
  uid: string;
  email: string;
}

/**
 * Verifies the admin session cookie on an API request.
 * Returns the session, or null if the cookie is missing, forged, expired,
 * revoked, or belongs to anyone other than the configured admin.
 */
export async function requireAdmin(request: Request): Promise<AdminSession | null> {
  const cookie = readSessionCookie(request);
  if (!cookie) return null;

  try {
    // checkRevoked: true — see (2) above. Costs a round trip; worth it here.
    const decoded = await adminAuth().verifySessionCookie(cookie, true);
    if (!isAdminEmail(decoded.email)) return null;

    return { uid: decoded.uid, email: decoded.email as string };
  } catch {
    // Forged, expired, or revoked. Callers return 401 either way — never leak
    // which, since that distinction only helps someone probing the cookie.
    return null;
  }
}

function readSessionCookie(request: Request): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;

    if (part.slice(0, separator).trim() === SESSION_COOKIE) {
      return decodeURIComponent(part.slice(separator + 1).trim()) || null;
    }
  }

  return null;
}
