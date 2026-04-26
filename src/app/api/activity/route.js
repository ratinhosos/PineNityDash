import { NextResponse } from 'next/server';
import { connectDB, MemberStats, Ticket, Vote } from '@/lib/db';

export async function GET() {
  await connectDB();
  const guildId = process.env.GUILD_ID;
  const members = await MemberStats.find({ guildId });
  const totalMessages = members.reduce((a,m)=>a+(m.messages||0),0);
  const tickets = await Ticket.countDocuments({ guildId });
  const votes = await Vote.countDocuments({ guildId });

  // últimos 14 dias agregando messagesByDay
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i*86400000);
    const key = d.toISOString().slice(0,10);
    let count = 0;
    for (const m of members) {
      const v = (m.messagesByDay || {})[key] || (m.messagesByDay?.get?.(key)) || 0;
      count += Number(v) || 0;
    }
    days.push({ day: key.slice(5), count });
  }

  return NextResponse.json({ totalMembers: members.length, totalMessages, tickets, votes, daily: days });
}
