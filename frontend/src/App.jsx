import React, { useState, useEffect, useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route, useSearchParams, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import ForgotPasswordPopup from './components/ForgotPasswordPopup/ForgotPasswordPopup'
import ResetPasswordPopup from './components/ResetPasswordPopup/ResetPasswordPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import FoodDetail from './pages/FoodDetail/FoodDetail'
import SplashScreen from './components/SplashScreen/SplashScreen'
import { StoreContext } from './context/StoreContext'

// Admin Components
import AdminLayout from './admin/AdminLayout'
import Add from './admin/pages/Add/Add'
import List from './admin/pages/List/List'
import Orders from './admin/pages/Order/Orders'
import Categories from './admin/pages/Categories/Categories'
import './admin/admin.css'

const AuthGuard = ({ children }) => {
  const { token } = useContext(StoreContext)
  if (!token) return <Navigate to="/" replace />
  return children
}

const AdminGuard = ({ children }) => {
  const { token, isAdmin } = useContext(StoreContext)
  if (!token || !isAdmin) return <Navigate to="/" replace />
  return children
}

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [loginMode, setLoginMode] = useState('Login')

  const openAuth = (mode = 'Login') => {
    setLoginMode(mode)
    setShowLogin(true)
  }

  const closeLogin = () => {
    setShowLogin(false)
    setLoginMode('Login')
  }

  const setShowLoginState = (show) => {
    if (show) openAuth('Login')
    else closeLogin()
  }
  const [showForgot, setShowForgot] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSplash, setShowSplash] = useState(true)
  const [skipSplash, setSkipSplash] = useState(false)
  const [splashShownOnce, setSplashShownOnce] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const query = searchParams.get('search')
    if (query) {
      setSearchQuery(query)
    } else {
      setSearchQuery("")
    }
    
    const handleSearch = (e) => {
      setSearchQuery(e.detail)
    }
    
    const handleClearSearch = () => {
      setSearchQuery("")
    }
    
    window.addEventListener('search', handleSearch)
    window.addEventListener('clearSearch', handleClearSearch)
    return () => {
      window.removeEventListener('search', handleSearch)
      window.removeEventListener('clearSearch', handleClearSearch)
    }
  }, [searchParams])

  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Hide splash screen on admin routes
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin')
    
    if (isAdminRoute) {
      setShowSplash(false)
      setSplashShownOnce(true)
    }
  }, [location.pathname])

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
    {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} isDataLoaded={true} />}
    {showLogin && <LoginPopup setShowLogin={setShowLoginState} initialMode={loginMode} setShowForgot={setShowForgot} />}
    {showForgot && <ForgotPasswordPopup setShowForgot={setShowForgot} setShowReset={setShowReset} setResetEmail={setResetEmail} setShowLogin={setShowLoginState} />}
    {showReset && <ResetPasswordPopup setShowReset={setShowReset} setShowForgot={setShowForgot} setShowLogin={setShowLoginState} resetEmail={resetEmail} />}
    
    {!isAdminRoute && <div className='navbar-full-width'><Navbar openAuth={openAuth} setSkipSplash={setSkipSplash} /></div>}
    <div className={isAdminRoute ? '' : 'app'}>
      <Routes>
        <Route path='/' element={<Home searchQuery={searchQuery} />} />
        <Route path='/cart' element={<AuthGuard><Cart /></AuthGuard>} />
        <Route path='/order' element={<AuthGuard><PlaceOrder /></AuthGuard>} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/myorders' element={<AuthGuard><MyOrders /></AuthGuard>} />
        <Route path='/food/:foodId' element={<FoodDetail />} />
        <Route path='/admin/*' element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Navigate to="add" replace />} />
          <Route path='add' element={<Add />} />
          <Route path='list' element={<List />} />
          <Route path='orders' element={<Orders />} />
          <Route path='categories' element={<Categories />} />
        </Route>
      </Routes>
    </div>
    {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
