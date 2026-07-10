import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getConfiguredAdminEmail } from '@/lib/admin';

const PUBLIC_ADMIN_PATHS = ['/admin/login'];
const PACKAGE_DETAIL_PATH = /^\/packages\/([^/]+)\/?$/;

type FirestoreValue = {
  stringValue?: string;
};

type FirestoreRunQueryResult = {
  document?: {
    fields?: Record<string, FirestoreValue>;
  };
};

async function getPublishedPackageMarket(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: 'packages' }],
            where: {
              compositeFilter: {
                op: 'AND',
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: 'slug' },
                      op: 'EQUAL',
                      value: { stringValue: slug },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: 'status' },
                      op: 'EQUAL',
                      value: { stringValue: 'published' },
                    },
                  },
                ],
              },
            },
            limit: 10,
          },
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const results = (await response.json()) as FirestoreRunQueryResult[];
    const markets = results
      .map((result) => result.document?.fields?.market?.stringValue)
      .filter((market): market is string => Boolean(market));

    if (markets.includes('global')) {
      return 'global';
    }

    return results.some((result) => result.document) ? 'india' : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const packageDetailMatch = pathname.match(PACKAGE_DETAIL_PATH);

  if (packageDetailMatch) {
    const market = await getPublishedPackageMarket(packageDetailMatch[1]);

    if (market === 'india') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = `/in${pathname}`;
      return NextResponse.redirect(redirectUrl, 307);
    }

    return NextResponse.next();
  }

  // Only run on admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

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
  matcher: ['/admin/:path*', '/packages/:path*'],
};
