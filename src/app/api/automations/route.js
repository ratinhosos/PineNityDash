import { NextResponse } from 'next/server';
import { connectDB, Automations } from '@/lib/db';

export async function GET() {
  await connectDB();
  const doc = await Automations.findOneAndUpdate(
    { guildId: process.env.GUILD_ID }, { $setOnInsert: { guildId: process.env.GUILD_ID } },
    { upsert: true, new: true }
  );
  return NextResponse.json(doc);
}
export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  delete body._id;
  const doc = await Automations.findOneAndUpdate(
    { guildId: process.env.GUILD_ID }, { $set: body }, { upsert: true, new: true }
  );
  return NextResponse.json(doc);
}
