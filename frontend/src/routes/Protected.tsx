// src/routes/Protected.tsx
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function Protected({ children }: { children: JSX.Element }) {
  const hasToken = !!localStorage.getItem("access_token");
  return hasToken ? children : <Navigate to="/login" replace />;
}
