import { CookieOptions } from 'express';

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: Boolean(process.env.COOKIE_SECURE || 0),
  // @ts-ignore
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
};
