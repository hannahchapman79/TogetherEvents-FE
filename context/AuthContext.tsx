"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROTECTED_ROUTES = ["/events/new"];
const AUTH_ROUTES = ["/login", "/signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname?.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
        },
      );
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken);
      return newToken;
    } catch (error) {
      return null;
    }
  };

  const checkAuth = async () => {
    // Skip auth check if not on protected route and no user exists
    if (!isProtectedRoute && !user) {
      setLoading(false);
      return;
    }

    // If we have a user and token, just finish loading
    if (user && accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          withCredentials: true,
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
        },
      );
      setUser(response.data.user);

      if (isAuthRoute) {
        router.push("/events");
      }
    } catch (error) {
      if (user) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
              {
                withCredentials: true,
                headers: { Authorization: `Bearer ${newToken}` },
              },
            );
            setUser(response.data.user);
          } catch {
            if (isProtectedRoute) {
              handleAuthFailure();
            }
          }
        } else if (isProtectedRoute) {
          handleAuthFailure();
        }
      } else if (isProtectedRoute) {
        handleAuthFailure();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedToken) {
      setAccessToken(storedToken);
    }

    if (storedUser && storedToken) {
      checkAuth();
    }
  }, []);

  const handleAuthFailure = () => {
    if (isProtectedRoute) {
      setUser(null);
      setAccessToken(null);
      router.push("/login");
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();

          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            originalRequest.withCredentials = true;
            return axios(originalRequest);
          } else {
            handleAuthFailure();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [pathname, accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const userData = response.data.user;
      const accessToken = response.data.accessToken;

      setUser(userData);
      setAccessToken(accessToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);

      router.push("/events");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    setAccessToken(null);
    router.push("/login");
  };

  if (loading && isProtectedRoute) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
