import React from 'react';
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const SignIn = ({ setIsAuth }) => {

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuth(true);

    setTimeout(() => {
      navigate("/Home2");
    }, 1200);
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
    <div className="min-h-screen flex items-center justify-center gap-20 overflow-hidden relative bg-black">

      {/* 🎥 Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/public/Bg2.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-white/10 to-cyan-300/20 blur-3xl z-0"
      />

      {/* Floating blur */}
      <motion.div
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px] z-0"
      />

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute w-[400px] h-[400px] bg-cyan-400/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px] z-0"
      />

      {/*Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, x: -100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-[360px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <h2 className="text-white text-2xl font-semibold text-center mb-6 tracking-wide">
          Sign In Your Account
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <motion.input
            variants={item}
            type="email"
            placeholder="Email or Username"
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
          />

          <motion.input
            variants={item}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white focus:border-blue-400 outline-none"
          />
        </motion.div>

        <motion.button
          onClick={handleLogin}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.07, boxShadow: "0px 0px 20px #3b82f6" }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium"
        >
          Sign In
        </motion.button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-blue-400 hover:underline">
            <Link to='/Get_Started'>Sign Up</Link>
          </span>
        </p>
      </motion.div>

      {/* Side Text */}
      <div className='z-10 flex items-center justify-center font-semibold text-7xl font-serif'>
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