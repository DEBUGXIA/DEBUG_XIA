import React from 'react'
import{Link} from 'react-router-dom'
import Home from './Home'

const Not_Found = () => {
  return (
    <div className='text-black bg-amber-300 w-[100%] aspect-[16/9]'>
      <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" alt="" className='w-800 h-160'/>
      <div className='flex flex-col items-center justify-between'>
        <div className='absolute top-25 font-serif font-medium text-6xl tracking-wider '>
          <h1>404</h1>
        </div>
        <div className='absolute top-140 flex gap-2 flex-col'>
          <h2 className='font-serif tracking-wide font-bold text-4xl'>Look like you're lost</h2>
          <p className='font-serif tracking-wide font-medium text-lg px-8'>the page you are looking for not avaible!</p>
        </div>
        <div className='absolute top-165'>
          <button className='bg-green-600 py-1.5 px-4 border-white border-2 rounded-3xl text-white font-semibold text-lg'>
            <Link to='/'>Go To Home</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Not_Found