// src/types/toss-payments.d.ts
export interface PaymentRequestOptions {
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerName?: string;
  customerEmail?: string;
  [key: string]: unknown;
}

export interface BillingAuthOptions {
  customerKey: string;
  orderId: string;
  successUrl: string;
  failUrl: string;
  [key: string]: unknown;
}

export type TossPaymentMethod =
  | "CARD"
  | "VIRTUAL_ACCOUNT"
  | "MOBILE_PHONE"
  | "TRANSFER"
  | (string & {}); 

export interface TossPaymentsInstance {
  requestPayment(method: TossPaymentMethod, opts: PaymentRequestOptions): Promise<void>;
  requestBillingAuth(method: "CARD", opts: BillingAuthOptions): Promise<void>;
}

export interface TossPaymentsFactory {
  (clientKey: string): TossPaymentsInstance;
}

export interface TossPaymentsError {
  isTossPaymentsError: true;
  code: string;    
  message: string;    
  data?: unknown;
}

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

export {};
