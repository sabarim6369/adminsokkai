"use client";
import Popup from "@/utils/customer/page";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Clients = () => {
  const [clients, setClients] = useState([]); 
  const [showPopup, setPopup] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get("/api/customer/clientdata");
        console.log(response.data);
        const data = response.data;
        if (data && data.users) {
          console.log("data : ", data);
          setClients(data.users);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchClientData();
  }, []);

  const clickPopup = () => {
    console.log("Popup triggered");
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 font-Cabin text-2xl">
      <h1 className="text-3xl text-black font-bold text-center mb-6">
        Customer Data
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="text-left bg-gray-800 text-white">
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Name
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Total Purchases
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Total Amount
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Address
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Phone Number
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Email
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Total Coupon
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                View More
              </th>
            </tr>
          </thead>
          <tbody className="text-black">
            {clients.map((client, index) => (
              <tr
                key={index}
                className="hover:bg-[#000000de]  hover:text-white text-left"
              >
                <td className="py-3 px-6 text-sm  xl:text-lg hover:text-white border-t border-b border-l-2 border-black">
                  {client.name || "N/A"}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white border-t border-b border-l-2 border-black">
                  {client.purchaseHistory &&
                  Array.isArray(client.purchaseHistory)
                    ? client.purchaseHistory.length
                    : 0}{" "}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg  hover:text-white border-t border-b border-l-2 border-black">
                  {client.purchaseHistory &&
                  Array.isArray(client.purchaseHistory)
                    ? client.purchaseHistory.reduce(
                        (total, purchase) =>
                          total + (purchase.totalAmount || 0),
                        0
                      )
                    : 0}{" "}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white border-t border-b border-l-2 border-black max-w-xs break-words overflow-hidden text-ellipsis">
                  {client.address &&
                  Array.isArray(client.address) &&
                  client.address[0]
                    ? client.address[0].address || "N/A"
                    : "N/A"}
                </td>

                <td className="py-3 px-6 text-wrap w- text-sm xl:text-lg hover:text-white border-t border-b border-l-2 border-black">
                  {client.address &&
                  Array.isArray(client.address) &&
                  client.address[0]
                    ? client.address[0].phone || "N/A"
                    : "N/A"}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white border-t border-b border-l-2 border-black">
                  {client.email || "N/A"}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white border-t border-b border-l-2 border-black">
                  {client.totalCoupon || 0}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg text-center border-t border-b border-l-2 border-black">
                  <button
                    onClick={clickPopup}
                    className="w-24 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && <Popup view={showPopup} onClose={closePopup} />}
    </div>
  );
};

export default Clients;
