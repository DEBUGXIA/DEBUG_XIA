import React, { useState, useRef, useEffect } from "react";
import {Link} from 'react-router-dom'
import Dashboard2 from "../../pages2.o/Dashboard2";
import Profile from "../../pages2.o/Profile";
import { authAPI } from "../../services/api";

const Profileh = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    
    // Fetch user data
    fetchUserData();
    
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found');
        return;
      }
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      // If token is invalid, clear it
      if (error.code === 'user_not_found' || error.detail === 'User not found') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  };

  const fullName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'User';
  const email = user?.email || '';

  return (
    <div className="relative" ref={dropdownRef}>
      
  
      <img src="/public/User.jpeg" alt="profile" onClick={() => setOpen(!open)}  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white/20 hover:scale-105 transition mr-20"/>

  
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
            <button className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg">
              <Link to='/'>Sign out</Link>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Profileh;