'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Card from '@/components/Card';

export default function TicketsPage() {
  const [tab, setTab] = useState('list');
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(()=>{
    fetch('/api/tickets').then(r=>r.json()).then(setTickets).catch(()=>{});
    fetch('/api/tickets/reviews').then(r=>r.json()).then(setReviews).catch(()=>{});
  },[]);

  const open = tickets.filter(t=>t.status==='open').length;
  const closed = tickets.filter(t=>t.status==='closed').length;
  const avgStaff = (reviews.reduce((a,r)=>a+(r.staffRating||0),0) / (reviews.length || 1)).toFixed(1);
  const avgService = (reviews.reduce((a,r)=>a+(r.serviceRating||0),0) / (reviews.length || 1)).toFixed(1);
  const goods = reviews.filter(r=>(r.staffRating||0) >= 4).length;
  const bads = reviews.filter(r=>(r.staffRating||0) <= 2).length;

  return (
    <Layout>
      <PageHead icon="🎫" title="Tickets" accent="Pineapple" subtitle="Atendimentos e avaliações"
        actions={<Tabs value={tab} onChange={setTab} options={[
          {label:'Tickets',value:'list'},{label:'Avaliações',value:'reviews'},
        ]} />}/>
      <div className="cards">
        <Card icon="🟢" label="ABERTOS" value={open} />
        <Card icon="🔒" label="FECHADOS" value={closed} />
        <Card icon="⭐" label="MÉDIA STAFF" value={avgStaff} />
        <Card icon="🌟" label="MÉDIA SERVIÇO" value={avgService} />
      </div>

      {tab === 'list' && (
        <div className="panel">
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>STATUS</th><th>CLAIM</th><th>ABERTO EM</th></tr></thead>
            <tbody>
              {tickets.length===0 && <tr><td colSpan={4} className="empty">Nenhum ticket.</td></tr>}
              {tickets.slice(0,50).map(t=>(
                <tr key={t._id}>
                  <td>&lt;@{t.userId}&gt;</td>
                  <td>{t.status==='open'?<span className="tag-active">Aberto</span>:t.status}</td>
                  <td>{t.claimedBy ? `<@${t.claimedBy}>` : '—'}</td>
                  <td>{new Date(t.openedAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="grid-2">
          <div className="panel">
            <h3>📊 Resumo</h3>
            <p>👍 Boas avaliações: <b style={{color:'#22c55e'}}>{goods}</b></p>
            <p>👎 Ruins: <b style={{color:'#ef4444'}}>{bads}</b></p>
            <p>Total: <b>{reviews.length}</b></p>
          </div>
          <div className="panel">
            <h3>💬 Últimas avaliações</h3>
            {reviews.slice(0,10).map(r => (
              <div key={r._id} style={{ padding:'10px 0', borderBottom:'1px solid #1a1a1a' }}>
                <b>{'⭐'.repeat(r.staffRating||0)}</b> staff / {'⭐'.repeat(r.serviceRating||0)} serviço<br/>
                <small style={{color:'#888'}}>{r.comment || '—'}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
