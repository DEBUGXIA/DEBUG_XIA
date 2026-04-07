import React from 'react'
import{Link} from 'react-router-dom'
import Home2 from './Home2'


const Not_Found_Page = () => {
    
  return (
    <div className='bg-white w-full'>
      <div>
        <h1 className=' font-serif font-normal text-8xl flex items-center justify-center text-black'>404</h1>
        <h1 className=' font-serif font-normal text-5xl flex items-center justify-center text-black relative top-175'>Look like you're lost</h1>
        <h1 className=' font-serif font-normal text-3xl flex items-center justify-center text-black relative top-185'>the page you are looking for not avaible!</h1>
        <button  className='bg-green-600 py-1.5 px-4 border-white border-2 rounded-3xl text-white font-semibold text-lg relative top-190 ml-180'>
          <Link to='/Home2'>Go To Home</Link>
        </button>
        <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="" className='w-500 h-200'/>
      </div>
    </div>
  )
}

export default Not_Found_Page