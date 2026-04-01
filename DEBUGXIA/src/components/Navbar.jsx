import React from 'react'
import Logo from './header/Logo'
import Nev from './header/Nev'
import Sing_in_up from './header/Sing_in_up'

const Navbar = () => {
  return (
    <div className=' p-8 rounded-2xl bg-white/5 backdrop-blur-xl h-15 shadow-2xl text-fuchsia-300 lg:flex items-center justify-between sticky top-0 w-[100%] aspect-[16/9]'>
        <Logo/>
        <Nev />
        <Sing_in_up/>
    </div>
  )
}

export default Navbar