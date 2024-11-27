"use client";
import React, { useEffect } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

const Popup = ({ view, onClose }) => {
  useEffect(() => {
    if (view) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [view]);
  if (!view) return null;

  const data = {
    customerName: "Alice Johnson",
    couponStatus: "Applied - 10% Discount",
    totalPrice: 12450,
    transactions: [
      {
        date: "2024-11-15",
        amount: 500,
        product: "Cotton T-Shirt",
      },
      {
        date: "2024-11-14",
        amount: 2500,
        product: "Denim Jeans",
      },
      {
        date: "2024-11-13",
        amount: 3000,
        product: "Winter Jacket",
      },
      {
        date: "2024-11-12",
        amount: 1200,
        product: "Sports Shoes",
      },
      {
        date: "2024-11-10",
        amount: 4000,
        product: "Leather Handbag",
      },
      {
        date: "2024-11-08",
        amount: 1250,
        product: "Silk Scarf",
      },
    ],
  };

  return (
    // view && (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      {" "}
      <div className="bg-white text-black w-11/12 xl:h-[70%] h-[60%] md:h-[70%] max-w-3xl p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Purchase Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-1">
            <span className="font-semibold">Customer Name:</span>{" "}
            <span className="text-gray-700">{data.customerName}</span>
          </p>
          <p className="text-lg mb-1">
            <span className="font-semibold">Coupon Status:</span>{" "}
            <span className="text-green-700">{data.couponStatus}</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total Price:</span>{" "}
            <span className="text-blue-700 font-medium">
              ₹{data.totalPrice}
            </span>
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto border-t border-gray-300 pt-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Transaction History
          </h3>
          {data.transactions.length > 0 ? (
            data.transactions.map((transaction, index) => (
              <div
                key={index}
                className="relative bg-gray-100 p-4 rounded-lg mb-4 shadow-md"
              >
                <p className="mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  <span className="text-gray-600">{transaction.date}</span>
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Amount:</span>{" "}
                  <span className="text-blue-600 font-medium">
                    ₹{transaction.amount}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Product:</span>{" "}
                  <span className="text-gray-700">{transaction.product}</span>
                </p>
                {/* Download icon */}
                <button
                  onClick={() => alert(`Downloading ${transaction.product}...`)}
                  className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
                >
                  <FaDownload size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert("Overall summary downloading...")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
          >
            <FaDownload className="inline-block mr-2" />
            Download Summary
          </button>
        </div>
      </div>
    </div>

    // )
  );
};
export default Popup;
