import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Editor from './pages/Editor'
import Login from './pages/Login'
import Register from './pages/Register'
// import LoginPage from './pages/LoginPage'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route path='/' element={<Home />}></Route>
          {/* <Route path='/' element={<LoginPage />}></Route> */}
          <Route path='/editor/:roomId' element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
