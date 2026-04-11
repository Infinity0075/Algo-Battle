import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Editor from './pages/Editor'
// import LoginPage from './pages/LoginPage'

function App () {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          {/* <Route path='/' element={<LoginPage />}></Route> */}
          <Route path='/editor/:roomId' element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
