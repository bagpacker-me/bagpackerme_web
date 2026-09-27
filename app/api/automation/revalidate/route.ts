import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAutomationAuth } from '@/lib/automation-auth';

export const runtime = 'nodejs';

// Blog and package pages carry `revalidate = 3600`, so freshly published content
// can sit behind a stale ISR entry for up to an hour. The distribution workflow
// submits the URL to IndexNow the moment it is published — pointing a crawler at
// a page the CDN has not rebuilt yet — so it calls this first.
//
// A sibling of app/api/admin/careers/revalidate, which does the same job for the
// admin UI but gates on the admin session cookie. n8n has no cookie to present,
// hence the bearer guard.
const bodySchema = z.object({
  // Explicit list rather than a free-form path: revalidatePath accepts anything,
  // and an automation that can invalidate arbitrary routes is a cache-stampede
  // switch for whoever holds the token.
  paths: z
    .array(z.string().trim().min(1).max(200).regex(/^\/[a-zA-Z0-9\-/[\]]*$/))
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const denied = requireAutomationAuth(request);
  if (denied) return denied;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'paths must be an array of 1-20 site-relative paths.' },
      { status: 400 }
    );
  }

  parsed.data.paths.forEach((path) => revalidatePath(path));
  // Content changes move the sitemap too, and the crawler being nudged is about
  // to read it.
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true, paths: parsed.data.paths });
}
