import React from 'react'
import{Link} from 'react-router-dom'
import Home from '../../pages2.o/Home2'
import Terminal2 from '../../pages2.o/Terminal2'
import Error_History from '../../pages2.o/Error_History'


const Nev2 = () => {
  return (
    <div className='no-underline list-none flex items-center flex-row justify-center gap-10 absolute right-75 text-base font-semibold tracking-wide'>
      <Link to='/Home2'>Home</Link>
      <Link to='/Terminal2'>Terminal</Link>
      <Link to='/Error_History'>Error History</Link>
    </div>
  )
}

export default Nev2