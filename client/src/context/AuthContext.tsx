import { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // sessionStorage clears automatically when the tab/window is closed
    const [token, setToken] = useState<string | null>(
        sessionStorage.getItem('token')
    );

    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useCallback(() => {
        setToken(null);
        sessionStorage.removeItem('token');
        if (idleTimer.current) clearTimeout(idleTimer.current);
    }, []);

    const resetIdleTimer = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(logout, IDLE_TIMEOUT_MS);
    }, [logout]);

    const login = (newToken: string) => {
        setToken(newToken);
        sessionStorage.setItem('token', newToken);
        resetIdleTimer();
    };

    // Start/stop idle timer based on whether the user is logged in
    useEffect(() => {
        if (!token) return;

        resetIdleTimer();
        ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));

        return () => {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetIdleTimer));
        };
    }, [token, resetIdleTimer]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};