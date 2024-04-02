import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('auth')?.value;
  const protectedPages = [
    '/protected/dashboard',
    '/protected/signedIn/account',
    '/protected/signedIn/community',
    '/protected/signedIn/recipes',
    '/protected/signedIn/inventory',
    '/protected/test']; // Add more protected page paths as needed

  if (currentUser) {
    // If user is authenticated, check if requested path is not a protected page
    if (!protectedPages.some(path => request.nextUrl.pathname.startsWith(path))) {
      return Response.redirect(new URL('/protected/dashboard', request.url));
    }
  } else {
    // If user is not authenticated, redirect to login page for all non-protected pages
    if (!request.nextUrl.pathname.startsWith('/')) {
      return Response.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    '/',
    '/pages/registration',
  ],
}
