import React from 'react'
import{Link} from 'react-router-dom'
import Home from '../../pages2.o/Home2'
import Terminal2 from '../../pages2.o/Terminal2'
import Optimizer from '../../pages2.o/Optimizer'


const Nev2 = () => {
  return (
    <div className='no-underline list-none flex items-center flex-row justify-center gap-10 absolute right-55 text-base font-semibold tracking-wide'>
      <Link to='/Home2'>Code Analyzer</Link>
      <Link to='/Terminal2'>Terminal</Link>
      <Link to='/Optimizer'>Optimizer</Link>
      <Link to='/About2'>About</Link>
    </div>
  )
}

export default Nev2