"use client";
import { useState, useEffect } from "react";
import { FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import ShowCategories from "./ShowCategories";

const AddProductForm = ({ value, onClose, product, isEditing }) => {
  const [formData, setFormData] = useState({
    name: "",
    originalprice: "",
    description: "",
    price: "",
    stock: "",
    brand: "",
    sizes: [],
    images: [],
    color: [],
    selectedGift: null,
    categoryids: [],
  });

  useEffect(() => {
    if (isEditing && product) {
      const sizesArray = Array.isArray(product.sizes)
        ? product.sizes
        : product.sizes?.[0]
        ? JSON.parse(product.sizes[0])
        : [];

      const colorArray = Array.isArray(product.color)
        ? product.color
        : product.color?.[0]
        ? JSON.parse(product.color[0])
        : [];

      setFormData({
        name: product.name || "",
        originalprice: product.originalprice || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        brand: product.brand || "",
        sizes: sizesArray,
        images: product.images || [],
        color: colorArray,
        selectedGift: product.selectedGift || null,
        categoryids: product.category || [],
      });
    }
  }, [isEditing, product]);
  const HandelCategory = (parentid, subid) => {
    console.log("data :", parentid, subid);
    setFormData((prevData) => ({
      ...prevData,
      categoryids: [...prevData.categoryids, parentid, subid],
    }));
  };
  const [loading, setLoading] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log("response data for the categories:", response.data);
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get("/api/gift");
        if (response.status === 200) {
          setGifts(response.data);
          console.log("response for gift data : ", response.data);
        }
      } catch (error) {
        toast.error("Failed to load available gifts.");
      }
    };

    fetchGifts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 4) {
      toast.error("You can only upload up to 4 images.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 4),
    }));
  };

  const handleRemoveFile = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isEditing
        ? `/api/products?id=${product._id}` // Pass as query param
        : "/api/products";

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("originalprice", formData.originalprice);
      data.append("category", JSON.stringify(formData.categoryids));
      data.append("stock", formData.stock);
      data.append("sizes", JSON.stringify(formData.sizes));
      data.append("brand", formData.brand);
      data.append("color", JSON.stringify(formData.color));
      data.append("selectedGift", formData.selectedGift);
      formData.images.forEach((file) => data.append("images", file));

      // Log the form data to ensure it's correctly constructed
      console.log("Form data:", data);

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const response = isEditing
        ? await axios.put(endpoint, data, config)
        : await axios.post(endpoint, data, config);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          isEditing
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
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
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      originalprice: "",
      price: "",
      category: "",
      stock: "",
      brand: "",
      sizes: [],
      color: [],
      images: [],
      selectedGift: null,
    });
  };

  const handleGiftSelect = (giftId) => {
    setFormData((prev) => ({
      ...prev,
      selectedGift: giftId,
    }));
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

  return (
    value && (
      <div className="relative">
        {/* Overlay and Loader */}
        {loading && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        )}

        <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
          <ToastContainer />
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
                <label className="block text-red-600 font-bold mb-2">
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
                <label className="block text-red-600 font-bold mb-2">
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
              <div>
                <label className="block text-red-600 font-bold mb-2">
                  Original Price ($)
                </label>
                <input
                  type="number"
                  name="originalprice"
                  value={formData.originalprice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter product original price"
                  min="0"
                  required
                />
              </div>
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
              <ShowCategories
                categories={categories}
                HandelCategory={HandelCategory}
                selectedCategoryIds={formData.categoryids}
              />
              <div>
                <label className="block text-red-600 font-bold mb-2">
                  Sizes Available
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={size}
                        name="sizes"
                        value={size}
                        checked={formData.sizes?.includes(size)}
                        onChange={(e) => {
                          const { value } = e.target;
                          const sizes = formData.sizes || [];
                          if (sizes.includes(value)) {
                            setFormData({
                              ...formData,
                              sizes: sizes.filter((item) => item !== value),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              sizes: [...sizes, value],
                            });
                          }
                        }}
                        className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-400"
                      />
                      <label htmlFor={size} className="ml-2 text-gray-800">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-red-600 font-bold mb-2">
                  Color Available
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "White",
                    "Black",
                    "Blue",
                    "Gray",
                    "Red",
                    "Green",
                    "Pink",
                    "Yellow",
                    "Brown",
                    "Purple",
                    "Orange",
                    "Burgundy",
                    "Teal",
                    "nocolor",
                  ].map((color) => (
                    <div key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        id={color}
                        name="color"
                        value={color}
                        checked={formData.color?.includes(color)} // Fix: Use formData.color
                        onChange={(e) => {
                          const { value } = e.target;
                          const updatedColors = formData.color || [];
                          if (updatedColors.includes(value)) {
                            setFormData({
                              ...formData,
                              color: updatedColors.filter(
                                (item) => item !== value
                              ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              color: [...updatedColors, value],
                            });
                          }
                        }}
                        className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-400"
                      />
                      <label htmlFor={color} className="ml-2 text-gray-800">
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-red-600 font-bold mb-2">
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
                <label className="block text-red-600 font-bold mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter brand name"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-red-600 font-bold mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="file:px-4 file:py-2 file:border file:rounded-lg file:bg-indigo-500 file:text-white"
                  multiple
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.images.map((image, index) => {
                    if (!image || !image.url) {
                      console.error(`Invalid image object at index ${index}`);
                      return null; // Skip rendering this image
                    }

                    const imageUrl = image.url;

                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            console.error(
                              `Failed to load image at index ${index}`
                            );
                            e.target.src = "/path/to/default/image.png";
                          }}
                        />
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute top-0 right-0 text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-red-600 font-bold mb-2">
                  Available Gifts
                </label>
                <div className="flex flex-wrap gap-4">
                  {gifts
                    .filter((gift) => {
                      console.log(gift.status);
                      return gift.status === "active";
                    })
                    .map((gift) => (
                      <div key={gift._id} className="flex items-center">
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-lg ${
                            formData.selectedGift === gift._id
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                          onClick={() => handleGiftSelect(gift._id)}
                        >
                          {gift.name}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-lg bg-gray-400 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-500 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default AddProductForm;
