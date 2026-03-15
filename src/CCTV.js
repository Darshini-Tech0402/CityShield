// ─────────────────────────────────────────────
//  CityShield · CCTV.js
//  Auto-creates cameras for each unique zone
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react"
import { getSeverityColor } from "./utils"

// ── Static YouTube live feeds (looping city cams) ──
const FEED_POOL = [
  "https://www.youtube.com/embed/ydYDqZQpim8?autoplay=0&mute=1",
  "https://www.youtube.com/embed/1EiC9bvVGnk?autoplay=0&mute=1",
  "https://www.youtube.com/embed/cbP2N1BQdYc?autoplay=0&mute=1",
  "https://www.youtube.com/embed/i3nqE3Yqk0Q?autoplay=0&mute=1",
  "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=0&mute=1",
  "https://www.youtube.com/embed/AdUw5RdyZxI?autoplay=0&mute=1",
  "https://www.youtube.com/embed/bnJLhs6e7RA?autoplay=0&mute=1",
  "https://www.youtube.com/embed/l8pmfZwN5rg?autoplay=0&mute=1",
]

// ── Default static cameras (always shown) ─────
const BASE_CAMERAS = [
  { id: 1, zone: "Zone A", label: "Zone A — North Gate",     feed: FEED_POOL[0] },
  { id: 2, zone: "Zone B", label: "Zone B — Central Square", feed: FEED_POOL[1] },
  { id: 3, zone: "Zone C", label: "Zone C — East Junction",  feed: FEED_POOL[2] },
  { id: 4, zone: "Zone A", label: "Zone A — Checkpoint 2",   feed: FEED_POOL[3] },
  { id: 5, zone: "Zone B", label: "Zone B — Market Road",    feed: FEED_POOL[4] },
]

