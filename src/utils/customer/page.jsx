"use client";
import React, { useEffect } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

const Popup = ({ view, onClose, data }) => {
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

  // Ensure 'data' exists and handle default values if not present
  const transactions = data?.purchaseHistory || [];
  const customerName = data?.name || "N/A";
  const couponStatus = data?.couponStatus || "No Status"; // Modify if couponStatus exists in your data
  const totalAmount = data?.totalAmount || 0;

  // Manipulate or filter data if necessary, here you can add logic to modify transactions
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
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
            <span className="text-gray-700">{customerName}</span>
          </p>
          <p className="text-lg mb-1">
            <span className="font-semibold">Coupon Status:</span>{" "}
            <span className="text-green-700">{couponStatus}</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total Price:</span>{" "}
            <span className="text-blue-700 font-medium">₹{totalAmount}</span>
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto border-t border-gray-300 pt-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Transaction History
          </h3>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between mb-2">
                <p className="text-gray-700">
                  {new Date(transaction.purchaseDate).toLocaleString()}
                </p>
                <p className="font-semibold">₹{transaction.totalAmount}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No transactions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
