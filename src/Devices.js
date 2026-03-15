// ─────────────────────────────────────────────
//  CityShield · Devices.js  (Device Management)
// ─────────────────────────────────────────────
import React, { useState } from "react"

const INITIAL_DEVICES = [
  {
    id: 1, name: "CCTV Camera — Zone A", type: "Surveillance",
    status: true, health: 98, icon: "📷",
    ip: "192.168.1.11", zone: "Zone A", lastPing: "0s ago"
  },
  {
    id: 2, name: "Surveillance Drone #1", type: "Aerial",
    status: true, health: 91, icon: "🚁",
    ip: "192.168.1.12", zone: "Zone B", lastPing: "2s ago"
  },
  {
    id: 3, name: "Next-Gen Firewall", type: "Cyber Security",
    status: true, health: 100, icon: "🔥",
    ip: "192.168.1.1",  zone: "Server Room", lastPing: "0s ago"
  },
  {
    id: 4, name: "IoT Sensor — Zone C", type: "IoT Sensor",
    status: false, health: 0, icon: "📡",
    ip: "192.168.1.21", zone: "Zone C", lastPing: "15m ago"
  },
  {
    id: 5, name: "Intrusion Detection System", type: "Cyber Security",
    status: true, health: 87, icon: "🛡️",
    ip: "192.168.1.5",  zone: "Server Room", lastPing: "1s ago"
  },
  {
    id: 6, name: "Traffic Sensor — Zone B", type: "IoT Sensor",
    status: true, health: 76, icon: "🚦",
    ip: "192.168.1.22", zone: "Zone B", lastPing: "5s ago"
  },
  {
    id: 7, name: "Biometric Scanner — Gate 1", type: "Access Control",
    status: true, health: 95, icon: "🔐",
    ip: "192.168.1.31", zone: "Zone A", lastPing: "3s ago"
  },
  {
    id: 8, name: "Emergency Alarm System", type: "Alarm",
    status: false, health: 0, icon: "🔔",
    ip: "192.168.1.41", zone: "Zone D", lastPing: "2h ago"
  },
  {
    id: 9, name: "VPN Gateway", type: "Cyber Security",
    status: true, health: 99, icon: "🔒",
    ip: "192.168.1.2",  zone: "Server Room", lastPing: "0s ago"
  },
  {
    id: 10, name: "License Plate Reader", type: "Surveillance",
    status: true, health: 82, icon: "🚗",
    ip: "192.168.1.51", zone: "Zone C", lastPing: "8s ago"
  },
]

const DEVICE_TYPES = ["All", "Surveillance", "Aerial", "Cyber Security", "IoT Sensor", "Access Control", "Alarm"]

function getHealthColor(health) {
  if (health >= 90) return "#00ff88"
  if (health >= 70) return "#ffcc00"
  if (health >= 40) return "#ff8800"
  return "#ff2d55"
}

