import React, { useEffect, useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = () => {

    const [image, setImage] = useState(false)
    const [categories, setCategories] = useState([])
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        ingredients: "",
        prepTime: "",
        servings: "",
        method: ""
    })

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${url}/api/category/list`)
            if (response.data.success) {
                const list = response.data.data || []
                setCategories(list)
                // set default category once
                setData(prev => ({ ...prev, category: prev.category || (list[0]?.name || "") }))
            }
        } catch {
            toast.error("Error fetching categories")
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Not authorized")
            return
        }
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("description", data.description)
        formData.append("price", data.price)
        formData.append("category", data.category)
        formData.append("image", image)
        
        // Parse ingredients (comma-separated to array)
        const ingredients = data.ingredients
            .split(',')
            .map(ing => ing.trim())
            .filter(ing => ing.length > 0)
        formData.append("ingredients", JSON.stringify(ingredients))
        
        formData.append("prepTime", data.prepTime)
        formData.append("servings", data.servings)
        formData.append("method", data.method)
        
        const response = await axios.post(`${url}/api/food/add`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: categories[0]?.name || "",
                ingredients: "",
                prepTime: "",
                servings: "",
                method: ""
            })
            setImage(false)
            toast.success(response.data.message)
        }
        else{
            toast.error(response.data.message)
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' name='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category} disabled={categories.length === 0} required>
                            {categories.length === 0 ? (
                                <option value="">No categories yet (add one first)</option>
                            ) : (
                                categories.map(cat => (
                                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='$20' required />
                    </div>
                </div>
                <div className="add-product-ingredients flex-col">
                    <p>Ingredients (comma-separated)</p>
                    <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="4" placeholder='e.g., Tomatoes, Cucumber, Onion, Olives, Feta cheese'></textarea>
                </div>
                <div className="add-prep-servings">
                    <div className="add-prep-time flex-col">
                        <p>Prep time</p>
                        <input onChange={onChangeHandler} value={data.prepTime} type="text" name='prepTime' placeholder='e.g., 10 min' />
                    </div>
                    <div className="add-servings flex-col">
                        <p>Servings</p>
                        <input onChange={onChangeHandler} value={data.servings} type="text" name='servings' placeholder='e.g., 2-4' />
                    </div>
                </div>
                <div className="add-product-method flex-col">
                    <p>Method / Instructions</p>
                    <textarea onChange={onChangeHandler} value={data.method} name="method" rows="6" placeholder='Write preparation method here'></textarea>
                </div>
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    )
}

export default Add
