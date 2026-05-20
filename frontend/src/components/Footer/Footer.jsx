import React from 'react'
import './Footer.css'
import { assets } from '../../assets/frontend_assets/assets'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const location = useLocation()
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <h2 className="logo-text">Feastly</h2>
            <p>Delicious food delivered fresh to your doorstep. Order your favorite meals from the best local restaurants and enjoy quality dining at home.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li onClick={scrollToTop}>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+1-212-456-7890</li>
                <li>contact@feastly.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © feastly.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
