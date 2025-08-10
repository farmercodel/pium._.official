import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Layout from './components/layout/Layout'

import MainPage from './pages/MainPage'
import SurveyPage from './pages/SurveyPage'
import GenerationPage from './pages/GenerationPage'
import ResultPage from './pages/ResultPage'
import AboutPage from './pages/AboutPage'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/generation" element={<GenerationPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
