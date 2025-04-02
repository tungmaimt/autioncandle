import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import Layout from './components/Layout/Layout'
import Aution from './pages/Aution'
import Candle from './pages/Candle'
import Login from './pages/Login'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Candle />} />
          <Route path='aution' element={<Aution />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  // </StrictMode>,
)
