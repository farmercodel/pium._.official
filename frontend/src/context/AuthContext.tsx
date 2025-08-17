import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, logout as doLogout } from "../api/auth";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { setUser(null); setLoading(false); return; }
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      // 토큰 무효 → 정리
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const logout = () => { doLogout(); };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
