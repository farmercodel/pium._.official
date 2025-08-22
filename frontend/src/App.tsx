import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";

import MainPage from "./pages/MainPage";
import PreviewPage from "./pages/PreviewPage";
import AboutPage from "./pages/AboutPage";
import SurveyPage from "./pages/SurveyPage";
import GenerationPage from "./pages/GenerationPage";
import GuidePage from "./pages/GuidePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PlansPage from "./pages/PlansPage";

import { AuthProvider } from "./context/AuthContext";
import Protected from "./routes/Protected";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/plans" element={<PlansPage />} />

            <Route path="/survey" element={
              <Protected><SurveyPage /></Protected>
            }/>
            <Route path="/generation" element={
              <Protected><GenerationPage /></Protected>
            }/>
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
