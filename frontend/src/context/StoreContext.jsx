import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({})
    // Use relative paths - Vite proxy will handle routing to backend
    const url = import.meta.env.VITE_API_URL || ""
    const [token, setToken] = useState("")
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)
    const [food_list, setFoodList] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Fetch food list from backend
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Load cart from localStorage
    const loadCartData = async () => {
        const savedCart = localStorage.getItem("cartItems")
        if (savedCart) {
            setCartItems(JSON.parse(savedCart))
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            const savedToken = localStorage.getItem("token")
            if (savedToken) {
                setToken(savedToken)
                // Try to get user name from localStorage
                const savedUserName = localStorage.getItem("userName")
                if (savedUserName) {
                    setUserName(savedUserName)
                }
                const savedUserEmail = localStorage.getItem("userEmail")
                if (savedUserEmail) {
                    setUserEmail(savedUserEmail)
                }
                const savedIsAdmin = localStorage.getItem("isAdmin")
                if (savedIsAdmin === "true") {
                    setIsAdmin(true)
                }
            }
            await loadCartData()
            setIsLoaded(true)
        }
        loadData()
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (Object.keys(cartItems).length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems))
        }
    }, [cartItems])

    const addToCart = (itemId, itemName) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
            toast.success(`${itemName || 'Item'} added to cart!`)
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
            toast.success(`1 more ${itemName || 'item'} added`)
        }
    }

    const removeFromCart = (itemId, itemName) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (itemName) {
            toast.info(`${itemName} removed from cart`)
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item]
                }
            }

        }
        return totalAmount
    }

    const getImageUrl = (imageName) => {
        return `${url}/images/${imageName}`;
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        getImageUrl,
        isLoaded,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        isAdmin,
        setIsAdmin
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider