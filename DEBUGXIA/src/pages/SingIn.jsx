import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/config';

const SingIn = ({ setIsAuth }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.signin(email, password);
      
      if (response.access && response.refresh) {
        // Save tokens to localStorage
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);
        
        setIsAuth(true);
        
        setTimeout(() => {
          navigate("/Home2");
        }, 800);
      } else {
        setError(response.non_field_errors?.[0] || 'Login failed');
      }
    } catch (err) {
      setError('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  const directions = [
    { x: -800, y: -400 }, { x: 800, y: -400 },
    { x: -900, y: 300 },  { x: 900, y: 300 },
    { x: -700, y: 500 },  { x: 700, y: 500 },
    { x: -1000, y: 0 },   { x: 1000, y: 0 },
    { x: -600, y: -600 }, { x: 600, y: -600 },
    { x: -1100, y: 200 }, { x: 1100, y: -200 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center gap-20 bg-[#020617] overflow-hidden relative">

      {/* 🌌 Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-black to-cyan-900 opacity-30 animate-pulse" />

      {/* ✨ Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-white/10 to-cyan-300/20 blur-3xl"
      />

      {/* 🦋 CENTER (UI) BURST */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

        {[...Array(25)].map((_, i) => {
          const dir = directions[i % directions.length];

          return (
            <motion.img
              key={i}
              src="/R.svg"
              alt="butterfly"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0.6,
              }}
              animate={{
                x: dir.x,
                y: dir.y,
                rotate: [0, 20, -15, 10, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 6,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              className="absolute drop-shadow-[0_0_25px_rgba(96,165,250,0.8)]"
              style={{
                width: "400px",
                height: "400px",
              }}
            />
          );
        })}

      </div>

      {/* Floating blur */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-[360px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6 tracking-wide">
          SingIn Your Account
        </h2>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

          <motion.input
            variants={item}
            type="email"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
          />

          <motion.input
            variants={item}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.07, boxShadow: "0px 0px 20px #3b82f6" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium disabled:opacity-50"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-blue-400 hover:underline">
            <Link to='/Get_Started'>Sign Up</Link>
          </span>
        </p>
      </motion.div>

      {/* Side Text */}
      <div className='flex items-center justify-center font-semibold text-7xl font-serif'>
        <h1>
          <motion.span
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome <br />
            <span className='px-25'>Back</span>
          </motion.span>
        </h1>
      </div>

    </div>
  );
}

export default SingIn;