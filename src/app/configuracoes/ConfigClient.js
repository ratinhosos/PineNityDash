'use client';
import { useState } from 'react';
import Dropdown from '@/components/Dropdown';

export default function ConfigClient({ config, guild }) {
  const [draft, setDraft] = useState({
    staffRoleId: config.staffRoleId || '',
    verifiedRoleId: config.verifiedRoleId || '',
    unverifiedRoleId: config.unverifiedRoleId || '',
    channels: {
      logs: config.channels?.logs || '', deletedLogs: config.channels?.deletedLogs || '',
      welcome: config.channels?.welcome || '', leave: config.channels?.leave || '',
    },
  });
  const [saving, setSaving] = useState(false);
  const channels = [{ value: '', label: '—' }, ...(guild.channels || []).filter(c => c.type === 0).map(c => ({ value: c.id, label: '#' + c.name }))];
  const roles = [{ value: '', label: '—' }, ...(guild.roles || []).map(r => ({ value: r.id, label: r.name }))];

  async function save() {
    setSaving(true);
    await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    setSaving(false);
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>⚙️ Sistema</h3>
      <div className="row">
        <div><div className="label">Cargo Staff</div><Dropdown value={draft.staffRoleId} options={roles} onChange={v => setDraft({ ...draft, staffRoleId: v })} /></div>
        <div><div className="label">Cargo Verificado</div><Dropdown value={draft.verifiedRoleId} options={roles} onChange={v => setDraft({ ...draft, verifiedRoleId: v })} /></div>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <div><div className="label">Cargo Não-verificado</div><Dropdown value={draft.unverifiedRoleId} options={roles} onChange={v => setDraft({ ...draft, unverifiedRoleId: v })} /></div>
        <div><div className="label">Canal de logs</div><Dropdown value={draft.channels.logs} options={channels} onChange={v => setDraft({ ...draft, channels: { ...draft.channels, logs: v } })} /></div>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <div><div className="label">Canal de apagadas</div><Dropdown value={draft.channels.deletedLogs} options={channels} onChange={v => setDraft({ ...draft, channels: { ...draft.channels, deletedLogs: v } })} /></div>
        <div><div className="label">Canal boas-vindas</div><Dropdown value={draft.channels.welcome} options={channels} onChange={v => setDraft({ ...draft, channels: { ...draft.channels, welcome: v } })} /></div>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <div><div className="label">Canal saída</div><Dropdown value={draft.channels.leave} options={channels} onChange={v => setDraft({ ...draft, channels: { ...draft.channels, leave: v } })} /></div>
      </div>
      <button className="btn" style={{ marginTop: 16 }} onClick={save} disabled={saving}>💾 Salvar</button>
    </div>
  );
}
