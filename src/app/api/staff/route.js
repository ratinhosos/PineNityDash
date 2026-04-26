import { NextResponse } from 'next/server';
import { connectDB, StaffStats } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await StaffStats.find({ guildId: process.env.GUILD_ID }).sort({ ticketsResolved: -1 }).lean();
  return NextResponse.json(list);
}
