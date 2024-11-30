"use client";

import { useState } from "react";

export default function AdminOrders() {
  const initialOrders = [
    {
      id: 1,
      customerName: "John Doe",
      phoneNumber: "+1 123-456-7890",
      customerDetails: "johndoe@example.com",
      address: "123 Main Street, Springfield, USA",
      products: [
        { name: "T-shirt", quantity: 2, size: "M", price: 20 },
        { name: "Jeans", quantity: 1, size: "L", price: 40 },
      ],
      paymentMethod: "Online",
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      phoneNumber: "+1 987-654-3210",
      customerDetails: "janesmith@example.com",
      address: "456 Elm Street, Shelbyville, USA",
      products: [
        { name: "Dress", quantity: 1, size: "S", price: 50 },
        { name: "Jacket", quantity: 1, size: "M", price: 70 },
      ],
      paymentMethod: "Offline",
      status: "Pending",
    },
  ];
  const [orders, setOrders] = useState(initialOrders);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedOrderId) {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      closePopup();
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  const calculateTotalPrice = (products) => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  return (
    <div className="p-4  bg-gray-50 text-base  min-h-screen">
      <h1 className="font-bold mb-4 text-gray-800 text-center ">
        Admin Orders Management
      </h1>
      <div className="overflow-x-auto w-[600%] xl:w-full">
        <table className="w-full border border-gray-200 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-left font-medium text-gray-700">
              <th className="px-2 py-2 border-b">Order ID</th>
              <th className="px-2 py-2 border-b">Customer Name</th>
              <th className="px-2 py-2 border-b">Phone Number</th>
              <th className="px-2 py-2 border-b">Email</th>
              <th className="px-2 py-2 border-b">Address</th>
              <th className="px-2 py-2 border-b w-[10%]">Order Details</th>
              <th className="px-2 py-2 border-b">Total Price</th>
              <th className="px-2 py-2 border-b">Payment Method</th>
              <th className="px-2 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 border-b text-gray-800">
                  {order.id}
                </td>
                <td className="px-2 py-2 border-b text-gray-800">
                  {order.customerName}
                </td>
                <td className="px-2 py-2 border-b text-gray-800">
                  {order.phoneNumber}
                </td>
                <td className="px-2 py-2 border-b text-gray-800">
                  {order.customerDetails}
                </td>
                <td className="px-2 py-2 border-b text-gray-800">
                  {order.address}
                </td>
                <td className="px-2 w-[15%]  py-2 border-b font-bold text-gray-800">
                  <ul className="list-disc ml-4">
                    {order.products.map((product, index) => (
                      <li key={index} className="text-sm sm:text-base">
                        {product.name} - {product.quantity} pcs (Size:{" "}
                        {product.size}) - ${product.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-2 py-2 border-b text-gray-800 font-bold">
                  ${calculateTotalPrice(order.products)}
                </td>
                <td className="px-2 py-2 border-b text-green-500 font-bold">
                  {order.paymentMethod}
                </td>
                <td className="px-2 py-2 border-b">
                  <button
                    onClick={() => openPopup(order.id)}
                    className={`px-2 py-2 rounded font-medium text-white transition ${
                      order.status === "Pending"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : order.status === "Dispatched"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {order.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-0">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full sm:w-96">
            <h2 className="text-lg text-black font-semibold mb-4">
              Change Order Status
            </h2>
            <p className="text-black mb-4">
              Select an action for order ID: <strong>{selectedOrderId}</strong>
            </p>
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
              <button
                onClick={() => handleStatusChange("Dispatched")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Dispatch
              </button>
              <button
                onClick={() => handleStatusChange("Cancelled")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel Order
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
