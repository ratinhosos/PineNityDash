import { NextResponse } from 'next/server';
import { connectDB, MemberStats } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await MemberStats.find({ guildId: process.env.GUILD_ID }).sort({ messages: -1 }).limit(500).lean();
  return NextResponse.json(list);
}
