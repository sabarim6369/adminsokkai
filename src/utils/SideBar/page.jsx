"use client";
import React, { useState } from "react";
import { FaAddressBook, FaDiscourse, FaHome, FaTimes } from "react-icons/fa";
import Link from "next/link";
import CouponPopup from "../Popup/Coupun/page";
import AddProductForm from "../Popup/AddProduct/page";
import Stockavailability from "../Popup/stockavailability/page";
import GiftVoucherPopup from "../Popup/GiftPopup/page";
import Signup from "@/utils/Popup/signup/page";
const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coupunpopup, setcoupunpopup] = useState(false);
  const [AddProduct, setAddProduct] = useState(false);
  const [Stockavailability1, setstockavailability] = useState(false);
  const [giftvoucher, setgiftvoucher] = useState(false);
  const [signuppopup, setsignuppopup] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const togglesignup = () => {
    setsignuppopup(!signuppopup);
  };
  const toggleCouponPopup = () => {
    setcoupunpopup(!coupunpopup);
  };
  const ToggleAddProduct = () => {
    setAddProduct(!AddProduct);
  };
  const ToggleGiftVoucher = () => {
    setgiftvoucher(!giftvoucher);
  };
  const Togglestockavailability = () => {
    console.log("stockavailability popup passed");
    setstockavailability(!Stockavailability1);
  };

  return (
    <div className="flex max-h-full w-80 bg-gradient-to-br from-black via-gray-900 to-gray-800 font-Cabin xl:overflow-hidden">
      <button
        onClick={toggleSidebar}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 transition-all duration-700 transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Sidebar"
      >
        <div className="h-full px-5 bg-gradient-to-br from-black via-gray-900 to-gray-800 relative">
          <button
            onClick={toggleSidebar}
            className="text-white absolute top-4 right-4 focus:outline-none lg:hidden"
          >
            <FaTimes className="w-6 h-6" />
          </button>
          <ul className="space-y-8 font-medium mt-10">
            <li className="ml-3">
              <h1 className="text-3xl font-Cabin font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                SOKKAI
              </h1>
            </li>

            <li>
              <Link
                href="/"
                className="flex items-center gap-4 p-3 text-white rounded-lg hover:bg-purple-700"
              >
                <FaHome className="text-xl" />
                <span
                  className="text-xl"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent page reload
                    ToggleGiftVoucher(); // Your existing toggle logic
                  }}
                >
                  {" "}
                  Add Gifts
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/frontend/admin/coupunhistory"
                className="flex items-center gap-4 p-3 text-white rounded-lg hover:bg-purple-700"
              >
                <FaAddressBook className="text-xl" />
                <span className="text-xl">Coupon History</span>
              </Link>
            </li>

            <li>
              <Link
                href="/frontend/admin/customerdata"
                className="flex items-center gap-4 p-3 text-white rounded-lg hover:bg-purple-700"
              >
                <FaDiscourse className="text-xl" />
                <span className="text-xl">Customer Data</span>
              </Link>
            </li>
            <li>
              <Link
                href="/frontend/admin/orderawaiting"
                className="flex items-center gap-4 p-3 text-white rounded-lg hover:bg-purple-700"
              >
                <FaDiscourse className="text-xl" />
                <span className="text-xl">Pending Orders</span>
              </Link>
            </li>

            <li>
              <button
                onClick={togglesignup}
                className="flex items-center gap-4 p-3 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
              >
                <FaHome className="text-xl" />
                <span className="text-xl">Add Admin</span>
              </button>
            </li>
          </ul>
          <div className="flex flex-col items-center gap-5">
            <div
              onClick={toggleCouponPopup}
              className="bg-[#514f4f79] text-white p-6 mt-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center w-48 h-10 hover:bg-purple-600 hover:text-white cursor-pointer"
            >
              Add Coupon Data
            </div>
            <div
              onClick={ToggleAddProduct}
              className="bg-[#514f4f79] text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center w-48 h-10 hover:bg-purple-600 hover:text-white cursor-pointer"
            >
              Add New Product
            </div>
            <div
              onClick={Togglestockavailability}
              className="bg-[#514f4f79] text-white p-6 mb-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center w-48 h-10 hover:bg-purple-600 hover:text-white cursor-pointer"
            >
              View Product Stock
            </div>
          </div>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <CouponPopup value={coupunpopup} onClose={() => setcoupunpopup(false)} />
      <AddProductForm value={AddProduct} onClose={() => setAddProduct(false)} />
      <Stockavailability
        value={Stockavailability1}
        onClose={() => setstockavailability(false)}
      />
      <GiftVoucherPopup
        value={giftvoucher}
        onClose={() => setgiftvoucher(false)}
      />
      <Signup
        onOpen={signuppopup}
        onClose={() => setsignuppopup(!signuppopup)}
      />
    </div>
  );
};

export default SideBar;
