import { NextResponse } from 'next/server';
import { botApi } from '@/lib/api';
export async function GET() {
  const d = await botApi('/api/emojis/all');
  return NextResponse.json(d.error ? { static: [], animated: [] } : d);
}
