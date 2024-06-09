import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const routes = request.nextUrl.pathname.split('/');
  console.log(routes);
  if (
    routes.length > 4 ||
    (routes[2] && !['favorites', 'newest', 'profile'].includes(routes[2]))
  )
    return NextResponse.redirect(new URL('/404', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
