"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import authAxios from "@/utils/authAxios";
import { BACKEND_URL } from "@/app/config";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData?: Partial<User>) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const response = await authAxios.get(`${BACKEND_URL}/api/v1/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      console.log("Auth Response: ", authToken, response);

      if (localStorage.getItem("token") !== authToken) return;

      if (response.data?.user) {
        const { id, name, email } = response.data.user;
        const u = { id, name, email };
        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch (e) {}
      }
    } catch (error: any) {
      // Only remove token if the server explicitly tells us the token is invalid or expired
      if (
        localStorage.getItem("token") === authToken &&
        error?.response?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {}
        }
        fetchUserProfile(storedToken).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          setToken(null);
          setUser(null);
        } else {
          setToken(e.newValue);
          fetchUserProfile(e.newValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchUserProfile]);

  const login = (newToken: string, userData?: Partial<User>) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (userData && userData.name && userData.email && userData.id) {
      const u = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
      setUser(u);
      try {
        localStorage.setItem("user", JSON.stringify(u));
      } catch (e) {}
    } else {
      fetchUserProfile(newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      await fetchUserProfile(currentToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
