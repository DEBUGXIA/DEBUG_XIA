import React from 'react'
import{Link} from 'react-router-dom'
import Home from '../../pages/Home'
import Features from '../../pages/Features'
import How_It_Works from '../../pages/How_It_Works'
import Dashboard from '../../pages/Dashboard'

const Nev = () => {
  return (
    <div className='no-underline list-none flex items-center flex-row justify-center gap-10 absolute right-75 text-base font-semibold tracking-wide'>
      <Link to='/'>Home</Link>
      <Link to='/Features'>Features</Link>
      <Link to='/How_It_Works'>How It Works</Link>
      <Link to='/Dashboard'>Dashboard</Link>
    </div>
  )
}

export default Nev