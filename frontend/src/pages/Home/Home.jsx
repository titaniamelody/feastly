import React, { useState, useEffect } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = ({ searchQuery = "" }) => {

  const [category, setCategory] = useState("All")
  const navigate = useNavigate()
  
  // Scroll to food item when page loads with search query
  useEffect(() => {
    if (searchQuery) {
      // Wait for components to render
      setTimeout(() => {
        // Try to find food items that match the search
        const foodItems = document.querySelectorAll('.food-item')
        foodItems.forEach(item => {
          const nameElement = item.querySelector('.food-item-name-rating p')
          if (nameElement && nameElement.textContent.toLowerCase().includes(searchQuery.toLowerCase())) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Add highlight class
            item.classList.add('highlighted')
            setTimeout(() => item.classList.remove('highlighted'), 2000)
          }
        })
      }, 100)
    }
  }, [searchQuery])

  useEffect(() => {
    if (searchQuery) {
      setCategory("All") // Reset category when searching
    }
  }, [searchQuery])

  const clearSearch = () => {
    navigate('/')
    window.dispatchEvent(new CustomEvent('clearSearch'))
  }

  return (
    <div>
      <Header />
      {searchQuery && (
        <div className="search-results-info">
          <p>Showing results for "{searchQuery}"</p>
          <button onClick={clearSearch}>Clear Search</button>
        </div>
      )}
      <div id="explore-menu">
        <ExploreMenu category={category} setCategory={setCategory}/>
      </div>
      <div>
        <FoodDisplay category={category} searchQuery={searchQuery}/>
      </div>
      <div>
        <AppDownload />
      </div>
    </div>
  )
}

export default Home
