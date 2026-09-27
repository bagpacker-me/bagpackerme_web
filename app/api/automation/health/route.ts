import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth } from '@/lib/automation-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/automation/health
 *
 * What the hourly monitor polls. Bearer-guarded and returns a fixed shape —
 * unlike /api/zadmincheck, which is reachable by anyone and echoes raw internal
 * error strings. Errors here are logged server-side and reported as a boolean.
 */
export async function GET(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  let firestoreOk = false;

  try {
    // Cheapest possible proof that the WIF credential exchange still works and
    // Firestore is answering: one document, no ordering, no filter.
    await adminDb().collection('settings').doc('site').get();
    firestoreOk = true;
  } catch (error) {
    console.error('[automation/health] firestore probe failed', error);
  }

  return NextResponse.json(
    {
      ok: firestoreOk,
      firestore: firestoreOk,
      checkedAt: new Date().toISOString(),
    },
    { status: firestoreOk ? 200 : 503 }
  );
}
