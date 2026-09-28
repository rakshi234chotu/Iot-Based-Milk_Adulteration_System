import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../background.png";
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: "USER",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();   // better to use json

    if (!response.ok) {
      toast.error(data || "Invalid credentials");
      return;
    }

    // ✅ Store in sessionStorage
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("userType", formData.userType);
    sessionStorage.setItem("isLoggedIn", "true");

    toast.success("Login Successful!");

    setTimeout(() => {
      if (formData.userType === "USER") {
        navigate("/userdashboard");
      } else if (formData.userType === "MANAGER") {
        navigate("/managerdashboard");
      } else if (formData.userType === "ADMIN") {
        navigate("/admindashboard");
      }
    }, 1000);

  } catch (error) {
    console.error("Login error:", error);
    toast.error("Server error. Please try again.");
  }
};


  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-overlay">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="USER">USER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
