import 'server-only';

// Side-effect notifications for surfaces where the Firestore write alone is the
// record of truth.
//
// Contrast lib/enquiry-delivery.ts: there the webhook is one of *two* sinks that
// jointly decide whether an enquiry was accepted, so its failure is meaningful
// and gets reported to the caller. Here it is not. A careers application whose
// CV is already in Storage, a Curious Club application the applicant has already
// been shown their personality result for, an affiliate whose code has already
// been generated — all of those are done. n8n being down must not turn any of
// them into an error the visitor sees.
//
// So every failure this can produce is swallowed and logged: unset env var, bad
// URL, timeout, non-2xx, malformed JSON. The boolean return exists for tests and
// logging; callers are not expected to branch on it.

const NOTIFY_TIMEOUT_MS = 5000;

/**
 * Event names double as n8n webhook paths, so adding an event here is the only
 * code change needed to wire a new workflow — the base URL stays one env var
 * instead of one per surface.
 */
export const AUTOMATION_EVENT_PATHS = {
  'careers.applied': 'bpm/careers-applied',
  'club.applied': 'bpm/club-applied',
  'affiliate.registered': 'bpm/affiliate-registered',
  'newsletter.subscribed': 'bpm/newsletter-subscribed',
} as const;

export type AutomationEvent = keyof typeof AUTOMATION_EVENT_PATHS;

function webhookUrlFor(event: AutomationEvent): string | null {
  const base = process.env.N8N_WEBHOOK_BASE_URL?.trim();
  if (!base) return null;

  return `${base.replace(/\/+$/, '')}/${AUTOMATION_EVENT_PATHS[event]}`;
}

/**
 * Fire-and-forget POST to n8n. Never throws.
 *
 * Awaited rather than floated: on Vercel the serverless instance can be frozen
 * the moment the response is returned, so an un-awaited fetch is routinely
 * killed mid-flight. Five seconds of latency on an application submit is an
 * acceptable price for the notification actually arriving.
 */
export async function notifyAutomation(
  event: AutomationEvent,
  payload: Record<string, unknown>
): Promise<boolean> {
  const url = webhookUrlFor(event);

  if (!url) {
    // Not an error: local dev and any deploy that has not configured n8n runs
    // fine without it. Logged at debug volume so it does not look like a fault.
    console.info(`[automation-notify] ${event} skipped — N8N_WEBHOOK_BASE_URL is not set`);
    return false;
  }

  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // n8n webhook URLs are guessable and unauthenticated on their own. The
        // receiving workflow compares this and drops anything that does not
        // match, so a leaked URL alone cannot inject fake applications.
        ...(secret ? { 'X-Automation-Secret': secret } : {}),
      },
      body: JSON.stringify({ event, ...payload }),
      cache: 'no-store',
      signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[automation-notify] ${event} responded ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[automation-notify] ${event} delivery failed:`, error);
    return false;
  }
}
