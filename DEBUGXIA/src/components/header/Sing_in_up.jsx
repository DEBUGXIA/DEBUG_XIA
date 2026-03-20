import React from 'react'
import{Link} from 'react-router-dom'
import SingIn from '../../pages/SingIn'
import Get_Started from '../../pages/Get_Started'

const Sing_in_up = () => {
  return (

      <div className='list-none flex items-center flex-row justify-end gap-10 absolute right-10 text-base font-semibold tracking-wide'>
        <Link to='/SingIn'>SingIn</Link>
        <button className=' text-white py-1.5 px-4 text-lg font-semibold rounded-2xl tracking-wide bg-gradient-to-r from-blue-500 to-cyan-400 text-white'><Link to='/Get_Started'>Get Started</Link></button>
    </div>
  )
}


export default Sing_in_up