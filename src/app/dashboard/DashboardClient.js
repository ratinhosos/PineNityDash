'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';

export default function DashboardClient({ data }) {
  const [period, setPeriod] = useState('daily');
  const guild = data.guild || {};
  const cards = [
    { label: 'MEMBROS', value: guild.memberCount || 0, icon: '👥' },
    { label: 'CANAIS', value: guild.channels?.length || 0, icon: '📺' },
    { label: 'CARGOS', value: guild.roles?.length || 0, icon: '🎭' },
    { label: 'EMOJIS', value: guild.emojis?.length || 0, icon: '😀' },
    { label: 'SORTEIOS ATIVOS', value: data.activeGiveaways, icon: '🎉' },
    { label: 'TICKETS ABERTOS', value: data.openTickets, icon: '🎫' },
    { label: 'VOTAÇÕES ATIVAS', value: data.activeVotes, icon: '🗳️' },
    { label: 'MENSAGENS TOTAIS', value: data.totalMessages, icon: '💬' },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Tabs value={period} onChange={setPeriod}
          options={[{ value: 'daily', label: 'Diário' }, { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensal' }]} />
      </div>
      <div className="kpi-grid">
        {cards.map(c => (
          <div key={c.label} className="card kpi hover">
            <span className="live">LIVE</span>
            <div className="icon">{c.icon}</div>
            <div className="label">{c.label}</div>
            <div className="value">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="card">
          <h3 style={{ margin: 0, marginBottom: 6 }}>🍍 Servidor</h3>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>Configurado via GUILD_ID</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {guild.icon && <img src={guild.icon} alt="" style={{ width: 80, height: 80, borderRadius: 16, border: '1px solid var(--border)' }} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{guild.name || 'Servidor'}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>ID: {guild.id || '—'}</div>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 style={{ margin: 0, marginBottom: 6 }}>⚡ Atalhos</h3>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 12 }}>Acesso rápido às áreas mais usadas.</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <a className="btn ghost" href="/comandos">⚙️ Comandos</a>
            <a className="btn ghost" href="/sorteios">🎉 Sorteios</a>
            <a className="btn ghost" href="/tickets">🎫 Tickets</a>
            <a className="btn ghost" href="/votacoes">🗳️ Votações</a>
            <a className="btn ghost" href="/automacao">🤖 Automação</a>
          </div>
        </div>
      </div>
    </>
  );
}
