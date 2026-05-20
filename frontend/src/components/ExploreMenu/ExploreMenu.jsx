import React, { useContext, useEffect, useState } from 'react'
import './ExploreMenu.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify'

const ExploreMenu = ({ category, setCategory }) => {
  const { url } = useContext(StoreContext)
  const [menuList, setMenuList] = useState([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/list`)
      if (response.data.success) {
        setMenuList(response.data.data || [])
      }
    } catch {
      toast.error("Error loading categories")
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our misson is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className="explore-menu-list" key={category}>
        {menuList.map((item, index)=>{
            return (
                <div onClick={()=>setCategory(prev=>prev===item.name?"All":item.name)} key={item._id || index} className='explore-menu-list-item'>
                    <img className={category===item.name?"active":""} src={`${url}/images/${item.image}`} alt={item.name} />
                    <p>{item.name}</p>
                </div>
            )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
