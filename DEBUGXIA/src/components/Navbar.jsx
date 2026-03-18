import React from 'react'
import Logo from './header/Logo'
import Nev from './header/Nev'
import Sing_in_up from './header/Sing_in_up'

const Navbar = () => {
  return (
    <div className='bg-black text-blue-300 lg:flex items-center justify-between'>
        <Logo/>
        <Nev />
        <Sing_in_up/>
    </div>
  )
}

export default Navbar