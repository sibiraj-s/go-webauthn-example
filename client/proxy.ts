import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth');

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/u/:path*',
};
