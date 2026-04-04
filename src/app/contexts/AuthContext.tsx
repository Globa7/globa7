import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      if (!supabase) {
        // No error needed - app works in demo mode without auth
        setLoading(false);
        return;
      }
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // Handle invalid session
      if (error) {
        console.error('Session error:', error);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (session) {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Session is invalid on server, clear it
          await supabase.auth.signOut();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Session check error:', error);
      if (supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser() {
    if (!supabase) {
      console.error('Cannot refresh user - Supabase client not initialized');
      return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    }
  }

  async function signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Authentication service unavailable - Supabase client not initialized');
    }
    
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign in failed');
    }

    const data = await response.json();
    
    // Set session with Supabase
    await supabase.auth.setSession({
      access_token: data.accessToken,
      refresh_token: data.accessToken,
    });

    setUser(data.user);
    return data.user;
  }

  async function signUp(email: string, password: string, name: string, phone: string) {
    if (!supabase) {
      throw new Error('Authentication service unavailable - Supabase client not initialized');
    }
    
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, name, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign up failed');
    }

    // Automatically sign in after signup
    await signIn(email, password);
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default context during hot reload or when provider is not mounted
    return {
      user: null,
      loading: true,
      signIn: async () => { throw new Error('AuthProvider not mounted'); },
      signUp: async () => { throw new Error('AuthProvider not mounted'); },
      signOut: async () => {},
      refreshUser: async () => {},
    };
  }
  return context;
}