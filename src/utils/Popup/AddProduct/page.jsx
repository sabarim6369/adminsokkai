"use client";

import { useState, useEffect } from "react";
import { FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddProductForm = ({ value, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleRemoveFile = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = "/api/products";
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      data.append("brand", formData.brand);
      formData.images.forEach((file) => data.append("images", file));
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = await axios.post(endpoint, data, config);
      console.log("response status : ", response);
      if (response.status === 201) {
        toast.success("Product added successfully!");
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (error) {
      console.error("Error submitting the form: ", error);
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Endpoint not found. Please check the URL.");
        } else if (error.response.status === 500) {
          toast.error("Internal server error. Please try again later.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  useEffect(() => {
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [value]);

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      brand: "",
      images: [],
    });
  };

  return (
    value && (
      <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
        <ToastContainer />{" "}
        <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-8 h-96 overflow-y-auto">
          <div className="flex flex-row w-full justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Add New Product
            </h2>
            <button onClick={onClose} className="text-black">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product description"
                rows="3"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product price"
                min="0"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product category"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter stock quantity"
                min="0"
                required
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product brand"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Images
              </label>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  className="hidden"
                  id="upload"
                  multiple
                  accept="image/*"
                />
                <label
                  htmlFor="upload"
                  className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-pointer hover:bg-indigo-600"
                >
                  <FaUpload className="mr-2" />
                  Upload Images
                </label>
              </div>

              {/* Displaying the selected files */}
              <div>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
                      >
                        <span className="text-black">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                <FaTimes />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                <FaCheck />
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddProductForm;
