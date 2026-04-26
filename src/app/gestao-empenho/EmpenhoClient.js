'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';
import Dropdown from '@/components/Dropdown';

export default function EmpenhoClient({ staff, guild, config }) {
  const [period, setPeriod] = useState('total');
  const [staffRoleId, setStaffRoleId] = useState(config.staffRoleId || '');
  const [saving, setSaving] = useState(false);

  async function saveRole() {
    setSaving(true);
    await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ staffRoleId }) });
    setSaving(false);
  }

  const sorted = [...staff].sort((a, b) => (b.ticketsResolved || 0) - (a.ticketsResolved || 0));
  const best = [...staff].sort((a, b) => (b.averageStaffRating || 0) - (a.averageStaffRating || 0))[0];
  const worst = [...staff].sort((a, b) => (a.averageStaffRating || 0) - (b.averageStaffRating || 0))[0];

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <div className="label">Cargo da Equipe (staff/mod/admin)</div>
            <Dropdown value={staffRoleId} onChange={setStaffRoleId}
              options={[{ value: '', label: '— Sem cargo definido —' }, ...((guild.roles || []).map(r => ({ value: r.id, label: r.name })))]} />
          </div>
          <button className="btn" onClick={saveRole} disabled={saving}>💾 Salvar cargo</button>
          <div style={{ marginLeft: 'auto' }}>
            <Tabs value={period} onChange={setPeriod} options={[{ value: 'daily', label: 'Diário' }, { value: 'weekly', label: 'Semanal' }, { value: 'monthly', label: 'Mensal' }, { value: 'total', label: 'Total' }]} />
          </div>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="card kpi"><div className="icon">⭐</div><div className="label">MELHOR STAFF</div><div className="value" style={{ fontSize: 18 }}>{best?.userId || '—'}</div></div>
        <div className="card kpi"><div className="icon">⚠️</div><div className="label">PIOR STAFF</div><div className="value" style={{ fontSize: 18 }}>{worst?.userId || '—'}</div></div>
        <div className="card kpi"><div className="icon">🎫</div><div className="label">TICKETS RESOLVIDOS</div><div className="value">{staff.reduce((a, s) => a + (s.ticketsResolved || 0), 0)}</div></div>
        <div className="card kpi"><div className="icon">✋</div><div className="label">ASSUMIDOS</div><div className="value">{staff.reduce((a, s) => a + (s.ticketsClaimed || 0), 0)}</div></div>
      </div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>🏆 Ranking da Equipe</h3>
        <table className="tbl"><thead><tr><th>#</th><th>Staff</th><th>Resolvidos</th><th>Assumidos</th><th>Boas</th><th>Ruins</th><th>Média Staff</th><th>Média Atend.</th></tr></thead>
          <tbody>{sorted.map((s, i) => (
            <tr key={s.userId}>
              <td>{i+1}</td><td>{s.userId}</td><td>{s.ticketsResolved || 0}</td><td>{s.ticketsClaimed || 0}</td>
              <td>{s.goodReviews || 0}</td><td>{s.badReviews || 0}</td>
              <td>{(s.averageStaffRating || 0).toFixed(2)}</td><td>{(s.averageServiceRating || 0).toFixed(2)}</td>
            </tr>))}
            {sorted.length === 0 && <tr><td colSpan="8" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Sem dados de staff ainda.</td></tr>}
          </tbody></table>
      </div>
    </>
  );
}
