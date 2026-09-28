import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const UpdateProfile = () => {

  const API = "http://localhost:8080/updatePasswordForAdmin";

  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Load email from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const message = await response.text();

      if (response.ok) {
        toast.success(message);
        setFormData(prev => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        toast.error(message);
      }

    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ width: "450px" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">
            Update Password
          </h4>

          <form onSubmit={handleSubmit}>

            {/* Email (readonly) */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                readOnly
              />
            </div>

            {/* Old Password */}
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                className="form-control"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Update Password
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
