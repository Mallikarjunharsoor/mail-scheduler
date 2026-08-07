import { jwtDecode } from "jwt-decode";

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  exp?: number;
}

const TOKEN_KEY = "mail_scheduler_token";

export function getSavedToken(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem(TOKEN_KEY)
    : null;
}

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function decodeAuthToken(token: string): AuthUser | null {
  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
}