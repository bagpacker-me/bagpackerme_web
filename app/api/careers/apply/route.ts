import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { uploadPrivateObject } from '@/lib/storage-admin';
import { jobApplicationSchema, CV_MAX_BYTES, CV_MAX_LABEL } from '@/lib/careers';
import {
  buildCvPath,
  sanitizeCvFilename,
  validateCvBuffer,
  type CvValidationSuccess,
} from '@/lib/careers-cv';
import { clientIpFrom, isHoneypotTripped, isRateLimited } from '@/lib/spam-guard';

// Admin SDK + node:crypto in the CV helpers.
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    // isHoneypotTripped and zod both index a plain object. FormData has no such
    // index property, so passing it straight through would make the honeypot
    // silently return false and the schema reject everything.
    const body: Record<string, string> = {};
    form.forEach((value, key) => {
      if (typeof value === 'string') body[key] = value;
    });

    // Bots autofill the hidden field. Return success so they get no signal that
    // they were caught, and drop the payload on the floor.
    if (isHoneypotTripped(body)) {
      return NextResponse.json({ success: true });
    }

    if (isRateLimited(`careers-apply:${clientIpFrom(request)}`)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const parsed = jobApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the form fields and try again.' },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Inspect the CV before any I/O — these checks are pure and cheap, so junk
    // is rejected without spending a Firestore read on it. Nothing is written
    // anywhere until the role is confirmed below.
    const cv = form.get('cv');
    const hasCv = cv instanceof File && cv.size > 0;
    let cvBuffer: Buffer | null = null;
    let cvCheck: CvValidationSuccess | null = null;

    if (hasCv) {
      // Checked here as well as in the browser: the client-side check is a
      // courtesy to the candidate, not a control. A curl -F ignores it.
      if (cv.size > CV_MAX_BYTES) {
        return NextResponse.json(
          { error: `Your CV must be under ${CV_MAX_LABEL}.` },
          { status: 413 }
        );
      }

      cvBuffer = Buffer.from(await cv.arrayBuffer());

      // Magic bytes, never cv.type or the extension — both are attacker-chosen.
      const check = validateCvBuffer(cvBuffer);
      if (!check.ok) {
        return NextResponse.json({ error: check.reason }, { status: 415 });
      }
      cvCheck = check;
    }

    // Resolve the role before touching Storage: a forged jobId must not be able
    // to write bytes into the bucket, and applications to a draft or closed role
    // should not be accepted at all.
    const jobSnapshot = await adminDb().collection('job_openings').doc(data.jobId).get();
    const job = jobSnapshot.data();

    if (!jobSnapshot.exists || !job || job.status !== 'published') {
      return NextResponse.json(
        { error: 'This role is no longer accepting applications.' },
        { status: 404 }
      );
    }

    let cvPath: string | null = null;
    let cvFilename: string | null = null;
    let cvSize: number | null = null;
    let cvContentType: string | null = null;

    if (hasCv && cvBuffer && cvCheck) {
      // Path is built from a validated job id, a server UUID, and the extension
      // we detected. The client filename is only ever a display label.
      cvPath = buildCvPath(data.jobId, cvCheck.ext);
      cvFilename = sanitizeCvFilename(cv.name, cvCheck.ext);
      cvSize = cv.size;
      cvContentType = cvCheck.contentType;

      await uploadPrivateObject({ path: cvPath, body: cvBuffer, contentType: cvContentType });
    }

    const now = new Date().toISOString();

    // Deliberately not deliverEnquiry: its contract is "success if either sink
    // accepts", which is right for a trip enquiry but wrong here. The CV is
    // already in Storage by this point, so a failed Firestore write must surface
    // as an error — returning 200 would leave an orphaned CV that no admin can
    // see or delete. If this throws, the catch below reports it.
    await adminDb()
      .collection('job_applications')
      .add({
        ...data,
        // '' → null: Firestore rejects undefined, and null is what the admin UI
        // and the JobApplication type expect for "not provided".
        linkedinUrl: data.linkedinUrl || null,
        portfolioUrl: data.portfolioUrl || null,
        jobTitle: job.title ?? 'Unknown role',
        jobSlug: job.slug ?? '',
        cvPath,
        cvFilename,
        cvSize,
        cvContentType,
        status: 'new',
        notes: '',
        source: 'careers-page',
        createdAt: now,
        updatedAt: now,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Careers application failed:', error);

    return NextResponse.json(
      { error: 'We could not submit your application right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
