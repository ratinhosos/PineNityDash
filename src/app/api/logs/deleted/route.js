import { NextResponse } from 'next/server';
import { connectDB, DeletedMessages } from '@/lib/db';
export async function GET() {
  await connectDB();
  const list = await DeletedMessages.find({ guildId: process.env.GUILD_ID }).sort({ deletedAt: -1 }).limit(200).lean();
  return NextResponse.json(list);
}
