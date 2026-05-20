import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category, searchQuery = ""}) => {

    const {food_list, getImageUrl} = useContext(StoreContext)

    if (!food_list || !Array.isArray(food_list)) {
        return (
            <div className='food-display' id='food-display'>
                <h2>Top dishes near you</h2>
                <div className="no-results">
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    // Filter foods based on search query
    const filteredFoods = food_list.filter((item) => {
        const matchesCategory = category === 'All' || category === item.category
        const itemName = item.name || ''
        const itemDesc = item.description || ''
        const itemCategory = item.category || ''
        const matchesSearch = searchQuery === "" || 
            itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            itemDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            itemCategory.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

  return (
    <div className='food-display' id='food-display'>
      <h2>{searchQuery ? `Search Results for "${searchQuery}"` : "Top dishes near you"}</h2>
      {filteredFoods.length === 0 ? (
        <div className="no-results">
            <p>No food items found matching your search.</p>
        </div>
      ) : (
        <div className="food-display-list" key={category}>
            {filteredFoods.map((item, index)=>{
            return <FoodItem key={`${item._id}-${category}`} id={item._id} name={item.name} description={item.description} price={item.price} image={getImageUrl(item.image)} category={item.category} ingredients={item.ingredients} prepTime={item.prepTime} servings={item.servings} method={item.method} />
            })}
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
