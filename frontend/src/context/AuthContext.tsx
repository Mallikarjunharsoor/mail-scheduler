import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser, clearToken, decodeAuthToken, getSavedToken, saveToken } from '../lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getSavedToken());
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedToken = getSavedToken();
    return savedToken ? decodeAuthToken(savedToken) : null;
  });

  useEffect(() => {
    if (token) {
      const decoded = decodeAuthToken(token);
      setUser(decoded);
      saveToken(token);
    } else {
      setUser(null);
      clearToken();
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      login: (newToken: string) => setToken(newToken),
      logout: () => setToken(null),
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
