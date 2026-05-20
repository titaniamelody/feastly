import React, { useContext, useState, useEffect } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi'

const LoginPopup = ({ setShowLogin, setShowForgot, initialMode = "Login" }) => {

  const {url, setToken, setUserName, setUserEmail, setIsAdmin} = useContext(StoreContext)

    const [currState, setCurrState] = useState(initialMode)
    const [data, setData] = useState({
      name:"",
      email:"",
      password:""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
      setCurrState(initialMode)
      setFormError("")
    }, [initialMode])

    const getErrorMessage = (payload) =>
      payload?.message || payload?.massage || "Something went wrong. Please try again."

    const onChangeHandler = (event) => {
      const name = event.target.name
      const value = event.target.value
      setData(data=>({...data,[name]:value}))
      if (formError) setFormError("")
    }

    const switchState = (state) => {
      setCurrState(state)
      setFormError("")
    }

    const passwordAutoComplete = currState === "Login" ? "current-password" : "new-password"

    const onLogin = async (event) => {
      event.preventDefault()
      setFormError("")

      let newUrl = url
      if (currState === "Login") {
        newUrl += "/api/user/login"
      }
      else{
        newUrl += "/api/user/register"
      }

      setIsSubmitting(true)
      try {
        const response = await axios.post(newUrl, data)

        if (response.data.success) {
          setToken(response.data.token)
          setUserName(response.data.userName)
          setUserEmail(response.data.userEmail)
          setIsAdmin(response.data.isAdmin || false)
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("userName", response.data.userName)
          localStorage.setItem("userEmail", response.data.userEmail)
          localStorage.setItem("isAdmin", response.data.isAdmin || false)
          setShowLogin(false)
          toast.success(currState === "Login" ? "Logged in successfully!" : "Account created successfully!")
        }
        else {
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
        setIsSubmitting(false)
      }

    }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <FiX onClick={() => setShowLogin(false)} className="close-icon" size={22} />
        </div>
        {formError && (
          <p className="login-popup-error" role="alert">
            {formError}
          </p>
        )}
        <div className="login-popup-inputs">
          {currState==="Login"?<></>: <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required autoComplete="name" />}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required autoComplete="email" />
          <div className="password-input-wrapper">
            <input 
              name='password' 
              onChange={onChangeHandler} 
              value={data.password} 
              type={showPassword ? "text" : "password"} 
              placeholder='Your password' 
              required 
              autoComplete={passwordAutoComplete} 
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>
        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : currState==="Sign Up"?"Create account":"Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-popup-footer">
          {currState==="Login"
          ?<>
            <p className="forgot-password" onClick={() => {
              setShowLogin(false)
              setShowForgot(true)
            }}>Forgot password?</p>
            <p>Create a new account? <span onClick={() => switchState("Sign Up")}>Click here</span></p>
          </>
          :<p>Already have an account? <span onClick={() => switchState("Login")}>Login here</span></p>
          }
        </div>
        
      </form>
    </div>
  )
}

export default LoginPopup
