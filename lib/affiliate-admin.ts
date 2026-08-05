import 'server-only';

import { adminDb } from './firebase-admin';
import {
  buildAffiliatePublicData,
  normalizeAffiliateCode,
  normalizeAffiliateSessionId,
} from './affiliate';
import type { Affiliate, AffiliateEvent, AffiliatePublic, Enquiry } from '@/types';

// Server-side counterparts to the affiliate writes in lib/firestore.ts.
//
// These run through the Admin SDK, which bypasses security rules. That is what
// lets firestore.rules deny these writes to browsers: before this existed the
// API routes used the same client SDK as the public site, so the rules had to
// permit anonymous writes to affiliate_public and affiliate_registration_index
// for the routes to work at all.

const AFFILIATE_CODE_CANDIDATES = 5;

/** Generates an affiliate code like BP-JOHNK3F9. */
function generateCode(name: string): string {
  const prefix = name.trim().split(' ')[0].toUpperCase().slice(0, 6).replace(/[^A-Z]/g, '');
  // 4 base36 chars (~1.6M) rather than 2 digits (90) — collisions were likely
  // enough with 90 that registration could fail for common first names.
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, '0');
  return normalizeAffiliateCode(`BP-${prefix}${suffix}`);
}

export type RegisterAffiliateInput = {
  name: string;
  email: string;
  emailHash: string;
  phone: string;
  socialHandle: string;
};

export type RegisterAffiliateResult =
  | { ok: true; affiliateId: string; code: string }
  | { ok: false; reason: 'duplicate_email' | 'code_exhausted' };

/**
 * Creates the private affiliate doc, its public mirror, and the email-hash
 * index in a single transaction.
 *
 * The previous implementation read-then-wrote across separate calls, so two
 * concurrent registrations could both pass the uniqueness check and the second
 * batch.set() would silently overwrite the first. Transactional create() throws
 * ALREADY_EXISTS instead of overwriting.
 */
export async function registerAffiliateAdmin(
  input: RegisterAffiliateInput
): Promise<RegisterAffiliateResult> {
  const db = adminDb();

  return db.runTransaction(async (tx) => {
    const indexRef = db.doc(`affiliate_registration_index/${input.emailHash}`);

    const candidates = Array.from({ length: AFFILIATE_CODE_CANDIDATES }, () =>
      generateCode(input.name)
    );
    const candidateRefs = candidates.map((code) => db.doc(`affiliate_public/${code}`));

    // All reads must precede all writes in a Firestore transaction.
    const [indexSnap, ...candidateSnaps] = await tx.getAll(indexRef, ...candidateRefs);

    if (indexSnap.exists) {
      return { ok: false as const, reason: 'duplicate_email' as const };
    }

    const freeIndex = candidateSnaps.findIndex((snap) => !snap.exists);
    if (freeIndex === -1) {
      return { ok: false as const, reason: 'code_exhausted' as const };
    }

    const code = candidates[freeIndex];
    const privateRef = db.collection('affiliates').doc();
    const now = new Date().toISOString();

    const affiliateData = {
      name: input.name,
      email: input.email,
      emailHash: input.emailHash,
      phone: input.phone,
      socialHandle: input.socialHandle,
      code,
      status: 'pending' as const,
      commissionRate: 10,
      totalClicks: 0,
      totalLeads: 0,
      totalBookings: 0,
      notes: '',
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<Affiliate, 'id'> & { emailHash: string };

    tx.create(privateRef, affiliateData);
    tx.create(candidateRefs[freeIndex], buildAffiliatePublicData(affiliateData));
    tx.create(indexRef, {
      emailHash: input.emailHash,
      affiliateId: privateRef.id,
      affiliateCode: code,
      createdAt: now,
    });

    return { ok: true as const, affiliateId: privateRef.id, code };
  });
}

export type TrackClickResult =
  | { tracked: true }
  | { tracked: false; reason: 'missing' | 'inactive' | 'duplicate' };

/** Records a click, deduped per session, and increments totalClicks. */
export async function trackAffiliateClickAdmin(data: {
  affiliateCode: string;
  pageUrl: string;
  packageSlug?: string;
  referrer?: string;
  sessionId: string;
}): Promise<TrackClickResult> {
  const affiliateCode = normalizeAffiliateCode(data.affiliateCode);
  const sessionId = normalizeAffiliateSessionId(data.sessionId);

  if (!affiliateCode || !sessionId) {
    return { tracked: false, reason: 'missing' };
  }

  const db = adminDb();
  const now = new Date().toISOString();

  return db.runTransaction(async (tx) => {
    const publicRef = db.doc(`affiliate_public/${affiliateCode}`);
    const eventRef = db.doc(`affiliate_public/${affiliateCode}/events/${sessionId}`);

    const [publicSnap, eventSnap] = await tx.getAll(publicRef, eventRef);

    if (!publicSnap.exists) {
      return { tracked: false as const, reason: 'missing' as const };
    }

    const affiliatePublic = publicSnap.data() as AffiliatePublic;
    if (affiliatePublic.status !== 'active') {
      return { tracked: false as const, reason: 'inactive' as const };
    }

    if (eventSnap.exists) {
      return { tracked: false as const, reason: 'duplicate' as const };
    }

    tx.set(eventRef, {
      affiliateCode,
      pageUrl: data.pageUrl || '',
      packageSlug: data.packageSlug || '',
      referrer: data.referrer || '',
      sessionId,
      convertedToEnquiry: false,
      convertedToBooking: false,
      createdAt: now,
      updatedAt: now,
    } satisfies Omit<AffiliateEvent, 'id'>);

    tx.update(publicRef, {
      totalClicks: (affiliatePublic.totalClicks ?? 0) + 1,
      updatedAt: now,
    });

    return { tracked: true as const };
  });
}

/** Marks a session's event as converted and bumps the matching counter. */
export async function markConversionAdmin(
  affiliateCode: string,
  sessionId: string,
  conversion: 'enquiry' | 'booking'
): Promise<boolean> {
  const normalizedCode = normalizeAffiliateCode(affiliateCode);
  const normalizedSessionId = normalizeAffiliateSessionId(sessionId);

  if (!normalizedCode || !normalizedSessionId) {
    return false;
  }

  const eventField = conversion === 'booking' ? 'convertedToBooking' : 'convertedToEnquiry';
  const metricField = conversion === 'booking' ? 'totalBookings' : 'totalLeads';
  const now = new Date().toISOString();
  const db = adminDb();

  return db.runTransaction(async (tx) => {
    const publicRef = db.doc(`affiliate_public/${normalizedCode}`);
    const eventRef = db.doc(`affiliate_public/${normalizedCode}/events/${normalizedSessionId}`);

    const [publicSnap, eventSnap] = await tx.getAll(publicRef, eventRef);

    if (!publicSnap.exists) {
      return false;
    }

    const affiliatePublic = publicSnap.data() as AffiliatePublic;
    const eventData = eventSnap.exists ? (eventSnap.data() as AffiliateEvent) : null;

    if (eventData?.[eventField]) {
      return false;
    }

    if (eventData) {
      tx.update(eventRef, { [eventField]: true, updatedAt: now });
    } else {
      tx.set(eventRef, {
        affiliateCode: normalizedCode,
        pageUrl: '',
        packageSlug: '',
        referrer: '',
        sessionId: normalizedSessionId,
        convertedToEnquiry: conversion === 'enquiry',
        convertedToBooking: conversion === 'booking',
        createdAt: now,
        updatedAt: now,
      } satisfies Omit<AffiliateEvent, 'id'>);
    }

    tx.update(publicRef, {
      [metricField]: ((affiliatePublic[metricField] as number | undefined) ?? 0) + 1,
      updatedAt: now,
    });

    return true;
  });
}

/** Increments a public counter directly, for attribution without a session. */
export async function incrementMetricAdmin(
  affiliateCode: string,
  metric: 'totalClicks' | 'totalLeads' | 'totalBookings'
): Promise<boolean> {
  const normalizedCode = normalizeAffiliateCode(affiliateCode);
  if (!normalizedCode) return false;

  const db = adminDb();
  const publicRef = db.doc(`affiliate_public/${normalizedCode}`);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(publicRef);
    if (!snap.exists) return false;

    const current = (snap.data() as AffiliatePublic)[metric] ?? 0;
    tx.update(publicRef, { [metric]: current + 1, updatedAt: new Date().toISOString() });
    return true;
  });
}

