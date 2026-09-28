import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ManageMilkBooth.css";

const ManageMilkBooth = () => {

  const [managers, setManagers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    milkBooth: "",
    mobile: "",
    address: ""
  });

  const API = "http://localhost:8080/api/milk-booth-managers";

  // Fetch all managers
  const fetchManagers = async () => {
    try {
      const res = await fetch(API);
      if (res.status === 204) {
        setManagers([]);
        return;
      }
      const data = await res.json();
      setManagers(data);
    } catch (error) {
      toast.error("Failed to load managers");
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);   // START spinner

  try {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const text = await res.text();

    if (!res.ok) {
      toast.error(text);
      setLoading(false);
      return;
    }

    toast.success(editId ? "Updated Successfully" : "Created Successfully");

    setFormData({
      name: "",
      email: "",
      password: "",
      milkBooth: "",
      mobile: "",
      address: ""
    });

    setEditId(null);
    fetchManagers();

  } catch (error) {
    toast.error("Operation failed");
  }

  setLoading(false);   // STOP spinner
};


  const handleEdit = (manager) => {
    setFormData(manager);
    setEditId(manager.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text);
        return;
      }

      toast.success("Deleted Successfully");
      fetchManagers();

    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="milkbooth-container">

      {/* Card Form */}
      <div className="form-card">
        <h2>{editId ? "Update MilkBooth Manager" : "Add MilkBooth Manager"}</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Manager Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input name="milkBooth" placeholder="Milk Booth Name" value={formData.milkBooth} onChange={handleChange} required />
          <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />

          <button type="submit" disabled={loading}>
  {loading ? (
    <span className="spinner"></span>
  ) : (
    editId ? "Update" : "Create"
  )}
</button>

        </form>
      </div>

      {/* Table */}
      <div className="table-card">
        <h2>MilkBooth Managers</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Milk Booth</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {managers.length === 0 ? (
              <tr>
                <td colSpan="5">No Data Found</td>
              </tr>
            ) : (
              managers.map((manager) => (
                <tr key={manager.id}>
                  <td>{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>{manager.milkBooth}</td>
                  <td>{manager.mobile}</td>
                  <td>
                    <button onClick={() => handleEdit(manager)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(manager.id)} className="delete-btn">Delete</button>
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

export default ManageMilkBooth;
