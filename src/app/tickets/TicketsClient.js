'use client';
import { useMemo } from 'react';

export default function TicketsClient({ tickets, reviews }) {
  const stats = useMemo(() => {
    const open = tickets.filter(t => t.status === 'open').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    const avgStaff = reviews.length ? (reviews.reduce((a, r) => a + (r.staffRating || 0), 0) / reviews.length) : 0;
    const avgService = reviews.length ? (reviews.reduce((a, r) => a + (r.serviceRating || 0), 0) / reviews.length) : 0;
    const good = reviews.filter(r => r.staffRating >= 4).length;
    const bad = reviews.filter(r => r.staffRating <= 2).length;
    return { open, closed, avgStaff, avgService, good, bad, total: reviews.length };
  }, [tickets, reviews]);

  return (
    <>
      <div className="kpi-grid">
        <div className="card kpi"><div className="icon">🟢</div><div className="label">ABERTOS</div><div className="value">{stats.open}</div></div>
        <div className="card kpi"><div className="icon">🔒</div><div className="label">FECHADOS</div><div className="value">{stats.closed}</div></div>
        <div className="card kpi"><div className="icon">⭐</div><div className="label">MÉDIA STAFF</div><div className="value">{stats.avgStaff.toFixed(2)}</div></div>
        <div className="card kpi"><div className="icon">💼</div><div className="label">MÉDIA ATENDIMENTO</div><div className="value">{stats.avgService.toFixed(2)}</div></div>
        <div className="card kpi"><div className="icon">✅</div><div className="label">BOAS</div><div className="value">{stats.good}</div></div>
        <div className="card kpi"><div className="icon">⚠️</div><div className="label">RUINS</div><div className="value">{stats.bad}</div></div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>📋 Tickets</h3>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Usuário</th><th>Status</th><th>Staff</th><th>Aberto em</th><th>Fechado em</th></tr></thead>
          <tbody>
            {tickets.length === 0 && <tr><td colSpan="6" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Nenhum ticket ainda.</td></tr>}
            {tickets.slice(0, 50).map(t => (
              <tr key={t._id}>
                <td><code>{String(t._id).slice(-6)}</code></td>
                <td>{t.userId}</td>
                <td>{t.status === 'open' ? <span className="pill-status on">Aberto</span> : <span className="pill-status off">Fechado</span>}</td>
                <td>{t.claimedBy || '—'}</td>
                <td>{t.openedAt ? new Date(t.openedAt).toLocaleString('pt-BR') : '—'}</td>
                <td>{t.closedAt ? new Date(t.closedAt).toLocaleString('pt-BR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>⭐ Avaliações Recentes</h3>
        <table className="tbl">
          <thead><tr><th>Usuário</th><th>Staff</th><th>Nota Staff</th><th>Nota Atend.</th><th>Comentário</th><th>Data</th></tr></thead>
          <tbody>
            {reviews.slice(0, 50).map(r => (
              <tr key={r._id}>
                <td>{r.reviewerId}</td>
                <td>{r.staffId || '—'}</td>
                <td>{'⭐'.repeat(r.staffRating || 0)}</td>
                <td>{'⭐'.repeat(r.serviceRating || 0)}</td>
                <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.comment || '—'}</td>
                <td>{new Date(r.createdAt).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
