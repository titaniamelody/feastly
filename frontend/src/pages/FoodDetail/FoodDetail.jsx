import React, { useContext, useEffect, useState } from 'react'
import './FoodDetail.css'
import { useParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'
import { FiArrowLeft } from 'react-icons/fi'

const FoodDetail = () => {
    const { foodId } = useParams()
    const navigate = useNavigate()
    const { addToCart, token, food_list, isLoaded, getImageUrl } = useContext(StoreContext)
    const [food, setFood] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isLoaded && food_list && food_list.length > 0) {
            const selectedFood = food_list.find(item => item._id === foodId)
            setFood(selectedFood)
            setLoading(false)
        }
    }, [foodId, food_list, isLoaded])

    const handleAddToCart = () => {
        if (!token) {
            toast.error("Please login to add items to cart")
            return
        }
        if (food) {
            addToCart(food._id, food.name)
        }
    }

    if (loading) {
        return (
            <div className="food-detail-page">
                <div className="loading">Loading...</div>
            </div>
        )
    }

    if (!food) {
        return (
            <div className="food-detail-page">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft size={24} /> Back
                </button>
                <div className="food-not-found">
                    <p>Food item not found</p>
                    <button onClick={() => navigate('/')}>Go to Home</button>
                </div>
            </div>
        )
    }

    return (
        <div className="food-detail-page">
            <div className="food-detail-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft size={24} /> Back
                </button>

                <div className="food-detail-wrapper">
                    <div className="food-detail-image-container">
                        <div className="food-image-box">
                            <img src={getImageUrl(food.image)} alt={food.name} className="food-detail-main-image" />
                        </div>
                    </div>

                    <div className="food-detail-info-section">
                        <div className="food-detail-header">
                            <div className="header-top">
                                <h1>{food.name}</h1>
                                <div className="rating-badge">
                                    <span className="star">★</span>
                                    <span className="rating-value">{food.rating || 4.5}</span>
                                </div>
                            </div>
                            <span className="food-category-badge">{food.category}</span>
                        </div>

                        <div className="food-detail-price-section">
                            <div className="price-tag">
                                <span className="currency">$</span>
                                <span className="amount">{food.price}</span>
                            </div>
                        </div>

                        {food.description && (
                            <div className="food-detail-section">
                                <p className="food-description">{food.description}</p>
                            </div>
                        )}

                        <div className="action-buttons">
                            <button 
                                className="add-to-cart-btn-large"
                                onClick={handleAddToCart}
                            >
                                🛒 Add to Cart
                            </button>
                        </div>

                        {(food.prepTime || food.servings) && (
                            <div className="food-detail-meta-section">
                                {food.prepTime && (
                                    <div className="meta-item">
                                        <span className="meta-label">⏱️ Prep Time</span>
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
                                            <span className="ingredient-checkbox">✓</span>
                                            {ingredient}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {food.method && (
                            <div className="food-detail-section method-section">
                                <h3>Cooking Method</h3>
                                <p className="food-method">{food.method}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodDetail
