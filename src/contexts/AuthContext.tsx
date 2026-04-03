import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, UserRole } from "@/types/pharmacy";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for standalone mode (no backend required)
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: { id: "1", username: "admin", email: "admin@medlink.com", full_name: "System Admin", role: "admin", is_active: 1 },
  },
  manager: {
    password: "manager123",
    user: { id: "2", username: "manager", email: "manager@medlink.com", full_name: "Store Manager", role: "manager", is_active: 1 },
  },
  staff: {
    password: "staff123",
    user: { id: "3", username: "staff", email: "staff@medlink.com", full_name: "Staff Member", role: "staff", is_active: 1 },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("medlink_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("medlink_token"));

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (user) localStorage.setItem("medlink_user", JSON.stringify(user));
    else localStorage.removeItem("medlink_user");
    if (token) localStorage.setItem("medlink_token", token);
    else localStorage.removeItem("medlink_token");
  }, [user, token]);

  const login = useCallback(async (username: string, password: string) => {
    // Demo mode - works without backend
    const demoUser = DEMO_USERS[username];
    if (demoUser && demoUser.password === password) {
      setUser(demoUser.user);
      setToken("demo-token-" + username);
      return;
    }
    throw new Error("Invalid credentials. Try: admin/admin123, manager/manager123, or staff/staff123");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback((...roles: UserRole[]) => {
    return !!user && roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
