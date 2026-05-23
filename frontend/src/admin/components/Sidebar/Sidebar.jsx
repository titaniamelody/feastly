import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { FiX } from 'react-icons/fi'

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className='sidebar-overlay' onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className='close-button' onClick={onClose}>
          <FiX size={24} />
        </button>
        <div className="sidebar-options">
          <NavLink to='/admin/add' className="sidebar-option" onClick={onClose}>
              <img src={assets.add_icon} alt="" />
              <p>Add Items</p>
          </NavLink>
          <NavLink to='/admin/list' className="sidebar-option" onClick={onClose}>
              <img src={assets.order_icon} alt="" />
              <p>List Items</p>
          </NavLink>
          <NavLink to='/admin/orders' className="sidebar-option" onClick={onClose}>
              <img src={assets.order_icon} alt="" />
              <p>Orders</p>
          </NavLink>
          <NavLink to='/admin/categories' className="sidebar-option" onClick={onClose}>
              <img src={assets.add_icon} alt="" />
              <p>Categories</p>
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar
