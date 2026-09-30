import 'server-only';
import { cookies } from 'next/headers';

// A trip is anonymous on purpose. Asking somebody to create an account before
// they can save a second activity is the fastest way to lose the itinerary that
// would have become a lead, so the trip id lives in a cookie and nowhere else
// on the visitor's side. n8n holds the contents.

export const TRIP_COOKIE = 'bpm_trip';

/** Long enough to survive planning a trip across several evenings. */
const TRIP_COOKIE_MAX_AGE = 60 * 60 * 24 * 60;

export function readTripId(): string | null {
  const value = cookies().get(TRIP_COOKIE)?.value?.trim();
  return value ? value : null;
}

/**
 * Persist the trip id returned by n8n. httpOnly because nothing in the browser
 * needs to read it — every trip surface is rendered or proxied server-side.
 */
export function writeTripId(response: Response, tripId: string): void {
  const parts = [
    `${TRIP_COOKIE}=${encodeURIComponent(tripId)}`,
    'Path=/',
    `Max-Age=${TRIP_COOKIE_MAX_AGE}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (process.env.NODE_ENV === 'production') parts.push('Secure');

  response.headers.append('Set-Cookie', parts.join('; '));
}
