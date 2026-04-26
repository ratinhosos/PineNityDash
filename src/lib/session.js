import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_SECRET || 'pineapple_default_secret_change_me_min_32_chars_long',
  cookieName: 'pineapple_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  return getIronSession(cookies(), sessionOptions);
}
