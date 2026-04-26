'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';

export default function GerenciarServidorPage() {
  const [tab, setTab] = useState('channels');
  const [data, setData] = useState({ channels: [], roles: [] });

  async function load() {
    const d = await fetch('/api/guild').then(r=>r.json());
    if (!d.error) setData(d);
  }
  useEffect(()=>{ load(); },[]);

  async function delChannel(id, name) {
    if (!confirm(`Apagar canal #${name}?\nEsta ação é IRREVERSÍVEL.`)) return;
    await fetch(`/api/server/channels/${id}`, { method:'DELETE' });
    load();
  }
  async function delRole(id, name) {
    if (!confirm(`Apagar cargo @${name}?\nEsta ação é IRREVERSÍVEL.`)) return;
    await fetch(`/api/server/roles/${id}`, { method:'DELETE' });
    load();
  }
  async function newChannel() {
    const name = prompt('Nome do canal:');
    if (!name) return;
    await fetch('/api/server/channels', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, type: 0 })});
    load();
  }
  async function newRole() {
    const name = prompt('Nome do cargo:');
    if (!name) return;
    await fetch('/api/server/roles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name })});
    load();
  }

  return (
    <Layout>
      <PageHead icon="🛠️" title="Gerenciar" accent="Servidor" subtitle="Canais, categorias e cargos"
        actions={<Tabs value={tab} onChange={setTab} options={[
          {label:'Canais',value:'channels'},{label:'Cargos',value:'roles'},
        ]}/>} />

      {tab==='channels' && (
        <div className="panel">
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
            <h3>📋 Canais ({data.channels.length})</h3>
            <button className="btn" onClick={newChannel}>+ Novo Canal</button>
          </div>
          <table className="table">
            <thead><tr><th>NOME</th><th>TIPO</th><th>ID</th><th>AÇÕES</th></tr></thead>
            <tbody>
              {data.channels.map(c => (
                <tr key={c.id}>
                  <td>#{c.name}</td>
                  <td>{c.type===0?'Texto':c.type===2?'Voz':c.type===4?'Categoria':c.type}</td>
                  <td><code style={{fontSize:11,color:'#888'}}>{c.id}</code></td>
                  <td><button className="btn-danger" onClick={()=>delChannel(c.id,c.name)}>Apagar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='roles' && (
        <div className="panel">
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
            <h3>🎭 Cargos ({data.roles.length})</h3>
            <button className="btn" onClick={newRole}>+ Novo Cargo</button>
          </div>
          <table className="table">
            <thead><tr><th>NOME</th><th>COR</th><th>ID</th><th>AÇÕES</th></tr></thead>
            <tbody>
              {data.roles.map(r => (
                <tr key={r.id}>
                  <td><span style={{color:r.color}}>@{r.name}</span></td>
                  <td><span style={{display:'inline-block',width:14,height:14,borderRadius:4,background:r.color,verticalAlign:'middle'}}/> <code style={{fontSize:11}}>{r.color}</code></td>
                  <td><code style={{fontSize:11,color:'#888'}}>{r.id}</code></td>
                  <td>{!r.managed && <button className="btn-danger" onClick={()=>delRole(r.id,r.name)}>Apagar</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
