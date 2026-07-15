import 'server-only';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_WINDOW = 5;

// Per-instance memory: on serverless this resets on cold start and does not
// coordinate across concurrent instances, so a determined attacker gets more
// than the cap. It is a speed bump for naive floods, not a security control.
// Promote to Vercel KV / Upstash if abuse becomes real.
// (middleware.ts already leans on per-instance memory for its market cache.)
const submissions = new Map<string, { count: number; resetAt: number }>();

export function clientIpFrom(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Left-most entry is the originating client; the rest are proxies.
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = submissions.get(key);

  if (!entry || now >= entry.resetAt) {
    submissions.set(key, { count: 1, resetAt: now + WINDOW_MS });

    // Opportunistic sweep so the map cannot grow unbounded across a long-lived
    // instance. Cheap because it only runs on a fresh window.
    if (submissions.size > 5000) {
      submissions.forEach((value, existingKey) => {
        if (now >= value.resetAt) submissions.delete(existingKey);
      });
    }

    return false;
  }

  entry.count += 1;
  return entry.count > MAX_SUBMISSIONS_PER_WINDOW;
}

export function isHoneypotTripped(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;

  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim().length > 0;
}
