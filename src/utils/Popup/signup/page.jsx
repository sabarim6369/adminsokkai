"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./signup.css";
import { FaTimes } from "react-icons/fa";

const Signup = ({ onOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    whatsappNumber: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/Login" : "/api/Auth";
      const response = await axios.post(endpoint, formData);

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      toast.success(
        isLogin ? "Logged in successfully!" : "Account created successfully!"
      );

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.error || err.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    onOpen && (
      <div className="bg-gray-600 bg-opacity-50 fixed inset-0 flex justify-center items-center z-50">
        <div className="signup-container">
          <div className="form-card">
            <button onClick={onClose} className="text-white">
              <FaTimes />
            </button>
            <h1 className="form-header">{isLogin ? "Login" : "Signup"}</h1>
            <p className="form-subheader">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-button"
              >
                {isLogin ? "Signup" : "Login"}
              </button>
            </p>

            <form className="signup-form xl:w-96 w-80  md:w-96" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="whatsappNumber"
                    placeholder="WhatsApp Number"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}

              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading
                  ? isLogin
                    ? "Logging in..."
                    : "Creating account..."
                  : isLogin
                  ? "Login"
                  : "Create account"}
              </button>
            </form>
          </div>

          <ToastContainer />
        </div>
      </div>
    )
  );
};

export default Signup;
