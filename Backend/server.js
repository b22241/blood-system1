const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectToDb = require("./DB/db");
const SensorData = require("./models/SensorData");
const compression = require("compression");

const app = express();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(compression());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

// ESP32 / testUpload sends data
app.post("/upload", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {
    tempInside,
    tempOutside,
    humidityInside,
    humidityOutside,
    latitude,
    longitude
  } = req.body;

  // ✅ Validation
  if (
    tempInside == null ||
    tempOutside == null ||
    humidityInside == null ||
    humidityOutside == null ||
    latitude == null ||
    longitude == null
  ) {
    return res.status(400).json({ error: "Invalid sensor data" });
  }

  // 🔥 Decision logic
  const isUnsafe = tempInside < 2 || tempInside > 6;
  const decision = isUnsafe ? "ON" : "OFF";

  try {
    const data = await SensorData.create({
      tempInside,
      tempOutside,
      humidityInside,
      humidityOutside,
      location: { latitude, longitude },
      peltier: decision
    });
    res.json({
      status: "ok",
      decision,
      savedAt: data.createdAt
    });
  } catch (error) {
    console.error("❌ Error saving data / sending email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Latest status
app.get("/status", async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// History (latest 17 records)
app.get("/history", async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Predict next 5 minutes (30 horizons × 10sec = 300seccod)
app.get("/predict", async (req, res) => {
  try {
    const data = await SensorData.find()
      .sort({ createdAt: -1 })
      .limit(5);

    if (data.length < 2) {
      return res.status(400).json({ error: "Not enough data to predict" });
    }

    data.reverse();

    const rawTemps = data.map(d => d.tempInside);
    const rawHums  = data.map(d => d.humidityInside);

    const smooth = (arr, window) =>
      arr.map((_, i) => {
        const slice = arr.slice(Math.max(0, i - window + 1), i + 1);
        return slice.reduce((a, b) => a + b, 0) / slice.length;
      });

    const smoothedTemps = smooth(rawTemps, 3);
    const smoothedHums  = smooth(rawHums, 5);

    const currTemp = smoothedTemps[smoothedTemps.length - 1];
    const prevTemp = smoothedTemps[smoothedTemps.length - 2];
    const diffTemp = currTemp - prevTemp;

    const currHum = smoothedHums[smoothedHums.length - 1];
    const prevHum = smoothedHums[smoothedHums.length - 2];
    const diffHum = currHum - prevHum;

    const predictions = [];
    for (let h = 1; h <= 30; h++) {
      predictions.push({
        horizon:       h,
        seconds:       h * 10,
        label:         `+${h * 10}s`,
        predictedTemp: parseFloat((currTemp + diffTemp * h).toFixed(2)),
        predictedHum:  parseFloat((currHum  + diffHum  * h).toFixed(2)),
      });
    }

    res.json({
      currentTemp: parseFloat(currTemp.toFixed(2)),
      currentHum:  parseFloat(currHum.toFixed(2)),
      predictions
    });

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});


/* ======================
   START SERVER
====================== */

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server NOT started (DB error)", err);
  });
