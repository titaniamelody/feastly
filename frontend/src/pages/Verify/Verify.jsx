import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    const [searchParams] = useSearchParams()
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const { url, setCartItems } = useContext(StoreContext)
    const navigate = useNavigate()

    const verifyPayment = async () => {
        try {
            const response = await axios.post(url + "/api/order/verify", {
                success,
                orderId
            })
            
            if (response.data.success) {
                setCartItems({})
                localStorage.removeItem("cartItems")
                navigate("/myorders")
                toast.success("Payment successful! Order placed.")
            } else {
                navigate("/")
                toast.error("Payment failed. Please try again.")
            }
        } catch (error) {
            console.log(error)
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
