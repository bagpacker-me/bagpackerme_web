import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { deletePrivateObject } from '@/lib/storage-admin';

export const runtime = 'nodejs';

/**
 * Deletes an application and its CV together.
 *
 * This exists as a route rather than a client-side deleteDoc because the admin
 * panel talks to Firestore directly: deleting from the browser would remove the
 * record and strand the CV in Storage, where nothing links to it, no admin can
 * see it, and it would sit as candidate PII nobody remembers keeping.
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const docRef = adminDb().collection('job_applications').doc(params.id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    const cvPath: unknown = snapshot.data()?.cvPath;

    // Storage first: if this fails we still have the record pointing at the
    // file, so the delete can be retried. Dropping the record first would lose
    // the only pointer to the bytes.
    if (typeof cvPath === 'string' && cvPath.startsWith('applications/')) {
      await deletePrivateObject(cvPath);
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[admin/applications] failed to delete ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Could not delete the application. Please try again.' },
      { status: 500 }
    );
  }
}
