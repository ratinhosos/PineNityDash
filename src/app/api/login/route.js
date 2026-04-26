import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req) {
  const { password } = await req.json();
  const expected = process.env.DASHBOARD_PASSWORD || 'pineapple2026';
  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
  }
  const session = await getSession();
  session.authed = true;
  await session.save();
  return NextResponse.json({ ok: true });
}
