import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080";

  // ✅ Get manager from sessionStorage
  const managerData = JSON.parse(sessionStorage.getItem("user"));
  const managerId = managerData?.id;

  useEffect(() => {
    if (managerId) {
      fetchPendingPayments();
      fetchCompletedPayments();
    }
  }, [managerId]);

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/payment/pending/${managerId}`
      );

      // 🔥 Sort by request date (latest first)
      const sorted = res.data.sort(
        (a, b) =>
          new Date(b.paymentRequestDate) -
          new Date(a.paymentRequestDate)
      );

      setPayments(sorted);
      setLoading(false);
    } catch (err) {
      // toast.error("Failed to load pending payments");
      setLoading(false);
    }
  };

  const fetchCompletedPayments = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/payment/completed/${managerId}`
      );

      const sorted = res.data.sort(
        (a, b) =>
          new Date(b.paymentDate) - new Date(a.paymentDate)
      );

      setCompletedPayments(sorted);
    } catch (err) {
      // toast.error("Failed to load completed payments");
    }
  };

  // ✅ Make Payment
  const handleMakePayment = async (paymentId) => {
    if (!window.confirm("Confirm payment?")) return;

    try {
      await axios.post(
        `${BASE_URL}/api/payment/make/${paymentId}`
      );

      toast.success("Payment completed successfully");

      // Refresh list
      fetchPendingPayments();
      fetchCompletedPayments();

    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  if (loading) return <p>Loading pending payments...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Pending Payment Requests</h3>

      {payments.length === 0 && (
        <div className="alert alert-success">
          No pending payments 🎉
        </div>
      )}

      <div className="row">
        {payments.map((payment) => (
          <div className="col-md-6 mb-4" key={payment.id}>
            <div className="card shadow border-0 rounded-4">

              <div className="card-header bg-warning text-dark rounded-top-4">
                <strong>Payment Request</strong>
              </div>

              <div className="card-body">

                <h5 className="card-title text-center">
                  👤 {payment.user.username}
                </h5>

                <p className="mb-1 text-start" style={{marginLeft: '150px'}}>
                  📧 {payment.user.email}
                </p>

                <p className="mb-1 text-start" style={{marginLeft: '150px'}}>
                  📅 From: {payment.fromDate}
                </p>

                <p className="mb-1 text-start" style={{marginLeft: '150px'}}>
                  📅 To: {payment.toDate}
                </p>

                <p className="mb-1 text-start" style={{marginLeft: '150px'}}>
                  📝 Requested On: {payment.paymentRequestDate}
                </p>

                <h4 className="text-success mt-3 text-center">
                  ₹ {payment.amount}
                </h4>

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={() =>
                    handleMakePayment(payment.id)
                  }
                >
                  💰 Make Payment
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-5" />

      <div className="mt-5">
        <h3 className="mb-4">Successfully Completed Payments</h3>

        {completedPayments.length === 0 ? (
          <div className="alert alert-info">
            No completed payments yet
          </div>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-success">
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Request Date</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.user.username}</td>
                  <td>{payment.user.email}</td>
                  <td>{payment.fromDate}</td>
                  <td>{payment.toDate}</td>
                  <td>{payment.paymentRequestDate}</td>
                  <td>{payment.paymentDate}</td>
                  <td>₹ {payment.amount}</td>
                  <td>
                    <span className="badge bg-success">✓ Paid</span>
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

export default ManagePayments;
