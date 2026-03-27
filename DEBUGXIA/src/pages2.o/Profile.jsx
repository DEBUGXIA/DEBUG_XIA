import React from 'react'
import Profile_Pic from '../components/header/Profile_Pic'
import Dasboard2 from '../components/header/Dasboard2'
import Das from '../components/header/Das'

const Profile = () => {
  return (
    <div className=' flex flex-col items-center justify-between gap-3'>
      <div className=' flex flex-row items-center justify-between mt-10 px-20 w-full gap-5'>
        <div className='flex flex-row items-center justify-between w-full gap-5 '>
            <Profile_Pic/>
            <Dasboard2/>
        </div>
    </div>
    <div className=' flex flex-col items-center justify-between w-full bg-green -mt-5'>
      <Das/>
    </div>
    </div>
  )
}

export default Profile