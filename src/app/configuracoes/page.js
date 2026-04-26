'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Dropdown from '@/components/Dropdown';

export default function ConfigPage() {
  const [cfg, setCfg] = useState({});
  const [guild, setGuild] = useState({ channels: [], roles: [] });

  useEffect(()=>{
    fetch('/api/config').then(r=>r.json()).then(setCfg).catch(()=>{});
    fetch('/api/guild').then(r=>r.json()).then(setGuild).catch(()=>{});
  },[]);

  function set(p,v){
    const c = JSON.parse(JSON.stringify(cfg||{}));
    const parts = p.split('.');
    let o = c; for (let i=0;i<parts.length-1;i++){o[parts[i]]||={};o=o[parts[i]];}
    o[parts[parts.length-1]] = v; setCfg(c);
  }

  async function save() {
    await fetch('/api/config', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(cfg)});
    alert('✅ Salvo!');
  }

  const channelOpts = (guild.channels||[]).filter(c=>c.type===0).map(c=>({label:'#'+c.name,value:c.id}));
  const roleOpts = (guild.roles||[]).filter(r=>!r.managed).map(r=>({label:'@'+r.name,value:r.id}));

  return (
    <Layout>
      <PageHead icon="⚙️" title="Configurações" accent="Pineapple" subtitle="Ajustes gerais do servidor"
        actions={<button className="btn" onClick={save}>💾 Salvar</button>} />
      <div className="grid-2">
        <div className="panel">
          <h3>🏷️ Cargos</h3>
          <div className="field"><label className="label">CARGO DE STAFF / EQUIPE</label>
            <Dropdown value={cfg.staffRoleId||''} options={roleOpts} onChange={v=>set('staffRoleId',v)}/></div>
          <div className="field"><label className="label">CARGO VERIFICADO</label>
            <Dropdown value={cfg.verifiedRoleId||''} options={roleOpts} onChange={v=>set('verifiedRoleId',v)}/></div>
          <div className="field"><label className="label">CARGO NÃO VERIFICADO</label>
            <Dropdown value={cfg.unverifiedRoleId||''} options={roleOpts} onChange={v=>set('unverifiedRoleId',v)}/></div>
        </div>
        <div className="panel">
          <h3>📺 Canais</h3>
          <div className="field"><label className="label">CANAL DE LOGS</label>
            <Dropdown value={cfg.channels?.logs||''} options={channelOpts} onChange={v=>set('channels.logs',v)}/></div>
          <div className="field"><label className="label">CANAL DE MENSAGENS APAGADAS</label>
            <Dropdown value={cfg.channels?.deletedLogs||''} options={channelOpts} onChange={v=>set('channels.deletedLogs',v)}/></div>
          <div className="field"><label className="label">CANAL DE BOAS-VINDAS</label>
            <Dropdown value={cfg.channels?.welcome||''} options={channelOpts} onChange={v=>set('channels.welcome',v)}/></div>
          <div className="field"><label className="label">CANAL DE SAÍDA</label>
            <Dropdown value={cfg.channels?.leave||''} options={channelOpts} onChange={v=>set('channels.leave',v)}/></div>
        </div>
      </div>
    </Layout>
  );
}
