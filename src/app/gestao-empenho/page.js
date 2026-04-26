'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Card from '@/components/Card';

export default function GestaoEmpenhoPage() {
  const [period, setPeriod] = useState('total');
  const [staff, setStaff] = useState([]);
  useEffect(()=>{ fetch('/api/staff').then(r=>r.json()).then(setStaff).catch(()=>{}); },[]);

  const sorted = [...staff].sort((a,b)=>(b.ticketsResolved||0)-(a.ticketsResolved||0));
  const totalTickets = staff.reduce((a,s)=>a+(s.ticketsResolved||0),0);
  const totalGood = staff.reduce((a,s)=>a+(s.goodReviews||0),0);
  const totalBad = staff.reduce((a,s)=>a+(s.badReviews||0),0);

  return (
    <Layout>
      <PageHead icon="🏆" title="Gestão de" accent="Empenho" subtitle="Equipe e desempenho dos staffs"
        actions={<Tabs value={period} onChange={setPeriod} options={[
          {label:'Dia',value:'day'},{label:'Semana',value:'week'},{label:'Mês',value:'month'},{label:'Total',value:'total'},
        ]}/>} />
      <div className="cards">
        <Card icon="👮" label="STAFFS" value={staff.length}/>
        <Card icon="🎫" label="TICKETS RESOLVIDOS" value={totalTickets}/>
        <Card icon="👍" label="BOAS AVALIAÇÕES" value={totalGood}/>
        <Card icon="👎" label="RUINS" value={totalBad}/>
      </div>

      <div className="panel">
        <h3>📊 Ranking da Equipe</h3>
        <table className="table">
          <thead><tr><th>STAFF</th><th>RESOLVIDOS</th><th>ASSUMIDOS</th><th>BOAS</th><th>RUINS</th><th>MÉDIA STAFF</th></tr></thead>
          <tbody>
            {sorted.length===0 && <tr><td colSpan={6} className="empty">Sem dados.</td></tr>}
            {sorted.map(s=>(
              <tr key={s.userId}>
                <td>&lt;@{s.userId}&gt;</td>
                <td>{s.ticketsResolved||0}</td>
                <td>{s.ticketsClaimed||0}</td>
                <td style={{color:'#22c55e'}}>{s.goodReviews||0}</td>
                <td style={{color:'#ef4444'}}>{s.badReviews||0}</td>
                <td>{(s.averageStaffRating||0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
