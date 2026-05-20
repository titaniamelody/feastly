import React, { useContext, useEffect, useState, useRef } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const FoodItem = ({id, name, price, description, image, category, ingredients, prepTime, servings, method}) => {

    const {cartItems, addToCart, removeFromCart, token, getImageUrl} = useContext(StoreContext)
    const [isHighlighted, setIsHighlighted] = useState(false)
    const itemRef = useRef(null)
    const navigate = useNavigate()

    // Highlight food item when it comes into view (for search navigation)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const searchQuery = params.get('search')
        
        if (searchQuery && name.toLowerCase().includes(searchQuery.toLowerCase())) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsHighlighted(true)
                        // Remove highlight after 3 seconds
                        setTimeout(() => setIsHighlighted(false), 3000)
                    }
                },
                { threshold: 0.5 }
            )
            
            if (itemRef.current) {
                observer.observe(itemRef.current)
            }
            
            return () => observer.disconnect()
        }
    }, [name])
    
    const handleAddToCart = (e) => {
        e.stopPropagation()
        if (!token) {
            toast.error("Please login to add items to cart")
            return
        }
        addToCart(id, name)
    }
    
    const handleRemoveFromCart = (e) => {
        e.stopPropagation()
        removeFromCart(id, name)
    }

    const handleFoodItemClick = () => {
        navigate(`/food/${id}`)
    }

  return (
    <div className={`food-item ${isHighlighted ? 'highlighted' : ''}`} ref={itemRef} id={`food-${id}`} onClick={handleFoodItemClick}>
      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt="" />
        {(!cartItems[id] || cartItems[id] === 0)
          ?<img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt=""/>
          :<div className='food-item-counter'>
            <img onClick={handleRemoveFromCart} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={handleAddToCart} src={assets.add_icon_green} alt="" />
          </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{category}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default FoodItem
