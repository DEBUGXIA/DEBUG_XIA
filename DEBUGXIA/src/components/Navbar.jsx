import React from 'react'
import Logo from './header/Logo'
import Nev from './header/Nev'
import Sing_in_up from './header/Sing_in_up'

const Navbar = () => {
  return (
    <div className='p-4 md:px-8 bg-white/5 backdrop-blur-xl shadow-2xl text-blue-400 flex items-center justify-between sticky top-0 w-full z-50 h-18'>
        <Logo/>
        <Nev />
        <Sing_in_up/>
    </div>
  )
}

export default Navbar