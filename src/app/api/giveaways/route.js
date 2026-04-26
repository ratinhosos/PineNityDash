import { NextResponse } from 'next/server';
import { connectDB, Giveaway } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await Giveaway.find({ guildId: process.env.GUILD_ID }).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json(list);
}
