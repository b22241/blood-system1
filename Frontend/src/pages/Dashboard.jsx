import { useEffect, useState } from "react";
import TempChart from "../components/TempChart";
import HumidityChart from "../components/HumidityChart";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [hasAlert, setHasAlert] = useState(false);
  const [latestTemp, setLatestTemp] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
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
        const latest = historyData.reduce((latest, item) =>
          new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest
        );
        setLatestTemp(latest.tempInside);
        setLastUpdated(latest.createdAt);
        setHasAlert(latest.tempInside < 2 || latest.tempInside > 6);
      } else {
        setHasAlert(false);
        setLatestTemp(null);
        setLastUpdated(null);
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

  // predicted temp at +5 min (horizon 30)
  const predAt5Min = predictions.length > 0
    ? predictions[predictions.length - 1].predictedTemp
    : null;

  // check if prediction goes out of safe range
  const predAlert = predictions.some(
    p => p.predictedTemp < 2 || p.predictedTemp > 6
  );

  return (
    <div style={{ padding: 10 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔴 / 🟢 CURRENT ALERT BOX */}
      {hasAlert ? (
        <div style={{
          backgroundColor: "#f8d7da", color: "#721c24",
          padding: "12px", borderRadius: "6px",
          marginTop: "30px", marginBottom: "10px", fontWeight: "bold"
        }}>
          🚨 ALERT: Latest temperature is OUT of safe range (2–6 °C)
        </div>
      ) : (
        <div style={{
          backgroundColor: "#d4edda", color: "#155724",
          padding: "12px", borderRadius: "6px",
          marginBottom: "15px", marginTop: "30px", fontWeight: "bold"
        }}>
          ✅ Latest temperature is within safe range
        </div>
      )}

      {/* 🔮 PREDICTION ALERT BOX */}
      {predictions.length > 0 && (
        predAlert ? (
          <div style={{
            backgroundColor: "#fff3cd", color: "#856404",
            padding: "12px", borderRadius: "6px",
            marginBottom: "15px", fontWeight: "bold"
          }}>
            ⚠️ WARNING: Temperature predicted to leave safe range in next 5 minutes!
          </div>
        ) : (
          <div style={{
            backgroundColor: "#cce5ff", color: "#004085",
            padding: "12px", borderRadius: "6px",
            marginBottom: "15px", fontWeight: "bold"
          }}>
             Prediction: Temperature expected to stay in safe range for next 5 minutes
          </div>
        )
      )}

      {/* 🔽 SENSOR SUMMARY */}
      {history.length > 0 && (() => {
        const latest = history.reduce((latest, item) =>
          new Date(item.createdAt) > new Date(latest.createdAt) ? item : latest
        );

        return (
          <div className="bg-white p-4 rounded-lg shadow-md text-center mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-800">
            <div>
              <p className="text-lg text-gray-600">Temp In</p>
              <p className="text-3xl font-medium">
                {latest.tempInside} <span className="text-lg">°C</span>
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-600">Temp Out</p>
              <p className="text-3xl font-medium">
                {latest.tempOutside} <span className="text-lg">°C</span>
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-600">Humidity Inside</p>
              <p className="text-3xl font-medium">
                {latest.humidityInside} <span className="text-lg">%</span>
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-600">Humidity Outside</p>
              <p className="text-3xl font-medium">
                {latest.humidityOutside} <span className="text-lg">%</span>
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-600">Latitude</p>
              <p className="text-3xl font-medium">
                {latest.location?.latitude ?? "0.000000"}°
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-600">Longitude</p>
              <p className="text-3xl font-medium">
                {latest.location?.longitude ?? "0.000000"}°
              </p>
            </div>

            {/* ✅ Now uses actual prediction data */}
            <div>
              <p className="text-lg text-gray-600">Predicted Temp (+5 min)</p>
              <p className="text-3xl font-medium"
                style={{ color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6) ? "#dc3545" : "#155724" }}>
                {predAt5Min !== null ? `${predAt5Min}°C` : "—"}
              </p>
            </div>
          </div>
        );
      })()}

      {/* 📈 TEMPERATURE HISTORY GRAPH */}
      <div style={{ height: "400px", marginTop: "40px" }}>
        <TempChart history={history} />
      </div>

      {/* 🔮 PREDICTION CHART */}
      {predictions.length > 0 && (
        <div style={{
          marginTop: "40px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "4px" }}>
            🔮 Temperature Forecast — Next 5 Minutes
          </h3>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>
            Current Temp: <strong>{currentPredTemp}°C</strong>
            &nbsp;|&nbsp;
            Predicted at +5min: <strong
              style={{ color: predAt5Min && (predAt5Min < 2 || predAt5Min > 6) ? "#dc3545" : "#28a745" }}>
              {predAt5Min}°C
            </strong>
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                interval={4}
                label={{ value: "Time Ahead", position: "insideBottom", offset: -2 }}
              />
              <YAxis
                domain={["auto", "auto"]}
                label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(val) => [`${val}°C`, "Predicted Temp"]} />
              <Legend />
              <ReferenceLine y={6} stroke="orange" strokeDasharray="4 4" label="Max (6°C)" />
              <ReferenceLine y={2} stroke="orange" strokeDasharray="4 4" label="Min (2°C)" />
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
      )}

    </div>
  );
}

export default Dashboard;