"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import couponCode from "coupon-code";
import { FaCheckCircle, FaClipboard, FaTimes, FaMagic } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CouponPopup = ({ value, onClose }) => {
  const [couponData, setCouponData] = useState({
    couponName: "",
    discountPrice: "",
    couponCode: "",
  });
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponData({ ...couponData, [name]: value });
  };

  const generateCoupon = () => {
    const generatedCode = couponCode.generate();
    setCouponData({ ...couponData, couponCode: generatedCode });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponData.couponCode);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/coupun`, {
        name: couponData.couponName,
        pricing: couponData.discountPrice,
        coupun: couponData.couponCode,
      });

      console.log("Coupon created successfully:", response.data);
      if (response.status === 201 || response.status === 200) {
        toast.success("Coupon created successfully!");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);

      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  return (
    value && (
      <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
        <ToastContainer />
        <div
          className="bg-white p-8 rounded-lg shadow-lg w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-black">
              Generate Coupon
            </h2>
            <button onClick={onClose} className="text-black">
              <FaTimes />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-black">Coupon Name</label>
              <input
                type="text"
                name="couponName"
                value={couponData.couponName}
                onChange={handleInputChange}
                className="mt-2 p-2 border w-full"
              />
            </div>

            <div>
              <label className="block text-black">Discount Price</label>
              <input
                type="text"
                name="discountPrice"
                value={couponData.discountPrice}
                onChange={handleInputChange}
                className="mt-2 p-2 border w-full"
              />
            </div>

            <div>
              <label className="block text-black">Coupon Code</label>
              <div className="flex items-center border mt-2">
                <input
                  type="text"
                  name="couponCode"
                  placeholder="black"
                  value={couponData.couponCode}
                  onChange={handleInputChange}
                  className="p-2 text-black w-full"
                  style={{
                    color: "black",
                    "::placeholder": { color: "black" },
                  }}
                />

                <button
                  onClick={generateCoupon}
                  className="ml-2 p-2 text-blue-500"
                >
                  <FaMagic />
                </button>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-2  text-black"
                >
                  <FaClipboard />
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 w-40 rounded-lg xl:ml-16 bg-green-500  text-white p-2"
            >
              Create Coupon
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CouponPopup;
