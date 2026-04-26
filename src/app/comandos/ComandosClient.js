'use client';
import { useState } from 'react';
import Tabs from '@/components/Tabs';
import Dropdown from '@/components/Dropdown';

const CATS = [
  { value: 'comunidade', label: 'Comunidade' },
  { value: 'sorteios', label: 'Sorteios' },
  { value: 'tickets', label: 'Tickets' },
  { value: 'cargos', label: 'Painel de Cores / RGB' },
  { value: 'automacao', label: 'Automação' },
  { value: 'votacoes', label: 'Votações' },
  { value: 'moderacao', label: 'Moderação' },
];

const KNOWN = {
  comunidade: ['perfil','reputacao','aniversario','sobre','avatar','banner','userinfo','serverinfo'],
  sorteios: ['sorteio','fakesorteio','sorteioreroll','fakesorteioreroll','sorteiolista','sorteiocancelar','sorteioeditar'],
  tickets: ['ticketsetup'],
  cargos: ['painelcor','rgb'],
  automacao: ['boasvindas','saida','logs','antilink'],
  votacoes: ['votacao','votacaobobo','votacaorei','votacaoprotagonista','votacaochato'],
  moderacao: ['warn','mute','kick','ban','unban','clear'],
};

export default function ComandosClient({ commands, guild, emojis, stickers }) {
  const [cat, setCat] = useState('comunidade');
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({});
  const [emojiTab, setEmojiTab] = useState('static');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const list = KNOWN[cat] || [];

  function open(name) {
    setSelected(name);
    const existing = commands.find(c => c.commandName === name) || {};
    setDraft({
      enabled: existing.enabled ?? true,
      channelId: existing.channelId || '',
      title: existing.embed?.title || '',
      description: existing.embed?.description || '',
      color: existing.embed?.color || '#FFD700',
      image: existing.embed?.image || '',
      thumbnail: existing.embed?.thumbnail || '',
      footer: existing.embed?.footer || '🍍 Pineapple Applications',
      fields: existing.embed?.fields || [],
      buttons: existing.buttons || [],
    });
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/commands/${selected}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: cat, enabled: draft.enabled, channelId: draft.channelId,
        embed: { title: draft.title, description: draft.description, color: draft.color, image: draft.image, thumbnail: draft.thumbnail, footer: draft.footer, fields: draft.fields },
        buttons: draft.buttons,
      }),
    });
    setSaving(false);
    if (res.ok) setSavedAt(Date.now());
  }

  const filteredEmojis = (emojis || []).filter(e => emojiTab === 'animated' ? e.animated : !e.animated);

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {CATS.map(c => (
          <button key={c.value} className={cat === c.value ? 'btn' : 'btn ghost'} onClick={() => { setCat(c.value); setSelected(null); }}>{c.label}</button>
        ))}
      </div>
      <div className="row">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Comandos — {CATS.find(x => x.value === cat)?.label}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {list.map(n => (
              <button key={n} onClick={() => open(n)} className={selected === n ? 'btn' : 'btn ghost'} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                /{n}
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          {!selected ? <div style={{ color: 'var(--muted)' }}>← Selecione um comando para editar.</div> : (
            <>
              <h3 style={{ marginTop: 0 }}>/{selected}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span className={`pill-status ${draft.enabled ? 'on' : 'off'}`}>{draft.enabled ? '● ATIVO' : '○ DESATIVADO'}</span>
                <button className="btn ghost" onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}>{draft.enabled ? 'Desativar' : 'Ativar'}</button>
              </div>
              <div className="row">
                <div>
                  <label className="label">Canal de envio</label>
                  <Dropdown value={draft.channelId}
                    onChange={v => setDraft({ ...draft, channelId: v })}
                    options={[{ value: '', label: 'Padrão (canal do comando)' }, ...((guild.channels || []).filter(c => c.type === 0).map(c => ({ value: c.id, label: '#' + c.name })))]} />
                </div>
                <div>
                  <label className="label">Cor da embed</label>
                  <input className="input" type="color" value={draft.color || '#FFD700'} onChange={e => setDraft({ ...draft, color: e.target.value })} />
                </div>
              </div>
              <label className="label" style={{ marginTop: 12 }}>Título da embed</label>
              <input className="input" value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
              <label className="label" style={{ marginTop: 12 }}>Descrição</label>
              <textarea className="textarea" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} />
              <div className="row">
                <div>
                  <label className="label">Imagem (banner)</label>
                  <input className="input" placeholder="URL" value={draft.image} onChange={e => setDraft({ ...draft, image: e.target.value })} />
                </div>
                <div>
                  <label className="label">Thumbnail</label>
                  <input className="input" placeholder="URL" value={draft.thumbnail} onChange={e => setDraft({ ...draft, thumbnail: e.target.value })} />
                </div>
              </div>
              <label className="label" style={{ marginTop: 12 }}>Rodapé</label>
              <input className="input" value={draft.footer} onChange={e => setDraft({ ...draft, footer: e.target.value })} />

              <div style={{ marginTop: 18 }}>
                <h4 style={{ margin: '0 0 8px' }}>😀 Emojis disponíveis</h4>
                <Tabs value={emojiTab} onChange={setEmojiTab} options={[{ value: 'static', label: 'Estáticos' }, { value: 'animated', label: 'Animados' }]} />
                <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto', padding: 8, background: '#0c0c0c', border: '1px solid var(--border)', borderRadius: 10 }}>
                  {filteredEmojis.map(e => (
                    <div key={e.id} title={`${e.name} (${e.guildName})`} style={{ display: 'grid', placeItems: 'center', padding: 6, border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => navigator.clipboard.writeText(e.animated ? `<a:${e.name}:${e.id}>` : `<:${e.name}:${e.id}>`)}>
                      <img src={e.url} alt={e.name} style={{ width: 32, height: 32 }} />
                    </div>
                  ))}
                </div>
                <small style={{ color: 'var(--muted)' }}>Clique em um emoji para copiar o código.</small>
              </div>
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button className="btn" onClick={save} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar'}</button>
                {savedAt && <span style={{ color: 'var(--green)', alignSelf: 'center', fontSize: 12 }}>✓ Salvo</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
