'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) router.push('/dashboard');
    else { const j = await res.json().catch(()=>({})); setErr(j.error || 'Senha incorreta.'); }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">🍍</div>
        <h2>Pineapple <span>Applications</span></h2>
        <p>Acesse o painel administrativo</p>
        {err && <div className="err">⚠ {err}</div>}
        <div className="field">
          <label className="label">SENHA</label>
          <input type="password" className="input" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Digite a senha" autoFocus />
        </div>
        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Verificando...' : 'Entrar →'}
        </button>
        <p style={{ marginTop: 20, fontSize: 10 }}>🔒 Acesso protegido • Pineapple Applications</p>
      </form>
    </div>
  );
}
