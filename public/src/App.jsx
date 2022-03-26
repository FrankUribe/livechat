import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Admin from './pages/Admin'
import Live from './pages/Live'
import Login from './pages/Login'
import NotFound from './pages/NotFound';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Live/>} />
        <Route exact path='/admin' element={<Admin/>} />
        <Route exact path='/login' element={<Login/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
