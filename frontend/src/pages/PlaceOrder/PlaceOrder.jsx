import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiArrowLeft } from 'react-icons/fi'

const PlaceOrder = () => {

  const { getTotalCartAmount, food_list, cartItems, url, token, setCartItems, getImageUrl } = useContext(StoreContext)
  const navigate = useNavigate()
  
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const [paymentMethod, setPaymentMethod] = useState("COD")

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({...data, [name]: value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = {...item};
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      address: data,
      paymentMethod: paymentMethod
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Order response:", response.data);
      
      if (response.data.success) {
        if (paymentMethod === "Stripe" && response.data.session_url) {
          // Redirect to Stripe payment page
          window.location.replace(response.data.session_url);
        } else {
          // For COD, clear cart and navigate to orders
          setCartItems({});
          localStorage.removeItem("cartItems");
          navigate("/myorders");
          toast.success("Order placed successfully!");
        }
      } else {
        toast.error("Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Error placing order. Please try again.");
    }
  }

  useEffect(() => {
    if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token, getTotalCartAmount, navigate])

  return (
    <div className='place-order-container'>
      <button className="back-btn" onClick={() => navigate('/cart')}>
        <FiArrowLeft size={24} /> Back
      </button>
      <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' required />
          <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' required />
        </div>
        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' required />
        <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' required />
          <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' required />
          <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' required />
        </div>
        <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' required />
      </div>
      <div className="place-order-right">
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
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <div className="payment-method">
            <h3>Payment Method</h3>
            <div className="payment-options">
              <label>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>
              <label>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Stripe" 
                  checked={paymentMethod === "Stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit / Debit Card
              </label>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
    </div>
  )
}

export default PlaceOrder
