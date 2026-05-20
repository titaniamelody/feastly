import React, { useContext } from 'react'
import './FoodDetailPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'

const FoodDetailPopup = ({ food, onClose }) => {
    const { addToCart, token, getImageUrl } = useContext(StoreContext)

    if (!food) return null

    const handleAddToCart = () => {
        if (!token) {
            toast.error("Please login to add items to cart")
            return
        }
        addToCart(food._id, food.name)
        onClose()
    }

    return (
        <div className="food-detail-popup-overlay" onClick={onClose}>
            <div className="food-detail-popup" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <FiX size={28} />
                </button>

                <div className="food-detail-container">
                    <div className="food-detail-image-section">
                        <div className="image-wrapper">
                            <img src={getImageUrl(food.image)} alt={food.name} className="popup-food-image" />
                        </div>
                    </div>

                    <div className="food-detail-content">
                        <div className="food-detail-header">
                            <div className="popup-header-top">
                                <h1>{food.name}</h1>
                                <div className="rating-badge">
                                    <span className="star">★</span>
                                    <span className="rating-value">{food.rating || 4.5}</span>
                                </div>
                            </div>
                            <span className="food-category-label">{food.category}</span>
                        </div>

                        <div className="food-detail-price">
                            <span className="currency">$</span>
                            <span className="price-amount">{food.price}</span>
                        </div>

                        {food.description && (
                            <div className="food-detail-section">
                                <p className="food-description">{food.description}</p>
                            </div>
                        )}

                        {(food.prepTime || food.servings) && (
                            <div className="food-detail-meta">
                                {food.prepTime && (
                                    <div className="meta-item">
                                        <span className="meta-label">⏱️ Prep time</span>
                                        <span className="meta-value">{food.prepTime}</span>
                                    </div>
                                )}
                                {food.servings && (
                                    <div className="meta-item">
                                        <span className="meta-label">🍽️ Servings</span>
                                        <span className="meta-value">{food.servings}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {food.ingredients && food.ingredients.length > 0 && (
                            <div className="food-detail-section ingredients-section">
                                <h3>Ingredients</h3>
                                <div className="ingredients-list">
                                    {food.ingredients.map((ingredient, index) => (
                                        <div key={index} className="ingredient-item">
                                            <span className="ingredient-check">✓</span>
                                            {ingredient}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {food.method && (
                            <div className="food-detail-section method-section">
                                <h3>Method</h3>
                                <p className="food-method">{food.method}</p>
                            </div>
                        )}

                        <button 
                            className="add-to-cart-btn"
                            onClick={handleAddToCart}
                        >
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodDetailPopup
