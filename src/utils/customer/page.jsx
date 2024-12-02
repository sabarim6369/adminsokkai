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

  const transactions = data?.purchaseHistory || [];
  const customerName = data?.name || "N/A";
  const email = data?.email || "N/A";
  const addresses = data?.address || [];
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + (transaction.totalAmount || 0),
    0
  );

  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
  );

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black w-11/12 max-w-3xl p-6 rounded-lg shadow-xl overflow-y-auto xl:h-[70%] h-[80%] md:h-[80%]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Customer Details */}
        <div className="mb-6">
          <p className="text-lg mb-1">
            <span className="font-semibold">Customer Name:</span> {customerName}
          </p>
          <p className="text-lg mb-1">
            <span className="font-semibold">Email:</span> {email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Total Spent:</span>{" "}
            <span className="text-blue-700 font-medium">₹{totalAmount}</span>
          </p>
        </div>

        {/* Address Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Addresses
          </h3>
          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div
                key={index}
                className="mb-4 p-3 border rounded-md shadow-sm bg-gray-50"
              >
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {address.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> {address.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span>{" "}
                  {address.address}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Location:</span>{" "}
                  {address.location}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Type:</span> {address.type}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No addresses available.</p>
          )}
        </div>

        {/* Transaction History */}
        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Transaction History
          </h3>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction, index) => (
              <div
                key={index}
                className="mb-4 p-3 border rounded-md shadow-sm bg-gray-50"
              >
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(transaction.purchaseDate).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{" "}
                  {transaction.status}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Amount:</span> ₹
                  {transaction.totalAmount}
                </p>
                <div className="mt-2">
                  <h4 className="font-semibold">Products:</h4>
                  {transaction.products.map((product, idx) => (
                    <p key={idx} className="text-gray-700 ml-4">
                      - {product.productId} (Qty: {product.quantity}, ₹
                      {product.totalPrice})
                    </p>
                  ))}
                </div>
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
