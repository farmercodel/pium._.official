import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Layout from './components/layout/Layout'

import MainPage from './pages/MainPage'
import PreviewPage from './pages/PreviewPage'
import AboutPage from './pages/AboutPage'
import SurveyPage from './pages/SurveyPage'
import GenerationPage from './pages/GenerationPage'
import ResultPage from './pages/ResultPage'
import GuidePage from './pages/GuidePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/generation" element={<GenerationPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
