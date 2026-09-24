import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || 'supersecretkey123456789' });
  if (pathname.startsWith('/admin') || pathname === '/login') {
    console.log(`[MW] path: ${pathname}, token: ${token ? JSON.stringify({ email: token.email, rol: token.rol }) : 'null'}, cookies: ${req.cookies.getAll().map(c => c.name).join(', ')}`);
  }

  // Protect API routes except auth and seed
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth') && !pathname.startsWith('/api/seed')) {
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  }

  // Redirect from login if already authenticated
  if (pathname === '/login' && token) {
    const rolePath = (token.rol as string)?.toLowerCase() || 'admin';
    return NextResponse.redirect(new URL(`/${rolePath}`, req.url));
  }

  // Role-based protection for frontend pages
  if (pathname.startsWith('/admin')) {
    if (!token || token.rol !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/maestro')) {
    if (!token || token.rol !== 'MAESTRO') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/alumno')) {
    if (!token || token.rol !== 'ALUMNO') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
