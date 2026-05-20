import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi'
const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, getImageUrl } = useContext(StoreContext)
  const navigate = useNavigate()
  
  // Delete confirmation state
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  const confirmDelete = (itemId, itemName) => {
    setDeleteItem({ id: itemId, name: itemName })
    setShowDeletePopup(true)
  }

  const handleDelete = () => {
    if (deleteItem) {
      removeFromCart(deleteItem.id, deleteItem.name)
      setShowDeletePopup(false)
      setDeleteItem(null)
    }
  }

  // Check if cart is truly empty (no items with quantity > 0)
  const hasItems = food_list.some(item => cartItems[item._id] > 0)

  if (!hasItems) {
    return (
      <div className='cart'>
        <div className="cart-empty">
          <FiShoppingBag size={60} color="#e0e0e0" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <a href="/">Start Ordering</a>
        </div>
      </div>
    )
  }

  return (
    <div className='cart'>
      <button className="back-btn" onClick={() => navigate('/')}>
        <FiArrowLeft size={24} /> Back
      </button>
      <h1 className="cart-title">Your Cart</h1>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Item</p>
          <p>Price</p>
          <p>Qty</p>
          <p>Total</p>
          <p>Action</p>
        </div>
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-item'>
                  <img src={getImageUrl(item.image)} alt="" />
                  <div className="food-info">
                    <span className="food-name">{item.name}</span>
                    <span className="food-category">{item.category}</span>
                  </div>
                  <span className="food-price">${item.price}</span>
                  <span>{cartItems[item._id]}</span>
                  <span className="food-price">${item.price * cartItems[item._id]}</span>
                  <FiTrash2 onClick={() => confirmDelete(item._id, item.name)} className='delete-icon' />
                </div>
                <hr />
              </div>

            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details total">
              <p>Total</p>
              <p>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>Proceed to Checkout</button>
        </div>
        <div className="cart-promocode">
          <p>Have a Promo Code?</p>
          <div className='promocode-row'>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Enter promo code' />
            </div>
            <button className='apply-button'>Apply</button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <div className="delete-popup-header">
              <h3>Delete Item</h3>
            </div>
            <p className="delete-message">
              Are you sure you want to remove <strong>{deleteItem?.name}</strong> from your cart?
            </p>
            <div className="delete-buttons">
              <button className="cancel-btn" onClick={() => setShowDeletePopup(false)}>Cancel</button>
              <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
