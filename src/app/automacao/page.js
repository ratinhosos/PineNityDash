'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Tabs from '@/components/Tabs';
import Dropdown from '@/components/Dropdown';

export default function AutomacaoPage() {
  const [tab, setTab] = useState('welcome');
  const [auto, setAuto] = useState({ welcome:{}, leave:{}, logs:{} });
  const [antilink, setAntilink] = useState({ enabled:false, blockServerInvites:true, blockSiteLinks:true, punishment:'delete', punishMessage:'🚫 Links não são permitidos.' });
  const [channels, setChannels] = useState([]);

  useEffect(()=>{
    fetch('/api/automations').then(r=>r.json()).then(setAuto).catch(()=>{});
    fetch('/api/antilink').then(r=>r.json()).then(setAntilink).catch(()=>{});
    fetch('/api/guild').then(r=>r.json()).then(d => setChannels((d.channels||[]).filter(c=>c.type===0).map(c=>({label:'#'+c.name,value:c.id})))).catch(()=>{});
  },[]);

  async function saveAuto() {
    await fetch('/api/automations', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(auto)});
    alert('✅ Salvo!');
  }
  async function saveAnti() {
    await fetch('/api/antilink', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(antilink)});
    alert('✅ Salvo!');
  }
  function setW(p,v){ setAuto({...auto, welcome:{...auto.welcome,[p]:v}}); }
  function setL(p,v){ setAuto({...auto, leave:{...auto.leave,[p]:v}}); }

  return (
    <Layout>
      <PageHead icon="🤖" title="Automação" accent="Pineapple" subtitle="Boas-vindas, saídas, logs e antilink"
        actions={<Tabs value={tab} onChange={setTab} options={[
          {label:'Boas-vindas',value:'welcome'},{label:'Saída',value:'leave'},{label:'AntiLink',value:'antilink'},{label:'Logs',value:'logs'},
        ]}/>} />

      {tab==='welcome' && (
        <div className="panel">
          <h3>👋 Boas-vindas</h3>
          <div className="grid-2">
            <div>
              <div className="field"><label className="label">ATIVO</label>
                <Tabs value={auto.welcome?.enabled?'on':'off'} onChange={v=>setW('enabled',v==='on')} options={[{label:'Ligado',value:'on'},{label:'Desligado',value:'off'}]} />
              </div>
              <div className="field"><label className="label">CANAL</label>
                <Dropdown value={auto.welcome?.channelId||''} options={channels} onChange={v=>setW('channelId',v)}/></div>
              <div className="field"><label className="label">MARCAR USUÁRIO</label>
                <Tabs value={auto.welcome?.mentionUser?'on':'off'} onChange={v=>setW('mentionUser',v==='on')} options={[{label:'Sim',value:'on'},{label:'Não',value:'off'}]}/></div>
              <div className="field"><label className="label">CARGO A MARCAR (ID)</label>
                <input className="input" value={auto.welcome?.mentionRoleId||''} onChange={e=>setW('mentionRoleId',e.target.value)}/></div>
            </div>
            <div>
              <div className="field"><label className="label">TÍTULO</label>
                <input className="input" value={auto.welcome?.title||''} onChange={e=>setW('title',e.target.value)} placeholder="👋 Bem-vindo {user.name}!"/></div>
              <div className="field"><label className="label">DESCRIÇÃO</label>
                <textarea className="textarea" value={auto.welcome?.description||''} onChange={e=>setW('description',e.target.value)} placeholder="Use {user}, {guild.name}, {member_count}"/></div>
              <div className="field"><label className="label">BANNER (URL)</label>
                <input className="input" value={auto.welcome?.image||''} onChange={e=>setW('image',e.target.value)}/></div>
              <div className="field"><label className="label">RODAPÉ</label>
                <input className="input" value={auto.welcome?.footer||''} onChange={e=>setW('footer',e.target.value)}/></div>
            </div>
          </div>
          <button className="btn" onClick={saveAuto}>💾 Salvar</button>
        </div>
      )}

      {tab==='leave' && (
        <div className="panel">
          <h3>👋 Saída</h3>
          <div className="grid-2">
            <div>
              <div className="field"><label className="label">ATIVO</label>
                <Tabs value={auto.leave?.enabled?'on':'off'} onChange={v=>setL('enabled',v==='on')} options={[{label:'Ligado',value:'on'},{label:'Desligado',value:'off'}]} /></div>
              <div className="field"><label className="label">CANAL</label>
                <Dropdown value={auto.leave?.channelId||''} options={channels} onChange={v=>setL('channelId',v)}/></div>
            </div>
            <div>
              <div className="field"><label className="label">TÍTULO</label>
                <input className="input" value={auto.leave?.title||''} onChange={e=>setL('title',e.target.value)}/></div>
              <div className="field"><label className="label">DESCRIÇÃO</label>
                <textarea className="textarea" value={auto.leave?.description||''} onChange={e=>setL('description',e.target.value)}/></div>
              <div className="field"><label className="label">BANNER (URL)</label>
                <input className="input" value={auto.leave?.image||''} onChange={e=>setL('image',e.target.value)}/></div>
            </div>
          </div>
          <button className="btn" onClick={saveAuto}>💾 Salvar</button>
        </div>
      )}

      {tab==='antilink' && (
        <div className="panel">
          <h3>🚫 AntiLink</h3>
          <div className="grid-2">
            <div>
              <div className="field"><label className="label">ATIVO</label>
                <Tabs value={antilink.enabled?'on':'off'} onChange={v=>setAntilink({...antilink,enabled:v==='on'})} options={[{label:'Ligado',value:'on'},{label:'Desligado',value:'off'}]}/></div>
              <div className="field"><label className="label">PUNIÇÃO</label>
                <Tabs value={antilink.punishment} onChange={v=>setAntilink({...antilink,punishment:v})} options={[
                  {label:'Apagar',value:'delete'},{label:'Warn',value:'warn'},{label:'Mute',value:'mute'},{label:'Kick',value:'kick'},{label:'Ban',value:'ban'},
                ]}/></div>
              <div className="field"><label className="label">BLOQUEAR CONVITES SERVIDOR</label>
                <Tabs value={antilink.blockServerInvites?'on':'off'} onChange={v=>setAntilink({...antilink,blockServerInvites:v==='on'})} options={[{label:'Sim',value:'on'},{label:'Não',value:'off'}]}/></div>
              <div className="field"><label className="label">BLOQUEAR LINKS DE SITE</label>
                <Tabs value={antilink.blockSiteLinks?'on':'off'} onChange={v=>setAntilink({...antilink,blockSiteLinks:v==='on'})} options={[{label:'Sim',value:'on'},{label:'Não',value:'off'}]}/></div>
            </div>
            <div>
              <div className="field"><label className="label">MENSAGEM DE PUNIÇÃO</label>
                <textarea className="textarea" value={antilink.punishMessage||''} onChange={e=>setAntilink({...antilink,punishMessage:e.target.value})}/></div>
              <div className="field"><label className="label">CANAL DE LOGS (ID)</label>
                <input className="input" value={antilink.logsChannelId||''} onChange={e=>setAntilink({...antilink,logsChannelId:e.target.value})}/></div>
              <div className="field"><label className="label">WHITELIST CARGOS (IDs separados por vírgula)</label>
                <input className="input" value={(antilink.whitelistRoles||[]).join(',')} onChange={e=>setAntilink({...antilink,whitelistRoles:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></div>
              <div className="field"><label className="label">WHITELIST CANAIS (IDs)</label>
                <input className="input" value={(antilink.whitelistChannels||[]).join(',')} onChange={e=>setAntilink({...antilink,whitelistChannels:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}/></div>
            </div>
          </div>
          <button className="btn" onClick={saveAnti}>💾 Salvar</button>
        </div>
      )}

      {tab==='logs' && (
        <div className="panel">
          <h3>📋 Logs</h3>
          <div className="field"><label className="label">CANAL DE LOGS GERAIS</label>
            <Dropdown value={auto.logs?.channelId||''} options={channels} onChange={v=>setAuto({...auto,logs:{...auto.logs,channelId:v}})}/></div>
          <div className="field"><label className="label">CANAL DE MENSAGENS APAGADAS</label>
            <Dropdown value={auto.logs?.deletedChannelId||''} options={channels} onChange={v=>setAuto({...auto,logs:{...auto.logs,deletedChannelId:v}})}/></div>
          <div className="field"><label className="label">ATIVO</label>
            <Tabs value={auto.logs?.enabled?'on':'off'} onChange={v=>setAuto({...auto,logs:{...auto.logs,enabled:v==='on'}})} options={[{label:'Ligado',value:'on'},{label:'Desligado',value:'off'}]}/></div>
          <button className="btn" onClick={saveAuto}>💾 Salvar</button>
        </div>
      )}
    </Layout>
  );
}
