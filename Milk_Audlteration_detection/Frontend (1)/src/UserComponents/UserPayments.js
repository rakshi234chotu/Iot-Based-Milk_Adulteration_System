import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserPayments = () => {
  const [records, setRecords] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const BASE_URL = "http://localhost:8080";

  // ✅ Get user from sessionStorage
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const userEmail = userData?.email;
  const userId = userData?.id;

  // 🔹 Fetch unpaid milk records
  useEffect(() => {
    if (userEmail) {
      fetchRecords();
    }
    if (userId) {
      fetchPendingPayments();
      fetchCompletedPayments();
    }
  }, [userEmail, userId]);

  const fetchRecords = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/api/milk-production/user/${userEmail}/payment-request-false`
    );

    // 🔥 Sort by date (Latest first)
    const sortedData = res.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    setRecords(sortedData);
    setLoading(false);
  } catch (err) {
    // toast.error("Failed to load payment records");
    setLoading(false);
  }
};

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/payment/user/${userId}/pending`);
      setPendingPayments(res.data);
    } catch (err) {
      toast.error("Failed to load pending payments");
    }
  };

  const fetchCompletedPayments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/payment/user/${userId}/completed`);
      setCompletedPayments(res.data);
    } catch (err) {
      toast.error("Failed to load completed payments");
    }
  };


  // ✅ Get managerId dynamically from records
  const milkBoothManagerId = records.length > 0
    ? records[0]?.milkBoothManager?.id
    : null;

  // 🔹 Calculate total
  const totalAmount = records.reduce(
    (sum, item) => sum + item.price,
    0
  );

  // 🔹 Date Range Payment
  const handleDateRangePayment = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Please select date range");
      return;
    }

    if (!milkBoothManagerId) {
      toast.error("Manager not found");
      return;
    }

    try {
      const payload = {
        userId,
        milkBoothManagerId,
        fromDate,
        toDate,
      };
      console.log("Payment request payload:", payload);
      
      await axios.post(`${BASE_URL}/api/payment/user/request`, payload);

      toast.success("Payment request sent successfully");
      fetchRecords();
      fetchPendingPayments();
    } catch (error) {
      toast.error("Failed to send payment request");
    }
  };

  // 🔹 Full Payment
  const handleFullPayment = async () => {
    if (!milkBoothManagerId) {
      toast.error("Manager not found");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/payment/request/all`, {
        userId,
        milkBoothManagerId,
      });

      toast.success("Full payment request sent successfully");
      fetchRecords();
      fetchPendingPayments();
    } catch (error) {
      toast.error("Failed to send full payment request");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Pending Milk Payments</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Weight (g)</th>
            <th>Price ₹</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.time}</td>
              <td>
                <span
                  className={
                    item.milkStatus === "PURE"
                      ? "badge bg-success"
                      : "badge bg-danger"
                  }
                >
                  {item.milkStatus}
                </span>
              </td>
              <td>{item.weightGrams}</td>
              <td>₹ {item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <h5>Total Pending Amount: ₹ {totalAmount}</h5>
      </div>

      <hr />

      {/* Date Range */}
      <div className="card p-3 mb-3">
        <h5>Request Payment by Date Range</h5>
        <div className="row">
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button
              className="btn btn-primary w-100"
              onClick={handleDateRangePayment}
              disabled={!records.length}
            >
              Request Payment
            </button>
          </div>
        </div>
      </div>

      {/* Full Payment */}
      <div className="card p-3">
        <h5>Request Full Pending Payment</h5>
        <button
          className="btn btn-success"
          onClick={handleFullPayment}
          disabled={!records.length}
        >
          Request Full Payment
        </button>
      </div>

      <hr className="my-5" />

      {/* Pending Payments Section */}
      <div className="mt-5">
        <h3 className="mb-4">Pending Payments</h3>
        {pendingPayments.length === 0 ? (
          <div className="alert alert-info">No pending payments</div>
        ) : (
          <table className="table table-bordered">
            <thead className="table-warning">
              <tr>
                <th>From Date</th>
                <th>To Date</th>
                <th>Amount ₹</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.fromDate}</td>
                  <td>{payment.toDate}</td>
                  <td>₹ {payment.amount}</td>
                  <td>{payment.paymentRequestDate}</td>
                  <td>
                    <span className="badge bg-warning text-dark">Pending</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Successful Payments Section */}
      <div className="mt-5">
        <h3 className="mb-4">Successful Payments</h3>
        {completedPayments.length === 0 ? (
          <div className="alert alert-info">No completed payments</div>
        ) : (
          <table className="table table-bordered">
            <thead className="table-success">
              <tr>
                <th>From Date</th>
                <th>To Date</th>
                <th>Amount ₹</th>
                <th>Request Date</th>
                <th>Payment Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.fromDate}</td>
                  <td>{payment.toDate}</td>
                  <td>₹ {payment.amount}</td>
                  <td>{payment.paymentRequestDate}</td>
                  <td>{payment.paymentDate || 'N/A'}</td>
                  <td>
                    <span className="badge bg-success">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserPayments;
