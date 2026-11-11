import React, { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { env } from '@/lib/config';

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const DEMO_SESSION_KEY = 'sp_demo_auth';

function readDemoUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => (isSupabaseConfigured ? null : readDemoUser()));
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email ?? null } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== env.DEMO_ADMIN_EMAIL.toLowerCase() || password !== env.DEMO_ADMIN_PASSWORD) {
        return { error: 'Credenciales incorrectas para el modo demo.' };
      }
      const demoUser: AuthUser = { id: 'demo-admin', email: normalizedEmail };
      window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setUser(data.user ? { id: data.user.id, email: data.user.email ?? null } : null);
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      window.localStorage.removeItem(DEMO_SESSION_KEY);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, isDemo: !isSupabaseConfigured, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
