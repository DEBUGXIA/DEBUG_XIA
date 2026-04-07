import React, { useState, useEffect } from 'react'
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Navbar2 from './components/Navbar2'

import Home from './pages/Home'
import Features from './pages/Features'
import How_It_Works from './pages/How_It_Works'
import Dashboard from './pages/Dashboard'
import SingIn from './pages/SingIn'
import Get_Started from './pages/Get_Started'
import About from './pages/About'
import Not_Found from './pages/Not_Found'
import Footer from './components/Footer'
import Terms_and_con from './pages/Terms_and_con'
import Privacy_Policy from './pages/Privacy_Policy'
import Home2 from './pages2.o/Home2'
import Profile from './pages2.o/Profile'
import Terminal2 from './pages2.o/Terminal2'
import Error_History from './pages2.o/Error_History'
import Edit_Profile from './pages2.o/Edit_Profile'
import Optimizer from './pages2.o/Optimizer'
import Dashboard2 from './pages2.o/Dashboard2'
import Footer2 from './components/Footer2'
import About2 from './pages2.o/About2'
import { authAPI, setAutoLogoutCallback, startHealthCheck, stopHealthCheck } from './services/api'


// Protected Route (only for Home2 now)
const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/SingIn" />;
};



// Public Route
const PublicRoute = ({ isAuth, children }) => {
  return !isAuth ? children : <Navigate to="/Home2" />;
};

const App = () => {

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is already authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuth(true);
    }
    setLoading(false);
  }, []);

  // Setup auto-logout callback when component mounts
  useEffect(() => {
    const handleAutoLogout = () => {
      console.log('🔴 [APP] Auto-logout triggered - redirecting to sign in...');
      setIsAuth(false);
      authAPI.logout();
      navigate('/SingIn', { replace: true });
    };
    
    setAutoLogoutCallback(handleAutoLogout);
    
    return () => {
      setAutoLogoutCallback(null);
    };
  }, [navigate]);

  // Start health checks when user is authenticated
  useEffect(() => {
    if (isAuth) {
      console.log('🟢 [APP] User authenticated - starting health checks');
      startHealthCheck(30000); // Check every 30 seconds
      
      return () => {
        console.log('🟡 [APP] User logged out - stopping health checks');
        stopHealthCheck();
      };
    }
  }, [isAuth]);

  // Navbar2 only for Home2 (after login)
  const afterLoginRoutes = [
  "/Home2",
  "/Profile",
  "/Terminal2",
  "/Error_History",
  "/Edit_Profile",
  "/Optimizer",
  "/Dashboard2",
  "/About2"
];

const isAfterLoginRoute = afterLoginRoutes.includes(location.pathname);

if (loading) {
  return (
    <div className='bg-[url(/public/Bg3.svg)] h-screen text-white flex items-center justify-center'>
      <p>Loading...</p>
    </div>
  );
}

  return (
    <div className='bg-[url(/public/Bg3.svg)] h-screen text-white overflow-x-hidden scroll-smooth min-h-screen overflow-y-auto bg-cover  w-[100%] aspect-[16/9]'>

  

      {/* CONDITIONAL NAVBAR */}
      {isAuth && isAfterLoginRoute ? (
        <Navbar2 setIsAuth={setIsAuth} />
      ) : (
        <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      )}

      

      <Routes>

        {/* PUBLIC (BEFORE LOGIN) */}
        <Route path='/' element={<Home />} />
        <Route path='/Features' element={<Features />} />
        <Route path='/How_It_Works' element={<How_It_Works />} />
        <Route path='/Get_Started' element={<Get_Started setIsAuth={setIsAuth} />} />
        <Route path='/About' element={<About />} />
        <Route path='/Dashboard' element={<Dashboard />} />

        {/* SIGN IN */}
        <Route
          path='/SingIn'
          element={
            <PublicRoute isAuth={isAuth}>
              <SingIn setIsAuth={setIsAuth} />
            </PublicRoute>
          }
        />

        

        {/* AFTER LOGIN ONLY */}
        <Route
          path='/Home2'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Home2 />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Profile'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Terminal2'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Terminal2 />
            </ProtectedRoute>
          }
        />
        <Route
          path='/Error_History'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Error_History/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/Edit_Profile'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Edit_Profile/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/Dashboard2'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard2/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/Optimizer'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Optimizer/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/About2'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <About2/>
            </ProtectedRoute>
          }
        />

        {/*  POLICIES */}
        <Route path='/Terms_and_con' element={<Terms_and_con />} />
        <Route path='/Privacy_Policy' element={<Privacy_Policy />} />
        

        {/*  NOT FOUND */}
        <Route path='*' element={<Not_Found />} />

      </Routes>

      {isAuth && isAfterLoginRoute ? (
        <Footer2 setIsAuth={setIsAuth} />
      ) : (
        <Footer isAuth={isAuth} setIsAuth={setIsAuth} />
      )}

    </div>
  )
}

export default App