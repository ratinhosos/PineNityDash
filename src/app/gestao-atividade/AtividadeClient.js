'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AtividadeClient({ summary, guild }) {
  const [period, setPeriod] = useState('daily');
  const dayData = Object.entries(summary.byDay || {}).sort().slice(-14).map(([d, v]) => ({ date: d.slice(5), msgs: v }));
  const channelMap = guild.channels ? Object.fromEntries(guild.channels.map(c => [c.id, c.name])) : {};
  const channelData = Object.entries(summary.byChannel || {}).map(([id, v]) => ({ name: channelMap[id] ? '#' + channelMap[id] : id, value: v })).sort((a,b) => b.value - a.value).slice(0, 10);
  const top = (summary.top || []).slice(0, 10);
  const bottom = (summary.bottom || []).slice(0, 10);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Tabs value={period} onChange={setPeriod} options={[{ value: 'daily', label: 'Diário' }, { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensal' }]} />
      </div>
      <div className="kpi-grid">
        <div className="card kpi"><div className="icon">💬</div><div className="label">MENSAGENS TOTAIS</div><div className="value">{summary.totalMessages || 0}</div></div>
        <div className="card kpi"><div className="icon">📅</div><div className="label">DIAS ATIVOS</div><div className="value">{Object.keys(summary.byDay || {}).length}</div></div>
        <div className="card kpi"><div className="icon">📺</div><div className="label">CANAIS COM ATIV.</div><div className="value">{Object.keys(summary.byChannel || {}).length}</div></div>
        <div className="card kpi"><div className="icon">📈</div><div className="label">STATUS</div><div className="value" style={{ color: '#22c55e', fontSize: 18 }}>ATIVO</div></div>
      </div>
      <div className="row">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>📈 Mensagens por dia (últimos 14d)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer><LineChart data={dayData}>
              <CartesianGrid stroke="#222" /><XAxis dataKey="date" stroke="#666" /><YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#0c0c0c', border: '1px solid #FFD700' }} />
              <Line type="monotone" dataKey="msgs" stroke="#FFD700" strokeWidth={2} dot={false} />
            </LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>📺 Top Canais</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer><BarChart data={channelData}>
              <CartesianGrid stroke="#222" /><XAxis dataKey="name" stroke="#666" /><YAxis stroke="#666" />
              <Tooltip contentStyle={{ background: '#0c0c0c', border: '1px solid #FFD700' }} />
              <Bar dataKey="value" fill="#FFD700" />
            </BarChart></ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>🔥 Quem mais fala</h3>
          <table className="tbl"><thead><tr><th>#</th><th>Usuário</th><th>Mensagens</th></tr></thead>
            <tbody>{top.map((u, i) => <tr key={u.userId}><td>{i+1}</td><td>{u.userId}</td><td>{u.messages}</td></tr>)}</tbody></table>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>😴 Quem menos fala</h3>
          <table className="tbl"><thead><tr><th>#</th><th>Usuário</th><th>Mensagens</th></tr></thead>
            <tbody>{bottom.map((u, i) => <tr key={u.userId}><td>{i+1}</td><td>{u.userId}</td><td>{u.messages}</td></tr>)}</tbody></table>
        </div>
      </div>
    </>
  );
}
