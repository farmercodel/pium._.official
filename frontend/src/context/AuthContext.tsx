import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe, logout as doLogout } from "../api/auth";

// 사용자 타입 정의
interface User {
  id: string | number;
  email: string;
  name?: string;
  is_active?: boolean;
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
      (typeof (obj as User).id === 'string' || typeof (obj as User).id === 'number') &&
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

  const hasResponse = (obj: unknown): obj is { response: { status: number } } => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'response' in obj &&
      typeof (obj as { response: { status: number } }).response === 'object' &&
      (obj as { response: { status: number } }).response !== null &&
      'status' in (obj as { response: { status: number } }).response &&
      typeof (obj as { response: { status: number } }).response.status === 'number'
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
        // 사용자 데이터가 유효하지 않아도 토큰은 유지 (일시적인 서버 문제일 수 있음)
        console.warn('[AuthContext] Keeping token despite invalid user data');
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
      
      // 네트워크 에러나 일시적인 서버 문제인 경우 토큰 유지
      // 401 Unauthorized나 403 Forbidden 같은 인증 에러만 토큰 삭제
      if (hasResponse(error) && error.response) {
        const response = error.response as { status: number };
        const status = response.status;
        if (status === 401 || status === 403) {
          console.warn('[AuthContext] Authentication error, removing token');
          localStorage.removeItem("access_token");
          setUser(null);
        } else {
          console.warn('[AuthContext] Non-auth error, keeping token');
        }
      } else {
        console.warn('[AuthContext] Network or unknown error, keeping token');
      }
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
