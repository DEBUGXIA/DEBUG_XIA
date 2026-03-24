import React from 'react'
import{Link} from 'react-router-dom'
import Profile from '../../pages2.o/Profile'

const Profileh = () => {
  return (
  <div className='list-none flex items-center flex-row justify-end gap-10 absolute right-10 text-base font-semibold tracking-wide'>
        <button className=' text-white py-1.5 px-5 text-lg font-semibold rounded-2xl tracking-wide bg-gradient-to-r from-blue-500 to-cyan-400 text-white'><Link to='/Profile'>Profile</Link></button>
    </div>
  )
}

export default Profileh