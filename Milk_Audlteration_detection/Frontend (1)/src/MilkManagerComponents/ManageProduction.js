import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import mqtt from "mqtt";
import {
  FaUser,
  FaCalendarAlt,
  FaSun,
  FaThermometerHalf,
  FaWeight,
  FaFlask
} from "react-icons/fa";
import { GiChemicalDrop } from "react-icons/gi";
import { MdWaterDrop } from "react-icons/md";

const ManageProduction = () => {

  const API = "http://localhost:8080/api/milk-production";

  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  const managerId = sessionUser?.id;

  const [loading, setLoading] = useState(false);
  const [mqttLoading, setMqttLoading] = useState(false);
  const mqttClient = useRef(null);

  const [formData, setFormData] = useState({
    userId: "",
    milkBoothManagerId: managerId,
    date: "",
    time: "morning",
    temperature: "",
    redFrequency: "",
    greenFrequency: "",
    blueFrequency: "",
    turbidityValue: "",
    weightGrams: "",
    pHValue: ""
  });

  /* ================= MQTT CONNECTION ================= */

  const fetchMQTTData = () => {
    setMqttLoading(true);
    toast.info("Connecting to MQTT...");

    mqttClient.current = mqtt.connect("wss://broker.hivemq.com:8884/mqtt", {
      clientId: "react_fetch_" + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 1000
    });

    mqttClient.current.on("connect", () => {
      console.log("MQTT Connected");
      mqttClient.current.subscribe("milksupplydata");
      toast.success("MQTT Connected - Waiting for data...");
    });

    mqttClient.current.on("message", (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());

        console.log(data)

        if (Array.isArray(data) && data.length === 7) {
          setFormData(prev => ({
            ...prev,
            temperature: Number(data[0]).toFixed(2),
            redFrequency: Number(data[1]).toFixed(2),
            greenFrequency: Number(data[2]).toFixed(2),
            blueFrequency: Number(data[3]).toFixed(2),
            turbidityValue: Number(data[4]).toFixed(2),
            weightGrams: Number(data[5]).toFixed(2),
            pHValue: Number(data[6]).toFixed(2)
          }));

          setMqttLoading(false);
          toast.success("MQTT Data Received ✅");
          mqttClient.current?.end();
        }
      } catch {
        setMqttLoading(false);
        toast.error("Invalid MQTT Data Format ❌");
        mqttClient.current?.end();
      }
    });

    mqttClient.current.on("error", () => {
      setMqttLoading(false);
      toast.error("MQTT Connection Failed ❌");
      mqttClient.current?.end();
    });
  };

  /* ================= FORM HANDLING ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          milkBoothManagerId: managerId,
          temperature: Number(formData.temperature),
          redFrequency: Number(formData.redFrequency),
          greenFrequency: Number(formData.greenFrequency),
          blueFrequency: Number(formData.blueFrequency),
          turbidityValue: Number(formData.turbidityValue),
          weightGrams: Number(formData.weightGrams),
          pHValue: Number(formData.pHValue)
        })
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text);
        setLoading(false);
        return;
      }

      toast.success("Milk Production Added 🎉");

    } catch {
      toast.error("Operation failed ❌");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  const styles = {
    container: { padding: "20px" },
    card: {
      background: "#fff",
      padding: "25px",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      marginBottom: "30px"
    },
    icon: (color) => ({
      backgroundColor: color,
      width: "36px",
      height: "36px",
      minWidth: "36px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: "16px",
      flexShrink: 0
    }),
    input: {
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      width: "100%"
    },
    button: {
      marginTop: "15px",
      padding: "10px",
      width: "100%",
      borderRadius: "20px",
      border: "none",
      background: "linear-gradient(135deg, #00ccff, #007bff)",
      color: "#fff",
      cursor: "pointer"
    }
  };

  const readOnlyFields = [
    "temperature",
    "redFrequency",
    "greenFrequency",
    "blueFrequency",
    "turbidityValue",
    "weightGrams",
    "pHValue"
  ];

  const InputRow = ({ label, icon, color, name, type = "text", select }) => (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "12px"
    }}>
      <div style={styles.icon(color)}>
        {icon}
      </div>
      <div style={{
        width: "140px",
        fontWeight: "600",
        textAlign: "left",
        whiteSpace: "nowrap"
      }}>
        {label}
      </div>
      <div style={{ flex: 1 }}>
        {select ? (
          <select
            style={styles.input}
            name={name}
            value={formData[name]}
            onChange={handleChange}
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        ) : (
          <input
            style={styles.input}
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            readOnly={readOnlyFields.includes(name)}
            required
          />
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
     
      <div style={styles.card}>
       <h2 className="mb-4">Add Milk Production</h2>  

        <form onSubmit={handleSubmit}>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px"
          }}>

            <InputRow label="User ID" icon={<FaUser />} color="#6f42c1" name="userId" />
            <InputRow label="Date" icon={<FaCalendarAlt />} color="#17a2b8" name="date" type="date" />

            <InputRow label="Time" icon={<FaSun />} color="#ffc107" name="time" select />
            <InputRow label="Temperature" icon={<FaThermometerHalf />} color="#ff5733" name="temperature" />

            <InputRow label="Red Frequency" icon={<GiChemicalDrop />} color="#ff0000" name="redFrequency" />
            <InputRow label="Green Frequency" icon={<GiChemicalDrop />} color="#28a745" name="greenFrequency" />

            <InputRow label="Blue Frequency" icon={<GiChemicalDrop />} color="#007bff" name="blueFrequency" />
            <InputRow label="Turbidity" icon={<MdWaterDrop />} color="#17a2b8" name="turbidityValue" />

            <InputRow label="Weight (grams)" icon={<FaWeight />} color="#6f42c1" name="weightGrams" />
            <InputRow label="pH Value" icon={<FaFlask />} color="#ffc107" name="pHValue" />

          </div>

          <button
            type="button"
            style={{
              ...styles.button,
              background: "linear-gradient(135deg, #28a745, #20c997)"
            }}
            onClick={fetchMQTTData}
            disabled={mqttLoading}
          >
            {mqttLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Waiting for MQTT Data...
              </>
            ) : (
              "Fetch MQTT Data"
            )}
          </button>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ManageProduction;
