"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GiftVoucherPopup = ({ value, onClose }) => {
  const [gifts, setGifts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    photo: null,
    name: "",
    price: "",
    oldImage: "",
    oldPublicId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState("");
  const fetchGifts = async () => {
    try {
      const response = await axios.get("/api/gift");
      setGifts(response.data);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast.error("Failed to fetch gift vouchers.");
    }
  };

  useEffect(() => {
    if (value) {
      document.body.style.overflow = "hidden"; 
      fetchGifts();
    } else {
      document.body.style.overflow = ""; // Enable scroll
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [value]);

  // Handle form submission for Add
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("price", formData.price);

      if (formData.id) formDataObj.append("id", formData.id); // Ensure ID is sent for update

      if (formData.photo && formData.photo !== formData.oldImage) {
        await deleteImageFromCloudinary(formData.oldPublicId); // Delete the old image first
      }

      if (formData.photo) {
        formDataObj.append("images", formData.photo);
      } else {
        formDataObj.append("oldImage", formData.oldImage);
        formDataObj.append("oldPublicId", formData.oldPublicId);
      }
      await axios.post("/api/gift", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Gift added successfully!");
      resetForm();
      fetchGifts();
    } catch (error) {
      console.error("Error saving gift:", error);
      toast.error("Error saving gift voucher.");
    }
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setFormData({ ...formData, photo: file });
  };

  const deleteImageFromCloudinary = async (publicId) => {
    try {
      await axios.delete(`/api/gift/delete-image?public_id=${publicId}`);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/gift?id=${id}`);
      fetchGifts();
      toast.success("Gift deleted successfully!");
    } catch (error) {
      console.error("Error deleting gift:", error);
      toast.error("Error deleting gift voucher.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      photo: null,
      name: "",
      price: "",
      oldImage: "",
      oldPublicId: "",
    });
    setIsEditing(false);
    setPreview("");
  };
  const isDisabled = (gift) => gift.status==='disabled';

  return (
    value && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Gift Vouchers
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✖
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[40vh] text-black">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b pb-2">Photo</th>
                  <th className="border-b pb-2">Name</th>
                  <th className="border-b pb-2">Price</th>
                  <th className="border-b pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gifts.map((gift) => (
                  <tr
                    key={gift.id}
                    className={`hover:bg-gray-50 ${{
                      "bg-gray-300": isDisabled(gift),
                    }}`}
                  >
                    <td className="py-2">
                      <img
                        src={gift.photos[0]?.url}
                        alt={gift.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-2">{gift.name}</td>
                    <td className="py-2">₹{gift.price}</td>
                    <td className="py-2 text-right space-x-2">
                      {!isDisabled(gift) ? (
                        <button
                          onClick={() => handleDelete(gift._id)}
                          className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-500 italic">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Form */}
          <div className="p-6 border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full mt-1 px-3 py-2 border rounded text-black"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded text-black"
                  placeholder="Enter gift name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded text-black"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default GiftVoucherPopup;
