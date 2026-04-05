import React from 'react'
import Logo from './header/Logo'
import Nev2 from './header/Nev2'
import Profileh from './header/Profileh'

const Navbar2 = () => {
  return (
    <div className=' p-8 rounded-2xl bg-white/5 backdrop-blur-xl h-18 shadow-2xl text-blue-300 lg:flex items-center justify-between sticky top-0 w-[100%] aspect-[16/9] z-50'>
        <Logo/>
        <Nev2 />
        <Profileh/>
    </div>
  )
}

export default Navbar2