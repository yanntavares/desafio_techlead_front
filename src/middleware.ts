import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from '@/utils/lib/auth';

const PUBLIC_ROUTES = ['/', '/cadastro'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const payload = token ? decodeJwt<{ role?: string; exp?: number }>(token) : null;
  const isValid = !!payload && (!payload.exp || payload.exp * 1000 > Date.now());

  if (PUBLIC_ROUTES.includes(pathname)) {
    return isValid
      ? NextResponse.redirect(new URL('/platform', request.url))
      : NextResponse.next();
  }

  if (!isValid) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/platform/admin_panel') && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/platform', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/cadastro', '/platform/:path*'],
};
