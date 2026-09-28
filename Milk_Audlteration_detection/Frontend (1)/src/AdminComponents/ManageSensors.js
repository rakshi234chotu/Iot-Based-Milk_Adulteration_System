import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaThermometerHalf,
  FaWeight,
  FaTint,
  FaFlask
} from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";

const ManageSensors = () => {

  const API = "http://localhost:8080/api/sensors";

  const [sensorId, setSensorId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    temperatureMin: "",
    temperatureMax: "",
    redFrequencyMin: "",
    redFrequencyMax: "",
    greenFrequencyMin: "",
    greenFrequencyMax: "",
    blueFrequencyMin: "",
    blueFrequencyMax: "",
    turbidityValueMin: "",
    turbidityValueMax: "",
    weightGramsMin: "",
    weightGramsMax: "",
    pHValueMin: "",
    pHValueMax: ""
  });

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      const res = await fetch(API);
      if (res.status === 204) return;
      const data = await res.json();
      if (data.length > 0) {
        setSensorId(data[0].id);
        setFormData(data[0]);
      }
    } catch {
      toast.error("Failed to load sensor config");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = sensorId ? "PUT" : "POST";
      const url = sensorId ? `${API}/${sensorId}` : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, Number(v)])
          )
        )
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text);
        setLoading(false);
        return;
      }

      toast.success(sensorId ? "Sensor Updated" : "Sensor Created");
      fetchSensors();

    } catch {
      toast.error("Operation failed");
    }

    setLoading(false);
  };

  // 🔥 Inline Styles
  const styles = {
    container: {
      padding: "30px",
      display: "flex",
      justifyContent: "center"
    },
    card: {
      background: "#fff",
      padding: "30px",
      borderRadius: "15px",
      width: "750px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "18px"
    },
    label: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: "600",
      width: "240px"
    },
    iconCircle: (color) => ({
      backgroundColor: color,
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "16px"
    }),
    inputs: {
      display: "flex",
      gap: "10px"
    },
    headerLabels: {
      display: "flex",
      gap: "10px",
      marginBottom: "8px",
      justifyContent: "flex-end"
    },
    headerLabel: {
      width: "90px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#666",
      textAlign: "center"
    },
    input: {
      width: "90px",
      padding: "6px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      textAlign: "center"
    },
    button: {
      marginTop: "20px",
      padding: "12px",
      width: "100%",
      borderRadius: "20px",
      border: "none",
      background: "linear-gradient(135deg, #00ccff, #007bff)",
      color: "#fff",
      cursor: "pointer"
    }
  };

  const SensorRow = ({ label, icon, color, minKey, maxKey, showHeader }) => (
    <>
      {showHeader && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ width: "240px" }}></div>
          <div style={styles.headerLabels}>
            <span style={styles.headerLabel}>Min</span>
            <span style={styles.headerLabel}>Max</span>
          </div>
        </div>
      )}
      <div style={styles.row}>
        <div style={styles.label}>
          <div style={styles.iconCircle(color)}>
            {icon}
          </div>
          <span>{label}</span>
        </div>

        <div style={styles.inputs}>
          <input
            style={styles.input}
            type="number"
            name={minKey}
            placeholder="Min"
            value={formData[minKey]}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="number"
            name={maxKey}
            placeholder="Max"
            value={formData[maxKey]}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 className="mb-4">
          {sensorId 
  ? "Update Sensor Threshold Level for GOOD Milk" 
  : "Create Sensor Threshold Level for GOOD Milk"}

        </h2>

        <form onSubmit={handleSubmit}>

          <SensorRow
            label="Temperature"
            icon={<FaThermometerHalf />}
            color="#ff5733"
            minKey="temperatureMin"
            maxKey="temperatureMax"
            showHeader={true}
          />

          <SensorRow
            label="Red Frequency"
            icon={<GiChemicalDrop />}
            color="#ff0000"
            minKey="redFrequencyMin"
            maxKey="redFrequencyMax"
          />

          <SensorRow
            label="Green Frequency"
            icon={<GiChemicalDrop />}
            color="#28a745"
            minKey="greenFrequencyMin"
            maxKey="greenFrequencyMax"
          />

          <SensorRow
            label="Blue Frequency"
            icon={<GiChemicalDrop />}
            color="#007bff"
            minKey="blueFrequencyMin"
            maxKey="blueFrequencyMax"
          />

          <SensorRow
            label="Turbidity"
            icon={<FaTint />}
            color="#17a2b8"
            minKey="turbidityValueMin"
            maxKey="turbidityValueMax"
          />

          {/* <SensorRow
            label="Weight Price (for 1 liter)"
            icon={<FaWeight />}
            color="#6f42c1"
            minKey="weightGramsMin"
            maxKey="weightGramsMax"
          /> */}

          <SensorRow
            label="pH Value"
            icon={<FaFlask />}
            color="#ffc107"
            minKey="pHValueMin"
            maxKey="pHValueMax"
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Processing..." :
              sensorId ? "Update" : "Create"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ManageSensors;
