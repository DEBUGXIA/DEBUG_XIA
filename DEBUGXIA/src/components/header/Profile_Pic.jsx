import React from 'react'
import { Link } from 'react-router-dom'
import {Link2} from 'lucide-react'

const Profile_Pic = () => {
  return (
    <div className=' flex flex-col items-center justify-between gap-2 w-1/4 ml-10 -mt-80'>
        <div>
            <img src="/public/User.jpeg" alt="" className=' w-70 h-65 border-2 border-gray-500 rounded-full'/>
        </div>

        <div className=' flex flex-row items-center justify-between gap-1 px-2 py-1'>
            <div>
              <h1 className='text-gray-200 font-medium text-lg tracking-wide'>Shradha Khapra .</h1>
            </div>
            <div>
              <h1 className='text-gray-200 font-normal text-xs tracking-wide'>She/Her</h1>
            </div>
        </div>

        <div className=''>
            <p className='text-gray-300 font-medium text-sm tracking-wide px-2 py-1'>
              No.1 for online Tech Placements & Internships Thousands of students Placed 🚀 7 Million+ Coders on YouTube
            </p>
        </div>

        <div className=' border-2 border-gray-500 rounded-xl text-gray-300 py-1 px-4 tracking-wide'>
            <button className='text-gray-300 font-normal text-sm tracking-wide'><Link to='/Edit_Profile'>Edit Profile Picture</Link></button>
        </div>

        <div className=' flex flex-row items-center justify-between gap-1.5 '>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <a href="https://www.linkedin.com/company/apna-college/posts/?feedView=all"><span className="text-sm hover:text-blue-300 transition-colors duration-200 hover:underline ">https://www.linkedin.com/company/apna-college/posts/?feedView=all</span></a>
            </div>
        </div>

        <div className=' flex flex-row items-center justify-between gap-1.5 '>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <a href="https://www.youtube.com/@ApnaCollegeOfficial"><span className="text-sm hover:text-blue-300 transition-colors duration-200 hover:underline ">https://www.youtube.com/@ApnaCollegeOfficial</span></a>
            </div>
        </div>
          

    </div>
  )
}

export default Profile_Pic