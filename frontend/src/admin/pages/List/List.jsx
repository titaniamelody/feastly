import React, { useEffect, useState } from 'react'
import './List.css'
import { url } from '../../assets/assets'
import { getImageUrl } from '../../../utils/imageUrl'
import axios from 'axios'
import {toast} from 'react-toastify'
import { FiEdit2, FiTrash2, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const ITEMS_PER_PAGE = 5

const List = () => {

  const [list, setList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState(null)
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "Salad",
    image: null,
    imagePreview: "",
    ingredients: "",
    prepTime: "",
    servings: "",
    method: ""
  })

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    if(response.data.success){
      setList(response.data.data)
    }
    else{
      toast.error('Error')
    }
  }

  const removeFood = async (foodId) => {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId},{
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchList()
    if(response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error")
    }
  }

  const confirmDelete = (foodId) => {
    setDeleteItemId(foodId)
    setShowDeletePopup(true)
  }

  const handleDelete = async () => {
    if (deleteItemId) {
      await removeFood(deleteItemId)
      setShowDeletePopup(false)
      setDeleteItemId(null)
    }
  }

  const openEditPopup = (item) => {
    setEditData({
      id: item._id,
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      image: null,
      imagePreview: getImageUrl(item.image, url),
      ingredients: item.ingredients ? item.ingredients.join(", ") : "",
      prepTime: item.prepTime || "",
      servings: item.servings || "",
      method: item.method || ""
    })
    setShowEditPopup(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditData(prev => ({ 
        ...prev, 
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("id", editData.id)
    formData.append("name", editData.name)
    formData.append("description", editData.description)
    formData.append("price", editData.price)
    formData.append("category", editData.category)
    
    // Parse ingredients (comma-separated to array)
    const ingredients = editData.ingredients
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)
    formData.append("ingredients", JSON.stringify(ingredients))
    
    formData.append("prepTime", editData.prepTime)
    formData.append("servings", editData.servings)
    formData.append("method", editData.method)
    
    if (editData.image) {
      formData.append("image", editData.image)
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${url}/api/food/update`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        setShowEditPopup(false)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error updating food item")
    }
  }

  useEffect(()=>{
    fetchList()
  },[])

  const totalPages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [list.length, currentPage, totalPages])

  const paginatedList = list.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const rangeStart = list.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const rangeEnd = Math.min(currentPage * ITEMS_PER_PAGE, list.length)

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {paginatedList.map((item)=>{
          return (
            <div key={item._id} className='list-table-format'>
              <img src={getImageUrl(item.image, url)} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <div className='action-buttons'>
                <FiEdit2 className='edit-icon' onClick={() => openEditPopup(item)} title="Edit" />
                <FiTrash2 className='delete-icon' onClick={() => confirmDelete(item._id)} title="Delete" />
              </div>
            </div>
          )
        })}
      </div>

      {list.length > ITEMS_PER_PAGE && (
        <div className="list-pagination">
          <p className="list-pagination-info">
            Showing {rangeStart}–{rangeEnd} of {list.length} items
          </p>
          <div className="list-pagination-controls">
            <button
              type="button"
              className="list-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <FiChevronLeft />
              <span>Previous</span>
            </button>
            <span className="list-pagination-pages">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="list-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label="Next page"
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Edit Popup */}
      {showEditPopup && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <div className="edit-popup-header">
              <h3>Edit Food Item</h3>
              <FiX className="close-btn" onClick={() => setShowEditPopup(false)} />
            </div>
            <form onSubmit={handleUpdate}>
              <div className="edit-img-upload">
                <p>Upload Image</p>
                <label htmlFor="edit-image">
                  <img src={editData.imagePreview} alt="" />
                </label>
                <input onChange={handleImageChange} type="file" id='edit-image' name='image' hidden />
              </div>
              <div className="edit-field">
                <p>Product name</p>
                <input 
                  type="text" 
                  name='name' 
                  value={editData.name} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="edit-field">
                <p>Description</p>
                <textarea 
                  name='description' 
                  value={editData.description} 
                  onChange={handleEditChange}
                  rows="3"
                  required
                />
              </div>
              <div className="edit-field">
                <p>Category</p>
                <select name="category" value={editData.category} onChange={handleEditChange}>
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Deserts">Deserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>
              <div className="edit-field">
                <p>Price</p>
                <input 
                  type="number" 
                  name='price' 
                  value={editData.price} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              <div className="edit-field">
                <p>Ingredients (comma-separated)</p>
                <textarea 
                  name='ingredients' 
                  value={editData.ingredients} 
                  onChange={handleEditChange}
                  rows="2"
                  placeholder="e.g., Tomatoes, Cucumber, Olives"
                />
              </div>
              <div className="edit-field">
                <p>Prep Time</p>
                <input 
                  type="text" 
                  name='prepTime' 
                  value={editData.prepTime} 
                  onChange={handleEditChange}
                  placeholder="e.g., 10 min"
                />
              </div>
              <div className="edit-field">
                <p>Servings</p>
                <input 
                  type="text" 
                  name='servings' 
                  value={editData.servings} 
                  onChange={handleEditChange}
                  placeholder="e.g., 2-4"
                />
              </div>
              <div className="edit-field">
                <p>Method / Instructions</p>
                <textarea 
                  name='method' 
                  value={editData.method} 
                  onChange={handleEditChange}
                  rows="2"
                  placeholder="Write preparation method here"
                />
              </div>
              <button type='submit' className='update-btn'>Update</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="edit-popup-overlay">
          <div className="edit-popup delete-popup">
            <div className="edit-popup-header">
              <h3>Confirm Delete</h3>
              <FiX className="close-btn" onClick={() => setShowDeletePopup(false)} />
            </div>
            <p className="delete-message">Are you sure you want to delete this food item? This action cannot be undone.</p>
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

export default List
