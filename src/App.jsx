import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import LoginComponent from './components/LoginComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <LoginComponent></LoginComponent>
    </>
  )
}

export default App
