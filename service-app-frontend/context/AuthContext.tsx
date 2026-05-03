import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";

interface AuthContextType {
  token: string | null;
  userName: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token + name from storage on app start
    const loadAuth = async () => {
      try {
        const [savedToken, savedName] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("userName"),
        ]);
        if (savedToken) setToken(savedToken);
        if (savedName) setUserName(savedName);
      } catch (e) {
        console.log("Failed to load auth:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    const response = await api.post("/api/auth/login", { phone, password });
    const receivedToken = response.data.token;
    await AsyncStorage.setItem("token", receivedToken);
    await AsyncStorage.setItem("userPhone", phone);
    setToken(receivedToken);
  };

  const register = async (name: string, phone: string, password: string) => {
    await api.post("/api/auth/register", { name, phone, password, role: "USER" });
    await AsyncStorage.setItem("userName", name);
    setUserName(name);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "userName", "userPhone"]);
    setToken(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userName, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}