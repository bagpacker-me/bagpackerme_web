import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const bodySchema = z.object({
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

/**
 * Firestore writes from the admin UI do not pass through a Next.js Server
 * Action, so they cannot automatically invalidate the cached public listing.
 * This protected endpoint is called only after a successful role save.
 */
export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'A valid role slug is required.' }, { status: 400 });
  }

  revalidateTag('published-job-openings');
  revalidatePath('/careers');
  revalidatePath(`/careers/${parsed.data.slug}`);
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true });
}
