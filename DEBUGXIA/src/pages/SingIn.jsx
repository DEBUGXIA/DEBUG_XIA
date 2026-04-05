import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const SignIn = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Starting signin with:', email);
      const result = await authAPI.signin(email, password);
      console.log('✓ Signin successful');
      console.log('✓ Access token:', result.access?.substring(0, 20) + '...');
      console.log('✓ Token in localStorage:', localStorage.getItem('access_token')?.substring(0, 20) + '...');
      
      // Wait a bit to ensure token is set, then navigate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✓ Setting isAuth to true and navigating...');
      setIsAuth(true);
      
      navigate("/Home2", { replace: true });
    } catch (err) {
      console.error('❌ Signin failed:', err);
      // Handle various error formats
      if (err.detail) {
        setError(err.detail);
      } else if (err.email) {
        setError(err.email);
      } else if (err.password) {
        setError(err.password);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Invalid email or password');
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center gap-20 overflow-hidden">
      {/*Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className=" w-[360px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6 tracking-wide">
          Sign In Your Account
        </h2>

        <form onSubmit={handleLogin}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.input
              variants={item}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <motion.input
              variants={item}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm mt-3 text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.07, boxShadow: "0px 0px 20px #3b82f6" }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-300 text-white font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-blue-400 hover:underline">
            <Link to='/Get_Started'>Sign Up</Link>
          </span>
        </p>
      </motion.div>

      {/* Side Text */}
      <div className=' flex items-center justify-center font-semibold text-7xl font-serif'>
        <h1>
          <motion.span
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide text-white"
          >
            Welcome<br />
            Back
          </motion.span>
        </h1>
      </div>
    </div>
  );
};

export default SignIn;