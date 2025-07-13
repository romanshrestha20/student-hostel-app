// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthResponse } from '../api/authApi';
import { login, register, logout as apiLogout, setAuthToken } from '../api/authApi';
import type { User, Role } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (storedToken) {
          setAuthToken(storedToken);
          setToken(storedToken);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

const handleAuthSuccess = (response: AuthResponse) => {
  setUser(response.user);
  setToken(response.token);
  setAuthToken(response.token);
  setError(null);

  // Save to localStorage
  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));
};

const handleAuthError = (error: unknown) => {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("An unexpected error occurred");
  }
  setUser(null);
  setToken(null);
  setAuthToken(null);
};

const authLogin = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    const response = await login({ email, password });
    handleAuthSuccess(response);
  } catch (error) {
    handleAuthError(error);
  } finally {
    setIsLoading(false);
  }
};

const authRegister = async (
  name: string,
  email: string,
  password: string,
  role?: Role
) => {
  try {
    setIsLoading(true);
    const response = await register({ name, email, password, role });
    handleAuthSuccess(response);
  } catch (error) {
    handleAuthError(error);
  } finally {
    setIsLoading(false);
  }
};

 const logout = () => {
   apiLogout();
   setUser(null);
   setToken(null);
   setError(null);

   // Remove from localStorage
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   setAuthToken(null);
 };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login: authLogin,
    register: authRegister,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

