import 'server-only';

// An enquiry is the product of every ad, every page, and every visit. It has two
// sinks: Firestore (durable, ours, drives the admin dashboard) and the n8n
// webhook (notification/automation, third-party, occasionally down).
//
// They are delivered concurrently and independently. The enquiry is considered
// delivered if *either* sink accepts it, so an n8n outage can no longer drop a
// lead — which is what happened previously, when a non-2xx webhook response
// returned 502 before the Firestore write was even attempted.
const WEBHOOK_TIMEOUT_MS = 8000;

export interface EnquiryDeliveryResult {
  persisted: boolean;
  notified: boolean;
}

async function postToWebhook(url: string | undefined, payload: unknown): Promise<void> {
  if (!url) {
    throw new Error(
      'Webhook URL is not configured — set N8N_ENQUIRY_WEBHOOK_URL / N8N_PACKAGE_WEBHOOK_URL'
    );
  }

  // Without a timeout a hanging n8n would hold the request open for the platform
  // limit, and the visitor would sit on a spinner while their lead is already safe.
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Webhook responded ${response.status}: ${body.slice(0, 200)}`);
  }
}

export async function deliverEnquiry(options: {
  label: string;
  persist: () => Promise<unknown>;
  webhookUrl: string | undefined;
  webhookPayload: unknown;
}): Promise<EnquiryDeliveryResult> {
  const { label, persist, webhookUrl, webhookPayload } = options;

  const [persistResult, webhookResult] = await Promise.allSettled([
    persist(),
    postToWebhook(webhookUrl, webhookPayload),
  ]);

  if (persistResult.status === 'rejected') {
    console.error(`[${label}] Firestore persistence failed:`, persistResult.reason);
  }

  if (webhookResult.status === 'rejected') {
    console.error(`[${label}] n8n webhook delivery failed:`, webhookResult.reason);
  }

  return {
    persisted: persistResult.status === 'fulfilled',
    notified: webhookResult.status === 'fulfilled',
  };
}
