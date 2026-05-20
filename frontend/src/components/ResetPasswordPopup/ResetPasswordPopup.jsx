import React, { useContext, useState } from 'react'
import './ResetPasswordPopup.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi'

const ResetPasswordPopup = ({ setShowReset, setShowForgot, setShowLogin, resetEmail }) => {

  const { url } = useContext(StoreContext)
  const [data, setData] = useState({
    otp: "",
    newPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!data.otp || !data.newPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (data.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${url}/api/user/reset-password`, {
        email: resetEmail,
        otp: data.otp,
        newPassword: data.newPassword
      })

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successful")
        setShowReset(false)
        setShowLogin(true)
      } else {
        toast.error(response.data.message || "Failed to reset password")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred")
      } else if (error.request) {
        toast.error("No response from server. Please check if the backend is running.")
      } else {
        toast.error("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='reset-password-popup'>
      <form onSubmit={handleSubmit} className="reset-password-container">
        <div className="reset-password-title">
          <h2>Reset Password</h2>
          <FiX onClick={() => setShowReset(false)} className="close-icon" size={22} />
        </div>

        <p className="reset-password-description">
          Enter the OTP sent to your email and your new password.
        </p>

        <div className="reset-password-inputs">
          <input
            type="text"
            name="otp"
            placeholder='Enter OTP'
            value={data.otp}
            onChange={handleInputChange}
            required
            autoComplete="off"
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder='New password (min 8 characters)'
              value={data.newPassword}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button type='submit' disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        <div className="reset-password-footer">
          <p>
            <span onClick={() => {
              setShowReset(false)
              setShowForgot(true)
            }}>Didn't receive OTP? Try again</span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default ResetPasswordPopup
