import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Get_Started = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.signup(formData);
      setIsAuth(true);
      setTimeout(() => {
        navigate("/Home2");
      }, 800);
    } catch (err) {
      setError(err.email?.[0] || err.detail || 'Signup failed. Please try again.');
      console.error('Signup error:', err);
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

  return (
    <div className="min-h-screen flex items-center justify-center gap-20 overflow-hidden">
      <div className='bg-blue flex items-center justify-center font-semibold text-7xl font-serif gap-3'>
        <h1>
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block tracking-wide"
          >
            Welcome
          </motion.span>
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className=" w-[360px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSignup}>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            <motion.input
              variants={item}
              type="text"
              name="first_name"
              placeholder="First Name"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.first_name}
              onChange={handleChange}
            />

            <motion.input
              variants={item}
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.last_name}
              onChange={handleChange}
            />

            <motion.input
              variants={item}
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <motion.input
              variants={item}
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <motion.input
              variants={item}
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <motion.input
              variants={item}
              type="password"
              name="password_confirm"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
              value={formData.password_confirm}
              onChange={handleChange}
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
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-300 text-white font-medium tracking-wide disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-center text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
            <Link to='/SingIn'>Sign In</Link>
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Get_Started;