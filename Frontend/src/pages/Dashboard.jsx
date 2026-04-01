import { useEffect, useState } from "react";
import TempChart from "../components/TempChart";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [hasAlert, setHasAlert] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [currentPredTemp, setCurrentPredTemp] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchPredictions() {
    try {
      const res = await fetch(`${API_URL}/predict`);
      const data = await res.json();
      setPredictions(data.predictions);
      setCurrentPredTemp(data.currentTemp);
    } catch (err) {
      console.error("Prediction fetch error:", err);
    }
  }

  async function fetchData() {
    try {
      const res = await fetch(`${API_URL}/history`);
      const historyData = await res.json();
      setHistory(historyData);
      if (historyData.length > 0) {
        const latest = historyData.reduce((a, b) =>
          new Date(a.createdAt) > new Date(b.createdAt) ? a : b
        );
        setHasAlert(latest.tempInside < 2 || latest.tempInside > 6);
      } else {
        setHasAlert(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchData();
    fetchPredictions();
    const interval = setInterval(() => {
      fetchData();
      fetchPredictions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const predAt5Min = predictions.length > 0
    ? predictions[predictions.length - 1].predictedTemp
    : null;

  const predAlert = predictions.some(
    p => p.predictedTemp < 2 || p.predictedTemp > 6
  );

  const latest = history.length > 0
    ? history.reduce((a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? a : b)
    : null;

  return (
    <div style={{ padding: "10px 16px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ── ALERT BOXES ── */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "10px", flexWrap: "wrap" }}>
        {/* Current temp alert */}
        <div style={{
          flex: 1, minWidth: "200px",
          backgroundColor: hasAlert ? "#f8d7da" : "#d4edda",
          color: hasAlert ? "#721c24" : "#155724",
          padding: "10px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px"
        }}>
          {hasAlert
            ? "🚨 ALERT: Temp OUT of safe range (2–6°C)"
            : "✅ Temp is within safe range (2–6°C)"}
        </div>

        {/* Prediction alert */}
        {predictions.length > 0 && (
          <div style={{
            flex: 1, minWidth: "200px",
            backgroundColor: predAlert ? "#fff3cd" : "#cce5ff",
            color: predAlert ? "#856404" : "#004085",
            padding: "10px 14px", borderRadius: "6px", fontWeight: "bold", fontSize: "14px"
          }}>
            {predAlert
              ? "⚠️ WARNING: Temp predicted to leave safe range in 5 min!"
              : "🔮 Prediction: Temp stable in safe range for next 5 min"}
          </div>
        )}
      </div>

      {/* ── COMPACT SENSOR CARDS ── */}
      {latest && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          marginBottom: "16px"
        }}>
          {[
            { label: "Temp In",       value: `${latest.tempInside}°C` },
            { label: "Temp Out",      value: `${latest.tempOutside}°C` },
            { label: "Hum In",        value: `${latest.humidityInside}%` },
            { label: "Hum Out",       value: `${latest.humidityOutside}%` },
            { label: "Latitude",      value: `${latest.location?.latitude ?? "0.00"}°` },
            { label: "Longitude",     value: `${latest.location?.longitude ?? "0.00"}°` },
            {
              label: "Pred (+5min)",
              value: predAt5Min !== null ? `${predAt5Min}°C` : "—",
              color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6) ? "#dc3545" : "#155724"
            },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "8px 6px",
              textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>
              <p style={{ fontSize: "11px", color: "#888", margin: "0 0 4px" }}>{card.label}</p>
              <p style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: card.color || "#1a1a1a" }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── BOTH GRAPHS SIDE BY SIDE ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* LEFT — Temperature History */}
        <div style={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>📈 Temperature History</h3>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 12px" }}>
            Current: <strong>{currentPredTemp}°C</strong>
          </p>
          <div style={{ height: "320px" }}>
            <TempChart history={history} />
          </div>
        </div>

        {/* RIGHT — Prediction Chart */}
        <div style={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "15px" }}>🔮 Temperature Forecast — Next 5 Min</h3>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 12px" }}>
            Predicted at +5min:{" "}
            <strong style={{ color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6) ? "#dc3545" : "#28a745" }}>
              {predAt5Min !== null ? `${predAt5Min}°C` : "—"}
            </strong>
          </p>
          <div style={{ height: "320px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  interval={4}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Time Ahead", position: "insideBottom", offset: -2, fontSize: 12 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Temp (°C)", angle: -90, position: "insideLeft", fontSize: 12 }}
                />
                <Tooltip formatter={(val) => [`${val}°C`, "Predicted Temp"]} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <ReferenceLine y={6} stroke="orange" strokeDasharray="4 4" label={{ value: "Max 6°C", fontSize: 11 }} />
                <ReferenceLine y={2} stroke="orange" strokeDasharray="4 4" label={{ value: "Min 2°C", fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="predictedTemp"
                  stroke="#e74c3c"
                  strokeWidth={2}
                  dot={false}
                  name="Predicted Temp"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;