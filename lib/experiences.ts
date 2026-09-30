import 'server-only';

import type {
  AvailabilityResult,
  ExperienceCard,
  ExperienceCardsResponse,
  ExperienceDetail,
  TripAddResult,
  TripBookResult,
  TripEnquiryResult,
  TripSummary,
} from '@/types/experiences';

// The site's only door to the Viator integration. Every call goes to n8n, never
// to Viator directly — which is the whole point of the split:
//
//   - the Viator API key lives in n8n and nowhere else, so it is never in a
//     Vercel env var, a client bundle, or this repo;
//   - the curation rules live in n8n too, so "what BagpackerMe sells" is one
//     editable thing rather than a filter duplicated across pages;
//   - catalogue reads hit a Data Table, so a Viator outage degrades live
//     availability without blanking a destination page.
//
// Reuses the existing N8N_WEBHOOK_BASE_URL / N8N_WEBHOOK_SECRET pair rather than
// introducing a parallel set — the receiving webhooks use the same headerAuth
// credential as the lead intake ones.

const READ_TIMEOUT_MS = 8000;
const WRITE_TIMEOUT_MS = 12000;

/** Cards change once a day at most; an hour of staleness is invisible. */
const CARDS_REVALIDATE_SECONDS = 3600;
/** Detail is cached inside n8n for 24h anyway; this just avoids the round trip. */
const DETAIL_REVALIDATE_SECONDS = 3600;

export class ExperienceApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ExperienceApiError';
    this.status = status;
  }
}

function baseUrl(): string | null {
  const base = process.env.N8N_WEBHOOK_BASE_URL?.trim();
  return base ? base.replace(/\/+$/, '') : null;
}

function headers(): Record<string, string> {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();

  return {
    'Content-Type': 'application/json',
    ...(secret ? { 'X-Automation-Secret': secret } : {}),
  };
}

interface CallOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  /** Seconds. Omit for a no-store call — anything with a price in it. */
  revalidate?: number;
  timeoutMs?: number;
}

async function callN8n<T>(path: string, options: CallOptions = {}): Promise<T> {
  const base = baseUrl();

  if (!base) {
    throw new ExperienceApiError('The experiences service is not configured.', 503);
  }

  const method = options.method ?? 'GET';
  const timeoutMs = options.timeoutMs ?? (method === 'GET' ? READ_TIMEOUT_MS : WRITE_TIMEOUT_MS);

  const response = await fetch(`${base}/${path}`, {
    method,
    headers: headers(),
    ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    signal: AbortSignal.timeout(timeoutMs),
    ...(options.revalidate === undefined
      ? { cache: 'no-store' as const }
      : { next: { revalidate: options.revalidate } }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new ExperienceApiError(
      `n8n ${path} responded ${response.status}: ${text.slice(0, 200)}`,
      response.status
    );
  }

  return (await response.json()) as T;
}

export interface FetchCardsOptions {
  limit?: number;
  sort?: 'curated' | 'rating' | 'price';
}

/**
 * Experience cards for a destination. Returns an empty array rather than
 * throwing when the service is unreachable: a destination page with no grid is
 * a worse day than usual, but a 500 on a page that also carries copy, SEO and
 * an enquiry route is a worse one.
 */
export async function fetchExperienceCards(
  destinationSlug: string,
  options: FetchCardsOptions = {}
): Promise<ExperienceCard[]> {
  const params = new URLSearchParams({ destination: destinationSlug });

  if (options.limit) params.set('limit', String(options.limit));
  if (options.sort) params.set('sort', options.sort);

  try {
    const data = await callN8n<ExperienceCardsResponse>(`bpm/experiences?${params.toString()}`, {
      revalidate: CARDS_REVALIDATE_SECONDS,
    });

    return Array.isArray(data.experiences) ? data.experiences : [];
  } catch (error) {
    console.error(`[experiences] cards for ${destinationSlug} failed:`, error);
    return [];
  }
}

/**
 * Full detail for one experience, or null when the code is not in the curated
 * catalogue — which the page turns into a 404. A product BagpackerMe never
 * curated is not a page we should be serving.
 */
export async function fetchExperienceDetail(productCode: string): Promise<ExperienceDetail | null> {
  const params = new URLSearchParams({ code: productCode });

  try {
    return await callN8n<ExperienceDetail>(`bpm/experience?${params.toString()}`, {
      revalidate: DETAIL_REVALIDATE_SECONDS,
    });
  } catch (error) {
    if (error instanceof ExperienceApiError && error.status === 404) {
      return null;
    }

    console.error(`[experiences] detail for ${productCode} failed:`, error);
    return null;
  }
}

export interface AvailabilityInput {
  productCode: string;
  travelDate: string;
  adults: number;
  children?: number;
  infants?: number;
}

/** Live, never cached. A cached price on a booking screen is a wrong price. */
export function checkAvailability(input: AvailabilityInput): Promise<AvailabilityResult> {
  return callN8n<AvailabilityResult>('bpm/availability-check', {
    method: 'POST',
    body: {
      productCode: input.productCode,
      travelDate: input.travelDate,
      adults: input.adults,
      children: input.children ?? 0,
      infants: input.infants ?? 0,
    },
  });
}

export interface AddTripItemInput {
  tripId?: string;
  productCode: string;
  title: string;
  destinationSlug: string;
  travelDate: string;
  adults: number;
  children?: number;
  infants?: number;
  productOptionCode?: string;
  startTime?: string;
  priceInr: number;
}

export function addTripItem(input: AddTripItemInput): Promise<TripAddResult> {
  return callN8n<TripAddResult>('bpm/trip-add', { method: 'POST', body: input });
}

export function fetchTrip(tripId: string): Promise<TripSummary> {
  const params = new URLSearchParams({ tripId });
  return callN8n<TripSummary>(`bpm/trip?${params.toString()}`);
}

export function removeTripItem(tripId: string, itemId: string): Promise<{ status: string }> {
  return callN8n<{ status: string }>('bpm/trip-remove', {
    method: 'POST',
    body: { tripId, itemId },
  });
}

/** BOOK ACTIVITY — returns the tracked Viator URL for the site to redirect to. */
export function bookTripItem(tripId: string, itemId: string): Promise<TripBookResult> {
  return callN8n<TripBookResult>('bpm/trip-book', { method: 'POST', body: { tripId, itemId } });
}

export interface TripEnquiryInput {
  tripId: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

/** BUILD MY TRIP — the whole itinerary becomes a BagpackerMe lead. */
export function enquireTrip(input: TripEnquiryInput): Promise<TripEnquiryResult> {
  return callN8n<TripEnquiryResult>('bpm/trip-enquiry', { method: 'POST', body: input });
}

/** Rupee formatting used by every experience surface. */
export function formatInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}
