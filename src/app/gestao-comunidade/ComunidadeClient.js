'use client';
import { useState, useMemo } from 'react';
import Tabs from '@/components/Tabs';

function classify(m) {
  const score = (m.warns || 0) * 5 + (m.mutes || 0) * 8 + (m.bans || 0) * 50 + (m.curses || 0) * 0.3;
  const messages = m.messages || 1;
  const ratio = score / Math.max(messages, 10);
  if (ratio < 0.05) return { label: 'Bom', class: 'on', pct: 90 };
  if (ratio < 0.2) return { label: 'Médio', class: 'on', pct: 65 };
  return { label: 'Ruim', class: 'off', pct: 30 };
}

export default function ComunidadeClient({ members }) {
  const [period, setPeriod] = useState('total');
  const [search, setSearch] = useState('');
  const ranked = useMemo(() => {
    return members.map(m => ({ ...m, problemScore: (m.warns||0)*5 + (m.mutes||0)*8 + (m.bans||0)*50 + (m.curses||0)*0.3, klass: classify(m) }))
      .filter(m => !search || m.userId.includes(search));
  }, [members, search]);
  const topProblem = [...ranked].sort((a,b) => b.problemScore - a.problemScore).slice(0, 10);
  const topMutes = [...ranked].sort((a,b) => (b.mutes||0)-(a.mutes||0)).slice(0, 10);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <input className="input" style={{ maxWidth: 360 }} placeholder="🔎 Buscar por ID..." value={search} onChange={e => setSearch(e.target.value)} />
        <Tabs value={period} onChange={setPeriod} options={[{ value: 'daily', label: 'Diário' }, { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensal' }, { value: 'total', label: 'Total' }]} />
      </div>
      <div className="row">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>🏆 Ranking Problemáticos</h3>
          <table className="tbl"><thead><tr><th>#</th><th>Usuário</th><th>Score</th><th>Class.</th></tr></thead>
          <tbody>{topProblem.map((m, i) => (<tr key={m.userId}><td>{i+1}</td><td>{m.userId}</td><td>{m.problemScore.toFixed(1)}</td><td><span className={`pill-status ${m.klass.class}`}>{m.klass.label}</span></td></tr>))}</tbody></table>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>🔇 Top Mutes</h3>
          <table className="tbl"><thead><tr><th>#</th><th>Usuário</th><th>Mutes</th><th>Warns</th></tr></thead>
          <tbody>{topMutes.map((m, i) => (<tr key={m.userId}><td>{i+1}</td><td>{m.userId}</td><td>{m.mutes||0}</td><td>{m.warns||0}</td></tr>))}</tbody></table>
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>👥 Todos os membros ({ranked.length})</h3>
        <table className="tbl"><thead><tr><th>ID</th><th>Mensagens</th><th>Warns</th><th>Mutes</th><th>Bans</th><th>Xingamentos</th><th>Comportamento</th></tr></thead>
        <tbody>{ranked.slice(0, 200).map(m => (
          <tr key={m.userId}>
            <td>{m.userId}</td><td>{m.messages || 0}</td><td>{m.warns || 0}</td><td>{m.mutes || 0}</td><td>{m.bans || 0}</td><td>{m.curses || 0}</td>
            <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 80, height: 6, background: '#222', borderRadius: 999 }}><div style={{ width: m.klass.pct + '%', height: 6, background: m.klass.class === 'on' ? '#22c55e' : '#ef4444', borderRadius: 999 }} /></div>
              <span className={`pill-status ${m.klass.class}`}>{m.klass.label} ({m.klass.pct}%)</span>
            </div></td>
          </tr>))}</tbody></table>
      </div>
    </>
  );
}
