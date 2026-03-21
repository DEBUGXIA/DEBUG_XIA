import React from 'react'
import { motion } from "framer-motion";
import SingIn from './SingIn'
import { Link } from 'react-router-dom';

const Get_Started = () => {

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
    <div className="min-h-screen flex items-center justify-center gap-20  bg-[#020617] overflow-hidden relative">

      <div className='bg-blue flex items-center justify-center
      font-semibold text-7xl font-serif gap-3'>
        <h1>
  <motion.span
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="inline-block tracking-wide"
  >
    Wellcome
  </motion.span>
</h1>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-black to-cyan-900 opacity-30 animate-pulse" />

      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-[360px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6  tracking-wide">
          Create Account
        </h2>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">

          <motion.input
            variants={item}
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
          />

          <motion.input
            variants={item}
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
          />

          <motion.input
            variants={item}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none transition"
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.07, boxShadow: "0px 0px 20px #3b82f6" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium tracking-wide"
        >
          Sign Up
        </motion.button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer hover:underline">
            <Link to='/SingIn'>Sing In</Link>
          </span>
        </p>
      </motion.div>
    </div>
  );
}


export default Get_Started