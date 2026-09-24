import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'supersecretkey123456789' });

  // Protect API routes except auth
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth') && !pathname.startsWith('/api/seed')) {
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  // Redirect from login if already authenticated
  if (pathname === '/login') {
    if (token) {
      const rolePath = (token.rol as string)?.toLowerCase() || 'admin';
      return NextResponse.redirect(new URL(`/${rolePath}`, req.url));
    }
    return NextResponse.next();
  }

  // Frontend pages access control
  const isProtectedPath = pathname.startsWith('/admin') || pathname.startsWith('/maestro') || pathname.startsWith('/alumno');

  if (isProtectedPath) {
    if (!token) {
      // Clear potentially invalid cookies on unauthenticated access
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      // For production (secure cookies)
      response.cookies.delete('__Secure-next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.callback-url');
      response.cookies.delete('__Host-next-auth.csrf-token');
      return response;
    }

    const rol = token.rol as string;
    
    if (pathname.startsWith('/admin') && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${rol.toLowerCase()}`, req.url));
    }

    if (pathname.startsWith('/maestro') && rol !== 'MAESTRO' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${rol.toLowerCase()}`, req.url));
    }

    if (pathname.startsWith('/alumno') && rol !== 'ALUMNO' && rol !== 'ADMIN') {
      return NextResponse.redirect(new URL(`/${rol.toLowerCase()}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
