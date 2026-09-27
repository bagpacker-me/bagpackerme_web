import { HONEYPOT_FIELD } from '@/lib/honeypot';

/**
 * Newsletter signup, client side.
 *
 * Deliberately not in lib/firestore.ts any more: this no longer touches
 * Firestore. It used to be a browser addDoc, which meant the footer's subscribe
 * button pulled the whole Firebase client SDK into its interaction path — the
 * reason both callers wrapped it in a dynamic import. A plain fetch needs none
 * of that, so callers can import this statically and still ship less.
 *
 * Errors carry the server's message so the toast can say something true.
 */
export async function subscribeToNewsletter(
  email: string,
  honeypotValue = ''
): Promise<{ success: true; alreadySubscribed?: boolean }> {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, [HONEYPOT_FIELD]: honeypotValue }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data?.error === 'string'
        ? data.error
        : 'Something went wrong. Please try again later.'
    );
  }

  return data;
}
