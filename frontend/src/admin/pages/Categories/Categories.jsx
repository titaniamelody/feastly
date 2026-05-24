import React, { useEffect, useState } from "react";
import "./Categories.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets, url } from "../../assets/assets";
import { getImageUrl } from "../../../utils/imageUrl";
import { FiTrash2 } from "react-icons/fi";

const Categories = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/list`);
      if (response.data.success) setList(response.data.data || []);
    } catch {
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter category name");
    if (!image) return toast.error("Please upload category image");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("image", image);

      const response = await axios.post(`${url}/api/category/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Category added");
        setName("");
        setImage(null);
        await fetchCategories();
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await axios.post(
        `${url}/api/category/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Category deleted");
        await fetchCategories();
      } else {
        toast.error(response.data.message || "Error");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="categories add flex-col">
      <h2>Categories</h2>

      <form className="categories-form flex-col" onSubmit={onSubmit}>
        <div className="add-img-upload flex-col">
          <p>Category image</p>
          <label htmlFor="cat-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            type="file"
            id="cat-image"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="categories-field flex-col">
          <p>Category name</p>
          <input
            type="text"
            placeholder="e.g. Burgers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button className="add-btn" type="submit" disabled={loading}>
          {loading ? "ADDING..." : "ADD CATEGORY"}
        </button>
      </form>

      <div className="categories-list">
        {list.map((cat) => (
          <div key={cat._id} className="categories-row">
            <img src={getImageUrl(cat.image, url)} alt={cat.name} />
            <p className="categories-name">{cat.name}</p>
            <FiTrash2
              className="delete-icon"
              title="Delete category"
              onClick={() => onDelete(cat._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

