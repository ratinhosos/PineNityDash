'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';

export default function SorteiosPage() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('active');
  useEffect(()=>{ fetch('/api/giveaways').then(r=>r.json()).then(setList).catch(()=>{}); },[]);

  const filtered = list.filter(g => {
    if (filter === 'active') return !g.ended && !g.cancelled;
    if (filter === 'ended') return g.ended;
    if (filter === 'cancelled') return g.cancelled;
    return true;
  });

  async function cancel(id) {
    if (!confirm('Cancelar sorteio?')) return;
    await fetch(`/api/giveaways/${id}`, { method:'DELETE' });
    setList(list.map(g => g._id===id ? {...g, cancelled:true, ended:true} : g));
  }

  return (
    <Layout>
      <PageHead icon="🎉" title="Sorteios" accent="Pineapple" subtitle="Gerencie todos os sorteios da comunidade."
        actions={<Tabs value={filter} onChange={setFilter} options={[
          {label:'Ativos',value:'active'},{label:'Encerrados',value:'ended'},{label:'Cancelados',value:'cancelled'},{label:'Todos',value:'all'},
        ]} />} />
      <div className="panel">
        <table className="table">
          <thead><tr>
            <th>PRÊMIO</th><th>GANHADORES</th><th>PARTICIPANTES</th><th>TERMINA</th><th>STATUS</th><th>AÇÕES</th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="empty">Nenhum sorteio.</td></tr>}
            {filtered.map(g => (
              <tr key={g._id}>
                <td><b>{g.prize}</b></td>
                <td>{g.winners}</td>
                <td>{g.participants?.length || 0}</td>
                <td>{new Date(g.endsAt).toLocaleString('pt-BR')}</td>
                <td>{g.cancelled ? '❌ Cancelado' : g.ended ? '✓ Encerrado' : <span className="tag-active">Ativo</span>}</td>
                <td>{!g.ended && !g.cancelled && <button className="btn-danger" onClick={()=>cancel(g._id)}>Cancelar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
