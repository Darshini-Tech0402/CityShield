// ─────────────────────────────────────────────
//  CityShield · CyberAlerts.js
//  All cyber attack types + live stats
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts"

// ── All known cyber attack types ──────────────
const ALL_ATTACKS = [
  {
    type:        "DDoS Attack",
    short:       "DDoS",
    icon:        "🌊",
    description: "Distributed Denial of Service — overwhelms a server with traffic, making it unavailable.",
    count:       14,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "Ransomware",
    short:       "Ransomware",
    icon:        "💰",
    description: "Encrypts victim's files and demands payment for decryption key.",
    count:       8,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "Phishing",
    short:       "Phishing",
    icon:        "🎣",
    description: "Fake emails or websites trick users into revealing credentials or installing malware.",
    count:       22,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "SQL Injection",
    short:       "SQLi",
    icon:        "💉",
    description: "Malicious SQL code injected into input fields to manipulate databases.",
    count:       6,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "Malware Infection",
    short:       "Malware",
    icon:        "🦠",
    description: "Malicious software (virus, worm, trojan) that damages or controls systems.",
    count:       11,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "MITM Attack",
    short:       "MITM",
    icon:        "👂",
    description: "Man-in-the-Middle: intercepts communication between two parties.",
    count:       4,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "Brute Force",
    short:       "Brute Force",
    icon:        "🔨",
    description: "Automated repeated guessing of passwords or encryption keys.",
    count:       18,
    severity:    "Medium",
    color:       "#ffcc00"
  },
  {
    type:        "Zero-Day Exploit",
    short:       "Zero-Day",
    icon:        "💣",
    description: "Exploit targeting unknown vulnerabilities before patches are available.",
    count:       2,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "XSS Attack",
    short:       "XSS",
    icon:        "📝",
    description: "Cross-Site Scripting: injects client-side scripts into trusted web pages.",
    count:       9,
    severity:    "Medium",
    color:       "#ffcc00"
  },
  {
    type:        "Data Breach",
    short:       "Data Breach",
    icon:        "🗃️",
    description: "Unauthorised access and extraction of sensitive/confidential data.",
    count:       5,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "Insider Threat",
    short:       "Insider",
    icon:        "🕵️",
    description: "Malicious actions by employees, contractors, or trusted insiders.",
    count:       3,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "Botnet Activity",
    short:       "Botnet",
    icon:        "🤖",
    description: "Network of infected computers controlled by an attacker for malicious purposes.",
    count:       7,
    severity:    "High",
    color:       "#ff8800"
  },
  {
    type:        "Credential Stuffing",
    short:       "Cred. Stuffing",
    icon:        "🔑",
    description: "Using stolen username/password lists to gain unauthorised account access.",
    count:       12,
    severity:    "Medium",
    color:       "#ffcc00"
  },
  {
    type:        "APT (Advanced Persistent Threat)",
    short:       "APT",
    icon:        "🎯",
    description: "Prolonged, targeted cyberattack where an intruder remains undetected in a network.",
    count:       1,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "Rootkit",
    short:       "Rootkit",
    icon:        "🌲",
    description: "Conceals malware deep in the operating system, evading detection.",
    count:       3,
    severity:    "Critical",
    color:       "#ff2d55"
  },
  {
    type:        "Keylogger",
    short:       "Keylogger",
    icon:        "⌨️",
    description: "Records keystrokes to capture passwords and sensitive information.",
    count:       5,
    severity:    "Medium",
    color:       "#ffcc00"
  },
  {
    type:        "Spyware",
    short:       "Spyware",
    icon:        "👁",
    description: "Secretly monitors and transmits user activity and data.",
    count:       6,
    severity:    "Medium",
    color:       "#ffcc00"
  },
  {
    type:        "Trojan Horse",
    short:       "Trojan",
    icon:        "🐴",
    description: "Disguises itself as legitimate software to gain access and cause damage.",
    count:       4,
    severity:    "High",
    color:       "#ff8800"
  },
]

// ── Recent attack log ─────────────────────────
const ATTACK_LOG = [
  { time: "10:42 AM", type: "DDoS Attack",      source: "External IP: 192.168.xx.xx", status: "Blocked" },
  { time: "10:35 AM", type: "Phishing Attempt",  source: "Email spoofing detected",    status: "Quarantined" },
  { time: "09:58 AM", type: "Brute Force",       source: "Admin portal login",          status: "Blocked" },
  { time: "09:40 AM", type: "SQL Injection",     source: "Web application endpoint",   status: "Mitigated" },
  { time: "09:12 AM", type: "Malware Infection", source: "Endpoint: WRKS-204",          status: "Removed" },
  { time: "08:55 AM", type: "Credential Stuffing",source: "API gateway",               status: "Blocked" },
]

