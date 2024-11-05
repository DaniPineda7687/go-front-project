// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken');
  const loginUrl = new URL('/login', req.url);

  if (!token && req.nextUrl.pathname !== '/login') {
    //return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Excluye las rutas de /login y /_next para que no afecte a los estilos
export const config = {
  matcher: '/((?!login|_next/static|_next/image|favicon.ico).*)',
};
