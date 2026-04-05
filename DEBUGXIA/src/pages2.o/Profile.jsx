import React from 'react'
import Profile_Pic from '../components/header/Profile_Pic'
const Profile = () => {
  return (
    <div className=' flex flex-col items-center justify-between gap-3'>
      <div className=' flex flex-row items-center justify-between mt-10 px-20 w-full gap-5'>
        <div className='flex flex-row items-center justify-between w-full gap-5 mt-100'>
            <Profile_Pic/>
        </div>
    </div>
    
    </div>
  )
}

export default Profile