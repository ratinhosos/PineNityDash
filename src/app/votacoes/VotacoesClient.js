'use client';
import { useState } from 'react';

const TYPES = { generic: 'Geral', bobo: '🤡 Bobo da Corte', rei: '👑 Rei da Semana', protagonista: '🌟 Protagonista', chato: '😒 Chato da Semana' };

export default function VotacoesClient({ list }) {
  const [items, setItems] = useState(list);
  async function end(id) { const r = await fetch(`/api/votes/${id}/end`, { method: 'POST' }); if (r.ok) setItems(items.map(v => v._id === id ? { ...v, endsAt: new Date().toISOString() } : v)); }
  async function cancel(id) { if (!confirm('Cancelar votação?')) return; const r = await fetch(`/api/votes/${id}`, { method: 'DELETE' }); if (r.ok) setItems(items.map(v => v._id === id ? { ...v, cancelled: true, ended: true } : v)); }
  return (
    <div className="card">
      <table className="tbl">
        <thead><tr><th>Tipo</th><th>Título</th><th>Termina</th><th>Votos</th><th>Status</th><th>Vencedor</th><th>Ações</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan="7" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Nenhuma votação.</td></tr>}
          {items.map(v => (
            <tr key={v._id}>
              <td>{TYPES[v.type] || v.type}</td>
              <td>{v.title || '—'}</td>
              <td>{v.endsAt ? new Date(v.endsAt).toLocaleString('pt-BR') : '—'}</td>
              <td>{v.votes?.length || 0}</td>
              <td>{v.cancelled ? <span className="pill-status off">Cancelada</span> : v.ended ? <span className="pill-status on">Encerrada</span> : <span className="pill-status on">Ativa</span>}</td>
              <td>{v.winnerId ? `<@${v.winnerId}>` : '—'}</td>
              <td>{!v.ended && (<><button className="btn ghost" onClick={() => end(v._id)}>Encerrar</button> <button className="btn danger" onClick={() => cancel(v._id)}>Cancelar</button></>)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
