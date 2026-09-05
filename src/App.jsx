import { useState, useEffect } from "react"
import "./App.css"

import {
  LayoutDashboard,
  Battery,
  Zap,
  ShieldCheck,
  Brain,
} from "lucide-react"

function App() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [batteryData, setBatteryData] = useState(null)

  // Connect to ESP32
  useEffect(() => {
    const getBatteryData = () => {
      fetch("http://192.168.173.239/api/battery")
        .then((response) => response.json())
        .then((data) => {
          console.log("ESP32 Data:", data)
          setBatteryData(data)
        })
        .catch((error) => {
          console.error("ESP32 connection error:", error)
        })
    }

    getBatteryData()

    const interval = setInterval(getBatteryData, 2000)

    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Battery Health",
      icon: <Battery size={20} />,
    },
    {
      name: "Charging",
      icon: <Zap size={20} />,
    },
    {
      name: "Safety",
      icon: <ShieldCheck size={20} />,
    },
    {
      name: "AI Prediction",
      icon: <Brain size={20} />,
    },
  ]

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          EV Monitor
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setActivePage(item.name)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <header className="topbar">
          <h1>{activePage}</h1>

          <div className="connection-status">
            <span className="status-dot"></span>
            ESP32 Connected
          </div>
        </header>

        {!batteryData ? (
          <div className="loading">
            Connecting to ESP32...
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {activePage === "Dashboard" && (
              <Dashboard batteryData={batteryData} />
            )}

            {/* BATTERY HEALTH */}
            {activePage === "Battery Health" && (
              <BatteryHealth batteryData={batteryData} />
            )}

            {/* CHARGING */}
            {activePage === "Charging" && (
              <Charging batteryData={batteryData} />
            )}

            {/* SAFETY */}
            {activePage === "Safety" && (
              <Safety batteryData={batteryData} />
            )}

            {/* AI */}
            {activePage === "AI Prediction" && (
              <AIPrediction batteryData={batteryData} />
            )}
          </>
        )}

      </main>
    </div>
  )
}


/* =========================
   DASHBOARD
========================= */

function Dashboard({ batteryData }) {
  const fireDetected = batteryData.fireDetected

  return (
    <div className="dashboard">

      {/* Emergency Banner */}
      {fireDetected && (
        <div className="emergency-banner">
          ⚠️ FIRE DETECTED — IMMEDIATE ATTENTION REQUIRED
        </div>
      )}

      {/* Cards */}
      <div className="cards">

        {/* Battery */}
        <div className="card">
          <Battery size={32} />

          <h3>Battery</h3>

          <h2>
            {batteryData.batteryPercentage}%
          </h2>

          <p>Battery Level</p>
        </div>


        {/* Voltage */}
        <div className="card">
          <Zap size={32} />

          <h3>Voltage</h3>

          <h2>
            {Number(batteryData.voltage).toFixed(2)} V
          </h2>

          <p>Battery Voltage</p>
        </div>


        {/* Current */}
        <div className="card">
          <Zap size={32} />

          <h3>Current</h3>

          <h2>
            {Number(batteryData.current).toFixed(2)} A
          </h2>

          <p>Battery Current</p>
        </div>


        {/* Safety */}
        <div
          className={
            fireDetected
              ? "card safety-card danger-card"
              : "card safety-card safe-card"
          }
        >
          <ShieldCheck size={32} />

          <h3>Safety</h3>

          <h2>
            {fireDetected
              ? "🔥 FIRE DETECTED"
              : "✓ SAFE"}
          </h2>

          <p>
            {fireDetected
              ? "Fire detected by sensor"
              : "All systems normal"}
          </p>
        </div>

      </div>


      {/* Temperature */}
      <section className="info-card">

        <h2>Battery Temperature</h2>

        <div className="temperature">

          <span>
            {Number(batteryData.temperature).toFixed(1)} °C
          </span>

          <span className="normal">
            Normal
          </span>

        </div>

      </section>

    </div>
  )
}


/* =========================
   BATTERY HEALTH
========================= */

function BatteryHealth({ batteryData }) {
  return (
    <section className="page-card">

      <Battery size={40} />

      <h2>Battery Health</h2>

      <div className="big-value">
        {batteryData.batteryHealth}%
      </div>

      <p>
        Battery condition: Excellent
      </p>

      <p>
        Estimated remaining life:{" "}
        <strong>
          {batteryData.lifeRemaining} years
        </strong>
      </p>

    </section>
  )
}


/* =========================
   CHARGING
========================= */

function Charging({ batteryData }) {
  return (
    <section className="page-card">

      <Zap size={40} />

      <h2>Charging Status</h2>

      <div className="charging-status">
        {batteryData.charging
          ? "Charging"
          : "Not Charging"}
      </div>

      <p>
        Voltage:{" "}
        {Number(batteryData.voltage).toFixed(2)} V
      </p>

      <p>
        Current:{" "}
        {Number(batteryData.current).toFixed(2)} A
      </p>

    </section>
  )
}


/* =========================
   SAFETY
========================= */

function Safety({ batteryData }) {
  const fireDetected = batteryData.fireDetected

  return (
    <section
      className={
        fireDetected
          ? "page-card safety-page danger-page"
          : "page-card safety-page safe-page"
      }
    >

      <ShieldCheck size={40} />

      <h2>Safety Monitoring</h2>

      <div
        className={
          fireDetected
            ? "safety-status danger-status"
            : "safety-status safe-status"
        }
      >
        {fireDetected
          ? "🔥 DANGER"
          : "✓ SAFE"}
      </div>


      <div className="safety-details">

        <div className="safety-item">
          <span>Temperature</span>

          <strong>
            {Number(batteryData.temperature).toFixed(1)} °C
          </strong>
        </div>


        <div className="safety-item">
          <span>Motor</span>

          <strong>
            {batteryData.motorON
              ? "ON"
              : "OFF"}
          </strong>
        </div>


        <div className="safety-item">
          <span>Fire Detection</span>

          <strong>
            {fireDetected
              ? "🔥 Fire Detected"
              : "Normal"}
          </strong>
        </div>

      </div>


      {fireDetected && (
        <div className="emergency-message">
          ⚠️ Emergency: Fire has been detected.
          Please inspect the vehicle immediately.
        </div>
      )}

    </section>
  )
}


/* =========================
   AI PREDICTION
========================= */

function AIPrediction({ batteryData }) {
  return (
    <section className="page-card">

      <Brain size={40} />

      <h2>AI Battery Prediction</h2>

      <div className="big-value">
        {batteryData.batteryHealth}%
      </div>

      <p>
        Current battery health is excellent.
      </p>

      <p>
        Estimated remaining battery life:{" "}
        <strong>
          {batteryData.lifeRemaining} years
        </strong>
      </p>

    </section>
  )
}


export default App