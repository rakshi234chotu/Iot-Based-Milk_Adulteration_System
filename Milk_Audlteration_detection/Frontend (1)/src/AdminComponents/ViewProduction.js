import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewProduction = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [data, startDate, endDate]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/milk-production/all`
      );

      // Sort latest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setData(sorted);
      setFilteredData(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      const itemDate = new Date(item.date);
      
      if (startDate && endDate) {
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      } else if (startDate) {
        return itemDate >= new Date(startDate);
      } else if (endDate) {
        return itemDate <= new Date(endDate);
      }
      return true;
    });

    setFilteredData(filtered);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(data);
  };

  // 📊 Summary Calculations for filtered data
  const totalAmount = filteredData.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const totalRecords = filteredData.length;

  const pureCount = filteredData.filter(
    (item) => item.milkStatus === "A Grade"
  ).length;

  const impureCount = filteredData.filter(
    (item) => item.milkStatus === "B Grade"
  ).length;

  const paidCount = filteredData.filter(
    (item) => item.paymentStatus === true
  ).length;

  // Additional calculations
  const pureTotalWeight = filteredData
    .filter((item) => item.milkStatus === "A Grade")
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const impureTotalWeight = filteredData
    .filter((item) => item.milkStatus === "B Grade")
    .reduce((sum, item) => sum + item.weightGrams, 0);

  const pureTotalAmount = filteredData
    .filter((item) => item.milkStatus === "A Grade")
    .reduce((sum, item) => sum + item.price, 0);

  const impureTotalAmount = filteredData
    .filter((item) => item.milkStatus === "B Grade")
    .reduce((sum, item) => sum + item.price, 0);

  const pendingPaymentCount = filteredData.filter(
    (item) => item.paymentStatus === false
  ).length;

  const pendingPaymentAmount = filteredData
    .filter((item) => item.paymentStatus === false)
    .reduce((sum, item) => sum + item.price, 0);

  if (loading) return (
    <div className="container-fluid mt-4 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-droplet"></i> Milk Production Dashboard
        </h2>
        <div className="text-muted">
          Total Records: {data.length} | Filtered: {filteredData.length}
        </div>
      </div>

      {/* 📅 DATE FILTER SECTION */}
      <div className="card shadow border-0 mb-4 bg-light">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-bold">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-counterclockwise"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MAIN SUMMARY CARDS - FIRST ROW */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 bg-gradient-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Records</h6>
                <h2 className="text-dark mb-0">{totalRecords}</h2>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-file-text text-primary fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Amount</h6>
                <h2 className="text-success mb-0"> {totalAmount.toLocaleString()}</h2>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-currency-rupee text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">A Grade Records</h6>
                <h2 className="text-info mb-0">{pureCount}</h2>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-check-circle text-info fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">B Grade Records</h6>
                <h2 className="text-danger mb-0">{impureCount}</h2>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-exclamation-triangle text-danger fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MILK QUALITY CARDS - SECOND ROW */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-muted">A Grade Milk (Liters)</h6>
                <h3 className="text-info mb-0">{(pureTotalWeight / 1000).toFixed(2)} L</h3>
                <small className="text-success">₹ {pureTotalAmount.toLocaleString()}</small>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle align-self-center">
                <i className="bi bi-droplet text-info fs-4"></i>
              </div>
            </div>
            <div className="progress mt-3" style={{ height: "8px" }}>
              <div 
                className="progress-bar bg-info" 
                style={{ width: `${(pureTotalWeight / (pureTotalWeight + impureTotalWeight || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-muted">B Grade Milk (Liters)</h6>
                <h3 className="text-danger mb-0">{(impureTotalWeight / 1000).toFixed(2)} L</h3>
                <small className="text-danger">₹ {impureTotalAmount.toLocaleString()}</small>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle align-self-center">
                <i className="bi bi-droplet-half text-danger fs-4"></i>
              </div>
            </div>
            <div className="progress mt-3" style={{ height: "8px" }}>
              <div 
                className="progress-bar bg-danger" 
                style={{ width: `${(impureTotalWeight / (pureTotalWeight + impureTotalWeight || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-muted">Total Milk Volume</h6>
                <h3 className="text-dark mb-0">{((pureTotalWeight + impureTotalWeight) / 1000).toFixed(2)} L</h3>
                <small className="text-primary">
                  A Grade: {((pureTotalWeight / (pureTotalWeight + impureTotalWeight || 1)) * 100).toFixed(1)}%
                </small>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle align-self-center">
                <i className="bi bi-cup-straw text-primary fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 PAYMENT STATUS CARDS - THIRD ROW */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-muted">Payments Completed</h6>
                <div className="d-flex align-items-baseline">
                  <h3 className="text-success mb-0">{paidCount}</h3>
                  <small className="text-muted ms-2">/ {totalRecords} records</small>
                </div>
                <small className="text-success">
                  ₹ {filteredData.filter(item => item.paymentStatus).reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                </small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle align-self-center">
                <i className="bi bi-check-circle text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-muted">Pending Payments</h6>
                <div className="d-flex align-items-baseline">
                  <h3 className="text-warning mb-0">{pendingPaymentCount}</h3>
                  <small className="text-muted ms-2">/ {totalRecords} records</small>
                </div>
                <small className="text-warning">
                  ₹ {pendingPaymentAmount.toLocaleString()}
                </small>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle align-self-center">
                <i className="bi bi-hourglass-split text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 TABLE */}
      <div className="card shadow border-0">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-table"></i> Production Records
          </span>
          <span className="badge bg-light text-dark">
            {filteredData.length} Records Found
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Manager</th>
                <th>Milk Status</th>
                <th>Weight (L)</th>
                <th>Price ₹</th>
                <th>Payment Request</th>
                <th>Payment Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="fw-semibold">{item.date}</span>
                    </td>
                    <td>{item.user?.username || "N/A"}</td>
                    <td>{item.milkBoothManager?.name || "N/A"}</td>

                    <td>
                      <span
                        className={`badge ${
                          item.milkStatus === "A Grade"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        <i className={`bi ${
                          item.milkStatus === "A Grade" 
                            ? "bi-check-circle" 
                            : "bi-exclamation-triangle"
                        } me-1`}></i>
                        {item.milkStatus}
                      </span>
                    </td>

                    <td className="fw-semibold">
                      {(item.weightGrams / 1000).toFixed(2)} L
                    </td>
                    
                    <td className="fw-semibold">
                      ₹ {item.price.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          item.paymentRequest
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {item.paymentRequest
                          ? "Requested"
                          : "Not Requested"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          item.paymentStatus
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {item.paymentStatus
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                    No records found for the selected date range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bootstrap Icons if not already included */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
};

export default ViewProduction;