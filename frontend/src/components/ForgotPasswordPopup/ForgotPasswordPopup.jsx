import React, { useContext, useState } from 'react'
import './ForgotPasswordPopup.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'

const ForgotPasswordPopup = ({ setShowForgot, setShowReset, setResetEmail, setShowLogin }) => {

  const { url } = useContext(StoreContext)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState("")

  const getErrorMessage = (payload) =>
    payload?.message || "Something went wrong. Please try again."

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError("")

    if (!email.trim()) {
      setFormError("Please enter your email")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${url}/api/user/forgot-password`, { email: email.trim() })

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email")
        setResetEmail(email.trim())
        setShowForgot(false)
        setShowReset(true)
      } else {
        setFormError(getErrorMessage(response.data))
      }
    } catch (error) {
      if (error.response) {
        setFormError(getErrorMessage(error.response.data))
      } else if (error.request) {
        setFormError("No response from server. Please check if the backend is running.")
      } else {
        setFormError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='forgot-password-popup'>
      <form onSubmit={handleSubmit} className="forgot-password-container">
        <div className="forgot-password-title">
          <h2>Forgot Password</h2>
          <FiX onClick={() => setShowForgot(false)} className="close-icon" size={22} />
        </div>

        <p className="forgot-password-description">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>

        {formError && (
          <p className="forgot-password-error" role="alert">
            {formError}
          </p>
        )}

        <div className="forgot-password-inputs">
          <input
            type="email"
            placeholder='Enter your email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (formError) setFormError("")
            }}
            required
            autoComplete="email"
          />
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? "Sending..." : "Send OTP"}
        </button>

        <div className="forgot-password-footer">
          <p>
            Remembered it? <span onClick={() => {
              setShowForgot(false)
              setShowLogin(true)
            }}>Back to login</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordPopup
