import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { requireAutomationAuth } from '@/lib/automation-auth';

// Admin SDK.
export const runtime = 'nodejs';

// Narrow on purpose. This is the only write the automation gets, and it exists
// so the follow-up sequence can record that it nudged someone — without which a
// second run of the same schedule would email the same traveller again.
//
// `status` is included so a workflow can retire a lead it has handled, and
// because /admin/enquiries reads the same field: a nudge the team cannot see in
// the panel would make the automation look like it had done nothing.
const patchSchema = z
  .object({
    status: z.enum(['new', 'in_progress', 'responded']).optional(),
    lastNudgedAt: z.string().trim().max(40).optional(),
    nudgeCount: z.coerce.number().int().min(0).max(50).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'At least one field is required.');

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  try {
    const parsed = patchSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid payload.' },
        { status: 400 }
      );
    }

    const ref = adminDb().collection('enquiries').doc(params.id);

    // Fail loudly on a missing document rather than creating one: a PATCH to an
    // id that does not exist means the workflow is working from stale data, and
    // an upsert would silently manufacture a lead with no name or email.
    const snapshot = await ref.get();
    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }

    await ref.update({ ...parsed.data, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true, id: params.id });
  } catch (error) {
    console.error('[automation/enquiries/:id]', error);
    return NextResponse.json({ error: 'Could not update the enquiry.' }, { status: 500 });
  }
}
