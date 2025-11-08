// App.js
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginComponent from './components/LoginComponent'
import AdminSongUpload from './components/AdminSongUpload'
import MusicPlayer from './components/MusicPlayer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/admin" element={<AdminSongUpload />} />
        <Route path="/music" element={<MusicPlayer />} />
        <Route path="/" element={<Navigate to="/music" replace />} />
      </Routes>
    </Router>
  )
}

export default App