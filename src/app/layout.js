import '@/styles/globals.css';

export const metadata = {
  title: '🍍 Pineapple Community Dashboard',
  description: 'Painel de gerenciamento — Pineapple Applications',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
