import React, { useState } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'

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
import Refund_Policy from './pages/Refund_Policy'
import Home2 from './pages2.o/Home2'
import Profile from './pages2.o/Profile'
import Dashboard2 from './pages2.o/Dashboard2'
import Error_History from './pages2.o/Error_History'

// Protected Route (only for Home2 now)
const ProtectedRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/SingIn" />;
};

const ProtectedRoute2 = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/Get_started" />;
};

// Public Route
const PublicRoute = ({ isAuth, children }) => {
  return !isAuth ? children : <Navigate to="/Home2" />;
};

const App = () => {

  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  // Navbar2 only for Home2 (after login)
  const afterLoginRoutes = ["/Home2", "/Profile","/Dashboard2","/Error_History"];

const isAfterLoginRoute = afterLoginRoutes.some(route =>
  location.pathname.startsWith(route)
);


  return (
    <div className='bg-[url(/public/Bg.svg)] h-screen text-white relative overflow-x-hidden scroll-smooth min-h-screen overflow-y-auto bg-cover  w-[100%] aspect-[16/9]'>

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

        <Route
          path='/Get_Started'
          element={
            <PublicRoute isAuth={isAuth}>
              <Get_Started setIsAuth={setIsAuth} />
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
          path='/Dashboard2'
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard2 />
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

        {/*  POLICIES */}
        <Route path='/Terms_and_con' element={<Terms_and_con />} />
        <Route path='/Privacy_Policy' element={<Privacy_Policy />} />
        <Route path='/Refund_Policy' element={<Refund_Policy />} />

        {/*  NOT FOUND */}
        <Route path='*' element={<Not_Found />} />

      </Routes>

      <Footer />

    </div>
  )
}

export default App