import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getConfiguredAdminEmail } from '@/lib/admin';
import { SESSION_COOKIE, verifySessionCookie } from '@/lib/session';

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

// Cache slug -> market for the same window as the pages' `revalidate = 3600`.
// The previous implementation used `cache: 'no-store'`, which put a
// US-region Firestore round-trip in front of every single package page view.
// Edge isolates are reused, so a warm isolate answers from memory.
const MARKET_TTL_MS = 60 * 60 * 1000;
const marketCache = new Map<string, { market: string | null; expiresAt: number }>();

async function fetchPublishedPackageMarket(slug: string) {
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

    // A published package with no `market` field is an india package — that is
    // how normalizePackageMarket() in lib/firestore.ts classifies it, and every
    // package currently in Firestore is in that state. Global packages are
    // served from STATIC_GLOBAL_PACKAGES unless the admin explicitly sets
    // market: 'global'.
    return results.some((result) => result.document) ? 'india' : null;
  } catch {
    return null;
  }
}

async function getPublishedPackageMarket(slug: string) {
  const cached = marketCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.market;
  }

  const market = await fetchPublishedPackageMarket(slug);
  marketCache.set(slug, { market, expiresAt: Date.now() + MARKET_TTL_MS });
  return market;
}

async function handlePackageDetail(request: NextRequest, slug: string) {
  const market = await getPublishedPackageMarket(slug);

  if (market === 'india') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/in${request.nextUrl.pathname}`;
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

function handleAdmin(request: NextRequest, pathname: string, email: string | null) {
  if (!email || email !== getConfiguredAdminEmail()) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear a stale or invalid cookie so the browser stops sending it.
    response.cookies.set({ name: SESSION_COOKIE, value: '', path: '/', maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The page-level redirect in packages/[slug]/page.tsx cannot replace this:
  // that route is statically rendered, so redirect() there degrades to a
  // `<meta http-equiv="refresh">` with a 200 status rather than a real 307.
  const packageDetailMatch = pathname.match(PACKAGE_DETAIL_PATH);
  if (packageDetailMatch) {
    return handlePackageDetail(request, packageDetailMatch[1]);
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin paths (login page)
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // The session cookie is minted by /api/auth/session and signed by Firebase.
  // Verifying the signature here is what makes this gate real: the previous
  // cookies were set by client JS and could be forged from devtools.
  const claims = await verifySessionCookie(
    request.cookies.get(SESSION_COOKIE)?.value,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
  const email = typeof claims?.email === 'string' ? claims.email.toLowerCase() : null;

  return handleAdmin(request, pathname, email);
}

export const config = {
  matcher: ['/admin/:path*', '/packages/:path*'],
};
