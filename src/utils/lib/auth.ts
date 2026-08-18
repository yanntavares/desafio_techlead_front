import { AuthTokens } from '@/app/api/api';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

interface JwtPayload {
  sub?: string;
  role?: 'ADMIN' | 'USER';
  exp?: number;
  [key: string]: unknown;
}

// Decodifica o payload de um JWT sem validar assinatura — pura, sem `document`,
// funciona tanto no browser quanto no Edge runtime do middleware.
export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthCookies(tokens: AuthTokens) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.acessToken);
  setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
}

export function clearAuthCookies() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}

export function getCurrentUser(): JwtPayload | null {
  const token = getAccessToken();
  return token ? decodeJwt(token) : null;
}
