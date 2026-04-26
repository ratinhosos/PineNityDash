'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', sub: 'Início', icon: '📊' },
  { href: '/comandos', label: 'Comandos', sub: 'Editar embeds', icon: '⚡' },
  { href: '/sorteios', label: 'Sorteios', sub: 'Giveaways', icon: '🎉' },
  { href: '/tickets', label: 'Tickets', sub: 'Atendimentos', icon: '🎫' },
  { href: '/votacoes', label: 'Votações', sub: 'Polls e enquetes', icon: '🗳️' },
  { href: '/gestao-comunidade', label: 'Gestão de Comunidade', sub: 'Membros e comportamento', icon: '👥' },
  { href: '/gestao-atividade', label: 'Gestão de Atividade', sub: 'Mensagens e canais', icon: '📈' },
  { href: '/gestao-empenho', label: 'Gestão de Empenho', sub: 'Equipe e staff', icon: '🏆' },
  { href: '/gerenciar-servidor', label: 'Gerenciar Servidor', sub: 'Canais e cargos', icon: '🛠️' },
  { href: '/automacao', label: 'Automação', sub: 'Boas-vindas, antilink', icon: '🤖' },
  { href: '/logs', label: 'Logs', sub: 'Eventos e mensagens', icon: '📋' },
  { href: '/configuracoes', label: 'Configurações', sub: 'Sistema', icon: '⚙️' },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">🍍</div>
        <div>
          <div className="brand-name">Pineapple</div>
          <div className="brand-sub">APPLICATIONS</div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card"><div className="stat-label">BOT</div><div className="stat-value">online</div></div>
        <div className="stat-card"><div className="stat-label">V</div><div className="stat-value">1.0.0</div></div>
      </div>

      <div className="menu-label">MENU</div>
      <nav className="nav">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={path === n.href ? 'active' : ''}>
            <span className="ico">{n.icon}</span>
            <span>
              {n.label}
              <small>{n.sub}</small>
            </span>
          </Link>
        ))}
      </nav>

      <div className="footer-status">
        <div className="lbl"><span className="dot"></span>SISTEMA ATIVO</div>
        <div className="sub">MongoDB · Senha · v1.0</div>
      </div>
      <button className="logout" onClick={logout}>↪ Sair</button>
    </aside>
  );
}
