import { useState, useCallback } from "react";

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
    title: undefined,
    size: "md",
    closeOnBackdrop: true
  });

  // 모달 열기
  const openModal = useCallback((
    content: React.ReactNode,
    options?: {
      title?: string;
      size?: "sm" | "md" | "lg" | "xl";
      closeOnBackdrop?: boolean;
    }
  ) => {
    setModalState({
      isOpen: true,
      content,
      title: options?.title,
      size: options?.size || "md",
      closeOnBackdrop: options?.closeOnBackdrop ?? true
    });
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // 모달 상태 초기화
  const resetModal = useCallback(() => {
    setModalState({
      isOpen: false,
      content: null,
      title: undefined,
      size: "md",
      closeOnBackdrop: true
    });
  }, []);

  return {
    // 모달 상태
    isOpen: modalState.isOpen,
    content: modalState.content,
    title: modalState.title,
    size: modalState.size,
    closeOnBackdrop: modalState.closeOnBackdrop,
    
    // 모달 제어 함수들
    openModal,
    closeModal,
    resetModal
  };
};
