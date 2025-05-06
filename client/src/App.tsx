import Navbar from './components/Navbar.tsx';

import { Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Profile from './pages/Profile.tsx';


function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
