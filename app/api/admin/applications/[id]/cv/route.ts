import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { adminDb } from '@/lib/firebase-admin';
import { openPrivateObjectStream } from '@/lib/storage-admin';

export const runtime = 'nodejs';

/**
 * Streams a candidate's CV to the admin.
 *
 * Deliberately not a signed URL. The only consumer is a logged-in admin, so a
 * shareable URL buys nothing and costs: it would need the service account to
 * hold roles/iam.serviceAccountTokenCreator on itself, and it cannot work in
 * local dev at all (signing needs a client_email, which the authorized_user ADC
 * from `gcloud auth application-default login` does not have). Streaming
 * behaves identically in both environments and leaves no URL to leak into logs
 * or a forwarded message.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) {
    // A 401 with a JSON body, not a redirect to the login page — this is fetched
    // by the admin UI, which would otherwise "succeed" with a page of HTML.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb().collection('job_applications').doc(params.id).get();
    const application = snapshot.data();

    if (!snapshot.exists || !application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    const cvPath: unknown = application.cvPath;
    if (typeof cvPath !== 'string' || !cvPath) {
      return NextResponse.json({ error: 'This application has no CV attached.' }, { status: 404 });
    }

    // The path comes from our own buildCvPath, but this route reads whatever the
    // document says — so re-assert the prefix rather than trusting the field to
    // still be well-formed. Without it, a bad write elsewhere could turn this
    // into a read-any-object oracle for the whole bucket.
    if (!cvPath.startsWith('applications/')) {
      console.error(`[admin/cv] refusing to serve out-of-prefix path for ${params.id}: ${cvPath}`);
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    const stream = await openPrivateObjectStream(cvPath);
    if (!stream) {
      return NextResponse.json({ error: 'The CV file is no longer available.' }, { status: 404 });
    }

    const filename = typeof application.cvFilename === 'string' ? application.cvFilename : 'cv';
    const contentType =
      typeof application.cvContentType === 'string'
        ? application.cvContentType
        : 'application/octet-stream';

    return new NextResponse(stream, {
      headers: {
        'Content-Type': contentType,
        // The filename is sanitized on upload, so it cannot break out of the
        // quotes here.
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error(`[admin/cv] failed to serve ${params.id}:`, error);
    return NextResponse.json({ error: 'Could not load the CV.' }, { status: 500 });
  }
}
