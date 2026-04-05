import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Link2} from 'lucide-react'
import { authAPI, profileAPI } from '../../services/api'

const Profile_Pic = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    // Fetch profile data immediately on mount - no delays!
    console.log('🚀 Profile_Pic.jsx mounted - fetching fresh user data immediately...')
    fetchUserProfile()
  }, [])

  // Refetch profile data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing profile data...')
        fetchUserProfile()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Refetch when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing profile...')
      setRefreshTrigger(prev => prev + 1)
      fetchUserProfile()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Listen for profile update signals from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'profileUpdated' || e.newValue) {
        console.log('Profile update detected, refreshing...')
        setRefreshTrigger(prev => prev + 1)
        fetchUserProfile()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check localStorage periodically for same-tab updates
    const interval = setInterval(() => {
      const profileUpdate = localStorage.getItem('profileUpdated')
      if (profileUpdate) {
        console.log('Profile update detected via polling, refreshing...')
        setRefreshTrigger(prev => prev + 1)
        fetchUserProfile()
        // Clear the flag after processing
        localStorage.removeItem('profileUpdated')
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const fetchUserProfile = async (retries = 0) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      console.log(`📋 Fetching user profile (attempt ${retries + 1})...`)
      console.log('🔑 Token exists:', !!token)
      
      if (!token && retries < 3) {
        console.log('⏳ Token not available yet, retrying...')
        await new Promise(r => setTimeout(r, 100))
        return fetchUserProfile(retries + 1)
      }
      
      console.log('📡 Calling authAPI.getCurrentUser()...')
      const userData = await authAPI.getCurrentUser()
      console.log('✓ User data fetched:', userData)
      console.log('   - First Name:', userData.first_name)
      console.log('   - Last Name:', userData.last_name)
      console.log('   - Profile Image:', userData.profile_image)
      setUser(userData)
      
      try {
        console.log('📡 Calling profileAPI.getProfile()...')
        const profileData = await profileAPI.getProfile()
        console.log('✓ Profile data fetched:', profileData)
        setProfile(profileData)
      } catch (profileError) {
        console.warn('⚠ Could not fetch extended profile:', profileError)
      }
    } catch (error) {
      console.error('❌ Error fetching profile:', error)
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

  // Helper: Convert relative image paths to absolute URLs
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl  // Already absolute
    if (imageUrl.startsWith('/media/')) return `http://localhost:8000${imageUrl}`  // Already has /media/
    if (imageUrl.startsWith('user_profiles/')) return `http://localhost:8000/media/${imageUrl}`  // Add /media/
    return `http://localhost:8000/media/${imageUrl}`  // Fallback
  }

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User'
  const bio = user?.bio || 'No bio added yet'
  // Generate unique cache-buster on every component render to ensure fresh image
  const timestamp = Date.now() + refreshTrigger
  const profileImage = user?.profile_image 
    ? `${getAbsoluteImageUrl(user.profile_image)}?t=${timestamp}` 
    : null  // No fallback - will show placeholder
  const website = profile?.website || ''
  return (
    <div className=' flex flex-row items-center justify-between gap-8 bg-amber w-full -mt-120 h-150'>

      <div className='flex flex-col items-center justify-start gap-4 w-1/4 ml-10'>
        <div className='w-60 h-60'>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className='w-full h-full border-4 border-blue-500 rounded-full object-cover shadow-lg' 
                onError={(e) => {
                  console.error('❌ Profile image failed to load:', profileImage)
                }}
              />
            ) : (
              <div className='w-full h-full border-4 border-gray-500 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-400 text-2xl font-medium shadow-lg'>
                📷
              </div>
            )}
        </div>

        <div className='flex flex-row items-center justify-center gap-2 px-2 py-1'>
            <h1 className='text-gray-200 font-medium text-xl tracking-wide text-center'>{fullName}</h1>
        </div>
        <div className='border-2 border-gray-500 rounded-xl text-gray-300 py-2 px-4 tracking-wide hover:bg-gray-900/50 transition'>
            <Link to='/Edit_Profile' className='text-gray-300 font-normal text-sm tracking-wide hover:text-white'>Edit Profile Picture</Link>
        </div>
      </div>

      <div className='flex flex-col items-start w-3/4 gap-4 h-100'>
        <div className='border-2 border-gray-500 rounded-lg w-full p-4 bg-gray-900/30'>
          <p className='text-gray-300 font-medium text-sm tracking-wide px-2 py-1'>
            {bio}
          </p>
        </div>

        {website && (
          <div className='flex flex-row items-center gap-3 text-gray-400'>
            <Link2 strokeWidth={1.5} size={20} className='text-blue-400' />
            <a href={website} target="_blank" rel="noopener noreferrer" className='text-sm hover:text-blue-300 transition-colors duration-200 hover:underline'>
              {website}
            </a>
          </div>
        )}
      </div>

    </div>
  )
}

export default Profile_Pic