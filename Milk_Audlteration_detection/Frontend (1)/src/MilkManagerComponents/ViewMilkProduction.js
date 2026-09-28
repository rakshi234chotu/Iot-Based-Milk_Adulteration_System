import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ViewProduction = () => {

  const API = "http://localhost:8080/api/milk-production";
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const managerEmail = sessionUser?.email;

  const [productions, setProductions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    if (managerEmail) fetchProductions();
  }, [managerEmail]);

  // 🔥 Fetch Data
  const fetchProductions = async () => {
    try {
      const res = await fetch(`${API}/manager/${managerEmail}`);
      if (!res.ok) return;

      const data = await res.json();

      const sorted = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setProductions(sorted);
      setFiltered(sorted);

    } catch {
      toast.error("Failed to load productions");
    }
  };

  // 📅 Apply Filter
  const applyFilter = () => {
    let temp = [...productions];

    if (fromDate && toDate) {
      temp = temp.filter(item =>
        item.date >= fromDate && item.date <= toDate
      );
    }


    setFiltered(temp);
    setCurrentPage(1);
  };

  // 🔄 Reset Filter
  const resetFilter = () => {
    setFromDate("");
    setToDate("");
    setMonth("");
    setFiltered(productions);
    setCurrentPage(1);
  };

  // 📊 Calculations
  const totalEarnings = filtered.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const today = new Date().toISOString().split("T")[0];

  const todayTotal = filtered
    .filter(item => item.date === today)
    .reduce((sum, item) => sum + item.price, 0);

  const pureLiters = filtered
    .filter(item => item.milkStatus === "A Grade")
    .reduce((sum, item) => sum + item.weightGrams / 1000, 0);

  const notPureLiters = filtered
    .filter(item => item.milkStatus === "B Grade")
    .reduce((sum, item) => sum + item.weightGrams / 1000, 0);

  // 📄 Pagination
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / recordsPerPage);

  // 🔥 Export PDF
  

 const exportPDF = () => {
  const doc = new jsPDF();

  let y = 20;

  // ===== TITLE =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("Milk Production Report", 14, y);

  y += 8;

  // ===== SUBTITLE =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Manager: ${managerEmail}`, 14, y);

  y += 6;

  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, y);

  y += 12;

  // ===== SUMMARY SECTION =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("Summary", 14, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);

  doc.text(`Total Earnings: Rs. ${totalEarnings.toFixed(2)}`, 14, y);
  y += 7;

  doc.text(`Today's Total: Rs. ${todayTotal.toFixed(2)}`, 14, y);
  y += 7;

  doc.text(`A Grade Liters: ${pureLiters.toFixed(2)} L`, 14, y);
  y += 7;

  doc.text(`B Grade Liters: ${notPureLiters.toFixed(2)} L`, 14, y);

  y += 10;

  // ===== TABLE =====
  autoTable(doc, {
    startY: y,
    head: [["Date", "Milk Man", "Time", "Weight (L)", "Status", "Price (Rs)"]],
    body: filtered.map(item => [
      item.date,
      item.user?.username,
      item.time,
      (item.weightGrams / 1000).toFixed(2),
      item.milkStatus,
      `Rs. ${item.price.toFixed(2)}`
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [0, 123, 255],
      textColor: 255,
      halign: "center"
    },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "left" },
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "center" },
      5: { halign: "right" }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 14, right: 14 }
  });

  // ===== FOOTER PAGE NUMBERS =====
  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save("MilkProductionReport.pdf");
};



  const styles = {
    container: { padding: "20px" },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "15px",
      marginBottom: "20px"
    },
    summaryCard: (color) => ({
      background: color,
      padding: "15px",
      borderRadius: "10px",
      color: "#fff",
      textAlign: "center"
    }),
    input: {
      padding: "6px",
      marginRight: "10px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    thtd: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "center"
    },
    button: {
      padding: "6px 12px",
      margin: "5px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      background: "#007bff",
      color: "#fff"
    }
  };

  return (
    <div style={styles.container}>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard("#007bff")}>
          <h4>Total Earnings</h4>
          <h3>₹ {totalEarnings.toFixed(2)}</h3>
        </div>

        <div style={styles.summaryCard("#28a745")}>
          <h4>Today's Total</h4>
          <h3>₹ {todayTotal.toFixed(2)}</h3>
        </div>

        <div style={styles.summaryCard("#17a2b8")}>
          <h4>A Grade Liters</h4>
          <h3>{pureLiters.toFixed(2)} L</h3>
        </div>

        <div style={styles.summaryCard("#dc3545")}>
          <h4>B Grade Liters</h4>
          <h3>{notPureLiters.toFixed(2)} L</h3>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.card}>
        <input type="date" style={styles.input}
          value={fromDate}
          onChange={(e)=>setFromDate(e.target.value)} />

        <input type="date" style={styles.input}
          value={toDate}
          onChange={(e)=>setToDate(e.target.value)} />

        

        <button style={styles.button} onClick={applyFilter}>
          Apply Filter
        </button>

        <button
          style={{...styles.button, background:"#6c757d"}}
          onClick={resetFilter}
        >
          Reset
        </button>

        <button
          style={{...styles.button, background:"#28a745"}}
          onClick={exportPDF}
        >
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thtd}>Date</th>
              <th style={styles.thtd}>Milk Man</th>
              <th style={styles.thtd}>Time</th>
              <th style={styles.thtd}>Weight (L)</th>
              <th style={styles.thtd}>Status</th>
              <th style={styles.thtd}>Price</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map(item => (
              <tr key={item.id}>
                <td style={styles.thtd}>{item.date}</td>
                <td style={styles.thtd}>{item.user?.username}</td>
                <td style={styles.thtd}>{item.time}</td>
                <td style={styles.thtd}>{(item.weightGrams / 1000).toFixed(2)}</td>
                <td style={{
                  ...styles.thtd,
                  color: item.milkStatus === "A Grade" ? "green" : "red",
                  fontWeight: "bold"
                }}>
                  {item.milkStatus}
                </td>
                <td style={styles.thtd}>₹ {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ textAlign:"center", marginTop:"15px" }}>
          {Array.from({length: totalPages}, (_,i)=>(
            <button
              key={i}
              style={styles.button}
              onClick={()=>setCurrentPage(i+1)}
            >
              {i+1}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
};

export default ViewProduction;
