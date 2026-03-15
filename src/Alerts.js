// ─────────────────────────────────────────────
//  CityShield · Alerts.js  (Security Alerts)
// ─────────────────────────────────────────────
import React, { useState } from "react"
import { getSeverityColor, getSeverityBg } from "./utils"

function Alerts({ incidents, acknowledge, setPage }) {
  const [filter, setFilter] = useState("All")

  const filtered = filter === "All"
    ? incidents
    : incidents.filter(i => i.category === filter || i.severity === filter)

  const categories = ["All", "Cyber", "Physical", "Critical", "High", "Medium", "Low"]

  return (
    <div style={S.wrap} className="fade-up">
      <div style={S.headerRow}>
        <div>
          <h1 style={S.title}>🚨 Security Alerts</h1>
          <p style={S.sub}>Real-time incident alert feed</p>
        </div>

        {incidents.length === 0 && (
          <div style={S.allClearBadge}>✅ All Clear — No Active Alerts</div>
        )}
        {incidents.length > 0 && (
          <div style={S.countBadge} className="pulse">
            {incidents.length} Alert{incidents.length !== 1 && "s"} Active
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div style={S.filters}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              ...S.filterBtn,
              background: filter === c ? "rgba(0,212,255,0.12)" : "transparent",
              borderColor: filter === c ? "#00d4ff" : "#1a3a6a",
              color:       filter === c ? "#00d4ff" : "#4a7a9b"
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <div style={{ color: "#4a7a9b", fontSize: "16px" }}>No alerts matching this filter.</div>
        </div>
      ) : (
        filtered.map((a, i) => (
          <AlertCard key={a.id || i} alert={a} acknowledge={acknowledge} setPage={setPage} />
        ))
      )}
    </div>
  )
}

// ── Single alert card ──────────────────────────
function AlertCard({ alert, acknowledge, setPage }) {
  const [acking, setAcking] = useState(false)

  const handleAck = () => {
    setAcking(true)
    setTimeout(() => acknowledge(alert), 600)
  }

  const isCrit = alert.severity === "Critical"
  const severityColor = getSeverityColor(alert.severity)

  return (
    <div
      style={{
        ...S.alertCard,
        borderColor: severityColor + "55",
        boxShadow: isCrit
          ? `0 0 20px rgba(255,45,85,0.15), 0 4px 20px rgba(0,0,0,0.4)`
          : "0 4px 20px rgba(0,0,0,0.3)"
      }}
      className={isCrit ? "pulse-alert" : ""}
    >
      <style>{alertCSS}</style>

      {/* Top row */}
      <div style={S.alertTop}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>
            {alert.category === "Cyber" ? "🛡️" : "🚨"}
          </span>
          <div>
            <div style={S.alertZone}>
              {alert.zone?.toUpperCase()} — {alert.category?.toUpperCase()}
            </div>
            <div style={S.alertType}>{alert.type}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <span style={{
            ...S.sevBadge,
            color: severityColor,
            background: getSeverityBg(alert.severity),
            border: `1px solid ${severityColor}44`
          }}>
            {isCrit && "⚡ "}{alert.severity}
          </span>
          <span style={{ color: "#4a7a9b", fontSize: "12px" }}>{alert.time}</span>
        </div>
      </div>

      {/* Info row */}
      <div style={S.alertInfo}>
        {[
          ["📍 Zone",    alert.zone],
          ["🏷 Type",    alert.type],
          ["📂 Category", alert.category],
          ["⏱ Reported", alert.time],
        ].map(([label, value]) => (
          <div key={label} style={S.infoItem}>
            <span style={{ color: "#4a7a9b", fontSize: "12px" }}>{label}</span>
            <span style={{ color: "#e8f4ff", fontSize: "13px", fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Description if exists */}
      {alert.description && (
        <div style={S.alertDesc}>
          📝 {alert.description}
        </div>
      )}

      {/* Action buttons */}
      <div style={S.alertActions}>
        <button
          onClick={handleAck}
          disabled={acking}
          style={{
            ...S.ackBtn,
            opacity: acking ? 0.6 : 1,
            background: acking
              ? "rgba(0,255,136,0.15)"
              : "linear-gradient(90deg, #0a6e3f, #00ff88)"
          }}
        >
          {acking ? "✅ Acknowledging..." : "✅ Acknowledge Incident"}
        </button>

        <button
          onClick={() => setPage("map")}
          style={S.mapBtn}
        >
          🗺 View on Map
        </button>
      </div>
    </div>
  )
}

// ── CSS for pulse animation ───────────────────
const alertCSS = `
  @keyframes pulseAlert {
    0%,100% { box-shadow: 0 0 10px rgba(255,45,85,0.2); }
    50%      { box-shadow: 0 0 25px rgba(255,45,85,0.5); }
  }
  .pulse-alert { animation: pulseAlert 2s infinite; }
`

// ── Styles ──────────────────────────────────────
const S = {
  wrap: { maxWidth: "900px" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px"
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 4px",
    fontWeight: 700
  },
  sub: {
    color: "#4a7a9b",
    fontSize: "13px",
    margin: 0,
    letterSpacing: "1px"
  },
  countBadge: {
    background: "rgba(255,45,85,0.12)",
    border: "1px solid #ff2d55",
    color: "#ff2d55",
    borderRadius: "20px",
    padding: "6px 18px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1px"
  },
  allClearBadge: {
    background: "rgba(0,255,136,0.1)",
    border: "1px solid rgba(0,255,136,0.3)",
    color: "#00ff88",
    borderRadius: "20px",
    padding: "6px 18px",
    fontSize: "14px",
    fontWeight: 700
  },

  filters: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  filterBtn: {
    padding: "6px 14px",
    border: "1px solid",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    transition: "all 0.2s"
  },

  empty: {
    textAlign: "center",
    padding: "60px 0"
  },

  // Alert card
  alertCard: {
    background: "linear-gradient(135deg, #071428, #071a38)",
    border: "1px solid",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    transition: "transform 0.2s"
  },
  alertTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px"
  },
  alertZone: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "2px",
    marginBottom: "4px"
  },
  alertType: {
    fontSize: "18px",
    color: "#e8f4ff",
    fontWeight: 700
  },
  sevBadge: {
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "1px"
  },

  alertInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "14px"
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "3px"
  },
  alertDesc: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #1a3a6a",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#7a9cc0",
    fontSize: "13px",
    marginBottom: "14px"
  },

  alertActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  ackBtn: {
    flex: 1,
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    color: "#020b18",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  mapBtn: {
    padding: "10px 20px",
    background: "transparent",
    border: "1px solid #1d6fe8",
    color: "#1d6fe8",
    borderRadius: "8px",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.5px"
  }
}

export default Alerts
