import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * 페이지 이동 시 스크롤을 맨 위로 이동시키는 hook
 * 
 * @param behavior - 스크롤 동작 방식 ('auto' | 'smooth')
 * @param deps - 추가 의존성 배열 (선택사항)
 * 
 * @example
 * // 기본 사용
 * useScrollToTop();
 * 
 * // 부드러운 스크롤
 * useScrollToTop('smooth');
 * 
 * // 특정 상태 변경 시에도 스크롤
 * useScrollToTop('auto', [someState]);
 */
export const useScrollToTop = (
  behavior: ScrollBehavior = 'auto',
  deps: React.DependencyList = []
) => {
  const location = useLocation();

  useEffect(() => {
    // 페이지 맨 위로 스크롤
    window.scrollTo({
      top: 0,
      left: 0,
      behavior,
    });
  }, [location.pathname, behavior, ...deps]);
};
