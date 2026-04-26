import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/session';

const PUBLIC = ['/login', '/api/login', '/_next', '/favicon.ico', '/icon.svg'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);
  if (!session.authed) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return res;
}

export const config = { matcher: ['/((?!_next|favicon.ico|icon.svg).*)'] };
