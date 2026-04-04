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
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-400 text-white font-medium"
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