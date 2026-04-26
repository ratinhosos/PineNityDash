'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Card from '@/components/Card';

function classify(score) {
  if (score >= 70) return { label: 'Bom', color: '#22c55e' };
  if (score >= 40) return { label: 'Médio', color: '#FFD700' };
  return { label: 'Ruim', color: '#ef4444' };
}

export default function GestaoComunidadePage() {
  const [period, setPeriod] = useState('total');
  const [members, setMembers] = useState([]);

  useEffect(()=>{ fetch('/api/community').then(r=>r.json()).then(setMembers).catch(()=>{}); },[]);

  const enriched = members.map(m => {
    const score = Math.max(0, 100 - (m.warns||0)*5 - (m.mutes||0)*10 - (m.bans||0)*30 - (m.curses||0)*0.5);
    return { ...m, score: Math.round(score), ...classify(score) };
  });

  const total = enriched.length;
  const good = enriched.filter(m=>m.label==='Bom').length;
  const med = enriched.filter(m=>m.label==='Médio').length;
  const bad = enriched.filter(m=>m.label==='Ruim').length;

  const topMutes = [...enriched].sort((a,b)=>(b.mutes||0)-(a.mutes||0)).slice(0,5);
  const problematic = [...enriched].sort((a,b)=>a.score-b.score).slice(0,5);

  return (
    <Layout>
      <PageHead icon="👥" title="Gestão de" accent="Comunidade" subtitle="Comportamento, warns, mutes e rankings"
        actions={<Tabs value={period} onChange={setPeriod} options={[
          {label:'Dia',value:'day'},{label:'Semana',value:'week'},{label:'Mês',value:'month'},{label:'Total',value:'total'},
        ]}/>} />
      <div className="cards">
        <Card icon="👥" label="MEMBROS" value={total}/>
        <Card icon="✅" label="BONS" value={good}/>
        <Card icon="⚠️" label="MÉDIOS" value={med}/>
        <Card icon="🚫" label="RUINS" value={bad}/>
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>🏆 Mais Problemáticos</h3>
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>SCORE</th><th>WARNS</th><th>MUTES</th></tr></thead>
            <tbody>
              {problematic.map(m=>(
                <tr key={m.userId}><td>&lt;@{m.userId}&gt;</td><td style={{color:m.color}}>{m.score} • {m.label}</td><td>{m.warns||0}</td><td>{m.mutes||0}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3>🔇 Mais Mutes</h3>
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>MUTES</th><th>WARNS</th></tr></thead>
            <tbody>
              {topMutes.map(m=>(
                <tr key={m.userId}><td>&lt;@{m.userId}&gt;</td><td>{m.mutes||0}</td><td>{m.warns||0}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
