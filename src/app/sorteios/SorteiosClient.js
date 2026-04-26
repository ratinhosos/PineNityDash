'use client';
import { useState } from 'react';

export default function SorteiosClient({ list }) {
  const [items, setItems] = useState(list);
  async function cancel(id) {
    if (!confirm('Cancelar sorteio?')) return;
    const r = await fetch(`/api/giveaways/${id}`, { method: 'DELETE' });
    if (r.ok) setItems(items.map(g => g._id === id ? { ...g, cancelled: true, ended: true } : g));
  }
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>📜 Histórico de Sorteios</h3>
      <table className="tbl">
        <thead><tr><th>ID</th><th>Prêmio</th><th>Vencedores</th><th>Termina</th><th>Status</th><th>Participantes</th><th>Ações</th></tr></thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan="7" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Nenhum sorteio ainda.</td></tr>}
          {items.map(g => (
            <tr key={g._id}>
              <td><code style={{ color: 'var(--gold)' }}>{String(g._id).slice(-6)}</code></td>
              <td>{g.prize}</td>
              <td>{g.winners}</td>
              <td>{g.endsAt ? new Date(g.endsAt).toLocaleString('pt-BR') : '—'}</td>
              <td>{g.cancelled ? <span className="pill-status off">Cancelado</span> : g.ended ? <span className="pill-status on">Finalizado</span> : <span className="pill-status on">Ativo</span>}</td>
              <td>{g.participants?.length || 0}</td>
              <td>{!g.ended && <button className="btn danger" onClick={() => cancel(g._id)}>Cancelar</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
