// frontend/src/types/inquiry.ts

// User 인터페이스 (Inquiry와 관계)
export interface User {
  id: number;
  email: string;
  hashed_password: string;
  is_active: boolean;
  is_admin: boolean;
  business_registration_number?: string | null;
  created_at: string;  
  updated_at: string;  
}

// Inquiry 생성 요청 인터페이스
export interface InquiryCreate {
  question: string;
}

// Inquiry 답변 요청 인터페이스
export interface InquiryAnswer {
  answer: string;
}

// Inquiry 응답 인터페이스
export interface InquiryResponse {
  id: number;
  user_id: number;
  question: string;
  answer: string | null;
  created_at: string;      
  answered_at: string | null;
  user?: User;             
}

// Inquiry 목록 조회 응답
export type InquiryListResponse = InquiryResponse[];

// API 응답 래퍼
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
