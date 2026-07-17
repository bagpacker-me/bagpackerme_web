import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const out: Record<string, unknown> = {};
  try {
    const snap = await adminDb().collection('packages').limit(1).get();
    out.firestore = { ok: true, docsRead: snap.size };
  } catch (e) {
    out.firestore = { ok: false, error: (e as Error).message };
  }
  try {
    await adminAuth().listUsers(1);
    out.auth = { ok: true };
  } catch (e) {
    out.auth = { ok: false, error: (e as Error).message };
  }
  return NextResponse.json(out);
}
