import React, { useContext } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link } from 'react-router-dom'
import { ThemeContext } from '../../../context/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)
  
  return (
    <div className='navbar'>
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
