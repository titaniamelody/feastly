import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'
import ThemeContextProvider from './context/ThemeContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './toast-custom.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/feastly">
    <ToastContainer 
      position="bottom-right" 
      autoClose={3000} 
      hideProgressBar={false} 
      newestOnTop 
      closeButton 
      closeOnClick 
      pauseOnHover
      theme="colored"
      style={{ zIndex: 10000 }}
    />
    <ThemeContextProvider>
      <StoreContextProvider>  
        <App />
      </StoreContextProvider>
    </ThemeContextProvider>
  </BrowserRouter>
)
