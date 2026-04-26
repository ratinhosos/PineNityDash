'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';
import Dropdown from '@/components/Dropdown';

const PUNI = [
  { value: 'delete', label: 'Apagar' }, { value: 'warn', label: 'Warn' },
  { value: 'mute', label: 'Mute' }, { value: 'kick', label: 'Kick' }, { value: 'ban', label: 'Ban' },
];

export default function AutomacaoClient({ automations, antilink, guild }) {
  const [tab, setTab] = useState('welcome');
  const [welcome, setWelcome] = useState(automations.welcome || { enabled: false, channelId: '', title: '', description: '', color: '#FFD700', mentionUser: true });
  const [leave, setLeave] = useState(automations.leave || { enabled: false, channelId: '', title: '', description: '', color: '#FFD700' });
  const [logs, setLogs] = useState(automations.logs || { enabled: false, channelId: '', deletedChannelId: '' });
  const [al, setAl] = useState(antilink || { enabled: false, blockServerInvites: true, blockSiteLinks: true, punishment: 'delete', punishMessage: '🚫 Links não permitidos.' });
  const [saving, setSaving] = useState(false);

  const channels = (guild.channels || []).filter(c => c.type === 0).map(c => ({ value: c.id, label: '#' + c.name }));
  const roles = (guild.roles || []).map(r => ({ value: r.id, label: r.name }));

  async function saveAuto() {
    setSaving(true);
    await fetch('/api/automations', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ welcome, leave, logs }) });
    setSaving(false);
  }
  async function saveAntilink() {
    setSaving(true);
    await fetch('/api/antilink', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(al) });
    setSaving(false);
  }

  return (
    <>
      <Tabs value={tab} onChange={setTab} options={[
        { value: 'welcome', label: 'Boas-vindas' }, { value: 'leave', label: 'Saída' },
        { value: 'logs', label: 'Logs' }, { value: 'antilink', label: 'AntiLink' },
      ]} />
      <div className="card" style={{ marginTop: 14 }}>
        {tab === 'welcome' && (
          <>
            <h3 style={{ marginTop: 0 }}>👋 Boas-vindas</h3>
            <div className="row">
              <div><div className="label">Status</div><button className="btn ghost" onClick={() => setWelcome({ ...welcome, enabled: !welcome.enabled })}>{welcome.enabled ? '🟢 Ativo' : '🔴 Inativo'}</button></div>
              <div><div className="label">Canal</div><Dropdown value={welcome.channelId} options={[{ value: '', label: '—' }, ...channels]} onChange={v => setWelcome({ ...welcome, channelId: v })} /></div>
            </div>
            <div className="label" style={{ marginTop: 10 }}>Título</div><input className="input" value={welcome.title || ''} onChange={e => setWelcome({ ...welcome, title: e.target.value })} />
            <div className="label" style={{ marginTop: 10 }}>Descrição (use {'{user}'}, {'{guild}'})</div><textarea className="textarea" value={welcome.description || ''} onChange={e => setWelcome({ ...welcome, description: e.target.value })} />
            <div className="row">
              <div><div className="label">Marcar usuário</div><button className="btn ghost" onClick={() => setWelcome({ ...welcome, mentionUser: !welcome.mentionUser })}>{welcome.mentionUser ? 'Sim' : 'Não'}</button></div>
              <div><div className="label">Marcar cargo</div><Dropdown value={welcome.mentionRoleId || ''} options={[{ value: '', label: '—' }, ...roles]} onChange={v => setWelcome({ ...welcome, mentionRoleId: v })} /></div>
            </div>
            <div className="label" style={{ marginTop: 10 }}>Banner (URL)</div><input className="input" value={welcome.image || ''} onChange={e => setWelcome({ ...welcome, image: e.target.value })} />
            <div className="label" style={{ marginTop: 10 }}>Rodapé</div><input className="input" value={welcome.footer || ''} onChange={e => setWelcome({ ...welcome, footer: e.target.value })} />
            <button className="btn" style={{ marginTop: 14 }} onClick={saveAuto} disabled={saving}>💾 Salvar</button>
          </>
        )}
        {tab === 'leave' && (
          <>
            <h3 style={{ marginTop: 0 }}>🚪 Saída</h3>
            <div className="row">
              <div><div className="label">Status</div><button className="btn ghost" onClick={() => setLeave({ ...leave, enabled: !leave.enabled })}>{leave.enabled ? '🟢 Ativo' : '🔴 Inativo'}</button></div>
              <div><div className="label">Canal</div><Dropdown value={leave.channelId} options={[{ value: '', label: '—' }, ...channels]} onChange={v => setLeave({ ...leave, channelId: v })} /></div>
            </div>
            <div className="label" style={{ marginTop: 10 }}>Título</div><input className="input" value={leave.title || ''} onChange={e => setLeave({ ...leave, title: e.target.value })} />
            <div className="label" style={{ marginTop: 10 }}>Descrição</div><textarea className="textarea" value={leave.description || ''} onChange={e => setLeave({ ...leave, description: e.target.value })} />
            <div className="label" style={{ marginTop: 10 }}>Banner</div><input className="input" value={leave.image || ''} onChange={e => setLeave({ ...leave, image: e.target.value })} />
            <button className="btn" style={{ marginTop: 14 }} onClick={saveAuto} disabled={saving}>💾 Salvar</button>
          </>
        )}
        {tab === 'logs' && (
          <>
            <h3 style={{ marginTop: 0 }}>📜 Logs</h3>
            <div className="row">
              <div><div className="label">Logs habilitados</div><button className="btn ghost" onClick={() => setLogs({ ...logs, enabled: !logs.enabled })}>{logs.enabled ? '🟢 Sim' : '🔴 Não'}</button></div>
              <div><div className="label">Canal de logs gerais</div><Dropdown value={logs.channelId} options={[{ value: '', label: '—' }, ...channels]} onChange={v => setLogs({ ...logs, channelId: v })} /></div>
            </div>
            <div className="label" style={{ marginTop: 10 }}>Canal de mensagens apagadas</div>
            <Dropdown value={logs.deletedChannelId} options={[{ value: '', label: '—' }, ...channels]} onChange={v => setLogs({ ...logs, deletedChannelId: v })} />
            <button className="btn" style={{ marginTop: 14 }} onClick={saveAuto} disabled={saving}>💾 Salvar</button>
          </>
        )}
        {tab === 'antilink' && (
          <>
            <h3 style={{ marginTop: 0 }}>🚫 AntiLink</h3>
            <div className="row">
              <div><div className="label">Status</div><button className="btn ghost" onClick={() => setAl({ ...al, enabled: !al.enabled })}>{al.enabled ? '🟢 Ativo' : '🔴 Inativo'}</button></div>
              <div><div className="label">Punição</div><Dropdown value={al.punishment} options={PUNI} onChange={v => setAl({ ...al, punishment: v })} /></div>
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <div><div className="label">Bloquear invites Discord</div><button className="btn ghost" onClick={() => setAl({ ...al, blockServerInvites: !al.blockServerInvites })}>{al.blockServerInvites ? 'Sim' : 'Não'}</button></div>
              <div><div className="label">Bloquear sites</div><button className="btn ghost" onClick={() => setAl({ ...al, blockSiteLinks: !al.blockSiteLinks })}>{al.blockSiteLinks ? 'Sim' : 'Não'}</button></div>
            </div>
            <div className="label" style={{ marginTop: 10 }}>Mensagem de punição</div>
            <input className="input" value={al.punishMessage || ''} onChange={e => setAl({ ...al, punishMessage: e.target.value })} />
            <div className="label" style={{ marginTop: 10 }}>Canal de logs</div>
            <Dropdown value={al.logsChannelId || ''} options={[{ value: '', label: '—' }, ...channels]} onChange={v => setAl({ ...al, logsChannelId: v })} />
            <button className="btn" style={{ marginTop: 14 }} onClick={saveAntilink} disabled={saving}>💾 Salvar</button>
          </>
        )}
      </div>
    </>
  );
}
