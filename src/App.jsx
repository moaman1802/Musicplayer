import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import LoginComponent from './components/LoginComponent'
import SongUpload from './components/AdminSongUpload'
import AdminSongUpload from './components/AdminSongUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <LoginComponent></LoginComponent>
  {/* <AdminSongUpload></AdminSongUpload> */}
    </>
  )
}

export default App
