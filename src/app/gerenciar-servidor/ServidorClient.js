'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';

export default function ServidorClient({ guild }) {
  const [tab, setTab] = useState('channels');
  const [channels, setChannels] = useState(guild.channels || []);
  const [roles, setRoles] = useState(guild.roles || []);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState(0);

  async function createChannel() {
    if (!newName) return;
    const r = await fetch('/api/server/channel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName, type: parseInt(newType, 10) }) });
    const data = await r.json(); if (data?.id) setChannels([...channels, { id: data.id, name: data.name, type: parseInt(newType, 10) }]); setNewName('');
  }
  async function delChannel(id) { if (!confirm('⚠️ Tem certeza? Essa ação é destrutiva.')) return; const r = await fetch(`/api/server/channel/${id}`, { method: 'DELETE' }); if (r.ok) setChannels(channels.filter(c => c.id !== id)); }
  async function createRole() { if (!newName) return; const r = await fetch('/api/server/role', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName }) }); const data = await r.json(); if (data?.id) setRoles([...roles, { id: data.id, name: data.name }]); setNewName(''); }
  async function delRole(id) { if (!confirm('⚠️ Tem certeza? Essa ação é destrutiva.')) return; const r = await fetch(`/api/server/role/${id}`, { method: 'DELETE' }); if (r.ok) setRoles(roles.filter(c => c.id !== id)); }

  return (
    <>
      <Tabs value={tab} onChange={setTab} options={[{ value: 'channels', label: 'Canais' }, { value: 'roles', label: 'Cargos' }, { value: 'categories', label: 'Categorias' }]} />
      <div className="card" style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <input className="input" style={{ maxWidth: 280 }} placeholder="Nome..." value={newName} onChange={e => setNewName(e.target.value)} />
          {tab === 'channels' && (<select className="input" style={{ maxWidth: 200 }} value={newType} onChange={e => setNewType(e.target.value)}>
            <option value="0">Texto</option><option value="2">Voz</option><option value="4">Categoria</option>
          </select>)}
          <button className="btn" onClick={tab === 'roles' ? createRole : createChannel}>+ Criar</button>
        </div>
        {tab === 'channels' && <table className="tbl"><thead><tr><th>Nome</th><th>Tipo</th><th>Ações</th></tr></thead>
          <tbody>{channels.filter(c => c.type !== 4).map(c => (<tr key={c.id}><td>#{c.name}</td><td>{c.type === 0 ? 'Texto' : c.type === 2 ? 'Voz' : c.type}</td><td><button className="btn danger" onClick={() => delChannel(c.id)}>Apagar</button></td></tr>))}</tbody></table>}
        {tab === 'categories' && <table className="tbl"><thead><tr><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>{channels.filter(c => c.type === 4).map(c => (<tr key={c.id}><td>{c.name}</td><td><button className="btn danger" onClick={() => delChannel(c.id)}>Apagar (com canais)</button></td></tr>))}</tbody></table>}
        {tab === 'roles' && <table className="tbl"><thead><tr><th>Cargo</th><th>Ações</th></tr></thead>
          <tbody>{roles.map(r => (<tr key={r.id}><td>{r.name}</td><td><button className="btn danger" onClick={() => delRole(r.id)}>Apagar</button></td></tr>))}</tbody></table>}
      </div>
    </>
  );
}
