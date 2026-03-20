import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Features from './pages/Features'
import How_It_Works from './pages/How_It_Works'
import Dashboard from './pages/Dashboard'
import SingIn from './pages/SingIn'
import Get_Started from './pages/Get_Started'
import Not_Found from './pages/Not_Found'
const App = () => {
  return (
    <div className='bg-gray-950 h-screen text-white'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Features' element={<Features/>}/>
        <Route path='/How_It_Works' element={<How_It_Works/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/SingIn' element={<SingIn/>}/> 
        <Route path='/Get_Started' element={<Get_Started/>}/>

        <Route path='*' element={<Not_Found/>}/>
      </Routes>
    </div>
  )
}

export default App