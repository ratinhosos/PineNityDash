'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Card from '@/components/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const [period, setPeriod] = useState('daily');
  const [stats, setStats] = useState({ members: 0, messages: 0, tickets: 0, votes: 0 });
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch('/api/activity').then(r=>r.json()).then(d => {
      setStats({ members: d.totalMembers || 0, messages: d.totalMessages || 0, tickets: d.tickets || 0, votes: d.votes || 0 });
      setSeries((d.daily || []).map(x => ({ day: x.day, value: x.count })));
    }).catch(()=>{});
  }, []);

  const pieData = [
    { name: 'Mensagens', value: stats.messages || 1 },
    { name: 'Tickets', value: stats.tickets || 1 },
    { name: 'Votos', value: stats.votes || 1 },
  ];

  return (
    <Layout>
      <PageHead icon="📊" title="Dashboard" accent="Pineapple"
        subtitle="Visão geral da comunidade em tempo real."
        actions={<Tabs value={period} onChange={setPeriod} options={[
          {label:'Diário',value:'daily'},{label:'Semanal',value:'weekly'},{label:'Mensal',value:'monthly'}
        ]} />}
      />
      <div className="cards">
        <Card icon="👥" label="MEMBROS" value={stats.members} />
        <Card icon="💬" label="MENSAGENS" value={stats.messages} />
        <Card icon="🎫" label="TICKETS" value={stats.tickets} />
        <Card icon="🗳️" label="VOTAÇÕES" value={stats.votes} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <h3>📈 Atividade ao longo do tempo</h3>
          <p className="sub">Últimos 14 dias</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series.length ? series : [{day:'',value:0}]}>
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#666" fontSize={10}/>
              <YAxis stroke="#666" fontSize={10}/>
              <Tooltip contentStyle={{ background:'#0a0a0a', border:'1px solid #FFD700' }}/>
              <Area type="monotone" dataKey="value" stroke="#FFD700" fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3>🥧 Distribuição</h3>
          <p className="sub">Atividade por tipo</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={90}>
                {pieData.map((_, i) => <Cell key={i} fill={['#FFD700','#FFC107','#6b6b6b'][i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#0a0a0a', border:'1px solid #FFD700' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
