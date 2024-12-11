"use client";
import Popup from "@/utils/customer/page";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
const Clients = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [showPopup, setPopup] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientData, setClientData] = useState(null);

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
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);
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
        <p style={{ fontWeight: "bold", fontSize: "20px", marginTop: "20px" }}>
          Loading, please wait...
        </p>
      </div>
    );
  }
  const clickPopup = (clientId) => {
    console.log("Popup triggered for client with ID:", clientId);

    const selectedCustomer = clients.find((client) => client._id === clientId);
    console.log("selected customer : ", selectedCustomer);
    if (selectedCustomer) {
      setClientData(selectedCustomer);
      setPopup(true);
    } else {
      console.error("Customer not found!");
    }
  };

  const closePopup = () => {
    setPopup(false);
    setSelectedClientId(null);
    setClientData(null);
  };

  // useEffect(() => {
  //   if (selectedClientId) {
  //     const fetchClientDetails = async () => {
  //       try {
  //         const response = await axios.get(
  //           `/api/customer/getbyid?clientId=${selectedClientId}`
  //         );
  //         setClientData(response.data);
  //       } catch (error) {
  //         console.error("Error fetching client details:", error);
  //       }
  //     };
  //     fetchClientDetails();
  //   }
  // }, [selectedClientId]);

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
                    onClick={() => clickPopup(client._id)} // Pass the client _id here
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
      {showPopup && clientData && (
        <Popup view={showPopup} onClose={closePopup} data={clientData} />
      )}
    </div>
  );
};

export default Clients;
