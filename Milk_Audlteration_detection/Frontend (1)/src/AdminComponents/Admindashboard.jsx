import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">Milk Admin</h2>

        <nav>
          <Link to="manage-milkbooth">Manage MilkBooth</Link>
          <Link to="manage-sensors">Manage Sensors</Link>
          <Link to="view-production">View Milk Production</Link>
          <Link to="update-profile">Update Profile</Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminDashboard;
