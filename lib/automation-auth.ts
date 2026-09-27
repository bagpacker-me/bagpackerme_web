import 'server-only';
import { timingSafeEqual } from 'node:crypto';

// Shared guard for /api/automation/*. These routes exist because n8n cannot talk
// to Firestore directly: the org policy iam.disableServiceAccountKeyCreation
// blocks the service-account key that n8n's Firestore node requires, and the
// keyless Workload Identity Federation path in lib/firebase-admin.ts is only
// available from inside a Vercel invocation. So the site reads on n8n's behalf.
//
// That makes these routes a read path over every lead, application and subscriber
// on the platform. They are bearer-guarded rather than admin-cookie-guarded
// because n8n has no browser session to present.

function safeEquals(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  // timingSafeEqual throws on a length mismatch, and the lengths themselves are
  // not secret, so compare them first.
  if (left.length !== right.length) return false;

  return timingSafeEqual(left, right);
}

/**
 * Returns null when the request is authorised, or the Response to return when it
 * is not. Callers do `const denied = requireAutomationAuth(request); if (denied)
 * return denied;`.
 *
 * Fails closed: if AUTOMATION_API_SECRET is unset the endpoints are unreachable
 * rather than open. An automation that has not been configured should look
 * broken, never permissive.
 */
export function requireAutomationAuth(request: Request): Response | null {
  const expected = process.env.AUTOMATION_API_SECRET?.trim();

  if (!expected) {
    console.error('[automation] AUTOMATION_API_SECRET is not set — refusing every request');
    return Response.json({ error: 'Automation API is not configured.' }, { status: 503 });
  }

  const header = request.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token || !safeEquals(token, expected)) {
    // Deliberately terse: no hint about whether the header was missing,
    // malformed, or simply wrong.
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  return null;
}

/** Clamps a caller-supplied `limit` into something a single query can serve. */
export function parseLimit(value: string | null, fallback = 100, max = 500): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

/**
 * Parses `?since=` into a comparable ISO string. Every collection here stores
 * createdAt as an ISO-8601 string rather than a Timestamp, so range filters are
 * lexicographic — which works only because the strings are fixed-length UTC.
 */
export function parseSince(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  const asDate = new Date(trimmed);
  if (Number.isNaN(asDate.getTime())) return null;

  return asDate.toISOString();
}
