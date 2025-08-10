import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Layout from './components/layout/Layout'

import MainPage from './pages/MainPage'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
