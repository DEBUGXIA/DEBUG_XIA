import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { motion } from "framer-motion";  
import Navbar2 from '../components/Navbar2';
import Home2 from './Home2';
const App3 = () => {
  return (

    <div>
      
    
      <Navbar2/>
      <Routes>
        <Route path='/Home2' element={<Home2/>}/>
        
      </Routes>

      


    
  </div>
  
  )
}

export default App3