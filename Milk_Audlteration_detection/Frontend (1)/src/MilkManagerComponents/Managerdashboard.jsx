import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./ManagerDashboard.css";

const ManagerDashboard = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="manager-container">

      {/* Sidebar */}
      <div className="manager-sidebar">
        <h2 className="manager-logo">Milk Manager</h2>

        <nav>
          <Link
            to="manage-users"
            className={location.pathname.includes("manage-users") ? "active" : ""}
          >
            Manage Users
          </Link>

          <Link
            to="manage-production"
            className={location.pathname.includes("manage-production") ? "active" : ""}
          >
            Manage Milk Production
          </Link>

          <Link
            to="view-production"
            className={location.pathname.includes("view-production") ? "active" : ""}
          >
            View Milk Production
          </Link>

          <Link
            to="manage-payments"
            className={location.pathname.includes("manage-payments") ? "active" : ""}
          >
            Manage Payments
          </Link>

          <Link
            to="manager-update-profile"
            className={location.pathname.includes("manager-update-profile") ? "active" : ""}
          >
            Update Profile
          </Link>

          <button onClick={handleLogout} className="manager-logout">
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="manager-content">
        <Outlet />
      </div>

    </div>
  );
};

export default ManagerDashboard;
