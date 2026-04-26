import { NextResponse } from 'next/server';
import { botApi } from '@/lib/api';
export async function DELETE(_, { params }) {
  const r = await botApi(`/api/server/channels/${params.id}`, { method:'DELETE' });
  return NextResponse.json(r);
}
