import { NextResponse } from 'next/server';
import { connectDB, CommandConfig } from '@/lib/db';

export async function GET(_, { params }) {
  await connectDB();
  const doc = await CommandConfig.findOne({ guildId: process.env.GUILD_ID, commandName: params.name });
  return NextResponse.json(doc || { commandName: params.name, enabled: true, embed: { color: '#FFD700' } });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const doc = await CommandConfig.findOneAndUpdate(
    { guildId: process.env.GUILD_ID, commandName: params.name },
    { $set: { ...body, guildId: process.env.GUILD_ID, commandName: params.name } },
    { upsert: true, new: true }
  );
  return NextResponse.json(doc);
}
