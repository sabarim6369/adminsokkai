"use client";

import { useState } from "react";
import StatusPopup from "@/utils/Popup/confirmpopup/page";
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

  const handleStatusChange = (orderId) => {
    const confirmDispatch = confirm(
      "Are you sure you want to mark this order as Dispatched?"
    );
    if (confirmDispatch) {
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: "Dispatched" } : order
      );
      setOrders(updatedOrders);
    }
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openPopup = (orderId) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
  };

  const handleConfirm = () => {
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrderId ? { ...order, status: "Dispatched" } : order
    );
    setOrders(updatedOrders);
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="p-6 bg-gray-50 text-lg min-h-screen">
      <h1 className="font-bold mb-4 text-gray-800">Admin Orders Management</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-100 text-left font-medium text-gray-700">
              <th className="px-4 py-2 border-b">Order ID</th>
              <th className="px-4 py-2 border-b">Customer Name</th>
              <th className="px-4 py-2 border-b">Phone Number</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Address</th>
              <th className="px-4 py-2 border-b">Order Details</th>
              <th className="px-4 py-2 border-b">Payment Method</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-gray-800">{order.id}</td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {order.customerName}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {order.phoneNumber}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {order.customerDetails}
                </td>
                <td className="px-4 py-2 border-b text-gray-800">
                  {order.address}
                </td>
                <td className="px-4 py-2 border-b font-bold text-gray-800">
                  <ul className="list-disc ml-4">
                    {order.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - {product.quantity} pcs (Size:{" "}
                        {product.size}) - ${product.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border-b text-green-500 font-bold">
                  {order.paymentMethod}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => openPopup(order.id)}
                    className={`px-4 py-2 rounded font-medium text-white transition ${
                      order.status === "Pending"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600"
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

      {/* Popup Component */}
      <StatusPopup
        isOpen={isPopupOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
