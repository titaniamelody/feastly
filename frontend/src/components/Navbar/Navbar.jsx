import React, { useContext, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { ThemeContext } from '../../context/ThemeContext'
import {
  FiSearch,
  FiShoppingCart,
  FiShoppingBag,
  FiUser,
  FiShield,
  FiLogOut,
  FiSun,
  FiMoon,
  FiX,
} from 'react-icons/fi'
import { toast } from 'react-toastify'

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightSearchMatch = (text, query) => {
  const trimmed = query.trim()
  if (!trimmed) return text

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'))
  return parts.map((part, i) => {
    if (!part) return null
    if (part.toLowerCase() === trimmed.toLowerCase()) {
      return (
        <span key={`${i}-${part}`} className="search-match-highlight">
          {part}
        </span>
      )
    }
    return part
  })
}

const Navbar = ({ openAuth, setSkipSplash }) => {

  const [menu, setMenu] = useState("menu")
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const searchRef = useRef(null)
  const mobileSearchRef = useRef(null)
  const profileRef = useRef(null)
  const mobileProfileRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    getTotalCartAmount,
    token,
    setToken,
    food_list,
    getImageUrl,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    isAdmin,
    setIsAdmin,
    setCartItems,
    cartItems,
  } = useContext(StoreContext)
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  const storedUserName = localStorage.getItem("userName") || userName
  const storedEmail = localStorage.getItem("userEmail") || userEmail

  const profileDisplayName =
    storedUserName && !storedUserName.includes("@")
      ? storedUserName
      : "Feastly"

  const isAdminUser =
    token &&
    (localStorage.getItem("isAdmin") === "true" ||
      storedEmail === "titaniamelody@gmail.com")

  const isHomePage = location.pathname === '/'

  // Calculate total cart items count
  const getCartItemsCount = () => {
    let count = 0
    for (const itemId in cartItems) {
      count += cartItems[itemId]
    }
    return count
  }

  const closeSidebar = () => setSidebarOpen(false)

  const handleNavClick = (section) => {
    if (section) setMenu(section)
    closeSidebar()
    setProfileOpen(false)
  }

  const handleLogout = (e) => {
    console.log("handleLogout called with event:", e)
    e?.preventDefault()
    e?.stopPropagation()
    try {
      console.log("Starting logout process...")
      toast.success("Logged out")
      setToken("")
      setUserName("")
      setUserEmail("")
      setIsAdmin(false)
      setCartItems({})
      localStorage.removeItem("token")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("cartItems")
      console.log("LocalStorage cleared, closing menus...")
      setProfileOpen(false)
      closeSidebar()
      // Use setTimeout to ensure state updates complete
      setTimeout(() => {
        console.log("Navigating to home...")
        navigate("/")
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  const onLogoutClick = (e) => {
    console.log("onLogoutClick triggered")
    setProfileOpen(false)
    handleLogout(e)
  }

  useEffect(() => {
    if (!isHomePage) {
      setMenu('')
      return
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      const footer = document.getElementById('footer')
      const appDownload = document.getElementById('app-download')
      const exploreMenu = document.getElementById('explore-menu')

      if (window.scrollY < 100) {
        setMenu('home')
        return
      }

      if (footer && footer.offsetTop <= scrollPosition) {
        setMenu('contact-us')
      } else if (appDownload && appDownload.offsetTop <= scrollPosition) {
        setMenu('mobile-app')
      } else if (exploreMenu && exploreMenu.offsetTop <= scrollPosition) {
        setMenu('menu')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    if (sidebarOpen) {
      setProfileOpen(false)
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    const mobileMq = window.matchMedia('(max-width: 768px)')
    const handleBreakpointChange = (e) => {
      if (!e.matches) {
        setSidebarOpen(false)
        setProfileOpen(false)
      }
    }
    mobileMq.addEventListener('change', handleBreakpointChange)
    return () => mobileMq.removeEventListener('change', handleBreakpointChange)
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = food_list
        .filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, food_list])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const inDesktopProfile = profileRef.current?.contains(event.target)
      const inMobileProfile = mobileProfileRef.current?.contains(event.target)
      if (!inDesktopProfile && !inMobileProfile) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const runSearch = (query) => {
    if (!query.trim()) return

    if (typeof setSkipSplash === 'function') {
      setSkipSplash(true)
    }

    navigate(`/?search=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
    closeSidebar()
    window.dispatchEvent(new CustomEvent('search', { detail: query.trim() }))

    setTimeout(() => {
      const foodDisplay = document.getElementById('food-display')
      if (foodDisplay) {
        foodDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      runSearch(searchQuery)
    }
  }

  const handleResultClick = (item) => {
    setSearchResults([])
    runSearch(item.name)
  }

  const toggleSearch = () => {
    if (searchOpen && searchQuery.trim()) {
      runSearch(searchQuery)
    } else {
      setSearchOpen(!searchOpen)
    }
  }

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => handleNavClick('home')}
        className={isHomePage && menu === 'home' ? 'active' : ''}
      >
        home
      </Link>
      <a
        href={isHomePage ? '#explore-menu' : '/#explore-menu'}
        onClick={() => handleNavClick('menu')}
        className={isHomePage && menu === 'menu' ? 'active' : ''}
      >
        menu
      </a>
      <a
        href={isHomePage ? '#app-download' : '/#app-download'}
        onClick={() => handleNavClick('mobile-app')}
        className={isHomePage && menu === 'mobile-app' ? 'active' : ''}
      >
        mobile-app
      </a>
      <a
        href={isHomePage ? '#footer' : '/#footer'}
        onClick={() => handleNavClick('contact-us')}
        className={isHomePage && menu === 'contact-us' ? 'active' : ''}
      >
        contact us
      </a>
    </>
  )

  const searchBlock = (mobile = false) => (
    <div
      className={`navbar-search-container ${searchOpen && !mobile ? 'open' : ''} ${mobile ? 'navbar-search-container--mobile' : ''}`}
      ref={mobile ? mobileSearchRef : searchRef}
    >
      <input
        type="text"
        placeholder="Search foods..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
        className="navbar-search-input"
        onFocus={() => searchQuery && setSearchResults(searchResults)}
      />
      <div className="icon-wrapper">
        <FiSearch
          className={`navbar-search-icon-btn ${searchOpen && !mobile ? 'active' : ''}`}
          onClick={() => (mobile ? runSearch(searchQuery) : toggleSearch())}
        />
      </div>
      {searchResults.length > 0 && (
        <div className="search-dropdown">
          {searchResults.map((item) => (
            <div
              key={item._id}
              className="search-dropdown-item"
              onClick={() => handleResultClick(item)}
            >
              <img src={getImageUrl(item.image)} alt={item.name} />
              <div className="search-dropdown-item-info">
                <p className="search-dropdown-item-name">
                  {highlightSearchMatch(item.name, searchQuery)}
                </p>
                <p className="search-dropdown-item-category">
                  {highlightSearchMatch(item.category, searchQuery)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const themeToggle = (
    <div
      className="theme-toggle"
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FiSun className="navbar-icon" /> : <FiMoon className="navbar-icon" />}
    </div>
  )

  const authBlock = (mobile = false, showTheme = true) => (
    <>
      {token && (
        <div
          className={`navbar-search-icon icon-wrapper ${location.pathname === '/cart' ? 'active' : ''}`}
        >
          <Link to="/cart" onClick={closeSidebar}>
            <FiShoppingCart className="navbar-icon" />
          </Link>
          {getCartItemsCount() > 0 && <span className="cart-badge">{getCartItemsCount()}</span>}
        </div>
      )}
      {!token ? (
        <button
          type="button"
          onClick={() => {
            openAuth('Login')
            closeSidebar()
          }}
          className="navbar-signin-btn"
        >
          sign in
        </button>
      ) : mobile ? (
        <div className="navbar-sidebar-profile">
          <div className="navbar-profile-user-info">
            <div className="navbar-profile-user-avatar">
              {profileDisplayName.charAt(0).toUpperCase()}
            </div>
            <div className="navbar-profile-user-details">
              <p className="navbar-profile-user-name">{profileDisplayName}</p>
              <p className="navbar-profile-user-label">
                {isAdminUser ? 'Administrator' : 'Account'}
              </p>
            </div>
          </div>
          {isAdminUser && (
            <Link to="/admin" className="navbar-sidebar-action" onClick={closeSidebar}>
              <FiShield />
              <span>Admin Panel</span>
            </Link>
          )}
          <Link to="/myorders" className="navbar-sidebar-action" onClick={closeSidebar}>
            <FiShoppingBag />
            <span>Orders</span>
          </Link>
          <button type="button" className="navbar-sidebar-action" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div
          className={`navbar-profile icon-wrapper ${profileOpen ? 'active' : ''}`}
          ref={profileRef}
        >
          <FiUser
            className={`user-icon ${profileOpen ? 'active' : ''}`}
            onClick={() => setProfileOpen(!profileOpen)}
          />
          <div className={`navbar-profile-dropdown ${profileOpen ? 'open' : ''}`}>
            <div className="navbar-profile-user-info">
              <div className="navbar-profile-user-avatar">
                {profileDisplayName.charAt(0).toUpperCase()}
              </div>
              <div className="navbar-profile-user-details">
                <p className="navbar-profile-user-name">{profileDisplayName}</p>
                <p className="navbar-profile-user-label">
                  {isAdminUser ? 'Administrator' : 'Account'}
                </p>
              </div>
            </div>
            <hr />
            {isAdminUser && (
              <Link to="/admin">
                <li onClick={() => setProfileOpen(false)}>
                  <FiShield />
                  <p>Admin Panel</p>
                </li>
              </Link>
            )}
            <Link to="/myorders">
              <li onClick={() => setProfileOpen(false)}>
                <FiShoppingBag />
                <p>Orders</p>
              </li>
            </Link>
            <hr />
            <button 
              type="button" 
              className="navbar-profile-logout-btn" 
              onClick={onLogoutClick}
            >
              <FiLogOut />
              <p>Logout</p>
            </button>
          </div>
        </div>
      )}
      {showTheme && themeToggle}
    </>
  )

  return (
    <>
      <div className="navbar">
        <Link to="/" className="logo-text" onClick={() => handleNavClick('home')}>
          Feastly
        </Link>

        <ul className="navbar-menu navbar-desktop-only">{navLinks}</ul>

        <div className="navbar-right navbar-desktop-only" ref={searchRef}>
          {searchBlock(false)}
          {authBlock(false)}
        </div>

        <div className="navbar-mobile-controls navbar-mobile-only">
          {themeToggle}
          {!token && (
            <button
              type="button"
              className="navbar-signin-btn navbar-signin-btn--compact"
              onClick={() => openAuth('Login')}
            >
              sign in
            </button>
          )}
          {token && (
            <div className="navbar-search-icon icon-wrapper">
              <Link to="/cart" onClick={closeSidebar}>
                <FiShoppingCart className="navbar-icon" />
              </Link>
              {getCartItemsCount() > 0 && <span className="cart-badge">{getCartItemsCount()}</span>}
            </div>
          )}
          {token && (
            <div
              className="navbar-profile icon-wrapper navbar-mobile-profile"
              ref={mobileProfileRef}
            >
              <FiUser
                className={`user-icon ${profileOpen ? 'active' : ''}`}
                onClick={() => setProfileOpen(!profileOpen)}
              />
              <div className={`navbar-profile-dropdown navbar-profile-dropdown-mobile ${profileOpen ? 'open' : ''}`}>
                <div className="navbar-profile-user-info">
                  <div className="navbar-profile-user-avatar">
                    {profileDisplayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="navbar-profile-user-details">
                    <p className="navbar-profile-user-name">{profileDisplayName}</p>
                    <p className="navbar-profile-user-label">
                      {isAdminUser ? 'Administrator' : 'Account'}
                    </p>
                  </div>
                </div>
                <hr />
                {isAdminUser && (
                  <Link to="/admin" onClick={() => { setProfileOpen(false); closeSidebar() }}>
                    <li>
                      <FiShield />
                      <p>Admin Panel</p>
                    </li>
                  </Link>
                )}
                <Link to="/myorders" onClick={() => { setProfileOpen(false); closeSidebar() }}>
                  <li>
                    <FiShoppingBag />
                    <p>Orders</p>
                  </li>
                </Link>
                <hr />
                <button 
                  type="button" 
                  className="navbar-profile-logout-btn" 
                  onClick={onLogoutClick}
                >
                  <FiLogOut />
                  <p>Logout</p>
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span className="navbar-hamburger-icon" aria-hidden="true">
              ☰
            </span>
          </button>
        </div>
      </div>

      {createPortal(
        <>
          <div
            className={`navbar-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
            onClick={closeSidebar}
            aria-hidden={!sidebarOpen}
          />
          <aside
            className={`navbar-sidebar ${sidebarOpen ? 'open' : ''}`}
            inert={!sidebarOpen}
          >
            <div className="navbar-sidebar-header">
              <span className="navbar-sidebar-title">Menu</span>
              <button
                type="button"
                className="navbar-sidebar-close"
                onClick={closeSidebar}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <nav className="navbar-sidebar-nav">{navLinks}</nav>

            <div className="navbar-sidebar-section">
              <p className="navbar-sidebar-label">Search</p>
              {searchBlock(true)}
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  )
}

export default Navbar
