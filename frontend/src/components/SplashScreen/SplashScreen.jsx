import React, { useEffect, useState } from 'react'
import './SplashScreen.css'
import { gsap } from 'gsap'

const SplashScreen = ({ onComplete, isDataLoaded }) => {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setAnimationComplete(true)
      }
    })

    // Logo animation
    tl.fromTo('.splash-logo', 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "back.out(1.7)" }
    )
    .fromTo('.splash-tagline',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo('.splash-food-icon',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    )

  }, [])

  // When animation is complete AND data is loaded, fade out
  useEffect(() => {
    if (animationComplete && isDataLoaded) {
      gsap.to('.splash-screen', {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: onComplete
      })
    }
  }, [animationComplete, isDataLoaded, onComplete])

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1 className="splash-logo">Feastly 🍴</h1>
        <p className="splash-tagline">Delicious moments, delivered</p>
        <div className="splash-food-icons">
          <span className="splash-food-icon" style={{animationDelay: '0s'}}>🍕</span>
          <span className="splash-food-icon" style={{animationDelay: '0.1s'}}>🍔</span>
          <span className="splash-food-icon" style={{animationDelay: '0.2s'}}>🍟</span>
          <span className="splash-food-icon" style={{animationDelay: '0.3s'}}>🌮</span>
          <span className="splash-food-icon" style={{animationDelay: '0.4s'}}>🍜</span>
        </div>
      </div>
      <div className="splash-loader">
        <div className="splash-loader-bar"></div>
      </div>
    </div>
  )
}

export default SplashScreen
