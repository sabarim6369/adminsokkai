"use client";

import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
const CouponHistory = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupun");
        const data = await response.json();
        if (data.coupons) {
          setCoupons(data.coupons);
        } else {
          setError("No coupons found.");
        }
      } catch (error) {
        setError("Error fetching coupons: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
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
  

  if (error) {
    return <div>{error}</div>;
  }

  const handleViewMore = (couponId) => {
    const coupon = coupons.find((coupon) => coupon._id === couponId);
    setSelectedCoupon(coupon);
  };

  if (loading) {
    return <p>Loading coupons...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="min-h-screen bg-black-100 py-6 px-4 font-Cabin xl:text-xl">
      <h1 className="text-3xl font-bold text-black text-center mb-6">
        Coupon History
      </h1>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full bg-white border border-black">
          <thead>
            <tr className="text-left bg-gray-800 text-white">
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                S.No
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                Coupon Code
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                pricing
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                Status
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                created date
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                Claimed date
              </th>
              <th className="py-3 px-6 text-sm font-semibold border border-gray">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, index) => (
              <tr
                key={coupon._id}
                className="group hover:bg-black hover:text-white text-left"
              >
                <td className="py-3 px-6 text-sm text-gray-700 group-hover:text-white border-t border-b border-black">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-sm text-gray-700 group-hover:text-white border-t border-l-2 border-b border-black">
                  {coupon.coupun}
                </td>
                <td className="py-3 px-6 text-sm text-gray-700 group-hover:text-white border-t border-l-2 border-b border-black">
                  {coupon.pricing}
                </td>
                <td className="py-3 px-6 text-sm text-center group-hover:text-white border-t border-l-2 border-b border-black">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      coupon.status === "Availed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-sm text-gray-700 group-hover:text-white border-t border-l-2 border-b border-black">
                  {new Date(coupon.createdAt)
                    .toLocaleDateString("en-GB")
                    .split("/")
                    .join("/")}
                </td>
                <td className="py-3 px-6 text-sm text-left text-gray-700 group-hover:text-white border-t border-l-2 border-b border-black">
                  {new Date(coupon.updatedAt)
                    .toLocaleDateString("en-GB")
                    .split("/")
                    .join("/")}
                </td>

                <td className="py-3 px-6 text-sm text-gray-700 group-hover:text-white border-t border-l-2 border-b border-black">
                  {coupon.user ? coupon.user.name : "Yet to be Used"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View More Details */}
      {selectedCoupon && (
        <div className="mt-6 bg-white p-6 shadow-md rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Coupon Details</h2>
          <div>
            <p>
              <strong>Coupon Code:</strong> {selectedCoupon.coupun}
            </p>
            <p>
              <strong>Pricing:</strong> {selectedCoupon.pricing}
            </p>
            <p>
              <strong>Status:</strong> {selectedCoupon.status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedCoupon.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Availed At:</strong>{" "}
              {selectedCoupon.updatedAt
                ? new Date(selectedCoupon.updatedAt).toLocaleString()
                : "Not Availed"}
            </p>
            <p>
              <strong>Generated By:</strong>{" "}
              {selectedCoupon.generatedBy || "N/A"}
            </p>
            <p>
              <strong>Availed By:</strong> {selectedCoupon.availedBy || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponHistory;