/** Creates an enquiry. Enquiries are written server-side only. */
export async function createEnquiryAdmin(enquiry: Omit<Enquiry, 'id'>) {
  return adminDb().collection('enquiries').add(enquiry);
}

/** The affiliate's own stats, trimmed to what /affiliate/dashboard renders. */
export type AffiliateDashboard = {
  affiliate: Pick<
    AffiliatePublic,
    'name' | 'code' | 'status' | 'totalClicks' | 'totalLeads' | 'totalBookings' | 'createdAt'
  >;
  recentClicks: Pick<
    AffiliateEvent,
    'pageUrl' | 'packageSlug' | 'convertedToEnquiry' | 'convertedToBooking' | 'createdAt'
  >[];
};

/**
 * Reads an affiliate's public mirror for /api/affiliate/[code].
 *
 * Through the Admin SDK, like every other server-side affiliate access here.
 * The route previously used the client SDK from lib/firestore.ts, which made a
 * public, unauthenticated endpoint depend on firestore.rules granting anonymous
 * reads of affiliate_public — a grant that also makes the collection listable,
 * so anyone could enumerate every affiliate by name. Reading through the Admin
 * SDK bypasses rules, so the collection can stay closed to browsers.
 *
 * Returns null when the code does not exist, so the route can answer 404.
 */
export async function getAffiliateDashboardAdmin(
  code: string,
  eventLimit = 20
): Promise<AffiliateDashboard | null> {
  const normalizedCode = normalizeAffiliateCode(code);
  if (!normalizedCode) return null;

  const db = adminDb();
  const publicSnap = await db.doc(`affiliate_public/${normalizedCode}`).get();
  if (!publicSnap.exists) return null;

  const affiliate = publicSnap.data() as AffiliatePublic;

  const eventsSnap = await db
    .collection(`affiliate_public/${normalizedCode}/events`)
    .orderBy('createdAt', 'desc')
    .limit(eventLimit)
    .get();

  return {
    // Never widen this: commissionRate, email, and notes live on the private
    // `affiliates` doc, but the mirror is not a safe object to spread wholesale.
    affiliate: {
      name: affiliate.name,
      code: affiliate.code,
      status: affiliate.status,
      totalClicks: affiliate.totalClicks,
      totalLeads: affiliate.totalLeads,
      totalBookings: affiliate.totalBookings,
      createdAt: affiliate.createdAt,
    },
    recentClicks: eventsSnap.docs.map((doc) => {
      const event = doc.data() as AffiliateEvent;
      return {
        pageUrl: event.pageUrl,
        packageSlug: event.packageSlug,
        convertedToEnquiry: event.convertedToEnquiry,
        convertedToBooking: event.convertedToBooking,
        createdAt: event.createdAt,
      };
    }),
  };
}
