import React from 'react'
import{Link} from 'react-router-dom'
import Home from '../../pages2.o/Home2'
import Dashboard from '../../pages2.o/Dashboard2'


const Nev2 = () => {
  return (
    <div className='no-underline list-none flex items-center flex-row justify-center gap-10 absolute right-75 text-base font-semibold tracking-wide'>
      <Link to='/Home2'>Home</Link>
      <Link to='/Dashboard2'>Dashboard</Link>
    </div>
  )
}

export default Nev2