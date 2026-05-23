import React, { useContext } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../../context/ThemeContext'
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi'

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  
  return (
    <div className='navbar'>
      <button className='hamburger-menu' onClick={toggleSidebar}>
        <FiMenu size={24} />
      </button>
      <Link to="/" className='logo-text'>Feastly</Link>
      <div className='navbar-right'>
        <button className='theme-toggle' onClick={toggleTheme} title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
          {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
        </button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar
