import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="user-container">

      {/* Sidebar */}
      <div className="user-sidebar">
        <h2 className="user-logo">Milk User</h2>

        <nav>
          <Link
            to="view-milk"
            className={location.pathname.includes("view-milk") ? "active" : ""}
          >
            View Milk
          </Link>

          <Link
            to="manage-payments"
            className={location.pathname.includes("manage-payments") ? "active" : ""}
          >
            Manage Payments
          </Link>

          <Link
            to="update-password"
            className={location.pathname.includes("update-password") ? "active" : ""}
          >
            Update Password
          </Link>

          <button onClick={handleLogout} className="user-logout">
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="user-content">
        <Outlet />
      </div>

    </div>
  );
};

export default UserDashboard;
