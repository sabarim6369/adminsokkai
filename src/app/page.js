"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import ProductsPage from "./frontend/admin/Product/page";
import Signup from "@/utils/Popup/signup/page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp > currentTime) {
          setIsAuthenticated(true);
          // router.push("/frontend/admin/Product");
        } else {
          throw new Error("Token expired");
        }
      } catch (err) {
        console.error("Token validation failed:", err.message);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    // <div>{isAuthenticated ? <ProductsPage /> : <Signup onOpen={true} />}</div>
    <Signup onOpen={true} />
  );
}
