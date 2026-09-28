import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ManageUsers.css";

const ManageUsers = () => {

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Get Logged-in Manager from sessionStorage
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const managerId = storedUser?.id;

  const API = managerId
    ? `http://localhost:8080/api/users/manager/${managerId}`
    : null;


console.log("Generated API:", API);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    
    mobile: "",
    address: ""
  });

  // ✅ Fetch Users by Manager Id
  const fetchUsers = async () => {
    if (!API) return;

    try {
      const res = await fetch(API);

      if (res.status === 204) {
        setUsers([]);
        return;
      }

      if (!res.ok) {
        toast.error("Failed to fetch users");
        return;
      }

      const data = await res.json();
      setUsers(data);

    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    if (!managerId) {
      toast.error("Manager not logged in");
      return;
    }
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:8080/api/users/${editId}`
        : "http://localhost:8080/api/users";

      // attach manager id when creating user
      const payload = {
        ...formData,
        milkBoothManager: { id: managerId }
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text);
        setLoading(false);
        return;
      }

      toast.success(editId ? "User Updated" : "User Created");

      setFormData({
        username: "",
        email: "",
        password: "",
        mobile: "",
        address: ""
      });

      setEditId(null);
      fetchUsers();

    } catch {
      toast.error("Operation failed");
    }

    setLoading(false);
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
      address: user.address
    });
    setEditId(user.id);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    setDeleteLoadingId(id);

    try {
      const res = await fetch(`http://localhost:8080/api/users/${id}`, {
        method: "DELETE"
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text);
        setDeleteLoadingId(null);
        return;
      }

      toast.success("User Deleted");
      fetchUsers();

    } catch {
      toast.error("Delete failed");
    }

    setDeleteLoadingId(null);
  };

  return (
    <div className="users-container">

      {/* Form Card */}
      <div className="form-card">
        <h2>{editId ? "Update User" : "Add User"}</h2>

        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username"
            value={formData.username} onChange={handleChange} required />

          <input name="email" placeholder="Email"
            value={formData.email} onChange={handleChange} required />

          <div style={{ position: "relative" }}>
            <input 
              name="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ paddingRight: "40px" }}
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>


          <input name="mobile" placeholder="Mobile"
            value={formData.mobile} onChange={handleChange} required />

          <input name="address" placeholder="Address"
            value={formData.address} onChange={handleChange} required />

          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> :
              editId ? "Update" : "Create"}
          </button>
        </form>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <h2>Users</h2>

        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Milk Booth</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5">No Users Found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{storedUser.milkBooth}</td>
                  <td>{user.mobile}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-btn"
                      disabled={deleteLoadingId === user.id}
                    >
                      {deleteLoadingId === user.id
                        ? <span className="small-spinner"></span>
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ManageUsers;
