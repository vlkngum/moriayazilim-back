'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: string | null;
  userType: 'static' | 'database' | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userType, setUserType] = useState<'static' | 'database' | null>(null);
  const router = useRouter();

  // --- FIX STARTS HERE ---

  // Step 1: Wrap logout in useCallback to stabilize it.
  const logout = useCallback(() => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('loginExpires');
    
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserType(null);
    
    router.push('/login');
  }, [router]); // Its only dependency is the router.

  // Step 2: Add the now-stable `logout` function to checkAuth's dependency array.
  const checkAuth = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    const loginExpires = localStorage.getItem('loginExpires');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('currentUser');
    const storedUserType = localStorage.getItem('userType');

    if (loginExpires && storedIsLoggedIn === 'true' && storedUser) {
      const expiresAt = new Date(loginExpires);
      const now = new Date();

      if (now < expiresAt) {
        setIsLoggedIn(true);
        setCurrentUser(storedUser);
        setUserType(storedUserType as 'static' | 'database' | null);
        return true;
      } else {
        // Session has expired, call logout.
        logout();
        return false;
      }
    }

    return false;
  }, [logout]); // ✅ Correctly added 'logout' as a dependency.

  // --- FIX ENDS HERE ---

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', data.user.username);
        localStorage.setItem('userType', data.user.isStatic ? 'static' : 'database');
        localStorage.setItem('loginExpires', expiresAt.toISOString());
        
        setIsLoggedIn(true);
        setCurrentUser(data.user.username);
        setUserType(data.user.isStatic ? 'static' : 'database');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, userType, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}