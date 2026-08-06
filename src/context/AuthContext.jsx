import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'thrift_syndicate_auth_v1';
const ADMIN_EMAIL = 'admin@thriftsyndicate.com';
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.isLoggedIn && parsed?.user?.email === ADMIN_EMAIL);
      }
    } catch (err) {
      console.error('Error reading auth state from localStorage:', err);
    }
    return false;
  });

  const [user, setUser] = useState(() => {
    return isAuthenticated ? { email: ADMIN_EMAIL, role: 'Admin' } : null;
  });

  const login = (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPassword = String(password || '').trim();

    if (cleanEmail === ADMIN_EMAIL && cleanPassword === ADMIN_PASSWORD) {
      const authUser = { email: ADMIN_EMAIL, role: 'Admin', loggedInAt: new Date().toISOString() };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: authUser }));
      setUser(authUser);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email or password. Please use default credentials.'
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
