# 🍍 Pineapple Community Dashboard

Painel administrativo da **Pineapple Applications**. Login simples por senha (sem OAuth2). 100% pronto para Vercel.

## 🚀 Recursos

- 12 abas: Dashboard, Comandos, Sorteios, Tickets, Votações, Gestão de Comunidade/Atividade/Empenho, Gerenciar Servidor, Automação, Logs, Configurações
- Visual Pineapple: preto + dourado, grid fino, cards com borda dourada, tabs/pills, dropdowns customizados
- Login protegido por senha via `.env`
- Comunicação direta com MongoDB + API REST do Bot

## 📦 Instalação

```bash
cd dashboard
npm install
cp .env.example .env
npm run dev
```

## ☁️ Deploy Vercel

1. Suba este projeto para um repo Git
2. Importe no Vercel
3. Configure todas as variáveis do `.env.example`
4. Deploy 🍍

## 🔑 .env

Veja `.env.example`. As principais:

- `DASHBOARD_PASSWORD` — senha para login
- `SESSION_SECRET` — secret para cookie (32+ chars)
- `GUILD_ID` — servidor a ser gerenciado
- `MONGODB_URI` — mesmo banco do bot
- `BOT_API_URL` — URL da API do bot (ex: `https://meubot.com:3001`)
- `API_SECRET` — mesmo secret do bot

## 🛡️ Login

Acesse `/login` e digite a senha de `DASHBOARD_PASSWORD`. Sessão mantida por 7 dias via cookie criptografado.

🍍 **Pineapple Applications**
