// ─────────────────────────────────────────────
//  CityShield · Incidents.js  (Report Incidents)
// ─────────────────────────────────────────────
import React, { useState } from "react"
import { getSeverityColor, getSeverityBg } from "./utils"

// ── Preset incident types per category ─────────
const INCIDENT_TYPES = {
  Physical: [
    "Car Speeding", "Road Accident", "Unauthorized Access", "Theft / Robbery",
    "Public Disturbance", "Fire Outbreak", "Crowd Riot", "Vandalism",
    "Suspicious Person", "Illegal Parking", "Drug Activity", "Missing Person"
  ],
  Cyber: [
    "DDoS Attack", "Phishing Attempt", "Ransomware", "SQL Injection",
    "Malware Infection", "Brute Force Attack", "Data Breach", "Zero-Day Exploit",
    "MITM Attack", "XSS Attack", "Credential Stuffing", "Insider Threat"
  ]
}

const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E", "Zone F", "Zone G", "Zone H"]
const SEVERITIES = ["Low", "Medium", "High", "Critical"]

function Incidents({ incidents, addIncident }) {
  const [zone,       setZone]       = useState("")
  const [category,   setCategory]   = useState("Physical")
  const [type,       setType]       = useState("")
  const [customType, setCustomType] = useState("")
  const [severity,   setSeverity]   = useState("Medium")
  const [desc,       setDesc]       = useState("")
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState("")

  const handleSubmit = () => {
    const finalType = type === "Custom" ? customType : type
    if (!zone)      { setError("Please select a zone.");         return }
    if (!finalType) { setError("Please select an incident type."); return }
    setError("")

    addIncident({ zone, type: finalType, severity, description: desc, category })

    // Reset form
    setZone("")
    setType("")
    setCustomType("")
    setSeverity("Medium")
    setDesc("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const types = [...INCIDENT_TYPES[category], "Custom"]

  return (
    <div style={S.wrap} className="fade-up">
      <h1 style={S.pageTitle}>
        <span style={{ marginRight: "12px" }}>📋</span>
        Incident Report
      </h1>
      <p style={S.pageSub}>Report a new city incident in real time</p>

      <div style={S.layout}>
        {/* ── Form panel ──────────────────── */}
        <div style={S.formCard}>
          <h3 style={S.cardTitle}>🚨 File New Incident</h3>

          {/* Success message */}
          {submitted && (
            <div style={S.successMsg}>
              ✅ Incident filed successfully! Alert sent to control room.
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={S.errorMsg}>⚠ {error}</div>
          )}

          {/* Zone */}
          <label style={S.label}>Select Zone</label>
          <select value={zone} onChange={e => setZone(e.target.value)} style={S.select}>
            <option value="">-- Choose Zone --</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>

          {/* Category toggle */}
          <label style={S.label}>Incident Category</label>
          <div style={S.catRow}>
            {["Physical", "Cyber"].map(c => (
              <button
                key={c}
                onClick={() => { setCategory(c); setType("") }}
                style={{
                  ...S.catBtn,
                  background: category === c
                    ? (c === "Cyber" ? "rgba(0,212,255,0.15)" : "rgba(255,136,0,0.15)")
                    : "transparent",
                  borderColor: category === c
                    ? (c === "Cyber" ? "#00d4ff" : "#ff8800")
                    : "#1a3a6a",
                  color: category === c
                    ? (c === "Cyber" ? "#00d4ff" : "#ff8800")
                    : "#7a9cc0"
                }}
              >
                {c === "Cyber" ? "🛡️" : "👮"} {c}
              </button>
            ))}
          </div>

          {/* Incident type */}
          <label style={S.label}>Incident Type</label>
          <div style={S.typeGrid}>
            {types.map(t => (
              <div
                key={t}
                onClick={() => setType(t)}
                style={{
                  ...S.typeChip,
                  background: type === t ? "rgba(29,111,232,0.2)" : "transparent",
                  borderColor: type === t ? "#1d6fe8" : "#1a3a6a",
                  color:       type === t ? "#e8f4ff" : "#7a9cc0"
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Custom type input */}
          {type === "Custom" && (
            <input
              placeholder="Describe the incident type..."
              value={customType}
              onChange={e => setCustomType(e.target.value)}
              style={S.input}
            />
          )}

          {/* Severity */}
          <label style={S.label}>Severity Level</label>
          <div style={S.sevRow}>
            {SEVERITIES.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                style={{
                  ...S.sevBtn,
                  background: severity === s ? getSeverityBg(s) : "transparent",
                  borderColor: severity === s ? getSeverityColor(s) : "#1a3a6a",
                  color:       severity === s ? getSeverityColor(s) : "#7a9cc0"
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Description */}
          <label style={S.label}>Description (optional)</label>
          <textarea
            placeholder="Add more details about the incident..."
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
            style={S.textarea}
          />

          {/* Submit */}
          <button onClick={handleSubmit} style={S.submitBtn}>
            🚨 REPORT INCIDENT
          </button>
        </div>

        {/* ── Active incidents list ──────────── */}
        <div style={S.listCard}>
          <h3 style={S.cardTitle}>
            🗂 Active Incidents
            <span style={S.incCount}>{incidents.length}</span>
          </h3>

          {incidents.length === 0 ? (
            <div style={S.emptyMsg}>✅ No active incidents reported.</div>
          ) : (
            incidents.map((inc, i) => (
              <div
                key={i}
                style={{
                  ...S.incCard,
                  borderLeftColor: getSeverityColor(inc.severity)
                }}
              >
                <div style={S.incTop}>
                  <span style={S.incZone}>{inc.zone}</span>
                  <span style={{
                    ...S.incSev,
                    color: getSeverityColor(inc.severity),
                    background: getSeverityBg(inc.severity)
                  }}>
                    {inc.severity}
                  </span>
                </div>
                <div style={S.incType}>{inc.type}</div>
                <div style={S.incMeta}>
                  <span style={{ color: inc.category === "Cyber" ? "#00d4ff" : "#ff8800" }}>
                    {inc.category}
                  </span>
                  <span style={{ color: "#4a7a9b" }}>{inc.time}</span>
                </div>
                {inc.description && (
                  <div style={S.incDesc}>{inc.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ── Styles ───────────────────────────────────────
const S = {
  wrap: { maxWidth: "1100px" },
  pageTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 6px",
    fontWeight: 700
  },
  pageSub: {
    color: "#4a7a9b",
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "24px"
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  formCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    padding: "24px"
  },
  listCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    padding: "24px",
    maxHeight: "80vh",
    overflowY: "auto"
  },
  cardTitle: {
    fontFamily: "'Orbitron', sans-serif",
    color: "#e8f4ff",
    fontSize: "14px",
    letterSpacing: "2px",
    margin: "0 0 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  incCount: {
    background: "#1d6fe8",
    color: "white",
    borderRadius: "12px",
    padding: "2px 10px",
    fontSize: "12px",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700
  },
  successMsg: {
    background: "rgba(0,255,136,0.1)",
    border: "1px solid rgba(0,255,136,0.3)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#00ff88",
    fontSize: "13px",
    marginBottom: "16px"
  },
  errorMsg: {
    background: "rgba(255,45,85,0.1)",
    border: "1px solid rgba(255,45,85,0.3)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#ff6b85",
    fontSize: "13px",
    marginBottom: "16px"
  },
  label: {
    display: "block",
    color: "#7a9cc0",
    fontSize: "12px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
    marginTop: "16px"
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(7,20,40,0.8)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif",
    outline: "none"
  },
  catRow: {
    display: "flex",
    gap: "10px"
  },
  catBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "1px",
    transition: "all 0.2s"
  },
  typeGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px"
  },
  typeChip: {
    padding: "6px 12px",
    border: "1px solid",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "12px",
    letterSpacing: "0.5px",
    transition: "all 0.15s"
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(7,20,40,0.8)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif",
    outline: "none",
    marginTop: "10px",
    boxSizing: "border-box"
  },
  sevRow: {
    display: "flex",
    gap: "8px"
  },
  sevBtn: {
    flex: 1,
    padding: "8px",
    border: "1px solid",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.2s",
    letterSpacing: "0.5px"
  },
  textarea: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(7,20,40,0.8)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box"
  },
  submitBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "13px",
    background: "linear-gradient(90deg, #cc1f3f, #ff2d55)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "13px",
    letterSpacing: "2px",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(255,45,85,0.3)"
  },
  emptyMsg: {
    color: "#4a7a9b",
    fontSize: "14px",
    textAlign: "center",
    padding: "40px 0"
  },
  incCard: {
    background: "rgba(7,20,40,0.7)",
    border: "1px solid #1a3a6a",
    borderLeft: "4px solid",
    borderRadius: "8px",
    padding: "14px",
    marginBottom: "12px"
  },
  incTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  },
  incZone: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "1px"
  },
  incSev: {
    fontSize: "11px",
    fontWeight: 700,
    padding: "2px 10px",
    borderRadius: "12px"
  },
  incType: {
    color: "#e8f4ff",
    fontSize: "15px",
    fontWeight: 600,
    marginBottom: "6px"
  },
  incMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px"
  },
  incDesc: {
    marginTop: "8px",
    color: "#4a7a9b",
    fontSize: "12px",
    borderTop: "1px solid rgba(26,58,106,0.4)",
    paddingTop: "8px"
  }
}

export default Incidents
