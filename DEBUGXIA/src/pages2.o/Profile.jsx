import React, { useState, useEffect } from 'react'
import Profile_Pic from '../components/header/Profile_Pic'

const Profile = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // Force component remount on page focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Profile page focused - refreshing profile data...')
      setRefreshKey(prev => prev + 1)
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Force remount when profile is updated
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'profileUpdated') {
        console.log('🔄 Profile update detected - remounting Profile_Pic...')
        setRefreshKey(prev => prev + 1)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check localStorage periodically
    const interval = setInterval(() => {
      const profileUpdate = localStorage.getItem('profileUpdated')
      if (profileUpdate) {
        console.log('🔄 Profile update detected via polling - remounting Profile_Pic...')
        setRefreshKey(prev => prev + 1)
        localStorage.removeItem('profileUpdated')
      }
    }, 300)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className=' flex flex-col items-center justify-between gap-3'>
      <div className=' flex flex-row items-center justify-between mt-10 px-20 w-full gap-5'>
        <div className='flex flex-row items-center justify-between w-full gap-5 mt-100'>
            <Profile_Pic key={refreshKey}/>
        </div>
    </div>
    
    </div>
  )
}

export default Profile