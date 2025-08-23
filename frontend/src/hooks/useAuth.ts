import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// AuthContext의 타입을 명확하게 정의
interface AuthContextType {
  user: {
    id: string;
    email: string;
    name?: string;
    [key: string]: unknown;
  } | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
}

// 타입 가드 함수
const isAuthContext = (ctx: unknown): ctx is AuthContextType => {
  return (
    typeof ctx === 'object' &&
    ctx !== null &&
    'user' in ctx &&
    'loading' in ctx &&
    'refresh' in ctx &&
    'logout' in ctx &&
    typeof (ctx as AuthContextType).refresh === 'function' &&
    typeof (ctx as AuthContextType).logout === 'function'
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  
  // 타입 가드로 context 검증
  if (!ctx || !isAuthContext(ctx)) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return ctx;
}
