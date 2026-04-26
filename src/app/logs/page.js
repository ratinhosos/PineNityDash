'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';

export default function LogsPage() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [deleted, setDeleted] = useState([]);
  useEffect(()=>{
    fetch('/api/logs').then(r=>r.json()).then(setEvents).catch(()=>{});
    fetch('/api/logs/deleted').then(r=>r.json()).then(setDeleted).catch(()=>{});
  },[]);

  return (
    <Layout>
      <PageHead icon="📋" title="Logs" accent="Pineapple" subtitle="Eventos e mensagens apagadas"
        actions={<Tabs value={tab} onChange={setTab} options={[
          {label:'Eventos',value:'events'},{label:'Apagadas',value:'deleted'},
        ]}/>} />

      {tab==='events' && (
        <div className="panel">
          <table className="table">
            <thead><tr><th>TIPO</th><th>USUÁRIO</th><th>ALVO</th><th>QUANDO</th></tr></thead>
            <tbody>
              {events.length===0 && <tr><td colSpan={4} className="empty">Nenhum log.</td></tr>}
              {events.map(l=>(
                <tr key={l._id}><td>{l.type}</td><td>&lt;@{l.actorId}&gt;</td><td>{l.targetId?`<@${l.targetId}>`:'—'}</td><td>{new Date(l.createdAt).toLocaleString('pt-BR')}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='deleted' && (
        <div className="panel">
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>CANAL</th><th>CONTEÚDO</th><th>HORA</th><th>ANEXOS</th></tr></thead>
            <tbody>
              {deleted.length===0 && <tr><td colSpan={5} className="empty">Sem mensagens apagadas registradas.</td></tr>}
              {deleted.map(d=>(
                <tr key={d._id}>
                  <td>{d.authorTag||'—'}<br/><small style={{color:'#666'}}>{d.authorId}</small></td>
                  <td>&lt;#{d.channelId}&gt;</td>
                  <td style={{maxWidth:280, overflow:'hidden', textOverflow:'ellipsis'}}>{d.content||'*sem texto*'}</td>
                  <td>{new Date(d.deletedAt).toLocaleString('pt-BR')}</td>
                  <td>{(d.attachments||[]).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
