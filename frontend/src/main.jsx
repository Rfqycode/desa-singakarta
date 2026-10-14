import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminPanel from "./AdminDashboard.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).setLayout || ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Halaman Utama Publik */}
        <Route path="/" element={<App />} />

        {/* Jalur URL Khusus Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)