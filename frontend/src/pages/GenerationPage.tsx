// src/pages/GenerationPage.tsx
import { useLocation, Navigate } from "react-router-dom";
import type { GenerationState } from "../hooks/useNavigation";

export default function GenerationPage() {
  const { state } = useLocation() as { state?: GenerationState };

  const data = state;

  if (!data) {
    return <Navigate to="/survey" replace />;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">생성 결과</h1>
      <pre className="text-sm bg-gray-50 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
