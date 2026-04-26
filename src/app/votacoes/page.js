'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';

const TYPE_LABELS = { generic:'Geral', bobo:'🤡 Bobo', rei:'👑 Rei', protagonista:'🌟 Protagonista', chato:'😤 Chato' };

export default function VotacoesPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('active');
  useEffect(()=>{ fetch('/api/votes').then(r=>r.json()).then(setList).catch(()=>{}); },[]);
  const filtered = list.filter(v => filter==='active' ? !v.ended && !v.cancelled : filter==='ended' ? v.ended : true);

  async function action(id, type) {
    await fetch(`/api/votes/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(
      type==='cancel' ? { cancelled:true, ended:true } : type==='reopen' ? { ended:false, cancelled:false } : {}
    )});
    fetch('/api/votes').then(r=>r.json()).then(setList);
  }

  return (
    <Layout>
      <PageHead icon="🗳️" title="Votações" accent="Pineapple" subtitle="Polls e enquetes especiais"
        actions={<Tabs value={filter} onChange={setFilter} options={[
          {label:'Ativas',value:'active'},{label:'Encerradas',value:'ended'},{label:'Todas',value:'all'},
        ]}/>} />
      <div className="panel">
        <table className="table">
          <thead><tr><th>TÍTULO</th><th>TIPO</th><th>VOTOS</th><th>TERMINA</th><th>VENCEDOR</th><th>AÇÕES</th></tr></thead>
          <tbody>
            {filtered.length===0 && <tr><td colSpan={6} className="empty">Nenhuma votação.</td></tr>}
            {filtered.map(v => (
              <tr key={v._id}>
                <td><b>{v.title || '—'}</b></td>
                <td>{TYPE_LABELS[v.type]||v.type}</td>
                <td>{v.votes?.length || 0}</td>
                <td>{v.endsAt ? new Date(v.endsAt).toLocaleString('pt-BR') : '—'}</td>
                <td>{v.winnerId ? `<@${v.winnerId}>` : '—'}</td>
                <td style={{display:'flex',gap:6}}>
                  {!v.ended && <button className="btn-danger" onClick={()=>action(v._id,'cancel')}>Cancelar</button>}
                  {v.ended && <button className="btn-ghost btn-sm" onClick={()=>action(v._id,'reopen')}>Reabrir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
