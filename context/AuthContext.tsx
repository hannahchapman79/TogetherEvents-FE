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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setAccessToken(storedToken);
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          localStorage.removeItem("user");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, accessToken]);

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
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setUser(null);
      setAccessToken(null);
      return null;
    }
  };

  const checkAuth = async () => {
    // Always check auth on initial load or route change
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
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
            {
              withCredentials: true,
              headers: { Authorization: `Bearer ${newToken}` },
            },
          );
          setUser(response.data.user);

          if (isAuthRoute) {
            router.push("/events");
          }
        } else if (isProtectedRoute) {
          handleAuthFailure();
        }
      } catch (refreshError) {
        if (isProtectedRoute) {
          handleAuthFailure();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

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
        if (
          error.response?.status === 401 &&
          !error.config._retry &&
          (isProtectedRoute || user)
        ) {
          error.config._retry = true;
          const newToken = await refreshAccessToken();

          if (newToken) {
            error.config.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(error.config);
          }

          if (isProtectedRoute) {
            handleAuthFailure();
          }
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [pathname, user, isProtectedRoute]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true },
      );
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
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
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
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
