import React, { useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const sliderData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    title: "Best Pizza in Town",
    subtitle: "Hot, fresh, and delivered to your door",
    cta: "Order Now"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    title: "Start Your Morning Right",
    subtitle: "Delicious breakfast options await",
    cta: "Explore"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    title: "Premium Quality Meals",
    subtitle: "Made with love, served with care",
    cta: "View Menu"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
    title: "Fresh & Healthy",
    subtitle: "Nutritious food for a better you",
    cta: "Try It"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=80",
    title: "Taste Italy at Home",
    subtitle: "Authentic recipes, authentic taste",
    cta: "Order"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&q=80",
    title: "Sweet Indulgence",
    subtitle: "Treat yourself to something delicious",
    cta: "Browse"
  }
]

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='header-slider'>
      <div className='slider-wrapper'>
        {sliderData.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-overlay">
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Link to="/" className="slide-cta">{slide.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="slider-nav prev" onClick={prevSlide}>
        <FiChevronLeft size={24} />
      </button>
      <button className="slider-nav next" onClick={nextSlide}>
        <FiChevronRight size={24} />
      </button>
      
      <div className="slider-dots">
        {sliderData.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Header
