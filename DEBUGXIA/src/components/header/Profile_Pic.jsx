import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Link2} from 'lucide-react'
import { authAPI, profileAPI } from '../../services/api'

const Profile_Pic = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Add a small delay to ensure token is initialized
    const timer = setTimeout(() => {
      fetchUserProfile()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const fetchUserProfile = async (retries = 0) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      console.log(`📋 Fetching user profile (attempt ${retries + 1})...`)
      console.log('🔑 Token exists:', !!token)
      
      if (!token && retries < 3) {
        console.log('⏳ Token not available yet, retrying...')
        await new Promise(r => setTimeout(r, 200))
        return fetchUserProfile(retries + 1)
      }
      
      const userData = await authAPI.getCurrentUser()
      console.log('✓ User data fetched:', userData)
      setUser(userData)
      
      try {
        const profileData = await profileAPI.getProfile()
        console.log('✓ Profile data fetched:', profileData)
        setProfile(profileData)
      } catch (profileError) {
        console.warn('⚠ Could not fetch extended profile:', profileError)
        // Don't fail completely if profile fetch fails
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
      // Silently fail - user will see loading state
      if (error.status === 401 || error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className='text-gray-300 text-center py-10'>Loading profile...</div>
  }

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User'
  const bio = user?.bio || 'No bio added yet'
  const profileImage = user?.profile_image || '/public/User.jpeg'
  const website = profile?.website || ''
  return (
    <div className=' flex flex-row items-center justify-between gap-8 bg-amber w-full -mt-120 h-150'>

      <div className=' flex flex-col items-center justify-between gap-2 w-1/4 ml-10 bg-green-'>
        <div>
            <img src={profileImage} alt="Profile" onError={(e) => e.target.src = '/public/User.jpeg'} className=' w-250 h-80 border-2 border-gray-500 rounded-full'/>
        </div>

        <div className=' flex flex-row items-center justify-between gap-2 px-2 py-1'>
            <div>
              <h1 className='text-gray-200 font-medium text-lg tracking-wide'>{fullName}</h1>
            </div>
        </div>
        <div className=' border-2 border-gray-500 rounded-xl text-gray-300 py-1 px-4 tracking-wide'>
            <button className='text-gray-300 font-normal text-sm tracking-wide'><Link to='/Edit_Profile'>Edit Profile Picture</Link></button>
          </div>
    </div>

    <div className=' flex flex-col items-start w-3/4 gap-3 h-100'>
      <div className=' border-2 border-gray-500 rounded-lg h-40 w-full p-3'>
            <p className='text-gray-300 font-medium text-sm tracking-wide px-2 py-1'>
              {bio}
            </p>
        </div>

        {website && (
          <div className=' flex flex-row items-center justify-between gap-1.5 '>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <a href={website} target="_blank" rel="noopener noreferrer"><span className="text-sm hover:text-blue-300 transition-colors duration-200 hover:underline ">{website}</span></a>
            </div>
          </div>
        )}
    </div>


    </div>
  )
}

export default Profile_Pic