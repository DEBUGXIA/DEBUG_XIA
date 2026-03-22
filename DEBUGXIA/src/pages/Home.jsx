import React from 'react'
import { Link } from 'react-router-dom'
import Dashboard from './Dashboard'
import Terminal from '../components/Terminal'
import { motion } from "framer-motion";
import Features from './Features';
import How_It_Works from './How_It_Works';

const Home = () => {
  return (
    <div
    className='flex flex-col items-center justify-between gap-10'>

    <div className='flex flex-col items-center justify-between gap-10 mt-30'>
      <div className='flex flex-col items-center justify-between gap-8 '>
        <h1 className='font-bold text-7xl tracking-normal'><motion.span
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide"
          >
            Your AI <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>Coding Teacher</span>
          </motion.span></h1>
        <p className='font-medium text-xl text-gray-500 tracking-wide'><span className='px-7'>Understand errors. Improve code. Become a better developer.</span><br></br>
        Stop Googling stack traces — get instant, plain-English explanations.</p>
      </div>

      <div className=' flex flex-row items-center justify-between gap-5'>
        <button className='bg-gradient-to-r from-blue-500 to-cyan-400 text-xl font-semibold px-7 py-3 rounded-2xl'>Connect With VS Code</button>
        <button className='text-xl font-semibold px-7 py-3 rounded-2xl border-2 border-gray-800'>
          <Link to='/Dashboard'>Download Extension</Link>
        </button>

      </div>

    </div>
    
    <div className=' ml-10 mr-10 w-screen'>
      
    </div>

    <div>
      <Features/>
    </div>

    <div>
      <How_It_Works/>
    </div>

    <div>
      <Dashboard/>
    </div>

    

    </div>
  )
}

export default Home