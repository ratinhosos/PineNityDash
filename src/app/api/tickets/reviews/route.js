import { NextResponse } from 'next/server';
import { connectDB, TicketReview } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await TicketReview.find({ guildId: process.env.GUILD_ID }).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json(list);
}
