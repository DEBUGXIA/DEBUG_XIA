import React, { useState, useRef, useEffect } from "react";
import {Link, useNavigate} from 'react-router-dom'
import Dashboard2 from "../../pages2.o/Dashboard2";
import Profile from "../../pages2.o/Profile";
import { authAPI } from "../../services/api";

const Profileh = ({ setIsAuth }) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    
    // Fetch user data immediately on mount - no delays!
    console.log('🚀 Profileh (navbar) mounted - fetching fresh user data immediately...')
    fetchUserData();
    
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Refetch profile data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Navbar profile: Page became visible, refreshing...')
        setRefreshTrigger(prev => prev + 1)
        fetchUserData()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Refetch when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Navbar: Window focused, refreshing profile...')
      setRefreshTrigger(prev => prev + 1)
      fetchUserData()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Listen for profile update signals from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'profileUpdated') {
        console.log('🔄 Navbar: Profile update detected, refreshing...')
        setRefreshTrigger(prev => prev + 1)
        fetchUserData()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check localStorage periodically for same-tab updates
    const interval = setInterval(() => {
      const profileUpdate = localStorage.getItem('profileUpdated')
      if (profileUpdate) {
        console.log('🔄 Navbar: Profile update detected via polling, refreshing...')
        setRefreshTrigger(prev => prev + 1)
        fetchUserData()
      }
    }, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('⚠️ No access token found in navbar');
        return;
      }
      console.log('📡 Navbar: Fetching current user...')
      const userData = await authAPI.getCurrentUser();
      console.log('✅ Navbar: User data received:', userData)
      console.log('   - Username:', userData.username)
      console.log('   - Profile image:', userData.profile_image)
      setUser(userData);
    } catch (error) {
      console.error('❌ Navbar: Error fetching user:', error);
      if (error.code === 'user_not_found' || error.detail === 'User not found') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      console.log('🔓 [LOGOUT] Initiating user logout...');
      authAPI.logout();
      console.log('✅ [LOGOUT] Auth state cleared');
      setIsAuth(false);
      console.log('✅ [LOGOUT] isAuth set to false');
      navigate('/SingIn', { replace: true });
      console.log('✅ [LOGOUT] Redirected to sign in');
    } catch (error) {
      console.error('❌ [LOGOUT] Logout error:', error);
      // Still redirect even if logout fails
      setIsAuth(false);
      navigate('/SingIn', { replace: true });
    }
  };

  // Helper: Convert relative image paths to absolute URLs
  const getAbsoluteImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('http')) return imageUrl  // Already absolute
    if (imageUrl.startsWith('/media/')) return `http://localhost:8000${imageUrl}`  // Already has /media/
    if (imageUrl.startsWith('user_profiles/')) return `http://localhost:8000/media/${imageUrl}`  // Add /media/
    return `http://localhost:8000/media/${imageUrl}`  // Fallback
  }

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User';
  const email = user?.email || '';
  // Add cache-busting query parameter to force fresh image load with refresh trigger
  const timestamp = Date.now() + refreshTrigger
  const profileImageUrl = user?.profile_image ? `${getAbsoluteImageUrl(user.profile_image)}?t=${timestamp}` : null

  return (
    <div className="relative" ref={dropdownRef}>
      
  
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="profile" onClick={() => setOpen(!open)} className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 hover:scale-105 transition mr-20" onError={(e) => {
          console.error('❌ Profile image failed to load:', profileImageUrl)
        }}/>
      ) : (
        <div className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 hover:scale-105 transition mr-20 bg-gray-700 flex items-center justify-center text-xs text-gray-400" onClick={() => setOpen(!open)}>
          ?
        </div>
      )}

  
      {open && (
        <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#161b22] border border-white/10 shadow-xl backdrop-blur-xl p-2 z-50">

          <div className="px-3 py-2 border-b border-white/10">
            <p className="text-sm font-semibold text-white">{fullName}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>

          <ul className="py-2 text-sm text-gray-300">
            <li className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
              <Link to='/Profile'>Your Profile</Link>
            </li>
            <li className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
              <Link to='/Dashboard2'>Dashboard</Link>
            </li>
          </ul>

          <div className="border-t border-white/10 mt-2 pt-2">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              Sign out
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Profileh;