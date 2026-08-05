import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuth } from '@/lib/firebase-admin';
import { isAdminEmail } from '@/lib/admin';
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from '@/lib/session';

export const runtime = 'nodejs';

const bodySchema = z.object({
  idToken: z.string().min(1),
});

/**
 * Exchanges a Firebase ID token for an HttpOnly session cookie.
 *
 * The previous scheme set `__session=1` and `__session_email=<email>` from
 * client JS, so anyone could forge them in devtools and walk past middleware.
 * The session cookie minted here is signed by Firebase and verified in
 * middleware, so it cannot be fabricated.
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'idToken is required.' }, { status: 400 });
    }

    const auth = adminAuth();

    // checkRevoked: a disabled or signed-out account must not mint a session.
    const decoded = await auth.verifyIdToken(parsed.data.idToken, true);

    if (!isAdminEmail(decoded.email)) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
    }

    const sessionCookie = await auth.createSessionCookie(parsed.data.idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SESSION_COOKIE,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });

    return response;
  } catch (err) {
    console.error('[auth/session]', err);

    // A rejected token is the caller's problem (401); anything else — missing
    // credentials, a failed Workload Identity exchange, Identity Toolkit being
    // unreachable — is ours (500).
    //
    // These used to share a 401, which actively misled: a server that could not
    // authenticate to Google at all reported the same "Could not create session"
    // as a wrong password, so a deploy-config outage looked like a bad login.
    if (isRejectedCredential(err)) {
      return NextResponse.json({ error: 'Could not create session.' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Authentication is temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * True when firebase-admin rejected the caller's token, rather than failing to
 * do its own job. `auth/internal-error` is excluded deliberately: it is what
 * surfaces when an Admin SDK call fails for infrastructure reasons, so it is a
 * server fault wearing an `auth/` prefix.
 */
function isRejectedCredential(err: unknown): boolean {
  const code = (err as { code?: unknown })?.code;
  return typeof code === 'string' && code.startsWith('auth/') && code !== 'auth/internal-error';
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
