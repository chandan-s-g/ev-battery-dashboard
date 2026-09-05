import { useState, useEffect } from "react"
import "./App.css"

import {
  LayoutDashboard,
  Battery,
  Zap,
  ShieldCheck,
  Brain,
  Thermometer,
  Car,
  Activity,
  Clock,
  Gauge,
  Wrench,
  Map,
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

function App() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [batteryData, setBatteryData] = useState(null)
  const [connected, setConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState("")
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const getBatteryData = () => {
      fetch(
        "https://api.thingspeak.com/channels/3482326/feeds/last.json"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("ThingSpeak connection failed")
          }

          return response.json()
        })
        .then((data) => {
          console.log("ThingSpeak Data:", data)

          const convertedData = {
            voltage: Number(data.field1) || 0,
            current: Number(data.field2) || 0,
            temperature: Number(data.field3) || 0,
            batteryPercentage: Number(data.field4) || 0,
            batteryHealth: Number(data.field5) || 0,
            lifeRemaining: Number(data.field6) || 0,
            fireDetected: Number(data.field7) === 1,
            motorON: Number(data.field8) === 1,
            charging: Number(data.field2) > 0.05,
          }

          setBatteryData(convertedData)
          setConnected(true)

          const graphPoint = {
            time: data.created_at
              ? new Date(data.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : new Date().toLocaleTimeString(),

            battery: Number(data.field4) || 0,
            voltage: Number(data.field1) || 0,
            current: Number(data.field2) || 0,
            temperature: Number(data.field3) || 0,
          }

          setChartData((previousData) => {
            const updatedData = [...previousData, graphPoint]

            return updatedData.slice(-20)
          })

          if (data.created_at) {
            const date = new Date(data.created_at)

            setLastUpdated(
              date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            )
          }
        })
        .catch((error) => {
          console.error("ThingSpeak connection error:", error)
          setConnected(false)
        })
    }

    getBatteryData()

    const interval = setInterval(getBatteryData, 5000)

    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "Battery Health",
      icon: <Battery size={19} />,
    },
    {
      name: "Charging",
      icon: <Zap size={19} />,
    },
    {
      name: "Safety",
      icon: <ShieldCheck size={19} />,
    },
    {
      name: "AI Prediction",
      icon: <Brain size={19} />,
    },
    {
      name: "Driving Style Analysis",
      icon: <Car size={19} />,
    },
    {
      name: "Predictive Maintenance",
      icon: <Wrench size={19} />,
    },
    {
      name: "Range Prediction",
      icon: <Map size={19} />,
    },
    {
      name: "Energy Consumption",
      icon: <Gauge size={19} />,
    },
  ]

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <span className="logo-icon">⚡</span>
          EV MONITOR
        </div>

        <div className="sidebar-label">
          VEHICLE SYSTEM
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

        <div className="sidebar-bottom">
          <div className="system-status">

            <span
              className={
                connected
                  ? "status-dot online"
                  : "status-dot offline"
              }
            ></span>

            <div>
              <strong>
                {connected ? "SYSTEM ONLINE" : "OFFLINE"}
              </strong>

              <small>
                {connected
                  ? "Cloud synchronized"
                  : "Connection lost"}
              </small>
            </div>

          </div>
        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <div>
            <div className="page-label">
              EV BATTERY MANAGEMENT SYSTEM
            </div>

            <h1>{activePage}</h1>
          </div>

          <div className="topbar-right">

            <div className="last-update">
              <Clock size={15} />

              <span>
                Updated {lastUpdated || "--:--:--"}
              </span>
            </div>

            <div className="connection-status">

              <span
                className={
                  connected
                    ? "status-dot online"
                    : "status-dot offline"
                }
              ></span>

              {connected
                ? "Cloud Connected"
                : "Connecting..."}

            </div>

          </div>

        </header>

        {!batteryData ? (

          <div className="loading">
            <div className="loading-circle"></div>
            <span>Connecting to EV Cloud...</span>
          </div>

        ) : (

          <>

            {activePage === "Dashboard" && (
              <Dashboard
                batteryData={batteryData}
                chartData={chartData}
              />
            )}

            {activePage === "Battery Health" && (
              <BatteryHealth batteryData={batteryData} />
            )}

            {activePage === "Charging" && (
              <Charging batteryData={batteryData} />
            )}

            {activePage === "Safety" && (
              <Safety batteryData={batteryData} />
            )}

            {activePage === "AI Prediction" && (
              <AIPrediction batteryData={batteryData} />
            )}

            {activePage === "Driving Style Analysis" && (
              <DrivingStyleAnalysis
                batteryData={batteryData}
              />
            )}

            {activePage === "Predictive Maintenance" && (
              <PredictiveMaintenance
                batteryData={batteryData}
              />
            )}

            {activePage === "Range Prediction" && (
              <RangePrediction
                batteryData={batteryData}
              />
            )}

            {activePage === "Energy Consumption" && (
              <EnergyConsumption
                batteryData={batteryData}
              />
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

function Dashboard({ batteryData, chartData }) {

  const fireDetected = batteryData.fireDetected

  const battery = Math.max(
    0,
    Math.min(100, batteryData.batteryPercentage)
  )

  return (
    <div className="dashboard">

      {fireDetected && (

        <div className="emergency-banner">

          <div className="emergency-icon">
            🔥
          </div>

          <div>
            <strong>
              CRITICAL SAFETY ALERT
            </strong>

            <span>
              Fire detected by battery safety sensor
            </span>
          </div>

          <div className="emergency-pulse">
            ALERT
          </div>

        </div>

      )}

      <div className="hero-grid">

        <section className="battery-hero">

          <div className="hero-heading">

            <div>

              <span className="section-label">
                BATTERY STATUS
              </span>

              <h2>
                Energy Level
              </h2>

            </div>

            <Battery size={25} />

          </div>

          <div className="battery-gauge">

            <div
              className="gauge-ring"
              style={{
                "--progress": `${battery * 3.6}deg`,
              }}
            >

              <div className="gauge-inner">

                <div className="battery-number">
                  {battery.toFixed(0)}
                  <span>%</span>
                </div>

                <div className="battery-label">
                  CHARGE
                </div>

              </div>

            </div>

          </div>

          <div className="battery-bottom">

            <div>
              <span>VOLTAGE</span>

              <strong>
                {batteryData.voltage.toFixed(2)} V
              </strong>
            </div>

            <div>
              <span>HEALTH</span>

              <strong>
                {batteryData.batteryHealth}%
              </strong>
            </div>

            <div>
              <span>RANGE LIFE</span>

              <strong>
                {batteryData.lifeRemaining} yrs
              </strong>
            </div>

          </div>

        </section>

        <div className="metrics-grid">

          <MetricCard
            icon={<Zap />}
            title="Voltage"
            value={batteryData.voltage.toFixed(2)}
            unit="V"
            description="Battery voltage"
          />

          <MetricCard
            icon={<Activity />}
            title="Current"
            value={batteryData.current.toFixed(2)}
            unit="A"
            description={
              batteryData.charging
                ? "Charging active"
                : "Standby current"
            }
          />

          <MetricCard
            icon={<Thermometer />}
            title="Temperature"
            value={batteryData.temperature.toFixed(1)}
            unit="°C"
            description="Battery temperature"
          />

          <MetricCard
            icon={<Car />}
            title="Motor"
            value={
              batteryData.motorON
                ? "ON"
                : "OFF"
            }
            unit=""
            description={
              batteryData.motorON
                ? "Vehicle active"
                : "Vehicle stopped"
            }
          />

        </div>

      </div>

      <LiveGraphs chartData={chartData} />

      <div className="bottom-grid">

        <div
          className={
            fireDetected
              ? "status-panel danger-panel"
              : "status-panel safe-panel"
          }
        >

          <div className="status-panel-icon">
            <ShieldCheck size={27} />
          </div>

          <div>

            <span className="section-label">
              SAFETY SYSTEM
            </span>

            <h3>
              {fireDetected
                ? "DANGER DETECTED"
                : "ALL SYSTEMS SAFE"}
            </h3>

            <p>
              {fireDetected
                ? "Immediate inspection required"
                : "No fire detected by sensors"}
            </p>

          </div>

          <div className="status-pill">
            {fireDetected
              ? "ALERT"
              : "SAFE"}
          </div>

        </div>

        <div className="status-panel charging-panel">

          <div className="status-panel-icon charging-icon">
            <Zap size={27} />
          </div>

          <div>

            <span className="section-label">
              POWER SYSTEM
            </span>

            <h3>
              {batteryData.charging
                ? "CHARGING"
                : "NOT CHARGING"}
            </h3>

            <p>
              Current: {batteryData.current.toFixed(2)} A
            </p>

          </div>

          <div className="status-pill charging-pill">
            {batteryData.charging
              ? "ACTIVE"
              : "IDLE"}
          </div>

        </div>

      </div>

    </div>
  )
}


/* =========================
   LIVE GRAPHS
========================= */

function LiveGraphs({ chartData }) {

  return (
    <section className="charts-section">

      <div className="charts-heading">

        <div>
          <span className="section-label">
            REAL-TIME ANALYTICS
          </span>

          <h2>
            Live Battery Telemetry
          </h2>
        </div>

        <div className="live-indicator">
          <span></span>
          LIVE
        </div>

      </div>

      <div className="charts-grid">

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <span>BATTERY LEVEL</span>

              <strong>
                {chartData.length > 0
                  ? `${chartData[chartData.length - 1].battery.toFixed(0)}%`
                  : "--"}
              </strong>
            </div>

            <Battery size={22} />

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                  minTickGap={30}
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101722",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="battery"
                  stroke="#7dd3fc"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <span>VOLTAGE</span>

              <strong>
                {chartData.length > 0
                  ? `${chartData[chartData.length - 1].voltage.toFixed(2)} V`
                  : "--"}
              </strong>
            </div>

            <Zap size={22} />

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                  minTickGap={30}
                />

                <YAxis
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101722",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="voltage"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <span>CURRENT</span>

              <strong>
                {chartData.length > 0
                  ? `${chartData[chartData.length - 1].current.toFixed(2)} A`
                  : "--"}
              </strong>
            </div>

            <Activity size={22} />

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                  minTickGap={30}
                />

                <YAxis
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101722",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="chart-card">

          <div className="chart-header">

            <div>
              <span>TEMPERATURE</span>

              <strong>
                {chartData.length > 0
                  ? `${chartData[chartData.length - 1].temperature.toFixed(1)} °C`
                  : "--"}
              </strong>
            </div>

            <Thermometer size={22} />

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={chartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="time"
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                  minTickGap={30}
                />

                <YAxis
                  stroke="#7f8b9d"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#101722",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </section>
  )
}


/* =========================
   METRIC CARD
========================= */

function MetricCard({
  icon,
  title,
  value,
  unit,
  description,
}) {

  return (
    <div className="metric-card">

      <div className="metric-top">

        <div className="metric-icon">
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>

      <div className="metric-value">
        {value}
        <small>
          {unit}
        </small>
      </div>

      <p>
        {description}
      </p>

    </div>
  )
}


/* =========================
   BATTERY HEALTH
========================= */

function BatteryHealth({ batteryData }) {

  const health = Math.max(
    0,
    Math.min(100, batteryData.batteryHealth)
  )

  return (
    <section className="page-card">

      <div className="page-icon">
        <Battery size={32} />
      </div>

      <span className="section-label">
        BATTERY ANALYTICS
      </span>

      <h2>
        Battery Health
      </h2>

      <div className="health-display">

        <div
          className="health-ring"
          style={{
            "--health": `${health * 3.6}deg`,
          }}
        >

          <div>
            <strong>
              {health}%
            </strong>

            <span>
              HEALTH
            </span>
          </div>

        </div>

        <div className="health-info">

          <div className="health-row">
            <span>
              Condition
            </span>

            <strong>
              {health >= 80
                ? "Excellent"
                : health >= 60
                  ? "Good"
                  : "Needs Attention"}
            </strong>
          </div>

          <div className="health-row">
            <span>
              Estimated Life
            </span>

            <strong>
              {batteryData.lifeRemaining} years
            </strong>
          </div>

          <div className="health-row">
            <span>
              Voltage
            </span>

            <strong>
              {batteryData.voltage.toFixed(2)} V
            </strong>
          </div>

        </div>

      </div>

    </section>
  )
}


/* =========================
   CHARGING
========================= */

function Charging({ batteryData }) {

  return (
    <section className="page-card">

      <div className="page-icon">
        <Zap size={32} />
      </div>

      <span className="section-label">
        POWER MANAGEMENT
      </span>

      <h2>
        Charging Status
      </h2>

      <div
        className={
          batteryData.charging
            ? "large-status charging-active"
            : "large-status charging-idle"
        }
      >

        <Zap size={24} />

        {batteryData.charging
          ? "CHARGING"
          : "NOT CHARGING"}

      </div>

      <div className="detail-grid">

        <div>
          <span>
            VOLTAGE
          </span>

          <strong>
            {batteryData.voltage.toFixed(2)} V
          </strong>
        </div>

        <div>
          <span>
            CURRENT
          </span>

          <strong>
            {batteryData.current.toFixed(2)} A
          </strong>
        </div>

        <div>
          <span>
            BATTERY
          </span>

          <strong>
            {batteryData.batteryPercentage}%
          </strong>
        </div>

      </div>

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

      <div className="page-icon">
        <ShieldCheck size={32} />
      </div>

      <span className="section-label">
        VEHICLE PROTECTION
      </span>

      <h2>
        Safety Monitoring
      </h2>

      <div
        className={
          fireDetected
            ? "large-status danger-status"
            : "large-status safe-status"
        }
      >

        <ShieldCheck size={24} />

        {fireDetected
          ? "🔥 DANGER DETECTED"
          : "✓ SYSTEM SAFE"}

      </div>

      <div className="detail-grid">

        <div>
          <span>
            TEMPERATURE
          </span>

          <strong>
            {batteryData.temperature.toFixed(1)} °C
          </strong>
        </div>

        <div>
          <span>
            MOTOR
          </span>

          <strong>
            {batteryData.motorON
              ? "ON"
              : "OFF"}
          </strong>
        </div>

        <div>
          <span>
            FIRE SENSOR
          </span>

          <strong>
            {fireDetected
              ? "DETECTED"
              : "NORMAL"}
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
    <section className="page-card ai-page">

      <div className="page-icon">
        <Brain size={32} />
      </div>

      <span className="section-label">
        INTELLIGENT ANALYTICS
      </span>

      <h2>
        AI Battery Prediction
      </h2>

      <div className="ai-score">

        <div className="ai-number">
          {batteryData.batteryHealth}%
        </div>

        <span>
          CURRENT HEALTH
        </span>

      </div>

      <div className="prediction-box">

        <Brain size={22} />

        <div>

          <strong>
            Battery Condition: Excellent
          </strong>

          <p>
            Estimated remaining battery life:
            {" "}
            <b>
              {batteryData.lifeRemaining} years
            </b>
          </p>

        </div>

      </div>

    </section>
  )
}


/* =========================
   DRIVING STYLE ANALYSIS
========================= */

function DrivingStyleAnalysis({ batteryData }) {

  const current = Math.abs(batteryData.current)
  const temperature = batteryData.temperature

  let style = "SMOOTH"
  let description = "Efficient and gentle driving pattern."
  let score = 90

  if (current > 2.5 || temperature > 45) {
    style = "AGGRESSIVE"
    description = "High power demand detected. Consider smoother acceleration."
    score = 55
  } else if (current > 1.2 || temperature > 38) {
    style = "MODERATE"
    description = "Normal driving pattern with moderate power demand."
    score = 75
  }

  return (
    <section className="page-card">

      <div className="page-icon">
        <Car size={32} />
      </div>

      <span className="section-label">
        DRIVER INTELLIGENCE
      </span>

      <h2>
        Driving Style Analysis
      </h2>

      <div className="large-status safe-status">
        <Car size={24} />
        {style} DRIVING
      </div>

      <div className="detail-grid">

        <div>
          <span>
            DRIVING SCORE
          </span>

          <strong>
            {score}/100
          </strong>
        </div>

        <div>
          <span>
            CURRENT LOAD
          </span>

          <strong>
            {batteryData.current.toFixed(2)} A
          </strong>
        </div>

        <div>
          <span>
            MOTOR
          </span>

          <strong>
            {batteryData.motorON ? "ACTIVE" : "IDLE"}
          </strong>
        </div>

      </div>

      <div className="prediction-box">

        <Activity size={22} />

        <div>
          <strong>
            Driving Behaviour
          </strong>

          <p>
            {description}
          </p>
        </div>

      </div>

    </section>
  )
}


/* =========================
   PREDICTIVE MAINTENANCE
========================= */

function PredictiveMaintenance({ batteryData }) {

  const health = batteryData.batteryHealth
  const temperature = batteryData.temperature
  const voltage = batteryData.voltage

  let status = "SYSTEM HEALTHY"
  let message = "No immediate maintenance action is required."

  if (health < 60 || temperature > 50) {
    status = "MAINTENANCE REQUIRED"
    message = "Battery system requires immediate inspection."
  } else if (health < 80 || temperature > 40) {
    status = "MAINTENANCE RECOMMENDED"
    message = "Schedule a battery system inspection soon."
  }

  return (
    <section className="page-card">

      <div className="page-icon">
        <Wrench size={32} />
      </div>

      <span className="section-label">
        VEHICLE DIAGNOSTICS
      </span>

      <h2>
        Predictive Maintenance
      </h2>

      <div className="large-status safe-status">
        <Wrench size={24} />
        {status}
      </div>

      <div className="detail-grid">

        <div>
          <span>
            BATTERY HEALTH
          </span>

          <strong>
            {health}%
          </strong>
        </div>

        <div>
          <span>
            TEMPERATURE
          </span>

          <strong>
            {temperature.toFixed(1)} °C
          </strong>
        </div>

        <div>
          <span>
            VOLTAGE
          </span>

          <strong>
            {voltage.toFixed(2)} V
          </strong>
        </div>

      </div>

      <div className="prediction-box">

        <Wrench size={22} />

        <div>
          <strong>
            Maintenance Recommendation
          </strong>

          <p>
            {message}
          </p>
        </div>

      </div>

    </section>
  )
}


/* =========================
   RANGE PREDICTION
========================= */

function RangePrediction({ batteryData }) {

  const battery = Math.max(
    0,
    Math.min(100, batteryData.batteryPercentage)
  )

  const estimatedRange = Math.round(
    battery * 2
  )

  return (
    <section className="page-card">

      <div className="page-icon">
        <Map size={32} />
      </div>

      <span className="section-label">
        INTELLIGENT RANGE SYSTEM
      </span>

      <h2>
        Range Prediction
      </h2>

      <div className="ai-score">

        <div className="ai-number">
          {estimatedRange}
          <small> km</small>
        </div>

        <span>
          ESTIMATED RANGE
        </span>

      </div>

      <div className="detail-grid">

        <div>
          <span>
            BATTERY
          </span>

          <strong>
            {battery.toFixed(0)}%
          </strong>
        </div>

        <div>
          <span>
            HEALTH
          </span>

          <strong>
            {batteryData.batteryHealth}%
          </strong>
        </div>

        <div>
          <span>
            MOTOR
          </span>

          <strong>
            {batteryData.motorON ? "ON" : "OFF"}
          </strong>
        </div>

      </div>

      <div className="prediction-box">

        <Map size={22} />

        <div>
          <strong>
            Range Estimate
          </strong>

          <p>
            Estimated using current battery level.
          </p>
        </div>

      </div>

    </section>
  )
}


/* =========================
   ENERGY CONSUMPTION
========================= */

function EnergyConsumption({ batteryData }) {

  const current = Math.abs(batteryData.current)
  const voltage = batteryData.voltage

  const estimatedPower = voltage * current

  let efficiency = "GOOD"

  if (estimatedPower > 1000) {
    efficiency = "HIGH CONSUMPTION"
  } else if (estimatedPower > 500) {
    efficiency = "MODERATE"
  }

  return (
    <section className="page-card">

      <div className="page-icon">
        <Gauge size={32} />
      </div>

      <span className="section-label">
        ENERGY ANALYTICS
      </span>

      <h2>
        Energy Consumption
      </h2>

      <div className="large-status safe-status">
        <Gauge size={24} />
        {efficiency}
      </div>

      <div className="detail-grid">

        <div>
          <span>
            VOLTAGE
          </span>

          <strong>
            {voltage.toFixed(2)} V
          </strong>
        </div>

        <div>
          <span>
            CURRENT
          </span>

          <strong>
            {current.toFixed(2)} A
          </strong>
        </div>

        <div>
          <span>
            POWER
          </span>

          <strong>
            {estimatedPower.toFixed(1)} W
          </strong>
        </div>

      </div>

      <div className="prediction-box">

        <Gauge size={22} />

        <div>
          <strong>
            Energy Status
          </strong>

          <p>
            Current estimated electrical power consumption is{" "}
            <b>{estimatedPower.toFixed(1)} W</b>.
          </p>
        </div>

      </div>

    </section>
  )
}


export default App