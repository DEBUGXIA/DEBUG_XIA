import React from 'react'
import{Link} from 'react-router-dom'
import Profile from '../../pages2.o/Profile'

const Profileh = () => {
  return (
  <div className='list-none flex items-center flex-row justify-end gap-10 absolute right-10 text-base font-semibold tracking-wide'>
        <button className='-mr-30 h-50 w-50'><Link to='/Profile'><img src="/public/User.jpg" alt=""  className='w-13 h-13 border-2 border-gray-500 rounded-full'/></Link></button>
    </div>
  )
}

export default Profileh