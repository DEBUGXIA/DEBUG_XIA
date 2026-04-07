import React from 'react'
import{Link} from 'react-router-dom'
import About from '../pages/About'
import Logo from './header/Logo'
import Icons from './icon/Icons'

const Footer2 = () => {
  return (
    <div className='rounded-2xl bg-white/5 backdrop-blur-xl h-70 shadow-2xl border-2 border-gray-800 text-blue-300 flex flex-row items-center justify-between px-10'>
      <div className=' flex flex-col items-center justify-between mt-5 mb-10'>
        <Logo/>
        <div className=' flex flex-col items-center justify-between gap-5'>
          <h1 className=' ml-5 font-medium text-lg text-white tracking-wide'>Your AI<br></br><span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-xl'>Coding Teacher</span></h1>
        <Icons/>
        </div>
      </div>

      <div className=' flex flex-row items-center justify-between gap-50 -mt-35 mr-10 '>
        <div className=' mt-35 flex items-start flex-col justify-between gap-5'>
          <div><h1 className=' tracking-wide font-medium text-xl'>Contact</h1></div>
          <div className=' flex flex-col items-start justify-between font-light text-lg text-white'>
            <h2>subhadeepbiswas205@gmail.com</h2>
            <h2>spedoriobusiness@gmail.com</h2>
            <h2>sohelighosh30@gmail.com</h2>
            <h2>sanchariray71@gmail.com</h2>
            <h2>sikdarritisha@gmail.com</h2></div>
        </div>
        <div className='mt-40 flex flex-col items-start justify-between gap-5'>
          <div><h1 className='tracking-wide font-medium text-xl'>Quick Links</h1></div>
          <div className='flex flex-col items-start justify-between font-light text-lg text-white'>
            <Link to='/About'>About</Link>
            <Link to='/Home2'>Code Analyzer</Link>
            <Link to='/Terminal2'>Terminal</Link>
            <Link to='/Optimizer'>Optimizer</Link>
            <Link to='/Analysis_History'>Analysis History</Link>
          </div>
        </div>
        <div className='mt-15 flex flex-col items-start justify-between gap-5'>
          <div><h1 className='tracking-wide font-medium text-xl'>Legal</h1></div>
          <div className='flex flex-col items-start justify-between font-light text-lg text-white'>
            <Link to='Terms_and_con'>Terms & Conditions</Link>
            <Link to='/Privacy_Policy'>Privacy Policy</Link>
            
          </div>
        </div>
      </div>

    </div>
  )
}

export default Footer2