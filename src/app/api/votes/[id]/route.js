import { NextResponse } from 'next/server';
import { connectDB, Vote } from '@/lib/db';
export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const doc = await Vote.findByIdAndUpdate(params.id, { $set: body }, { new: true });
  return NextResponse.json(doc);
}
