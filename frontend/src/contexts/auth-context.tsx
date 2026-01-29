/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'student' | 'faculty' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  universityId: string;
  role: UserRole;
  mfaEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; requiresMfa?: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  verifyMfa: (identifier: string, otp: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
  setUser: (user: User | null) => void;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<{ ok: boolean; status: number; data: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (identifier: string, password: string): Promise<{ success: boolean; requiresMfa?: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok && data.step === 'mfa-pending') {
        return { success: true, requiresMfa: true };
      }

      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  const verifyMfa = async (identifier: string, otp: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
      const response = await fetch(`${API_URL}/auth/mfa-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      }

      return { success: false, message: data.message || 'Verification failed' };
    } catch (error) {
      console.error('MFA Verify error:', error);
      return { success: false, message: 'Server connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        verifyMfa,
        logout,
        setUser,
        apiCall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
