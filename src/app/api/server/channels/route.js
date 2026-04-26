import { NextResponse } from 'next/server';
import { botApi } from '@/lib/api';
export async function POST(req) {
  const body = await req.json();
  const r = await botApi('/api/server/channels', { method:'POST', body: JSON.stringify(body) });
  return NextResponse.json(r);
}
