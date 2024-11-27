"use client";
import Popup from "@/utils/customer/page";
import React, { useState } from "react";
const Clients = () => {
  // Sample JSON data
  const clients = [
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 1,
      name: "John Doe",
      totalPurchases: 25,
      enteredOn: "2024-01-15",
      phoneNumber: "+1 234 567 890",
      email: "johndoe@example.com",
      totalcoupun: 3,
      totalammount: 1000,
    },
    {
      id: 2,
      name: "Jane Smith",
      totalPurchases: 30,
      enteredOn: "2024-02-10",
      phoneNumber: "+1 234 567 891",
      email: "janesmith@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
    {
      id: 3,
      name: "Alice Johnson",
      totalPurchases: 15,
      enteredOn: "2024-03-05",
      phoneNumber: "+1 234 567 892",
      email: "alicejohnson@example.com",
      totalammount: 1000,
      totalcoupun: 2,
    },
  ];
  const [showpopup, setpopup] = useState(false);
  const clickPopup = () => {
    console.log("triggered");
    setpopup(true);
  };

  const closePopup = () => {
    setpopup(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 font-Cabin text-2xl">
      <h1 className="text-3xl text-black font-bold text-center mb-6">
        Customer Data
      </h1>

      {/* Table */}
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
                Total amount
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Entered On
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Phone Number
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                Email
              </th>
              <th className="py-3 px-6 text-sm xl:text-xl font-semibold border border-gray-300">
                total Coupun
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
                className="hover:bg-[#000000de] hover:text-white text-left"
              >
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.name}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.totalPurchases}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.totalammount}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.enteredOn}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.phoneNumber}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.email}
                </td>
                <td className="py-3 px-6 text-sm xl:text-lg hover:text-white  border-t border-b border-l-2 border-black">
                  {client.totalcoupun}
                </td>
                <td className="py-3 px-6 text-sm text-center border-t border-b border-l-2 border-black">
                  <button
                    onClick={clickPopup}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showpopup && <Popup view={showpopup} onClose={closePopup} />}
    </div>
  );
};

export default Clients;
