// src/api/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
});

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common.Authorization;
  }
}

const saved = localStorage.getItem("access_token");
if (saved) api.defaults.headers.common.Authorization = `Bearer ${saved}`;

api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  }
);
