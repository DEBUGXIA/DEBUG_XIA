import React from 'react'
import {NotebookPen} from 'lucide-react'
import {UserRoundPen} from 'lucide-react'

const Profile = () => {
  return (
    <div className='flex flex-col items-center justify-between mt-10 px-20'>
      <div className=' flex flex-row items-center justify-between bg-amber- w-full gap-5'>
        <div className=' flex flex-col items-center justify-between gap-2 w-1/4 bg-green-'>
          <div>
            <img src="/public/User.jpeg" alt="" className=' w-70 h-70 border-2 border-gray-500 rounded-full'/>
          </div>
          <div className=' bg-gray-900 border-2 border-gray-500 rounded-xl text-gray-400 py-1.5 px-4 tracking-wide'>
            <h1>Edit Profile Picture</h1>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter UserName' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-70' />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><NotebookPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <textarea placeholder='Enter Your Boi . . . ' name="" id=""className='bg-gray-900 px-5 py-2 font-normal text-lg tracking-wide border-gray-500 rounded-xl border-1 h-20 w-70 text-gray-400'></textarea>
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5 bg-gray-900 px-5 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-xl border-1  w-80 -'>
            <label for="cars" className=' text-gray-400'>Pronouns :</label>

              <select name="cars" id="cars"  className='bg-gray-900 text-gray-400 w-40 font-normal text-lg'>
                <option >Don't Specify</option>
                <option >They/Them</option>
                <option >She/Her</option>
                <option >He/Him</option>
                <option >Custom</option>
              </select>
          </div>

        </div>

        <div className='w-3/4 bg-gray-900 flex flex-col items-center justify-between gap-2 border-2 border-gray-500 h-80 rounded-2xl -mt-50'>
          
          
        </div>

      </div>
    </div>
  )
}

export default Profile