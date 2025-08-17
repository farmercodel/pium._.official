// src/components/auth/AuthFrame.tsx
import type { ReactNode } from "react";

interface AuthFrameProps {
  children: ReactNode;
  onBackToMain: () => void;
}

const AuthFrame = ({ children, onBackToMain }: AuthFrameProps) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm md:max-w-md border-2 border-gray-300 rounded-2xl shadow-lg flex items-center justify-center px-6 py-8 flex-col gap-4 bg-white">
        {children}
      </div>
      <div
        className="text-gray-500 text-sm underline cursor-pointer"
        onClick={onBackToMain}
      >
        메인화면으로 돌아가기
      </div>
    </div>
  );
};

export default AuthFrame;
