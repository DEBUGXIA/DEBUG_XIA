import React from 'react'
import{Link} from 'react-router-dom'
import Profile from '../../pages2.o/Profile'

const Profileh = () => {
  return (
  <div className='list-none flex items-center flex-row justify-end gap-10 absolute right-10 text-base font-semibold tracking-wide'>
        <button className='-mr-30 h-50 w-50'><Link to='/Profile'><img src="/public/User.jpeg" alt=""  className='w-8 h-8 border-1 border-gray-500 rounded-full'/></Link></button>
    </div>
  )
}

export default Profileh