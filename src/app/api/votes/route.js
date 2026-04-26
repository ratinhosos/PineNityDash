import { NextResponse } from 'next/server';
import { connectDB, Vote } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await Vote.find({ guildId: process.env.GUILD_ID }).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json(list);
}
