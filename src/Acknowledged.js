// ─────────────────────────────────────────────
//  CityShield · Acknowledged.js
// ─────────────────────────────────────────────
import React, { useState } from "react"
import { getSeverityColor, getSeverityBg } from "./utils"

const STATUS_OPTS = [
  { value: "Pending",              color: "#ffcc00", icon: "⏳" },
  { value: "Under Investigation",  color: "#00d4ff", icon: "🔍" },
  { value: "Contained",            color: "#ff8800", icon: "🚧" },
  { value: "Rescued",              color: "#1d6fe8", icon: "🚑" },
  { value: "Prevented",            color: "#a855f7", icon: "🛡️" },
  { value: "Resolved",             color: "#00ff88", icon: "✅" },
]

function getStatusMeta(s) {
  return STATUS_OPTS.find(o => o.value === s) || { color: "#7a9cc0", icon: "❓" }
}

function Acknowledged({ acknowledged }) {
  const [statuses, setStatuses] = useState({})
  const [filter,   setFilter]   = useState("All")

  const updateStatus = (id, val) => {
    setStatuses(prev => ({ ...prev, [id]: val }))
  }

  const getStatus = (id) => statuses[id] || "Pending"

  const filtered = filter === "All"
    ? acknowledged
    : acknowledged.filter((a, i) => getStatus(a.id ?? i) === filter)

  // Summary counts
  const counts = {}
  STATUS_OPTS.forEach(s => {
    counts[s.value] = acknowledged.filter((a, i) => getStatus(a.id ?? i) === s.value).length
  })

  return (
    <div style={S.wrap} className="fade-up">

      <h1 style={S.title}>✅ Acknowledged Incidents</h1>
      <p style={S.sub}>Track and update the resolution status of acknowledged incidents</p>

      {/* Summary row */}
      <div style={S.summaryRow}>
        <div style={S.summaryCard}>
          <div style={{ ...S.summaryNum, color: "#00d4ff" }}>{acknowledged.length}</div>
          <div style={S.summaryLabel}>Total Acknowledged</div>
        </div>
        {STATUS_OPTS.slice(1).map(s => (
          <div key={s.value} style={S.summaryCard}>
            <div style={{ ...S.summaryNum, color: s.color }}>{counts[s.value]}</div>
            <div style={S.summaryLabel}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={S.filterRow}>
        {["All", ...STATUS_OPTS.map(s => s.value)].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...S.filterBtn,
              background: filter === f ? "rgba(0,212,255,0.1)" : "transparent",
              borderColor: filter === f ? "#00d4ff" : "#1a3a6a",
              color:       filter === f ? "#00d4ff" : "#4a7a9b"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {acknowledged.length === 0 ? (
        <div style={S.empty}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <div style={{ color: "#4a7a9b", fontSize: "16px" }}>
            No incidents have been acknowledged yet.
          </div>
          <div style={{ color: "#2a4a6a", fontSize: "13px", marginTop: "8px" }}>
            Go to Security Alerts to acknowledge incoming incidents.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={S.empty}>
          <div style={{ color: "#4a7a9b", fontSize: "14px" }}>No incidents with status "{filter}".</div>
        </div>
      ) : (
        <div style={S.cardList}>
          {filtered.map((a, i) => {
            const key    = a.id ?? i
            const status = getStatus(key)
            const meta   = getStatusMeta(status)

            return (
              <div key={key} style={S.incCard}>

                {/* Left accent bar */}
                <div style={{ ...S.accentBar, background: meta.color }} />

                <div style={S.cardContent}>

                  {/* Top row */}
                  <div style={S.cardTop}>
                    <div>
                      <div style={S.incZone}>
                        {a.zone?.toUpperCase()}
                        <span style={{ marginLeft: "8px", color: "#4a7a9b" }}>·</span>
                        <span style={{ marginLeft: "8px", color: a.category === "Cyber" ? "#00d4ff" : "#ff8800" }}>
                          {a.category}
                        </span>
                      </div>
                      <div style={S.incType}>{a.type}</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span style={{
                        color: getSeverityColor(a.severity),
                        background: getSeverityBg(a.severity),
                        padding: "2px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: 700
                      }}>
                        {a.severity}
                      </span>
                      <span style={{ color: "#4a7a9b", fontSize: "11px" }}>
                        Reported: {a.time}
                      </span>
                      <span style={{ color: "#2a4a6a", fontSize: "11px" }}>
                        Acknowledged: {a.acknowledgedAt}
                      </span>
                    </div>
                  </div>

                  {/* Status row */}
                  <div style={S.statusRow}>
                    <span style={{ ...S.statusBadge, color: meta.color, borderColor: meta.color + "44", background: meta.color + "11" }}>
                      {meta.icon} {status}
                    </span>

                    <div style={S.statusSelectWrap}>
                      <label style={{ color: "#4a7a9b", fontSize: "12px", letterSpacing: "1px" }}>
                        UPDATE STATUS:
                      </label>
                      <select
                        value={status}
                        onChange={e => updateStatus(key, e.target.value)}
                        style={{
                          ...S.select,
                          borderColor: meta.color + "66"
                        }}
                      >
                        {STATUS_OPTS.map(o => (
                          <option key={o.value} value={o.value}>
                            {o.icon} {o.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={S.progressTrack}>
                    <div style={{
                      ...S.progressFill,
                      width: getProgress(status) + "%",
                      background: meta.color
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ color: "#2a4a6a", fontSize: "10px", letterSpacing: "1px" }}>PROGRESS</span>
                    <span style={{ color: meta.color, fontSize: "10px", fontWeight: 700 }}>
                      {getProgress(status)}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Progress % per status ─────────────────────
function getProgress(status) {
  const map = {
    "Pending":             10,
    "Under Investigation": 35,
    "Contained":           60,
    "Rescued":             75,
    "Prevented":           85,
    "Resolved":            100,
  }
  return map[status] || 10
}

// ── Styles ──────────────────────────────────────
const S = {
  wrap: { maxWidth: "1000px" },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 6px",
    fontWeight: 700
  },
  sub: {
    color: "#4a7a9b",
    fontSize: "13px",
    margin: "0 0 24px",
    letterSpacing: "1px"
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "12px",
    marginBottom: "20px"
  },
  summaryCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "10px",
    padding: "14px",
    textAlign: "center"
  },
  summaryNum: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "26px",
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
  empty: {
    textAlign: "center",
    padding: "60px 0"
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  incCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    display: "flex",
    overflow: "hidden"
  },
  accentBar: {
    width: "4px",
    flexShrink: 0
  },
  cardContent: {
    flex: 1,
    padding: "18px 20px"
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "10px"
  },
  incZone: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "2px",
    marginBottom: "6px"
  },
  incType: {
    fontSize: "17px",
    color: "#e8f4ff",
    fontWeight: 700
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "12px"
  },
  statusBadge: {
    border: "1px solid",
    borderRadius: "20px",
    padding: "4px 14px",
    fontSize: "13px",
    fontWeight: 700
  },
  statusSelectWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  select: {
    background: "rgba(7,20,40,0.8)",
    border: "1px solid",
    borderRadius: "6px",
    color: "#e8f4ff",
    fontSize: "13px",
    fontFamily: "'Rajdhani', sans-serif",
    padding: "6px 10px",
    outline: "none",
    cursor: "pointer"
  },
  progressTrack: {
    height: "6px",
    background: "#0a1628",
    borderRadius: "3px",
    overflow: "hidden",
    marginTop: "8px"
  },
  progressFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.5s ease"
  }
}

export default Acknowledged