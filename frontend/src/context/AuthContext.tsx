import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe, logout as doLogout } from "../api/auth";

// 사용자 타입 정의
interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown; // 추가 속성 허용
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 타입 가드 함수들 (내부에서만 사용)
  const isUser = (obj: unknown): obj is User => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof (obj as User).id === 'string' &&
      typeof (obj as User).email === 'string'
    );
  };

  const isError = (obj: unknown): obj is Error => {
    return obj instanceof Error;
  };

  const hasMessage = (obj: unknown): obj is { message: string } => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'message' in obj &&
      typeof (obj as { message: string }).message === 'string'
    );
  };

  const refresh = async (): Promise<void> => {
    const token = localStorage.getItem("access_token");
    if (!token) { 
      setUser(null); 
      setLoading(false); 
      return; 
    }
    
    try {
      const me = await getMe();
      
      // 타입 가드로 사용자 데이터 검증
      if (isUser(me)) {
        setUser(me);
      } else {
        console.error('[AuthContext] Invalid user data received:', me);
        throw new Error('Invalid user data received from server');
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch user data:', error);
      
      // 에러 메시지 추출 및 로깅
      let errorMessage = 'Unknown error occurred';
      if (isError(error)) {
        errorMessage = error.message;
      } else if (hasMessage(error)) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      console.error('[AuthContext] Error message:', errorMessage);
      
      // 토큰 무효 → 정리
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    void refresh(); 
  }, []);

  const logout = (): void => { 
    try {
      doLogout();
      setUser(null);
      localStorage.removeItem("access_token");
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      // 에러가 발생해도 로컬 상태는 정리
      setUser(null);
      localStorage.removeItem("access_token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Context를 export하여 useAuth에서 사용할 수 있도록 함
export { AuthContext };
