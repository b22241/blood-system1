import { useEffect, useState } from "react";
import TempChart from "../components/TempChart";
import {
  Chart as ChartJS,
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Tooltip, Legend
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement, PointElement,
  LinearScale, CategoryScale,
  Tooltip, Legend, annotationPlugin
);

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

  // ── Chart.js prediction chart config ──
  const predChartData = {
    labels: predictions.map(p => p.label),
    datasets: [
      {
        label: "Predicted Temp (°C)",
        data: predictions.map(p => p.predictedTemp),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.15)",
        tension: 0.4,
        pointRadius: predictions.map(p =>
          p.predictedTemp < 2 || p.predictedTemp > 6 ? 6 : 3
        ),
        pointBackgroundColor: predictions.map(p =>
          p.predictedTemp < 2 || p.predictedTemp > 6 ? "red" : "green"
        ),
      }
    ]
  };

  const predChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      annotation: {
        annotations: {
          safeZone: {
            type: "box",
            yMin: 2,
            yMax: 6,
            backgroundColor: "rgba(0, 200, 0, 0.15)",
            borderWidth: 0,
            label: {
              display: true,
              content: "Safe Zone (2–6 °C)",
              position: "center",
              color: "green",
              font: { weight: "bold" }
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time Ahead",
          font: { weight: "bold", size: 22 }
        }
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
          font: { weight: "bold", size: 22 }
        }
      }
    }
  };

  return (
    <div style={{ padding: "8px 12px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ── ALERT BOXES ── */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
        <div style={{
          flex: 1, minWidth: "200px",
          backgroundColor: hasAlert ? "#f8d7da" : "#d4edda",
          color: hasAlert ? "#721c24" : "#155724",
          padding: "8px 14px", borderRadius: "6px",
          fontWeight: "bold", fontSize: "14px"
        }}>
          {hasAlert
            ? "🚨 ALERT: Temp OUT of safe range (2–6°C)"
            : "✅ Temp is within safe range (2–6°C)"}
        </div>
        {predictions.length > 0 && (
          <div style={{
            flex: 1, minWidth: "200px",
            backgroundColor: predAlert ? "#fff3cd" : "#cce5ff",
            color: predAlert ? "#856404" : "#004085",
            padding: "8px 14px", borderRadius: "6px",
            fontWeight: "bold", fontSize: "14px"
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
          gap: "8px", marginBottom: "10px"
        }}>
          {[
            { label: "Temp In",     value: `${latest.tempInside}°C` },
            { label: "Temp Out",    value: `${latest.tempOutside}°C` },
            { label: "Hum In",      value: `${latest.humidityInside}%` },
            { label: "Hum Out",     value: `${latest.humidityOutside}%` },
            { label: "Latitude",    value: `${latest.location?.latitude ?? "0.00"}°` },
            { label: "Longitude",   value: `${latest.location?.longitude ?? "0.00"}°` },
            {
              label: "Pred (+5min)",
              value: predAt5Min !== null ? `${predAt5Min}°C` : "—",
              color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6)
                ? "#dc3545" : "#155724"
            },
          ].map((card, i) => (
            <div key={i} style={{
              backgroundColor: "#fff", borderRadius: "8px",
              padding: "6px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
            }}>
              <p style={{ fontSize: "11px", color: "#888", margin: "0 0 2px" }}>{card.label}</p>
              <p style={{ fontSize: "17px", fontWeight: "600", margin: 0, color: card.color || "#1a1a1a" }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── TEMPERATURE HISTORY GRAPH ── */}
      <div style={{
        backgroundColor: "#fff", borderRadius: "8px",
        padding: "12px 16px", marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <h3 style={{ margin: "0 0 2px", fontSize: "15px" }}>📈 Temperature History</h3>
        <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>
          Current: <strong>{currentPredTemp}°C</strong>
        </p>
        <div style={{ height: "320px" }}>
          <TempChart history={history} />
        </div>
      </div>

      {/* ── PREDICTION GRAPH ── */}
      {predictions.length > 0 && (
        <div style={{
          backgroundColor: "#fff", borderRadius: "8px",
          padding: "12px 16px", marginBottom: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h3 style={{ margin: "0 0 2px", fontSize: "15px" }}>🔮 Temperature Forecast — Next 5 Min</h3>
          <p style={{ color: "#888", fontSize: "12px", margin: "0 0 8px" }}>
            Predicted at +5min:{" "}
            <strong style={{ color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6) ? "#dc3545" : "#28a745" }}>
              {predAt5Min !== null ? `${predAt5Min}°C` : "—"}
            </strong>
          </p>
          <div style={{ height: "320px" }}>
            <Line data={predChartData} options={predChartOptions} />
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;