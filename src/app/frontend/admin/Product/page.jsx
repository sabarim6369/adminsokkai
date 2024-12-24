"use client";
import React, { useState, useEffect } from "react";
import SideBar from "@/utils/SideBar/page";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Updateform from "@/utils/Popup/UpdateForm/page";
import { ToastContainer, toast } from "react-toastify";
const ProductsPage = () => {
  const [products, setproduct] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [loading, setloading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmName, setConfirmName] = useState("");
  const [showPopupUpdate, setPopupUpdate] = useState(false);
  useEffect(() => {
    const hour = new Date().getHours();
    getproducts();

    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);
  const getproducts = async () => {
    try {
      const response = await axios.get(`/api/products`);
      toast.success("Product fetched successfully!");
      console.log("response data :", response.data);
      setproduct(response.data);
    } catch (error) {
      toast.error("Failed to fetch the product!");
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log("consoling the id...", id);
      const response = await axios.delete(`/api/products?id=${id}`);
      setproduct(products.filter((product) => product.id !== id));
      if (response.status === 200) {
        setproduct((prevProducts) =>
          prevProducts.filter(
            (product) => product.id !== id && product._id !== id
          )
        );
        toast.success("Product deleted successfully!");
        setShowPopup(false);
        setSelectedProduct(null);
        setConfirmName("");
      }
    } catch (error) {
      toast.error("Failed to delete the product!");
    }
  };

  const openDeletePopup = (product) => {
    setShowPopup(true);
    setSelectedProduct(product);
    setConfirmName("");
  };

  const openupdateform = (product) => {
    console.log("function triggered  : ", product);
    setSelectedProduct(product);
    console.log("selected product : ", product);
    setPopupUpdate(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setConfirmName("");
  };
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Centers it vertically on the page
          flexDirection: "column",
        }}
      >
        <ClipLoader color="#4A90E2" size={100} /> {/* Increased size */}
        <p
          style={{
            fontWeight: "bold",
            color: "black",
            fontSize: "20px",
            marginTop: "20px",
          }}
        >
          Loading, please wait...
        </p>
      </div>
    );
  }
  return (
    <div className="relative">
      <ToastContainer />
      <SideBar />
      <div className="w-full font-Mona text-xl">
        <h1 className="text-2xl font-bold mt-9 xl:ml-[16.8%] text-black ml-3 font-Cabin mb-4">
          {greeting}, Vijay
        </h1>
        <div className="xl:ml-[19%] lg:ml-[23%]">
          <div className="grid grid-cols-1 xl:w-full md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-8 px-3">
            {products.map((product, index) => (
              <div
                key={product.id || product._id || index}
                className="w-full sm:w-72 md:w-80 lg:w-[70%] xl:w-[90%]"
              >
                <div
                  className={`${
                    product.status === "inactive"
                      ? "bg-red-100 border-red-300" // light red background and border for inactive products
                      : "bg-white border-gray-300" // normal background and border for active products
                  } shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4`}
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder-image.png"}
                    alt={product.name}
                    className="w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-lg mb-4"
                  />

                  <div className="flex flex-col font-Cabin w-full space-y-2">
                    <div className="flex justify-between text-sm sm:text-lg md:text-xl">
                      <span className="text-gray-500 font-semibold">Name:</span>
                      <span className="text-black font-bold">
                        {product.name}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-lg md:text-xl">
                      <span className="text-gray-500 font-semibold">
                        Price:
                      </span>
                      <span className="text-black font-bold">
                        {product.price}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-lg md:text-xl">
                      <span className="text-gray-500 font-semibold">
                        Stock Availability:
                      </span>
                      <span
                        className={`font-bold ${
                          product.stock > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm sm:text-lg md:text-xl">
                      <span className="text-gray-500 font-semibold">
                        Total Revenue:
                      </span>
                      <span className="text-black font-bold">
                        {product.total_revenue}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 sm:space-x-4 mt-4">
                    <button
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 flex items-center"
                      onClick={() => openupdateform(product)}
                    >
                      <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => openDeletePopup(product)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-700 flex items-center"
                    >
                      <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <AiOutlineClose size={20} />
            </button>
            <h2 className="text-lg font-bold text-center mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-4">
              Type <b>{selectedProduct.name}</b> to confirm deletion.
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter product name"
            />
            <div className="flex justify-between">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmName === selectedProduct.name
                    ? handleDelete(selectedProduct._id)
                    : toast.error("Product name does not match!")
                }
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopupUpdate && (
        <Updateform
          value={showPopupUpdate}
          onClose={() => setPopupUpdate(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
export default ProductsPage;
