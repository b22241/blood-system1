import { useEffect, useState } from "react";
import TempChart from "../components/TempChart";
import HumidityChart from "../components/HumidityChart";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [hasAlert, setHasAlert] = useState(false);
  const [latestTemp, setLatestTemp] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchData() {
    try {
      const res = await fetch(`${API_URL}/history`);
      const historyData = await res.json();

      setHistory(historyData);

      if (historyData.length > 0) {
        const latest = historyData.reduce((latest, item) =>
          new Date(item.createdAt) > new Date(latest.createdAt)
            ? item
            : latest
        );

        setLatestTemp(latest.tempInside);
        setLastUpdated(latest.createdAt);

        const unsafe =
          latest.tempInside < 2 || latest.tempInside > 6;

        setHasAlert(unsafe);
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
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 10 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔴 / 🟢 ALERT BOX */}
      {hasAlert ? (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "12px",
            borderRadius: "6px",
            marginTop: "30px",
            marginBottom: "10px",
            fontWeight: "bold"
          }}
        >
          🚨 ALERT: Latest temperature is OUT of safe range (2–6 °C)
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "15px",
            marginTop: "30px",
            fontWeight: "bold"
          }}
        >
          ✅ Latest temperature is within safe range
        </div>
      )}

 

      {/* 🔽 SENSOR SUMMARY (SS DATA) */}
      {history.length > 0 && (() => {
        const latest = history.reduce((latest, item) =>
          new Date(item.createdAt) > new Date(latest.createdAt)
            ? item
            : latest
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

              <div>
              <p className="text-lg text-gray-600">Predicted Temperature</p>
              <p className="text-3xl font-medium">
                {((latest.tempInside + latest.tempOutside) / 2).toFixed(1)} <span className="text-lg">°C</span>
              </p>
            </div>

          </div>
        );
      })()}

      {/* 📈 GRAPH */}
      <div style={{ height: "400px", marginTop: "40px" }}>
        <TempChart history={history} />
      </div>

    </div>
  );
}

export default Dashboard;