function Devices() {
  const [devices,  setDevices]  = useState(INITIAL_DEVICES)
  const [filter,   setFilter]   = useState("All")
  const [selected, setSelected] = useState(null)

  const toggle = (id) => {
    setDevices(prev => prev.map(d =>
      d.id === id
        ? { ...d, status: !d.status, health: !d.status ? Math.floor(Math.random() * 30 + 70) : 0, lastPing: !d.status ? "just now" : "N/A" }
        : d
    ))
  }

  const filtered = filter === "All"
    ? devices
    : devices.filter(d => d.type === filter)

  const online  = devices.filter(d => d.status).length
  const offline = devices.filter(d => !d.status).length
  const avgHealth = devices.filter(d => d.status).length > 0
    ? Math.round(devices.filter(d => d.status).reduce((s, d) => s + d.health, 0) / devices.filter(d => d.status).length)
    : 0

  return (
    <div style={S.wrap} className="fade-up">
      <h1 style={S.title}>💻 Device Management</h1>
      <p style={S.sub}>Monitor and control all city surveillance & security hardware</p>

      {/* Summary cards */}
      <div style={S.summaryRow}>
        {[
          { label: "Total Devices", value: devices.length, color: "#00d4ff" },
          { label: "Online",        value: online,         color: "#00ff88" },
          { label: "Offline",       value: offline,        color: "#ff2d55" },
          { label: "Avg. Health",   value: avgHealth + "%", color: "#ffcc00" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.summaryCard, borderColor: s.color + "33" }}>
            <div style={{ ...S.summaryNum, color: s.color }}>{s.value}</div>
            <div style={S.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Type filter */}
      <div style={S.filterRow}>
        {DEVICE_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              ...S.filterBtn,
              background: filter === t ? "rgba(0,212,255,0.1)" : "transparent",
              borderColor: filter === t ? "#00d4ff" : "#1a3a6a",
              color:       filter === t ? "#00d4ff" : "#4a7a9b"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Device grid */}
      <div style={S.grid}>
        {filtered.map(device => {
          const isSelected = selected === device.id
          const healthColor = getHealthColor(device.health)

          return (
            <div
              key={device.id}
              onClick={() => setSelected(isSelected ? null : device.id)}
              style={{
                ...S.devCard,
                borderColor: device.status ? "#1a3a6a" : "#ff2d5540",
                cursor: "pointer",
                background: isSelected ? "rgba(0,212,255,0.06)" : "rgba(7,20,40,0.6)"
              }}
            >
              {/* Status indicator */}
              <div style={S.cardTop}>
                <div style={S.devIcon}>{device.icon}</div>
                <div style={S.statusDot}>
                  <div style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: device.status ? "#00ff88" : "#ff2d55"
                  }} />
                  <span style={{ color: device.status ? "#00ff88" : "#ff2d55", fontSize: "11px", fontWeight: 700 }}>
                    {device.status ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Device name */}
              <div style={S.devName}>{device.name}</div>
              <div style={S.devType}>{device.type}</div>
              <div style={S.devZone}>{device.zone}</div>

              {/* Health bar */}
              {device.status && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0 4px" }}>
                    <span style={{ color: "#4a7a9b", fontSize: "11px" }}>HEALTH</span>
                    <span style={{ color: healthColor, fontSize: "11px", fontWeight: 700 }}>{device.health}%</span>
                  </div>
                  <div style={S.healthTrack}>
                    <div style={{
                      ...S.healthFill,
                      width: device.health + "%",
                      background: healthColor
                    }} />
                  </div>
                </>
              )}

              {/* Expanded info */}
              {isSelected && (
                <div style={S.expandInfo}>
                  <div style={S.infoRow}>
                    <span style={S.infoLabel}>IP Address</span>
                    <span style={{ color: "#00d4ff", fontSize: "12px", fontFamily: "monospace" }}>{device.ip}</span>
                  </div>
                  <div style={S.infoRow}>
                    <span style={S.infoLabel}>Last Ping</span>
                    <span style={{ color: "#e8f4ff", fontSize: "12px" }}>{device.lastPing}</span>
                  </div>
                  <div style={S.infoRow}>
                    <span style={S.infoLabel}>Zone</span>
                    <span style={{ color: "#e8f4ff", fontSize: "12px" }}>{device.zone}</span>
                  </div>
                </div>
              )}

              {/* Toggle button */}
              <button
                onClick={(e) => { e.stopPropagation(); toggle(device.id) }}
                style={{
                  ...S.toggleBtn,
                  background: device.status
                    ? "rgba(255,45,85,0.15)"
                    : "rgba(0,255,136,0.15)",
                  borderColor: device.status ? "#ff2d55" : "#00ff88",
                  color:       device.status ? "#ff2d55" : "#00ff88"
                }}
              >
                {device.status ? "⏻ Power Off" : "⏺ Power On"}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Styles ─────────────────────────────────────
const S = {
  wrap: { maxWidth: "1200px" },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 6px",
    fontWeight: 700
  },
  sub: { color: "#4a7a9b", fontSize: "13px", margin: "0 0 24px", letterSpacing: "1px" },

  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  },
  summaryCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "center"
  },
  summaryNum: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: 1
  },
  summaryLabel: {
    color: "#4a7a9b",
    fontSize: "11px",
    marginTop: "6px",
    letterSpacing: "0.5px"
  },

  filterRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  filterBtn: {
    padding: "5px 12px",
    border: "1px solid",
    borderRadius: "16px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.2s"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "14px"
  },
  devCard: {
    border: "1px solid",
    borderRadius: "12px",
    padding: "18px",
    transition: "all 0.2s"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  devIcon: { fontSize: "28px" },
  statusDot: {
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  devName: {
    color: "#e8f4ff",
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "4px"
  },
  devType: {
    color: "#00d4ff",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: 600,
    marginBottom: "3px"
  },
  devZone: {
    color: "#4a7a9b",
    fontSize: "12px"
  },
  healthTrack: {
    height: "5px",
    background: "#0a1628",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "12px"
  },
  healthFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.5s ease"
  },
  expandInfo: {
    background: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "10px 12px",
    marginBottom: "12px"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 0"
  },
  infoLabel: {
    color: "#4a7a9b",
    fontSize: "11px",
    letterSpacing: "0.5px"
  },
  toggleBtn: {
    width: "100%",
    padding: "9px",
    border: "1px solid",
    borderRadius: "7px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px",
    transition: "all 0.2s"
  }
}

export default Devices
