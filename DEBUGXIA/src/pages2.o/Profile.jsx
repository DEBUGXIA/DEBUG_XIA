import React from 'react'

const Profile = () => {
  return (
    <div className='flex flex-col items-center justify-between mt-10 px-20'>
      <div className=' flex flex-row items-center justify-between bg-amber-300 w-full gap-5'>
        <div className=' flex flex-col items-center justify-between gap-2 w-1/3 bg-green-300'>
          <div>
            <img src="/public/User.jpg" alt="" className=' w-70 h-70 border-2 border-gray-500 rounded-full'/>
          </div>
          <div className=' bg-gray-900 border-2 border-gray-500 rounded-xl text-gray-400 py-1.5 px-4 tracking-wide'>
            <h1>Edit Profile Picture</h1>
          </div>
        </div>

        <div className='w-2/3 bg-gray-900 flex flex-col items-center justify-between gap-2 border-2 border-gray-500 h-80 rounded-2xl'>
          <div className=' flex flex-row items-center justify-baseline gap-2 h-1/2 w-full'>
            <div className=' w-1/2 -mt-20 ml-3'>
              <input type="text" placeholder='Enter UserName' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-600 border-1 rounded-xl w-full'/>
            </div>
            <div className='  w-1/2 -mt-20 mr-3'>
              <input type="text" placeholder='Enter UserName' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-600 border-1 rounded-xl w-full'/>
            </div>
          </div>
          <div className=' flex flex-row items-center justify-baseline gap-2 h-1/2 w-full'>
            <div className='  w-1/2 -mt-70 ml-3'>
              <input type="text" placeholder='Enter UserName' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-600 border-1 rounded-xl w-full'/>
            </div>
            <div className='  w-1/2 -mt-70 mr-3'>
              <input type="text" placeholder='Enter UserName' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-600 border-1 rounded-xl w-full'/>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile