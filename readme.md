# 🩸 Blood Transportation System

A full-stack IoT-based blood transportation monitoring system that tracks **temperature**, **humidity**, and **GPS location** of blood units in real-time during transportation. The system ensures blood is kept within the safe temperature range (2°C – 6°C) and automatically controls a **Peltier cooling device** based on live sensor readings.

---

## 🌐 Live Demo

| Service | URL |
|--------|-----|
| 🖥️ Frontend | [blood-system-frontend.s3-website.ap-south-1.amazonaws.com](http://blood-system-frontend.s3-website.ap-south-1.amazonaws.com) |
---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Guide](#deployment-guide)
- [How It Works](#how-it-works)

---

## 📖 Overview

Blood products (RBCs, platelets, plasma) require strict temperature control during transportation. This system uses an **ESP32 microcontroller** with temperature and humidity sensors to continuously monitor conditions inside the blood storage unit. Data is sent to a **cloud backend** hosted on AWS EC2, stored in **MongoDB Atlas**, and visualized on a **React dashboard** hosted on AWS S3.

If the temperature goes outside the safe range (2°C – 6°C), the backend automatically signals the ESP32 to turn **ON** the Peltier cooling device.

---

## ✨ Features

- 📡 **Real-time sensor data** from ESP32 microcontroller
- 🌡️ **Temperature monitoring** — inside and outside the storage unit
- 💧 **Humidity monitoring** — inside and outside the storage unit
- 📍 **GPS location tracking** — latitude and longitude
- ❄️ **Automatic Peltier control** — ON/OFF based on temperature threshold
- 📊 **Live dashboard** with charts (temperature & humidity graphs)
- 📋 **Tabular results** — last 20 sensor readings
- 🔐 **API key authentication** — secure ESP32 communication
- ☁️ **Cloud hosted** — AWS EC2 + AWS S3 + MongoDB Atlas
- 🔄 **CI/CD pipeline** — auto deploy on every git push

---

## 🏗️ System Architecture

```
ESP32 Microcontroller
  (Temp + Humidity + GPS Sensors)
          │
          │ HTTP POST /upload
          │ Header: x-api-key
          ▼
┌─────────────────────────┐
│     AWS EC2 (Mumbai)    │
│   Node.js + Express     │◄──── MongoDB Atlas
│       + PM2             │      (Cloud Database)
└─────────────────────────┘
          ▲
          │ fetch("/history", "/status")
          │
┌─────────────────────────┐
│       AWS S3            │
│   React + Vite          │◄──── User's Browser
│  (Static Website)       │
└─────────────────────────┘
          ▲
          │ auto deploy
          │
┌─────────────────────────┐
│    GitHub Actions       │
│    CI/CD Pipeline       │◄──── git push (Developer)
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

### 🔧 Hardware
| Component | Description |
|-----------|-------------|
| **ESP32** | Microcontroller that reads sensors and sends data to the backend |
| **DHT22 / DS18B20** | Temperature and humidity sensors |
| **GPS Module** | Tracks real-time location of the blood unit |
| **Peltier Module** | Cooling device controlled by ESP32 based on backend decision |

---

### ⚛️ Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI component library for building the dashboard |
| **Vite** | Fast build tool — bundles React code into static HTML/CSS/JS |
| **Recharts** | Library for rendering temperature and humidity charts |
| **CSS** | Styling the dashboard and components |

> Vite compiles all React `.jsx` files into a static `dist/` folder that S3 can serve directly.

---

### ⚙️ Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime for running the server |
| **Express.js** | Web framework for handling HTTP routes |
| **Mongoose** | ODM (Object Document Mapper) for MongoDB |
| **dotenv** | Loads environment variables from `.env` file |
| **cors** | Allows frontend (S3) to call the backend (EC2) |

---

### 🗄️ Database
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose Schema** | Defines structure of sensor data documents |

Each document stored in MongoDB:
```json
{
  "tempInside": 4.5,
  "tempOutside": 28.3,
  "humidityInside": 65,
  "humidityOutside": 70,
  "location": {
    "latitude": 28.9845,
    "longitude": 77.7064
  },
  "peltier": "OFF",
  "createdAt": "2026-03-12T10:30:00Z"
}
```

---

### ☁️ Cloud Infrastructure (AWS)
| Service | Purpose |
|---------|---------|
| **AWS EC2 (t2.micro)** | Virtual server hosting the Node.js backend 24/7 |
| **Amazon Linux 2023** | OS running on the EC2 instance |
| **AWS S3** | Static website hosting for the React frontend |
| **IAM User** | Secure AWS credentials for GitHub Actions to deploy |
| **Security Groups** | Firewall rules — Port 22 (SSH), Port 5000 (API) |

---

### 🔄 DevOps & CI/CD
| Technology | Purpose |
|-----------|---------|
| **GitHub Actions** | CI/CD pipeline — auto build and deploy on every push |
| **PM2** | Process manager — keeps Node.js server running forever on EC2 |
| **GitHub Secrets** | Securely stores AWS keys and API URLs |
| **Git** | Version control |

---

## 📁 Project Structure

```
blood-system/
│
├── .github/
│   └── workflows/
│       └── main.yml          # GitHub Actions CI/CD pipeline
│
├── Backend/
│   ├── DB/
│   │   └── db.js             # MongoDB Atlas connection
│   ├── models/
│   │   └── SensorData.js     # Mongoose schema for sensor readings
│   ├── .env                  # Environment variables (not pushed to GitHub)
│   ├── .gitignore
│   ├── package.json
│   └── server.js             # Express server + API routes
│
├── Frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images, logos
│   │   ├── components/
│   │   │   ├── HumidityChart.jsx   # Humidity line chart
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── TempChart.jsx       # Temperature line chart
│   │   ├── Dashboard.jsx     # Main dashboard with charts
│   │   ├── Home.jsx          # Home/landing page
│   │   ├── Research.jsx      # Research work page
│   │   ├── TabularResult.jsx # Table of sensor readings
│   │   ├── App.jsx           # Root component + routing
│   │   ├── App.css
│   │   ├── main.jsx          # React entry point
│   │   └── index.css
│   ├── .env                  # VITE_API_URL (not pushed to GitHub)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📡 API Reference

### POST `/upload`
Receives sensor data from ESP32.

**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

**Request Body:**
```json
{
  "tempInside": 4.5,
  "tempOutside": 28.3,
  "humidityInside": 65,
  "humidityOutside": 70,
  "latitude": 28.9845,
  "longitude": 77.7064
}
```

**Response:**
```json
{
  "status": "ok",
  "decision": "OFF",
  "savedAt": "2026-03-12T10:30:00Z"
}
```

> `decision` is `"ON"` if tempInside < 2°C or > 6°C, otherwise `"OFF"`

---

### GET `/status`
Returns the latest sensor reading.

**Response:**
```json
{
  "tempInside": 4.5,
  "tempOutside": 28.3,
  "humidityInside": 65,
  "peltier": "OFF",
  "createdAt": "2026-03-12T10:30:00Z"
}
```

---

### GET `/history`
Returns the last 20 sensor readings (newest first).

**Response:**
```json
[
  { "tempInside": 4.5, "peltier": "OFF", "createdAt": "..." },
  { "tempInside": 6.8, "peltier": "ON",  "createdAt": "..." },
  ...
]
```

---

### GET `/health`
Health check endpoint.

**Response:**
```
OK
```

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bloodDB
PORT=5000
API_KEY=your_secret_api_key
```

### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://YOUR_EC2_IP:5000
```

> ⚠️ Never push `.env` files to GitHub. Both are listed in `.gitignore`.

---

## 🔄 CI/CD Pipeline

Every time you push code to the `main` branch, GitHub Actions automatically:

```
git push origin main
        │
        ▼
┌────────────────────────┐
│  1. Checkout Code      │  ← Downloads repo on GitHub's server
│  2. npm install        │  ← Installs React dependencies
│  3. npm run build      │  ← Vite compiles React → dist/
│  4. Configure AWS      │  ← Authenticates with AWS using secrets
│  5. aws s3 sync        │  ← Uploads dist/ to S3 bucket
└────────────────────────┘
        │
        ▼
   Website Updated! ✅
```

### `.github/workflows/main.yml`
```yaml
name: Blood System Deployment

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Dependencies
        working-directory: ./Frontend
        run: npm install
      - name: Build React App
        working-directory: ./Frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - name: Deploy to S3
        run: aws s3 sync ./Frontend/dist s3://blood-system-frontend --delete
```

---

## 🚀 Deployment Guide

### Backend (AWS EC2)

```bash
# 1. SSH into EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_IP

# 2. Clone repo
git clone https://github.com/YOUR_USERNAME/blood-system.git
cd blood-system/Backend

# 3. Create .env
nano .env

# 4. Install & start
npm install
pm2 start server.js --name "blood-system-backend"
pm2 startup
pm2 save
```

### Frontend (AWS S3)
Frontend deploys automatically via GitHub Actions on every push to `main`.

---

## ⚙️ How It Works

### Data Flow — ESP32 to Dashboard

```
1. ESP32 reads temperature, humidity, GPS every X seconds
2. ESP32 sends POST request to EC2 with sensor data + API key
3. EC2 validates API key → rejects unauthorized requests
4. EC2 checks temperature range (2°C – 6°C)
5. EC2 saves data to MongoDB Atlas
6. EC2 responds with Peltier decision (ON/OFF)
7. ESP32 controls Peltier based on decision
8. React Dashboard fetches /history from EC2
9. Charts and tables update with latest data
```

### Temperature Decision Logic

```
tempInside < 2°C  →  Peltier: ON  (too cold, stop cooling)
tempInside > 6°C  →  Peltier: ON  (too warm, start cooling)
2°C ≤ tempInside ≤ 6°C  →  Peltier: OFF  (safe range ✅)
```

---

## 👨‍💻 Author

**Suman Deep** — IIT Mandi  
Project developed for cold-chain blood transportation monitoring.

---

## 📄 License

This project is for academic and research purposes.