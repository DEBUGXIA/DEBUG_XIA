import React from 'react'
import {NotebookPen} from 'lucide-react'
import {UserRoundPen} from 'lucide-react'
import {Link2} from 'lucide-react'
import { useState, useRef, useEffect } from "react"
import {Link, useNavigate} from 'react-router-dom'
import { authAPI, profileAPI } from '../services/api'

const Edit_Profile = () => {

  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Form state
  const [image, setImage] = useState("/public/User.jpeg")
  const [imageFile, setImageFile] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
    pronouns: 'Don\'t Specify',
    website: '',
    phone_number: '',
    company: '',
    location: '',
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load user data on mount
  useEffect(() => {
    // Ensure token exists and is initialized before loading
    const timer = setTimeout(() => {
      const token = localStorage.getItem('access_token')
      console.log('📝 Edit_Profile mounted, token exists:', !!token)
      
      if (!token) {
        setError('Authentication required. Please sign in.')
        setTimeout(() => navigate('/SingIn'), 1000)
        return
      }
      
      loadUserData()
    }, 50)
    
    return () => clearTimeout(timer)
  }, [navigate])

  const loadUserData = async (retries = 0) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      
      console.log(`[LoadUserData] Attempt ${retries + 1}, token exists: ${!!token}`)
      
      if (!token && retries < 3) {
        console.log('⏳ Token lost, retrying...')
        await new Promise(r => setTimeout(r, 200))
        return loadUserData(retries + 1)
      }
      
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      console.log('[LoadUserData] Fetching current user...')
      const userData = await authAPI.getCurrentUser()
      console.log('[LoadUserData] ✓ User data received:', userData)
      
      setFormData(prev => ({
        ...prev,
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        bio: userData.bio || '',
        phone_number: userData.phone_number || '',
      }))
      
      // Load profile data
      try {
        console.log('[LoadUserData] Fetching profile data...')
        const profileData = await profileAPI.getProfile()
        console.log('[LoadUserData] ✓ Profile data received:', profileData)
        setFormData(prev => ({
          ...prev,
          website: profileData.website || '',
          company: profileData.company || '',
          location: profileData.location || '',
        }))
      } catch (e) {
        console.warn('[LoadUserData] ⚠ Could not fetch profile data:', e)
        // Don't fail completely - profile might not exist yet
      }
      
      // Load profile image if available
      if (userData.profile_image) {
        setImage(userData.profile_image)
      }
      
      setLoading(false)
      setError('')
    } catch (err) {
      console.error('[LoadUserData] ❌ Error:', err)
      setError('Failed to load profile data')
      setLoading(false)
      
      // Redirect to login if no token
      if (err.message.includes('No authentication token')) {
        setTimeout(() => navigate('/SingIn'), 2000)
      }
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage(preview)
      setImageFile(file)
    }
  }

  const handleRemove = () => {
    setImage("/public/User.jpeg")
    setImageFile(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Check token exists
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Authentication required. Please sign in again.')
        navigate('/SingIn')
        return
      }

      console.log('💾 Saving profile changes...')
      console.log('🔑 Token available:', !!token)
      
      // Prepare all profile data to send
      const profileUpdateData = {
        // User profile fields
        bio: formData.bio,
        phone_number: formData.phone_number,
        
        // Extended profile fields
        website: formData.website,
        company: formData.company,
        location: formData.location,
      }
      
      console.log('📝 Updating profile with data:', profileUpdateData)
      // Single call to update all profile data
      const result = await profileAPI.updateMyProfile(profileUpdateData)
      console.log('✅ Profile updated successfully:', result)
      
      setSuccess('✅ Profile saved successfully!')
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate('/Profile')
      }, 1500)
      
    } catch (err) {
      console.error('❌ Error saving profile:', err)
      
      // Handle 401 unauthorized
      if (err.response?.status === 401 || err.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setError('Session expired. Please sign in again.')
        setTimeout(() => navigate('/SingIn'), 2000)
      } else if (err.error) {
        setError(err.error)
      } else if (err.detail) {
        setError(err.detail)
      } else if (typeof err === 'string') {
        setError(err)
      } else {
        setError('Failed to save profile. Please try again.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className='text-gray-300 text-center py-20'>Loading profile data...</div>
  }

  return (
    <div className=' flex flex-row items-center gap-8 w-full h-150 px-10'>

      <div className=' flex flex-col items-center justify-between gap-2 w-1/4 -mt-45 '>
          <div>
            <img src={image} alt="" className=' w-70 h-70 border-2 border-gray-500 rounded-full'/>
          </div>
          <div className="flex flex-col items-center gap-4">

      <input  type="file"  accept="image/*"  ref={fileInputRef}  onChange={handleImageChange} className="hidden"/>

      <div className="flex gap-3">
        <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700">Upload new</button>

        <button onClick={handleRemove} className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">Remove</button>
      </div>
    </div>
        </div>

        <div className=' flex flex-col items-start gap-3 w-3/4'>
          
          {error && (
            <div className='w-full p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-sm'>
              {error}
            </div>
          )}
          
          {success && (
            <div className='w-full p-3 bg-green-900/30 border border-green-500 rounded-lg text-green-400 text-sm'>
              {success}
            </div>
          )}
          
          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <input 
                type="text" 
                name="username"
                placeholder='Enter UserName' 
                value={formData.username}
                onChange={handleInputChange}
                className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
              />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <input 
                type="text" 
                name="email"
                placeholder='Enter Mail ID' 
                value={formData.email}
                onChange={handleInputChange}
                className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
              />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><NotebookPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <textarea 
                name="bio"
                placeholder='Enter Your Bio . . . ' 
                value={formData.bio}
                onChange={handleInputChange}
                className='bg-gray-900 px-5 py-2 font-normal text-lg tracking-wide border-gray-500 rounded-xl border-1  w-150 text-gray-400'
              ></textarea>
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5 bg-gray-900 px-4 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-xl border-1  w-150 -mr-3 ml-6'>
            <label htmlFor="pronouns" className=' text-gray-400 font-normal text-lg tracking-wide'>Pronouns :</label>

              <select 
                name="pronouns" 
                id="pronouns"
                value={formData.pronouns}
                onChange={handleInputChange}
                className='bg-gray-900 text-gray-400 w-35 font-normal text-lg'
              >
                <option>Don't Specify</option>
                <option>They/Them</option>
                <option>She/Her</option>
                <option>He/Him</option>
                <option>Custom</option>
              </select>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input 
                type="text" 
                name="website"
                placeholder='Enter Url 1' 
                value={formData.website}
                onChange={handleInputChange}
                className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
              />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input 
                type="text" 
                name="company"
                placeholder='Enter Url 2' 
                value={formData.company}
                onChange={handleInputChange}
                className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
              />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input 
                type="text" 
                name="location"
                placeholder='Enter Url 3' 
                value={formData.location}
                onChange={handleInputChange}
                className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
              />
            </div>
          </div>

          <button 
            onClick={handleSave} 
            disabled={saving}
            className='bg-green-600 border-2 border-white rounded-xl text-white py-1 px-4 tracking-wide mt-3 font-medium text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

    </div>   
  )
}

export default Edit_Profile