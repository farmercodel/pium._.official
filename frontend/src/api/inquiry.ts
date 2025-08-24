// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // 여기를 실제 백엔드 주소로 변경
  timeout: 60000,
});
