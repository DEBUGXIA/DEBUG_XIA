import React from 'react'
import Logo from './header/Logo'
import Icons from './icon/Icons'

const Footer = () => {
  return (
    <div className='rounded-2xl bg-white/5 backdrop-blur-xl h-60 shadow-2xl border-2 border-gray-800 text-blue-300 mt-20 flex flex-row items-center justify-between px-10'>
      <div className=' flex flex-col items-center justify-between mt-5'>
        <Logo/>
        <div className=' flex flex-col items-center justify-between gap-5'>
          <h1 className=' ml-5 font-medium text-lg text-white tracking-wide'>Your AI<br></br><span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-xl'>Coding Teacher</span></h1>
        <Icons/>
        </div>
      </div>

      <div className=' flex flex-row items-center justify-between gap-25 -mt-25 mr-20 font-medium text-lg'>
        <div>
          <h1>Contact</h1>
        </div>
        <div>
          <h1>Quick Links</h1>
        </div>
        <div>
          <h1>Legal</h1>
        </div>
      </div>

    </div>
  )
}

export default Footer