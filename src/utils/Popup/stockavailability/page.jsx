"use client";

import React, { useEffect } from "react";
import axios from "axios";

const Stockavailability = ({ value, onClose }) => {
  const [products, setProducts] = React.useState([]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product availability:", error);
    }
  };

  useEffect(() => {
    if (value) {
      document.body.style.overflow = "hidden";
      fetchAvailability();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [value]);

  return (
    value && (
      <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white h-auto max-h-[80vh] rounded-lg shadow-lg w-[90%] sm:w-11/12 md:w-9/12 lg:w-1/2 xl:w-[30%]">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Product Availability
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✖
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {products.map((elem) => (
              <div
                className={`p-4 sm:p-6 border-b flex items-center space-x-4 ${
                  elem.status === "inactive" ? "bg-red-100 border-red-300" : "" // Apply light red background and border for inactive products
                }`}
                key={elem.id || elem.name}
              >
                <img
                  src={elem.images?.[0]?.url || "/placeholder-image.png"} // Provide a placeholder image in case the image URL is missing
                  alt={elem.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-medium text-gray-700">
                    {elem.name}
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      elem.stock > 5 ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {elem.stock > 5 ? "In Stock" : "Low Stock"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-semibold text-gray-700">
                    Stock: {elem.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 sm:px-6 py-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Stockavailability;
