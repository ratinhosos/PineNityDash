'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Card from '@/components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function GestaoAtividadePage() {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState({ totalMembers: 0, totalMessages: 0, daily: [], top:[], bottom:[] });
  useEffect(()=>{ fetch('/api/activity').then(r=>r.json()).then(setData).catch(()=>{}); },[]);

  return (
    <Layout>
      <PageHead icon="📈" title="Gestão de" accent="Atividade" subtitle="Mensagens, canais ativos e rankings"
        actions={<Tabs value={period} onChange={setPeriod} options={[
          {label:'Diário',value:'daily'},{label:'Semanal',value:'weekly'},{label:'Mensal',value:'monthly'},
        ]}/>} />
      <div className="cards">
        <Card icon="💬" label="MENSAGENS" value={data.totalMessages || 0}/>
        <Card icon="👥" label="MEMBROS ATIVOS" value={data.totalMembers || 0}/>
        <Card icon="🎫" label="TICKETS" value={data.tickets || 0}/>
        <Card icon="🗳️" label="VOTAÇÕES" value={data.votes || 0}/>
      </div>

      <div className="panel">
        <h3>📊 Mensagens por dia (14d)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.daily || []}>
            <XAxis dataKey="day" stroke="#666" fontSize={10}/>
            <YAxis stroke="#666" fontSize={10}/>
            <Tooltip contentStyle={{ background:'#0a0a0a', border:'1px solid #FFD700' }}/>
            <Bar dataKey="count" fill="#FFD700" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2" style={{marginTop:16}}>
        <div className="panel">
          <h3>🔥 Quem mais fala</h3>
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>MENSAGENS</th></tr></thead>
            <tbody>{(data.top||[]).slice(0,10).map(m=>(
              <tr key={m.userId}><td>&lt;@{m.userId}&gt;</td><td>{m.messages||0}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="panel">
          <h3>💤 Quem menos fala</h3>
          <table className="table">
            <thead><tr><th>USUÁRIO</th><th>MENSAGENS</th></tr></thead>
            <tbody>{(data.bottom||[]).slice(0,10).map(m=>(
              <tr key={m.userId}><td>&lt;@{m.userId}&gt;</td><td>{m.messages||0}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
