'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';

export default function LogsClient({ logs, deleted }) {
  const [tab, setTab] = useState('events');
  return (
    <>
      <Tabs value={tab} onChange={setTab} options={[{ value: 'events', label: 'Eventos' }, { value: 'deleted', label: 'Mensagens apagadas' }]} />
      <div className="card" style={{ marginTop: 14 }}>
        {tab === 'events' ? (
          <table className="tbl"><thead><tr><th>Tipo</th><th>Ator</th><th>Alvo</th><th>Data</th></tr></thead>
            <tbody>{logs.length === 0 && <tr><td colSpan="4" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Sem eventos.</td></tr>}
              {logs.map(l => <tr key={l._id}><td>{l.type}</td><td>{l.actorId}</td><td>{l.targetId || '—'}</td><td>{new Date(l.createdAt).toLocaleString('pt-BR')}</td></tr>)}</tbody></table>
        ) : (
          <table className="tbl"><thead><tr><th>Autor</th><th>Canal</th><th>Mensagem</th><th>Anexos</th><th>Apagada em</th></tr></thead>
            <tbody>{deleted.length === 0 && <tr><td colSpan="5" style={{ color: 'var(--muted)', textAlign: 'center', padding: 24 }}>Sem mensagens apagadas.</td></tr>}
              {deleted.map(d => <tr key={d._id}><td>{d.authorTag || d.authorId}</td><td>{d.channelId}</td><td style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.content || '*sem texto*'}</td><td>{d.attachments?.length || 0}</td><td>{new Date(d.deletedAt).toLocaleString('pt-BR')}</td></tr>)}</tbody></table>
        )}
      </div>
    </>
  );
}
