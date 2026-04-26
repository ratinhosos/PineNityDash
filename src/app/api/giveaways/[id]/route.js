import { NextResponse } from 'next/server';
import { connectDB, Giveaway } from '@/lib/db';
export async function DELETE(_, { params }) {
  await connectDB();
  await Giveaway.findByIdAndUpdate(params.id, { cancelled: true, ended: true });
  return NextResponse.json({ ok: true });
}
