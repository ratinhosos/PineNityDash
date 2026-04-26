// Helpers para a API do bot (server side)
const BOT_API = process.env.BOT_API_URL || 'http://localhost:3001';
const SECRET = process.env.API_SECRET || '';

export async function botApi(path, options = {}) {
  try {
    const res = await fetch(`${BOT_API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': SECRET,
        ...(options.headers || {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) return { error: `bot_api_${res.status}`, status: res.status };
    return await res.json();
  } catch (e) {
    return { error: 'bot_api_unreachable', message: e.message };
  }
}
