// src/api/api.ts

import { api } from "./api";
import type { InquiryResponse } from "../types/inquiry";

export async function inquiry(payload: InquiryResponse) {
  const { data } = await api.post("/inquiries", payload);
  return data;
}
//
// import axios from "axios";
//
// export const api = axios.create({
//   baseURL: "http://127.0.0.1:8000", // 여기를 실제 백엔드 주소로 변경
//   timeout: 60000,
// });
