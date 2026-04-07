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
  
  // Helper: Convert relative image paths to absolute URLs
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl  // Already absolute
    if (imageUrl.startsWith('/media/')) return `http://localhost:8000${imageUrl}`  // Already has /media/
    if (imageUrl.startsWith('user_profiles/')) return `http://localhost:8000/media/${imageUrl}`  // Add /media/
    return `http://localhost:8000/media/${imageUrl}`  // Fallback
  }
  
  // Form state
  const [image, setImage] = useState(null)  // No hardcoded fallback - use real user data
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

  // Debug: Log when image changes
  useEffect(() => {
    console.log('🖼️ [STATE] Image changed to:', image)
  }, [image])

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
        const absoluteUrl = getAbsoluteImageUrl(userData.profile_image)
        console.log('📸 Loaded user profile image:')
        console.log('   - Original:', userData.profile_image)
        console.log('   - Absolute URL:', absoluteUrl)
        setImage(absoluteUrl)
      } else {
        console.log('⚠️ No profile image found for user')
        setImage(null)  // Explicitly set to null to show error, not default
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
    console.log('🎬 handleImageChange triggered')
    console.log('   - Files in input:', e.target.files.length)
    if (file) {
      console.log('✅ File selected:')
      console.log('   - Name:', file.name)
      console.log('   - Size:', file.size, 'bytes')
      console.log('   - Type:', file.type)
      const preview = URL.createObjectURL(file);
      console.log('📋 Preview URL:', preview)
      setImage(preview)
      setImageFile(file)
      console.log('📌 State updated - imageFile should now be set')
    } else {
      console.log('⚠️ No file selected')
    }
  }

  const handleRemove = () => {
    console.log('🗑️ Removing image')
    setImage(null)  // Remove hardcoded fallback
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
      const token = localStorage.getItem('access_token')
      if (!token) {
        setError('Authentication required. Please sign in again.')
        navigate('/SingIn')
        return
      }

      console.log('💾 === SAVE STARTED ===')
      console.log('🖼️ Image file present:', !!imageFile)
      
      if (!imageFile) {
        console.log('⚠️ No image file - sending JSON update only')
      } else {
        console.log('📁 File details:')
        console.log('   - Name:', imageFile.name)
        console.log('   - Size:', imageFile.size, 'bytes')
        console.log('   - Type:', imageFile.type)
      }

      // Build FormData with ALL fields
      const sendData = new FormData()
      if (imageFile) {
        sendData.append('profile_image', imageFile)
      }
      sendData.append('bio', formData.bio)
      sendData.append('phone_number', formData.phone_number)
      sendData.append('website', formData.website)
      sendData.append('company', formData.company)
      sendData.append('location', formData.location)

      console.log('📦 FormData prepared:')
      for (let [key, value] of sendData) {
        if (value instanceof File) {
          console.log(`   - ${key}: File(${value.name}, ${value.size}b)`)
        } else {
          console.log(`   - ${key}: "${value}"`)
        }
      }

      // Use DIRECT FETCH - no axios interceptors
      console.log('🌐 Sending to: http://localhost:8000/api/profiles/me/')
      const response = await fetch('http://localhost:8000/api/profiles/me/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // DO NOT SET Content-Type - let fetch set it automatically for FormData
        },
        body: sendData
      })

      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Response error:', errorData)
        setError(`Upload failed: ${response.status} - ${JSON.stringify(errorData)}`)
        setSaving(false)
        return
      }

      const result = await response.json()
      console.log('✅ Response received:')
      console.log('   - Keys:', Object.keys(result))
      console.log('   - Full response:', result)

      // Get the new image URL
      const newImageUrl = result.user?.profile_image || result.profile_image
      console.log('🖼️ New image URL from response:')
      console.log('   - Raw:', newImageUrl)
      
      if (newImageUrl) {
        const absoluteUrl = getAbsoluteImageUrl(newImageUrl)
        console.log('   - Converted to absolute:', absoluteUrl)
        setImage(absoluteUrl)
        setImageFile(null)  // Clear the preview
        setSuccess('✅ Profile saved successfully!')
        
        // Broadcast update to other components
        localStorage.setItem('profileUpdated', JSON.stringify({
          timestamp: Date.now(),
          imageUrl: newImageUrl
        }))
        
        console.log('✅ === SAVE COMPLETED SUCCESSFULLY ===')
        
        // Reload profile after a short delay
        setTimeout(() => {
          window.location.href = '/Profile?t=' + Date.now()
        }, 1000)
      } else {
        console.error('⚠️ No profile_image in response')
        setError('Upload succeeded but no image URL in response')
      }

    } catch (err) {
      console.error('❌ === SAVE ERROR ===')
      console.error('Error:', err)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      setError('Error: ' + (err.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className='text-gray-300 text-center py-20'>Loading profile data...</div>
  }

  return (
    <div className='flex flex-row items-center gap-8 w-full h-150 px-10'>
      {/* LEFT COLUMN - Profile Picture */}
      <div className='flex flex-col items-center justify-between gap-2 w-1/4 -mt-45'>
        <div>
          {image ? (
            <img 
              src={image} 
              alt="Profile preview" 
              className='w-70 h-70 border-2 border-gray-500 rounded-full object-cover'
              onError={(e) => console.error('Image failed to load:', image)}
              onLoad={() => console.log('Image loaded:', image)}
            />
          ) : (
            <div className='w-70 h-70 border-2 border-gray-500 rounded-full bg-gray-800 flex items-center justify-center text-gray-400'>
              No image
            </div>
          )}
        </div>
        
        <div className='flex flex-col items-center gap-4 w-full'>
          <input  type="file"  accept="image/*"  ref={fileInputRef}  onChange={handleImageChange} className="hidden"/>

          {imageFile && (
            <div className='w-full bg-blue-900/40 border border-blue-500 rounded-lg p-2 text-center'>
              <p className='text-blue-300 text-xs font-medium'>File selected: {imageFile.name}</p>
              <p className='text-blue-200 text-xs'>({(imageFile.size / 1024).toFixed(2)} KB)</p>
            </div>
          )}

          <div className='flex gap-3 flex-wrap justify-center w-full'>
            <button 
              onClick={() => fileInputRef.current.click()} 
              className='px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700 transition'>
               Upload new
            </button>
            <button 
              onClick={handleRemove} 
              className='px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-300 hover:bg-gray-900/50 transition'>
              Remove
            </button>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Form */}
      <div className='flex flex-col items-start gap-3 w-3/4'>
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
        
        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
          <input 
            type="text" 
            name="username"
            placeholder='Enter UserName' 
            value={formData.username}
            onChange={handleInputChange}
            className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
          />
        </div>

        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
          <input 
            type="text" 
            name="email"
            placeholder='Enter Mail ID' 
            value={formData.email}
            onChange={handleInputChange}
            className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
          />
        </div>

        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><NotebookPen color="#ffffff" strokeWidth={1.25} /></div>
          <textarea 
            name="bio"
            placeholder='Enter Your Bio . . . ' 
            value={formData.bio}
            onChange={handleInputChange}
            className='bg-gray-900 px-5 py-2 font-normal text-lg tracking-wide border-gray-500 rounded-xl border-1 w-150 text-gray-400'
          />
        </div>

        <div className='flex flex-row items-center justify-between gap-1.5 bg-gray-900 px-4 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-xl border-1 w-150 -mr-3 ml-6'>
          <label htmlFor="pronouns" className='text-gray-400 font-normal text-lg tracking-wide'>Pronouns :</label>
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

        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><Link2 strokeWidth={1.25} /></div>
          <input 
            type="text" 
            name="website"
            placeholder='Enter Website' 
            value={formData.website}
            onChange={handleInputChange}
            className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
          />
        </div>

        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><Link2 strokeWidth={1.25} /></div>
          <input 
            type="text" 
            name="company"
            placeholder='Enter Company' 
            value={formData.company}
            onChange={handleInputChange}
            className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
          />
        </div>

        <div className='flex flex-row items-center justify-between gap-1.5'>
          <div><Link2 strokeWidth={1.25} /></div>
          <input 
            type="text" 
            name="location"
            placeholder='Enter Location' 
            value={formData.location}
            onChange={handleInputChange}
            className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' 
          />
        </div>

        {imageFile && (
          <div className='w-full bg-green-900/30 border border-green-500 rounded-lg p-3 mb-2'>
            <p className='text-green-400 text-sm font-medium'>Ready to upload: <span className='font-bold'>{imageFile.name}</span></p>
            <p className='text-green-300 text-xs mt-1'>Click Save to upload this image</p>
          </div>
        )}

        <div className='flex gap-2 mt-4'>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className='flex-1 bg-green-600 border-2 border-white rounded-xl text-white py-2 px-4 tracking-wide font-medium text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition'
          >
            {saving ? ' Saving...' : imageFile ? 'Save & Upload' : ' Save Changes'}
          </button>
          
          
        </div>
      </div>
    </div>
  )
}

export default Edit_Profile