import React from 'react'
import { Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import Terminal from '../components/Terminal'
import { motion } from "framer-motion";
import Navbar from '../components/Navbar';

import Features from './Features';
import How_It_Works from './How_It_Works';

const Home = () => {
  return (
  
    <div className='flex flex-col items-center justify-between gap-10 w-[100%] aspect-[16/9]'>
      

    <div className='flex flex-col items-center justify-between gap-10 mt-30'>
      <div className='flex flex-col items-center justify-between gap-8 '>
        <h1 className='font-bold text-7xl tracking-normal'><motion.span
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide"
          >
            Your AI <span className='bg-gradient-to-r from-blue-500 to-fuchsia-400 bg-clip-text text-transparent'>Coding Teacher</span>
          </motion.span></h1>
        <p className='font-medium text-xl text-gray-300 tracking-wide'><motion.span
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide"
          >
            <span className='px-7'>Understand errors. Improve code. Become a better developer.</span><br></br>
        Stop Googling stack traces — get instant, plain-English explanations.
          </motion.span></p>
      </div>

      <div className=' flex flex-row items-center justify-between gap-5'>
        <button>
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide bg-gradient-to-r from-blue-500 to-fuchsia-400 text-xl font-semibold px-7 py-3 rounded-2xl"> <Link to='/Get_Started'>Connect With VS Code</Link> </motion.span></button>
        <button>
          <Link to='/Dashboard'>
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide text-xl font-semibold px-7 py-3 rounded-2xl border-2 border-gray-300"
          > Download Extension </motion.span></Link></button>

      </div>

    </div>
    
    <div>
       <motion.span
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="inline-block tracking-wide ml-10 mr-10 w-screen"
      >
        
      </motion.span>
    </div>

    <div>
      <motion.span
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="inline-block tracking-wide"
      >
        <Features/>
      </motion.span>
    </div>

    <div>
      <motion.span
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="inline-block tracking-wide"
      >
        <How_It_Works/>
      </motion.span>
    </div>

    <div>
      <motion.span
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className="inline-block tracking-wide"
      >
        <Dashboard/>
      </motion.span>
    </div>

    

    </div>
  
  )
}

export default Home