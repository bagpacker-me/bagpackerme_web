'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const SESSION_KEY = 'bp_affiliate_code';
const SESSION_ID_KEY = 'bp_session_id';

/** Generate a random session ID that persists for the session */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

/**
 * Reads ?ref= from the URL, stores it in sessionStorage, and fires one tracking
 * event per session per affiliate code via the /api/affiliate/track endpoint.
 *
 * Exposes a helper to read the current affiliate code so forms can attach it.
 */
export function useAffiliateTracking() {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    const refCode = searchParams?.get('ref');
    if (refCode) {
      // Persist the code for the whole session
      sessionStorage.setItem(SESSION_KEY, refCode.toUpperCase());
    }

    const storedCode = sessionStorage.getItem(SESSION_KEY);
    if (!storedCode) return;

    // Only fire once per component mount
    trackedRef.current = true;

    const sessionId = getOrCreateSessionId();
    const pageUrl = window.location.href;
    // Extract package slug from URL if present
    const slugMatch = pageUrl.match(/\/packages\/([^/?#]+)/);
    const packageSlug = slugMatch ? slugMatch[1] : '';

    fetch('/api/affiliate/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        affiliateCode: storedCode,
        pageUrl,
        packageSlug,
        sessionId,
      }),
    }).catch(() => {
      // Silently swallow tracking errors — never impact UX
    });
  }, [searchParams]);
}

/** Reads the affiliate code stored in sessionStorage (for form attribution) */
export function getStoredAffiliateCode(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_KEY);
}
