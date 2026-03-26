import React from 'react'
import Profile_Pic from '../components/header/Profile_Pic'
import Dasboard2 from '../components/header/Dasboard2'

const Profile = () => {
  return (
    <div className=' flex flex-row items-center justify-between mt-10 px-20 w-full gap-5'>
        <div className='flex flex-row items-center justify-between w-full gap-5 '>
            <Profile_Pic/>
            <Dasboard2/>
        </div>
    </div>
  )
}

export default Profile