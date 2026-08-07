import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearToken, decodeAuthToken, getSavedToken, saveToken } from '../lib/auth';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getSavedToken());
    const [user, setUser] = useState(() => {
        const savedToken = getSavedToken();
        return savedToken ? decodeAuthToken(savedToken) : null;
    });
    useEffect(() => {
        if (token) {
            const decoded = decodeAuthToken(token);
            setUser(decoded);
            saveToken(token);
        }
        else {
            setUser(null);
            clearToken();
        }
    }, [token]);
    const value = useMemo(() => ({
        user,
        token,
        login: (newToken) => setToken(newToken),
        logout: () => setToken(null),
    }), [token, user]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
