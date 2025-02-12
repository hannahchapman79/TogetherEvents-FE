'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${process.env.API_URL}/auth/refresh`, {}, { withCredentials: true });
      return response.data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
  
      if (typeof window !== 'undefined') {
        const protectedRoutes = ["/events/create"]; 
        if (protectedRoutes.includes(window.location.pathname)) {
          router.push('/login');
        }
      }
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/auth/me`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        const newToken = await refreshAccessToken(); 
        if (newToken) {
          try {
            const response = await axios.get(`${process.env.API_URL}/auth/me`, { 
              withCredentials: true, 
              headers: { Authorization: `Bearer ${newToken}` } 
            });
            setUser(response.data.user);
          } catch {
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);


  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      // If request is successful, return it as usual
      (response) => response,  
  
      // If a request fails, handle it
      async (error) => {
        if (error.response?.status === 401) {
          console.log("Token expired! Trying to refresh...");
  
          const newToken = await refreshAccessToken(); 
  
          if (newToken) {
            console.log("Token refreshed! Retrying original request...");
  
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return axios.request(error.config); 
          } else {
            console.log("Refresh token failed. Logging out...");
            router.push('/login'); 
          }
        }
  
        return Promise.reject(error);
      }
    );
  
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.API_URL}/auth/login`, { email, password }, { withCredentials: true });
      setUser(response.data.user);
      router.push('/events');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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