const LOG_STATUS_COLOR = {
  "Blocked":    "#00ff88",
  "Quarantined":"#ffcc00",
  "Mitigated":  "#1d6fe8",
  "Removed":    "#00d4ff"
}

function CyberAlerts({ incidents }) {
  const [search, setSearch] = useState("")
  const [sevFilter, setSevFilter] = useState("All")
  const [expanded, setExpanded] = useState(null)

  // Count cyber incidents from live incidents
  const cyberIncs = incidents.filter(i => i.category === "Cyber")
  const total = ALL_ATTACKS.reduce((s, a) => s + a.count, 0) + cyberIncs.length

  // Add live incidents to counts
  const attackData = ALL_ATTACKS.map(a => {
    const liveCount = cyberIncs.filter(i =>
      i.type.toLowerCase().includes(a.short.toLowerCase()) ||
      a.type.toLowerCase().includes(i.type.toLowerCase().split(" ")[0])
    ).length
    return { ...a, count: a.count + liveCount }
  })

  const filtered = attackData.filter(a =>
    (sevFilter === "All" || a.severity === sevFilter) &&
    (a.type.toLowerCase().includes(search.toLowerCase()) ||
     a.description.toLowerCase().includes(search.toLowerCase()))
  )

  // Chart data
  const barData = filtered.slice(0, 10).map(a => ({ name: a.short, count: a.count, fill: a.color }))
  const radarData = [
    { subject: "DDoS",      A: 14 },
    { subject: "Malware",   A: 11 },
    { subject: "Phishing",  A: 22 },
    { subject: "Brute Force",A:18 },
    { subject: "Zero-Day",  A: 2  },
    { subject: "APT",       A: 1  },
  ]

  // Severity summary
  const critCount = attackData.filter(a => a.severity === "Critical").reduce((s,a) => s+a.count, 0)
  const highCount = attackData.filter(a => a.severity === "High").reduce((s,a) => s+a.count, 0)
  const medCount  = attackData.filter(a => a.severity === "Medium").reduce((s,a) => s+a.count, 0)

  return (
    <div style={S.wrap} className="fade-up">
      <h1 style={S.title}>🛡️ Cyber Threat Intelligence</h1>
      <p style={S.sub}>Comprehensive cyber attack monitoring and documentation</p>

      {/* ── Summary cards ─────────────────── */}
      <div style={S.summaryRow}>
        {[
          { label: "Total Cyber Threats", value: total,     color: "#00d4ff" },
          { label: "Critical Attacks",    value: critCount, color: "#ff2d55" },
          { label: "High Severity",       value: highCount, color: "#ff8800" },
          { label: "Medium Severity",     value: medCount,  color: "#ffcc00" },
          { label: "Attack Types Known",  value: ALL_ATTACKS.length, color: "#a855f7" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.summaryCard, borderColor: s.color + "33" }}>
            <div style={{ ...S.summaryNum, color: s.color }}>{s.value}</div>
            <div style={S.summaryLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts ────────────────────────── */}
      <div style={S.chartsRow}>
        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>📊 Attack Frequency (Top 10)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a6a" />
              <XAxis dataKey="name" stroke="#4a7a9b" tick={{ fontSize: 10, fill: "#4a7a9b" }} />
              <YAxis stroke="#4a7a9b" tick={{ fontSize: 10, fill: "#4a7a9b" }} />
              <Tooltip contentStyle={{ background: "#071428", border: "1px solid #1a3a6a", borderRadius: "8px", color: "#e8f4ff" }} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {barData.map((entry, i) => (
                  <Bar key={i} dataKey="count" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={S.chartCard}>
          <h3 style={S.chartTitle}>🕸 Threat Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1a3a6a" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#4a7a9b", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} stroke="#1a3a6a" tick={{ fill: "#2a4a6a", fontSize: 9 }} />
              <Radar name="Attacks" dataKey="A" stroke="#ff2d55" fill="#ff2d55" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Attack log ────────────────────── */}
      <div style={S.section}>
        <h3 style={S.sectionTitle}>⏱ Recent Attack Log</h3>
        {ATTACK_LOG.map((log, i) => (
          <div key={i} style={S.logRow}>
            <span style={{ color: "#4a7a9b", fontSize: "12px", minWidth: "80px" }}>{log.time}</span>
            <span style={{ color: "#e8f4ff", fontSize: "13px", flex: 1 }}>{log.type}</span>
            <span style={{ color: "#7a9cc0", fontSize: "12px", flex: 1 }}>{log.source}</span>
            <span style={{
              color: LOG_STATUS_COLOR[log.status] || "#7a9cc0",
              background: (LOG_STATUS_COLOR[log.status] || "#7a9cc0") + "15",
              borderRadius: "12px",
              padding: "2px 10px",
              fontSize: "12px",
              fontWeight: 700
            }}>
              {log.status}
            </span>
          </div>
        ))}
      </div>

      {/* ── Attack library ────────────────── */}
      <div style={S.section}>
        <h3 style={S.sectionTitle}>📚 Cyber Attack Library</h3>

        {/* Search + filter */}
        <div style={S.controls}>
          <input
            placeholder="🔍 Search attack types..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={S.searchInput}
          />
          <div style={{ display: "flex", gap: "6px" }}>
            {["All", "Critical", "High", "Medium"].map(f => (
              <button
                key={f}
                onClick={() => setSevFilter(f)}
                style={{
                  ...S.filterBtn,
                  background: sevFilter === f ? "rgba(0,212,255,0.1)" : "transparent",
                  borderColor: sevFilter === f ? "#00d4ff" : "#1a3a6a",
                  color:       sevFilter === f ? "#00d4ff" : "#4a7a9b"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Attack cards grid */}
        <div style={S.attackGrid}>
          {filtered.map((attack, i) => (
            <div
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                ...S.attackCard,
                borderColor: attack.color + "44",
                cursor: "pointer"
              }}
            >
              <div style={S.attackTop}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{attack.icon}</span>
                  <div>
                    <div style={{ color: "#e8f4ff", fontSize: "14px", fontWeight: 700 }}>
                      {attack.type}
                    </div>
                    <div style={{ color: attack.color, fontSize: "11px", fontWeight: 700, letterSpacing: "1px" }}>
                      {attack.severity}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ ...S.attackCount, color: attack.color }}>{attack.count}</div>
                  <div style={{ color: "#4a7a9b", fontSize: "10px" }}>detected</div>
                </div>
              </div>

              {/* Bar indicator */}
              <div style={S.attackBarTrack}>
                <div style={{
                  ...S.attackBarFill,
                  width: Math.min(100, (attack.count / 25) * 100) + "%",
                  background: attack.color
                }} />
              </div>

              {/* Expanded description */}
              {expanded === i && (
                <div style={S.attackDesc}>
                  📌 {attack.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────
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
    fontSize: "30px",
    fontWeight: 700,
    lineHeight: 1
  },
  summaryLabel: {
    color: "#4a7a9b",
    fontSize: "11px",
    marginTop: "6px",
    letterSpacing: "0.5px"
  },

  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "20px"
  },
  chartCard: {
    background: "rgba(7,20,40,0.6)",
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
    fontSize: "13px",
    letterSpacing: "2px",
    margin: "0 0 16px"
  },

  logRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(26,58,106,0.4)",
    flexWrap: "wrap"
  },

  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    padding: "9px 14px",
    background: "rgba(7,20,40,0.8)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif",
    outline: "none"
  },
  filterBtn: {
    padding: "6px 12px",
    border: "1px solid",
    borderRadius: "16px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    transition: "all 0.2s"
  },

  attackGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "12px"
  },
  attackCard: {
    background: "rgba(7,20,40,0.7)",
    border: "1px solid",
    borderRadius: "10px",
    padding: "14px",
    transition: "transform 0.2s, box-shadow 0.2s"
  },
  attackTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  attackCount: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: 1
  },
  attackBarTrack: {
    height: "4px",
    background: "#0a1628",
    borderRadius: "2px",
    overflow: "hidden"
  },
  attackBarFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "width 0.6s ease"
  },
  attackDesc: {
    marginTop: "10px",
    color: "#7a9cc0",
    fontSize: "12px",
    lineHeight: 1.6,
    background: "rgba(0,0,0,0.2)",
    borderRadius: "6px",
    padding: "8px 12px"
  }
}

export default CyberAlerts