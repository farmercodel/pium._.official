import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useModal } from "./hooks/useModal";
import { Modal } from "./components/common/Modal";

// 페이지 컴포넌트들
import MainPage from "./pages/MainPage";
import AboutPage from "./pages/AboutPage";
import GuidePage from "./pages/GuidePage";
import SurveyPage from "./pages/SurveyPage";
import GenerationPage from "./pages/GenerationPage";
import PlansPage from "./pages/PlansPage";
import PreviewPage from "./pages/PreviewPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Protected from "./routes/Protected";
import Layout from "./components/layout/Layout";
import ContactPage from "./pages/ContactPage";

// 모달을 사용하는 App 컴포넌트
const AppContent = () => {
  const { isOpen, content, title, closeModal, resetModal } = useModal();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/survey" element={<Protected><SurveyPage /></Protected>} />
          <Route path="/generation" element={<Protected><GenerationPage /></Protected>} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/contact" element = {<ContactPage />} />
        </Routes>
      </Layout>

      {/* Modal */}
      <Modal
        open={isOpen}
        onClose={closeModal}
        title={title || "제목 없음"}
        desc={content as string}
        confirmText="확인"
        cancelText="닫기"
        onConfirm={resetModal}
        variant="success"
        reduceMotion={false}
      />
    </Router>
  );
};

// 메인 App 컴포넌트
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
