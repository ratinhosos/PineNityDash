'use client';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PageHead from '@/components/PageHead';
import Dropdown from '@/components/Dropdown';
import Tabs from '@/components/Tabs';

const CATEGORIES = ['Comunidade','Sorteios','Tickets','Painel de Cores','RGB / Cargos','Automação','Votações','Logs','Moderação','Servidor'];
const COMMANDS = {
  'Comunidade': ['perfil','reputacao','aniversario','sobre','avatar','banner','userinfo','serverinfo','help'],
  'Sorteios': ['sorteio','fakesorteio','sorteioreroll','fakesorteioreroll','sorteiolista','sorteiocancelar','sorteioeditar'],
  'Tickets': ['ticketsetup'],
  'Painel de Cores': ['painelcor'],
  'RGB / Cargos': ['rgb'],
  'Automação': ['boasvindas','saida','logs','antilink'],
  'Votações': ['votacao','votacaobobo','votacaorei','votacaoprotagonista','votacaochato'],
  'Logs': ['logs'],
  'Moderação': ['warn','mute','kick','ban','clear'],
  'Servidor': [],
};

export default function ComandosPage() {
  const [cat, setCat] = useState('Comunidade');
  const [cmd, setCmd] = useState(COMMANDS['Comunidade'][0]);
  const [config, setConfig] = useState({});
  const [emojis, setEmojis] = useState({ static: [], animated: [] });
  const [emojiTab, setEmojiTab] = useState('static');
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch('/api/guild').then(r=>r.json()).then(d => {
      setChannels((d.channels||[]).filter(c=>c.type===0).map(c=>({label:'#'+c.name,value:c.id})));
    }).catch(()=>{});
    fetch('/api/emojis').then(r=>r.json()).then(setEmojis).catch(()=>{});
  }, []);

  useEffect(() => {
    if (!cmd) return;
    fetch(`/api/commands/${cmd}`).then(r=>r.json()).then(d => setConfig(d || {})).catch(()=>{});
  }, [cmd]);

  function set(path, val) {
    setConfig(prev => {
      const c = JSON.parse(JSON.stringify(prev || {}));
      const parts = path.split('.');
      let o = c; for (let i=0;i<parts.length-1;i++) { o[parts[i]] ||= {}; o = o[parts[i]]; }
      o[parts[parts.length-1]] = val; return c;
    });
  }
  async function save() {
    await fetch(`/api/commands/${cmd}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(config) });
    alert('✅ Salvo!');
  }

  return (
    <Layout>
      <PageHead icon="⚡" title="Comandos" accent="Pineapple"
        subtitle="Edite embeds, canais, botões e mensagens automáticas."
        actions={<button className="btn" onClick={save}>💾 Salvar</button>} />

      <div className="grid-2">
        <div className="panel">
          <h3>Categoria & Comando</h3>
          <div className="field">
            <label className="label">CATEGORIA</label>
            <Dropdown value={cat} options={CATEGORIES.map(c=>({label:c,value:c}))} onChange={(v)=>{setCat(v); setCmd(COMMANDS[v][0]||'');}} />
          </div>
          <div className="field">
            <label className="label">COMANDO</label>
            <Dropdown value={cmd} options={(COMMANDS[cat]||[]).map(c=>({label:'/'+c,value:c}))} onChange={setCmd} placeholder="Sem comandos" />
          </div>
          <div className="field">
            <label className="label">CANAL</label>
            <Dropdown value={config?.channelId || ''} options={channels} onChange={v=>set('channelId',v)} placeholder="Selecionar canal" />
          </div>
          <div className="field">
            <label className="label">ATIVO</label>
            <Tabs value={config?.enabled ? 'on' : 'off'} onChange={v=>set('enabled',v==='on')}
              options={[{label:'Ativo',value:'on'},{label:'Desativado',value:'off'}]} />
          </div>
        </div>

        <div className="panel">
          <h3>Embed</h3>
          <div className="field"><label className="label">TÍTULO</label>
            <input className="input" value={config?.embed?.title||''} onChange={e=>set('embed.title',e.target.value)} /></div>
          <div className="field"><label className="label">DESCRIÇÃO</label>
            <textarea className="textarea" value={config?.embed?.description||''} onChange={e=>set('embed.description',e.target.value)} /></div>
          <div className="grid-2">
            <div className="field"><label className="label">COR (HEX)</label>
              <input className="input" value={config?.embed?.color||'#FFD700'} onChange={e=>set('embed.color',e.target.value)} /></div>
            <div className="field"><label className="label">RODAPÉ</label>
              <input className="input" value={config?.embed?.footer||''} onChange={e=>set('embed.footer',e.target.value)} /></div>
          </div>
          <div className="field"><label className="label">BANNER (URL)</label>
            <input className="input" value={config?.embed?.image||''} onChange={e=>set('embed.image',e.target.value)} /></div>
          <div className="field"><label className="label">THUMBNAIL (URL)</label>
            <input className="input" value={config?.embed?.thumbnail||''} onChange={e=>set('embed.thumbnail',e.target.value)} /></div>
        </div>
      </div>

      <div className="panel" style={{marginTop:16}}>
        <h3>😀 Emojis & Stickers</h3>
        <p className="sub">Selecione emojis estáticos ou animados de qualquer servidor onde o bot está.</p>
        <Tabs value={emojiTab} onChange={setEmojiTab} options={[
          {label:`Estáticos (${emojis.static?.length||0})`,value:'static'},
          {label:`Animados (${emojis.animated?.length||0})`,value:'animated'},
        ]} />
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
          {(emojis[emojiTab]||[]).map(e => (
            <div key={e.id} title={`${e.name} (${e.guildName})`}
              style={{ width: 40, height: 40, background:'#0a0a0a', border:'1px solid #2a2a2a', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <img src={e.url} alt={e.name} width="28" height="28" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
