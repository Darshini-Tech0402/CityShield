// ─────────────────────────────────────────────
//  CityShield · Dashboard.js
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react"
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from "recharts"
import { getSeverityColor, getSeverityBg, isCyber } from "./utils"

// ── Helper: unique zones from incidents ───────
const getZoneCounts = (incidents) => {
  const map = {}
  incidents.forEach(i => {
    map[i.zone] = (map[i.zone] || 0) + 1
  })
  return Object.entries(map).map(([zone, count]) => ({ zone, count }))
}

// ── Static weekly trend data ──────────────────
const TREND = [
  { day: "Mon", physical: 4, cyber: 2 },
  { day: "Tue", physical: 3, cyber: 5 },
  { day: "Wed", physical: 6, cyber: 3 },
  { day: "Thu", physical: 2, cyber: 7 },
  { day: "Fri", physical: 5, cyber: 4 },
  { day: "Sat", physical: 1, cyber: 2 },
  { day: "Sun", physical: 3, cyber: 3 },
]

function Dashboard({ incidents, setPage }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString("en-IN"))
  const [date, setDate] = useState(new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }))

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN"))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // ── Compute stats ─────────────────────────
  const total    = incidents.length
  const cyber    = incidents.filter(i => i.category === "Cyber" || isCyber(i.type)).length
  const physical = total - cyber
  const critical = incidents.filter(i => i.severity === "Critical").length
  const high     = incidents.filter(i => i.severity === "High").length
  const cyberPct = total === 0 ? 0 : Math.round((cyber / total) * 100)

  const zoneCounts  = getZoneCounts(incidents)

  const pieData = [
    { name: "Cyber",    value: cyber    || 1 },
    { name: "Physical", value: physical || 1 }
  ]
  const PIE_COLORS = ["#00d4ff", "#1d6fe8"]

  const severityData = [
    { name: "Critical", count: critical,                                          fill: "#ff2d55" },
    { name: "High",     count: high,                                              fill: "#ff8800" },
    { name: "Medium",   count: incidents.filter(i => i.severity === "Medium").length, fill: "#ffcc00" },
    { name: "Low",      count: incidents.filter(i => i.severity === "Low").length,    fill: "#00ff88" },
  ]

  // ── Stat cards data ───────────────────────
  const STATS = [
    { label: "Total Incidents",  value: total,    icon: "📊", color: "#00d4ff", bg: "rgba(0,212,255,0.08)" },
    { label: "Cyber Threats",    value: cyber,    icon: "🛡️", color: "#1d6fe8", bg: "rgba(29,111,232,0.08)" },
    { label: "Physical Threats", value: physical, icon: "👮", color: "#ff8800", bg: "rgba(255,136,0,0.08)"  },
    { label: "Critical Alerts",  value: critical, icon: "🚨", color: "#ff2d55", bg: "rgba(255,45,85,0.08)"  },
  ]

  return (
    <div style={S.wrap} className="fade-up">

      {/* ── Title row ─────────────────────── */}
      <div style={S.titleRow}>
        <div>
          <h1 style={S.title}>
            Hybrid Surveillance & Cyber Security<br />
            <span style={{ color: "#00d4ff" }}>Management System</span>
          </h1>
          <p style={S.subtitle}>Real-time city-wide incident monitoring</p>
        </div>
        <div style={S.clockBox}>
          <div style={S.clockTime}>{time}</div>
          <div style={S.clockDate}>{date}</div>
        </div>
      </div>

      {/* ── 4 Stat cards ──────────────────── */}
      <div style={S.statsGrid}>
        {STATS.map((s, i) => (
          <div key={i} style={{ ...S.statCard, background: s.bg, borderColor: s.color + "33" }}>
            <div style={{ fontSize: "30px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Cyber threat bar ──────────────── */}
      <div style={S.section}>
        <h3 style={S.sectionTitle}>⚡ Cyber Threat Level</h3>
        <div style={S.threatBarTrack}>
          <div style={{ ...S.threatBarFill, width: cyberPct + "%" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ color: "#7a9cc0", fontSize: "13px" }}>0%</span>
          <span style={{ color: cyberPct > 60 ? "#ff2d55" : "#00d4ff", fontWeight: 700, fontSize: "14px" }}>
            {cyberPct}% of incidents are cyber-related
          </span>
          <span style={{ color: "#7a9cc0", fontSize: "13px" }}>100%</span>
        </div>
      </div>

      {/* ── Charts row ────────────────────── */}
      <div style={S.chartsRow}>

        {/* Pie chart */}
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>🔵 Incident Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#071428", border: "1px solid #1a3a6a", borderRadius: "8px", color: "#e8f4ff" }}
              />
              <Legend
                formatter={(value) => <span style={{ color: "#7a9cc0", fontSize: "13px" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Area trend chart */}
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>📈 Weekly Incident Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="cyberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="physGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1d6fe8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1d6fe8" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a6a" />
              <XAxis dataKey="day" stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} />
              <YAxis stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} />
              <Tooltip contentStyle={{ background: "#071428", border: "1px solid #1a3a6a", borderRadius: "8px", color: "#e8f4ff" }} />
              <Legend formatter={(v) => <span style={{ color: "#7a9cc0", fontSize: "13px" }}>{v}</span>} />
              <Area type="monotone" dataKey="cyber"    stroke="#00d4ff" fill="url(#cyberGrad)" strokeWidth={2} name="Cyber" />
              <Area type="monotone" dataKey="physical" stroke="#1d6fe8" fill="url(#physGrad)"  strokeWidth={2} name="Physical" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity bar chart */}
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>⚠ Severity Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={severityData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a6a" />
              <XAxis dataKey="name" stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} />
              <YAxis stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#071428", border: "1px solid #1a3a6a", borderRadius: "8px", color: "#e8f4ff" }} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {severityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Zone overview ─────────────────── */}
      <div style={S.section}>
        <h3 style={S.sectionTitle}>🗺 Zone Overview</h3>
        {zoneCounts.length === 0 ? (
          <p style={{ color: "#4a7a9b" }}>No active zones.</p>
        ) : (
          <div style={S.zoneGrid}>
            {zoneCounts.map((z, i) => (
              <div key={i} style={S.zoneCard}>
                <div style={{ fontSize: "22px" }}>📍</div>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "13px", color: "#00d4ff", letterSpacing: "1px" }}>
                  {z.zone}
                </div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#e8f4ff", margin: "4px 0" }}>
                  {z.count}
                </div>
                <div style={{ color: "#4a7a9b", fontSize: "12px" }}>incident{z.count !== 1 && "s"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Bar chart for zone counts ──────── */}
      {zoneCounts.length > 0 && (
        <div style={S.section}>
          <h3 style={S.sectionTitle}>📊 Incidents by Zone</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={zoneCounts} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a6a" />
              <XAxis dataKey="zone" stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} />
              <YAxis stroke="#4a7a9b" tick={{ fontSize: 12, fill: "#4a7a9b" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#071428", border: "1px solid #1a3a6a", borderRadius: "8px", color: "#e8f4ff" }} />
              <Bar dataKey="count" fill="#1d6fe8" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Mini city map ─────────────────── */}
      <div style={S.section}>
        <h3 style={S.sectionTitle}>🗺 City Map – Incident Hotspots</h3>
        <div style={S.mapWrap}>
          <iframe
            title="Hyderabad City Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.43611734555!2d78.24323485!3d17.412281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen
            loading="lazy"
          />
          {/* Overlay markers */}
          <div style={S.mapOverlay}>
            {incidents.slice(0, 4).map((inc, i) => (
              <div key={i} style={S.mapMarker} title={`${inc.zone}: ${inc.type}`}>
                <span style={{ color: getSeverityColor(inc.severity) }}>●</span>
                <span style={{ marginLeft: "4px", fontSize: "11px" }}>{inc.zone}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: "#4a7a9b", fontSize: "12px", marginTop: "8px" }}>
          * For live incident markers, open the City Map module for full interactive view.
        </p>
      </div>

      {/* ── Recent incidents table ─────────── */}
      <div style={S.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={S.sectionTitle}>🗂 Recent Incidents</h3>
          <button onClick={() => setPage("alerts")} style={S.viewAllBtn}>
            View All Alerts →
          </button>
        </div>
        <div style={S.table}>
          <div style={S.tableHead}>
            {["Zone","Type","Category","Severity","Time"].map(h => (
              <div key={h} style={S.th}>{h}</div>
            ))}
          </div>
          {incidents.length === 0 ? (
            <div style={{ padding: "20px", color: "#4a7a9b", textAlign: "center" }}>No active incidents.</div>
          ) : (
            incidents.slice(0, 8).map((inc, i) => (
              <div key={i} style={{ ...S.tableRow, background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <div style={S.td}>{inc.zone}</div>
                <div style={S.td}>{inc.type}</div>
                <div style={{ ...S.td, color: inc.category === "Cyber" ? "#00d4ff" : "#ff8800" }}>{inc.category}</div>
                <div style={{ ...S.td }}>
                  <span style={{
                    background: getSeverityBg(inc.severity),
                    color: getSeverityColor(inc.severity),
                    padding: "2px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 600
                  }}>
                    {inc.severity}
                  </span>
                </div>
                <div style={{ ...S.td, color: "#4a7a9b" }}>{inc.time}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────

const S = {
  wrap: { maxWidth: "1200px" },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px"
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "clamp(16px, 2.5vw, 24px)",
    fontWeight: 700,
    color: "#e8f4ff",
    margin: 0,
    lineHeight: 1.4,
    letterSpacing: "1px"
  },
  subtitle: {
    color: "#4a7a9b",
    fontSize: "13px",
    letterSpacing: "1px",
    margin: "6px 0 0"
  },
  clockBox: {
    textAlign: "right",
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "10px",
    padding: "12px 20px"
  },
  clockTime: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "20px",
    color: "#00d4ff",
    letterSpacing: "3px"
  },
  clockDate: {
    color: "#4a7a9b",
    fontSize: "11px",
    marginTop: "4px",
    letterSpacing: "1px"
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "28px"
  },
  statCard: {
    border: "1px solid",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    transition: "transform 0.2s"
  },
  statValue: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: 1
  },
  statLabel: {
    color: "#7a9cc0",
    fontSize: "13px",
    marginTop: "6px",
    letterSpacing: "0.5px"
  },

  // Threat bar
  section: {
    background: "rgba(7,20,40,0.5)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    padding: "20px 24px",
    marginBottom: "20px"
  },
  sectionTitle: {
    fontFamily: "'Orbitron', sans-serif",
    color: "#e8f4ff",
    fontSize: "14px",
    letterSpacing: "2px",
    margin: "0 0 16px"
  },
  threatBarTrack: {
    width: "100%",
    height: "14px",
    background: "#0a1628",
    borderRadius: "7px",
    border: "1px solid #1a3a6a",
    overflow: "hidden"
  },
  threatBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #1d6fe8, #00d4ff, #ff2d55)",
    borderRadius: "7px",
    transition: "width 1s ease"
  },

  // Charts
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "20px"
  },
  chartCard: {
    background: "rgba(7,20,40,0.5)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    padding: "20px"
  },
  chartTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "12px",
    color: "#7a9cc0",
    letterSpacing: "2px",
    margin: "0 0 12px"
  },

  // Zone
  zoneGrid: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap"
  },
  zoneCard: {
    background: "rgba(7,20,60,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "10px",
    padding: "16px 24px",
    textAlign: "center",
    minWidth: "100px",
    transition: "transform 0.2s, box-shadow 0.2s"
  },

  // Map
  mapWrap: {
    height: "320px",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #1a3a6a",
    position: "relative"
  },
  mapOverlay: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "rgba(2,11,24,0.85)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  mapMarker: {
    display: "flex",
    alignItems: "center",
    color: "#e8f4ff",
    fontSize: "13px"
  },

  // Table
  viewAllBtn: {
    background: "transparent",
    border: "1px solid #1d6fe8",
    color: "#1d6fe8",
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    letterSpacing: "1px"
  },
  table: {
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    overflow: "hidden"
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
    background: "rgba(0,212,255,0.06)",
    borderBottom: "1px solid #1a3a6a"
  },
  th: {
    padding: "10px 14px",
    color: "#4a7a9b",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: 600
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr",
    borderBottom: "1px solid rgba(26,58,106,0.4)"
  },
  td: {
    padding: "11px 14px",
    fontSize: "14px",
    color: "#e8f4ff"
  }
}

export default Dashboard