function CCTV({ incidents }) {
  const [time, setTime]   = useState(new Date().toLocaleTimeString("en-IN"))
  const [grid, setGrid]   = useState("3")   // "2" | "3" | "4"
  const [search, setSearch] = useState("")

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-IN")), 1000)
    return () => clearInterval(t)
  }, [])

  // ── Auto-generate cameras for incident zones ──
  const incidentZones = [...new Set(incidents.map(i => i.zone))]
  const existingZones = new Set(BASE_CAMERAS.map(c => c.zone))

  const dynamicCameras = []
  let idCounter = BASE_CAMERAS.length + 1

  incidentZones.forEach(zone => {
    if (!existingZones.has(zone)) {
      existingZones.add(zone)
      const feedIndex = (idCounter % FEED_POOL.length)
      dynamicCameras.push({
        id:    idCounter++,
        zone,
        label: `${zone} — Auto Cam (Incident)`,
        feed:  FEED_POOL[feedIndex],
        auto:  true
      })
    }
  })

  const allCameras = [...BASE_CAMERAS, ...dynamicCameras]

  // ── Filter by search ──────────────────────────
  const filtered = allCameras.filter(c =>
    c.zone.toLowerCase().includes(search.toLowerCase()) ||
    c.label.toLowerCase().includes(search.toLowerCase())
  )

  // ── Incidents per zone (for alert indicators) ─
  const incByZone = {}
  incidents.forEach(inc => {
    if (!incByZone[inc.zone]) incByZone[inc.zone] = []
    incByZone[inc.zone].push(inc)
  })

  // ── Motion detection (random, per-cam) ──────
  const motionMap = {}
  allCameras.forEach(c => {
    motionMap[c.id] = Math.random() > 0.65
  })

  const cols = { "2": "1fr 1fr", "3": "1fr 1fr 1fr", "4": "1fr 1fr 1fr 1fr" }

  return (
    <div style={S.wrap} className="fade-up">
      <style>{cctvCSS}</style>

      {/* ── Header ──────────────────────────── */}
      <div style={S.headerRow}>
        <div>
          <h1 style={S.title}>📷 Smart City CCTV Surveillance</h1>
          <p style={S.sub}>
            {allCameras.length} Camera{allCameras.length !== 1 && "s"} Active
            {dynamicCameras.length > 0 && (
              <span style={{ color: "#00d4ff", marginLeft: "10px" }}>
                +{dynamicCameras.length} auto-added from incidents
              </span>
            )}
          </p>
        </div>
        <div style={S.clockBox}>
          <div style={S.clockTime}>{time}</div>
          <div style={{ color: "#ff2d55", fontSize: "11px", letterSpacing: "2px", marginTop: "4px" }}>
            ● LIVE FEED
          </div>
        </div>
      </div>

      {/* ── Controls ────────────────────────── */}
      <div style={S.controls}>
        <input
          placeholder="🔍  Search zone or camera..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={S.searchInput}
        />
        <div style={S.gridBtns}>
          {["2","3","4"].map(g => (
            <button
              key={g}
              onClick={() => setGrid(g)}
              style={{
                ...S.gridBtn,
                background: grid === g ? "rgba(0,212,255,0.15)" : "transparent",
                borderColor: grid === g ? "#00d4ff" : "#1a3a6a",
                color:       grid === g ? "#00d4ff" : "#4a7a9b"
              }}
            >
              {g}×{g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Camera grid ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: cols[grid], gap: "16px" }}>
        {filtered.map(cam => {
          const zoneIncs  = incByZone[cam.zone] || []
          const hasAlert  = zoneIncs.length > 0
          const worstInc  = hasAlert
            ? zoneIncs.sort((a,b) => {
                const order = { Critical: 4, High: 3, Medium: 2, Low: 1 }
                return (order[b.severity] || 0) - (order[a.severity] || 0)
              })[0]
            : null
          const motion = motionMap[cam.id]

          return (
            <div
              key={cam.id}
              style={{
                ...S.camCard,
                borderColor: hasAlert ? getSeverityColor(worstInc?.severity) + "66" : "#1a3a6a",
                boxShadow: hasAlert
                  ? `0 0 20px ${getSeverityColor(worstInc?.severity)}22`
                  : "0 4px 20px rgba(0,0,0,0.4)"
              }}
              className={hasAlert ? "cam-alert" : ""}
            >
              {/* Camera header */}
              <div style={S.camHeader}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "#ff2d55", fontSize: "10px" }}>● LIVE</span>
                  <span style={{ color: "#00ff88", fontSize: "10px" }}>● ONLINE</span>
                  {cam.auto && (
                    <span style={{ color: "#00d4ff", fontSize: "10px" }}>● AUTO</span>
                  )}
                </div>
                <span style={{ color: "#4a7a9b", fontSize: "10px" }}>CAM {cam.id}</span>
              </div>

              {/* Camera label */}
              <div style={S.camLabel}>{cam.label}</div>

              {/* Video feed */}
              <div style={S.vidWrap}>
                <iframe
                  src={cam.feed}
                  title={cam.label}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>

              {/* Motion detected banner */}
              {motion && (
                <div style={S.motionBanner} className="blink">
                  ⚡ Motion Detected
                </div>
              )}

              {/* Zone incident alerts */}
              {hasAlert && (
                <div style={{
                  ...S.incBanner,
                  background: getSeverityColor(worstInc?.severity) + "22",
                  borderColor: getSeverityColor(worstInc?.severity) + "55",
                  color: getSeverityColor(worstInc?.severity)
                }}>
                  🚨 {zoneIncs.length} Active Incident{zoneIncs.length !== 1 && "s"} in {cam.zone}
                  <span style={{ marginLeft: "8px", fontSize: "11px" }}>
                    [{worstInc?.severity}]
                  </span>
                </div>
              )}

              {/* Zone tag */}
              <div style={S.camFooter}>
                <span style={S.zonePill}>{cam.zone}</span>
                {zoneIncs.slice(0, 2).map((inc, i) => (
                  <span key={i} style={{ ...S.incPill, color: getSeverityColor(inc.severity) }}>
                    {inc.type}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#4a7a9b" }}>
          No cameras found for "{search}"
        </div>
      )}
    </div>
  )
}

// ── CSS ─────────────────────────────────────────
const cctvCSS = `
  @keyframes blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }
  .blink { animation: blink 1s infinite; }
  
  @keyframes camAlert {
    0%,100% { box-shadow: 0 0 8px rgba(255,45,85,0.2); }
    50%      { box-shadow: 0 0 22px rgba(255,45,85,0.5); }
  }
  .cam-alert { animation: camAlert 2s infinite; }
`

// ── Styles ─────────────────────────────────────
const S = {
  wrap: {},
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px"
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 6px",
    fontWeight: 700
  },
  sub: { color: "#4a7a9b", fontSize: "13px", margin: 0, letterSpacing: "0.5px" },
  clockBox: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "10px",
    padding: "10px 18px",
    textAlign: "center"
  },
  clockTime: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "16px",
    color: "#00d4ff",
    letterSpacing: "2px"
  },
  controls: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center"
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "10px 14px",
    background: "rgba(7,20,40,0.7)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "14px",
    fontFamily: "'Rajdhani', sans-serif",
    outline: "none"
  },
  gridBtns: { display: "flex", gap: "8px" },
  gridBtn: {
    padding: "8px 14px",
    border: "1px solid",
    borderRadius: "6px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    transition: "all 0.2s"
  },
  camCard: {
    background: "linear-gradient(160deg, #071428, #071a38)",
    border: "1px solid",
    borderRadius: "10px",
    overflow: "hidden"
  },
  camHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    background: "rgba(0,0,0,0.3)"
  },
  camLabel: {
    padding: "6px 12px",
    color: "#7a9cc0",
    fontSize: "12px",
    letterSpacing: "0.5px",
    fontWeight: 600
  },
  vidWrap: {
    width: "100%",
    height: "180px",
    background: "#000",
    overflow: "hidden"
  },
  motionBanner: {
    background: "rgba(255,45,85,0.2)",
    color: "#ff6b85",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 12px",
    letterSpacing: "1px"
  },
  incBanner: {
    border: "1px solid",
    borderLeft: "none",
    borderRight: "none",
    fontSize: "12px",
    fontWeight: 700,
    padding: "6px 12px",
    letterSpacing: "0.5px"
  },
  camFooter: {
    padding: "8px 10px",
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    alignItems: "center",
    minHeight: "36px"
  },
  zonePill: {
    background: "rgba(0,212,255,0.1)",
    color: "#00d4ff",
    borderRadius: "12px",
    padding: "2px 10px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "1px"
  },
  incPill: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    padding: "2px 8px",
    fontSize: "10px"
  }
}

export default CCTV
