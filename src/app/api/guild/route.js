import { NextResponse } from 'next/server';
import { botApi } from '@/lib/api';

export async function GET() {
  const data = await botApi('/api/guild');
  return NextResponse.json(data);
}
