import { useEffect, useState } from "react";
import { api } from "../api/api";

// 타입 가드 함수들
const isError = (error: unknown): error is Error => error instanceof Error;
const hasResponse = (obj: unknown): obj is { response?: { data?: { detail?: unknown } } } => 
  typeof obj === 'object' && obj !== null && 'response' in obj;
const hasMessage = (obj: unknown): obj is { message: unknown } => 
  typeof obj === 'object' && obj !== null && 'message' in obj;

export const useInstagramPreview = (username: string, version: number) => {
  const [postId, setPostId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    
    const fetchLatestPost = async () => {
      setErr(null);
      setPostId(null);
      setLoading(true);
      
      try {
        console.log('[useInstagramPreview] 최신 게시물 조회 시작:', { username, version });
        
        // 백엔드에서 최신 게시물 shortcode/id를 반환하도록 구현
        const { data } = await api.get("/api/instagram/latest-post", {
          params: { username },
          timeout: 30000,
          signal: ctrl.signal as unknown as AbortSignal,
        });
        
        if (ctrl.signal.aborted) return;
        
        const id = String(data?.shortcode ?? data?.id ?? data?.permalink ?? "");
        
        if (id) {
          setPostId(id);
          console.log('[useInstagramPreview] 최신 게시물 ID 조회 성공:', id);
        } else {
          setErr("최근 게시물을 찾을 수 없어요.");
          console.warn('[useInstagramPreview] 최신 게시물 ID 없음');
        }
      } catch (e: unknown) {
        if (ctrl.signal.aborted) return;
        
        console.error('[useInstagramPreview] 최신 게시물 조회 실패:', e);
        
        // 타입 가드를 통한 안전한 에러 메시지 처리
        let errorMessage = "최근 게시물을 불러오지 못했어요.";
        
        if (isError(e)) {
          errorMessage = e.message;
        } else if (hasResponse(e) && e.response?.data?.detail) {
          errorMessage = String(e.response.data.detail);
        } else if (hasMessage(e)) {
          errorMessage = String(e.message);
        }
        
        setErr(errorMessage);
      } finally {
        if (!ctrl.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLatestPost();
    
    return () => {
      ctrl.abort();
    };
  }, [username, version]);

  return {
    postId,
    err,
    loading
  };
};
