import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getConfiguredAdminEmail } from '@/lib/admin';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public admin paths (login page)
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for Firebase auth session cookie
  // Firebase client SDK stores auth state in IndexedDB, not cookies,
  // so we use a lightweight cookie flag set after login
  const authToken = request.cookies.get('__session')?.value;
  const sessionEmail = request.cookies.get('__session_email')?.value;
  const adminEmail = getConfiguredAdminEmail();

  if (!authToken || !sessionEmail || decodeURIComponent(sessionEmail) !== adminEmail) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
