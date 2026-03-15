// ─────────────────────────────────────────────
//  CityShield · MapPage.js  (City Incident Map)
//  Uses Google Maps API with incident markers
// ─────────────────────────────────────────────
import React, { useState, useRef, useEffect } from "react"
import { getSeverityColor } from "./utils"

// ── Zone coordinates around Hyderabad ─────────
const ZONE_COORDS = {
  "Zone A": { lat: 17.440, lng: 78.490 },
  "Zone B": { lat: 17.380, lng: 78.530 },
  "Zone C": { lat: 17.420, lng: 78.440 },
  "Zone D": { lat: 17.360, lng: 78.480 },
  "Zone E": { lat: 17.460, lng: 78.550 },
  "Zone F": { lat: 17.340, lng: 78.430 },
  "Zone G": { lat: 17.480, lng: 78.400 },
  "Zone H": { lat: 17.350, lng: 78.560 },
}

// ── Default coords with slight random offset ──
function getCoords(zone) {
  const base = ZONE_COORDS[zone]
  if (base) return base
  return {
    lat: 17.385 + (Math.random() - 0.5) * 0.1,
    lng: 78.486 + (Math.random() - 0.5) * 0.1
  }
}

function MapPage({ incidents }) {
  const [selected, setSelected] = useState(null)
  const [filter,   setFilter]   = useState("All")

  const filtered = filter === "All"
    ? incidents
    : incidents.filter(i => i.category === filter || i.severity === filter || i.zone === filter)

  const zones    = [...new Set(incidents.map(i => i.zone))]
  const filters  = ["All", "Cyber", "Physical", "Critical", "High", ...zones]

  // Zone counts
  const zoneCounts = {}
  incidents.forEach(i => {
    zoneCounts[i.zone] = (zoneCounts[i.zone] || 0) + 1
  })

  return (
    <div style={S.wrap} className="fade-up">
      <h1 style={S.title}>🗺 City Incident Map</h1>
      <p style={S.sub}>Live view of incident locations across all city zones</p>

      {/* Filters */}
      <div style={S.filterRow}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...S.filterBtn,
              background: filter === f ? "rgba(0,212,255,0.12)" : "transparent",
              borderColor: filter === f ? "#00d4ff" : "#1a3a6a",
              color:       filter === f ? "#00d4ff" : "#4a7a9b"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={S.layout}>
        {/* ── Map ─────────────────────────────── */}
        <div style={S.mapPanel}>
          <div style={S.mapFrame}>
            <iframe
              title="CityShield Incident Map"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647!2d78.24323!3d17.41228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />

            {/* Overlay: incident count badge */}
            <div style={S.mapBadge}>
              <div style={{ color: "#00d4ff", fontFamily: "'Orbitron',sans-serif", fontSize: "11px", letterSpacing: "1px" }}>
                ACTIVE INCIDENTS
              </div>
              <div style={{ color: "#e8f4ff", fontSize: "28px", fontWeight: 700, fontFamily: "'Orbitron',sans-serif" }}>
                {filtered.length}
              </div>
            </div>

            {/* Overlay: zone legend */}
            <div style={S.zoneLegend}>
              {Object.entries(zoneCounts).map(([zone, count]) => (
                <div key={zone} style={S.legendItem}>
                  <span style={{ color: "#ff2d55" }}>◉</span>
                  <span style={{ color: "#e8f4ff", fontSize: "12px" }}>{zone}</span>
                  <span style={{
                    background: "#1d6fe8",
                    color: "white",
                    borderRadius: "10px",
                    padding: "0 6px",
                    fontSize: "10px",
                    fontWeight: 700
                  }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Note about API key */}
          <div style={S.apiNote}>
            ℹ️ To enable live incident markers on the map, replace <code>YOUR_GOOGLE_API_KEY</code> in MapPage.js with your actual Google Maps API key and use the &lt;GoogleMap&gt; component from <code>@react-google-maps/api</code>.
          </div>
        </div>

        {/* ── Incident list panel ──────────────── */}
        <div style={S.listPanel}>
          <h3 style={S.panelTitle}>
            📍 Incident Locations
            <span style={{ ...S.count, marginLeft: "8px" }}>{filtered.length}</span>
          </h3>

          {filtered.length === 0 ? (
            <div style={{ color: "#4a7a9b", textAlign: "center", padding: "40px 0" }}>
              No incidents for this filter.
            </div>
          ) : (
            filtered.map((inc, i) => {
              const coords = getCoords(inc.zone)
              const isActive = selected?.id === inc.id
              return (
                <div
                  key={inc.id || i}
                  onClick={() => setSelected(isActive ? null : inc)}
                  style={{
                    ...S.incRow,
                    borderColor:   getSeverityColor(inc.severity) + "55",
                    background: isActive ? "rgba(0,212,255,0.06)" : "rgba(7,20,40,0.6)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={S.incZone}>{inc.zone}</div>
                    <span style={{ color: getSeverityColor(inc.severity), fontSize: "12px", fontWeight: 700 }}>
                      {inc.severity}
                    </span>
                  </div>
                  <div style={S.incType}>{inc.type}</div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                    <span style={{ color: inc.category === "Cyber" ? "#00d4ff" : "#ff8800", fontSize: "12px" }}>
                      {inc.category}
                    </span>
                    <span style={{ color: "#4a7a9b", fontSize: "12px" }}>{inc.time}</span>
                  </div>

                  {isActive && (
                    <div style={S.coordBox}>
                      <span style={{ color: "#4a7a9b", fontSize: "11px" }}>📡 Approx. Location</span>
                      <span style={{ color: "#00d4ff", fontSize: "11px" }}>
                        {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Zone stat cards ──────────────────── */}
      <h3 style={{ ...S.panelTitle, marginTop: "24px" }}>📊 Zone Incident Summary</h3>
      <div style={S.zoneGrid}>
        {Object.entries(zoneCounts).map(([zone, count]) => {
          const zoneIncs = incidents.filter(i => i.zone === zone)
          const critical = zoneIncs.filter(i => i.severity === "Critical").length
          return (
            <div key={zone} style={S.zoneCard}>
              <div style={S.zoneName}>{zone}</div>
              <div style={{ ...S.zoneNum, color: critical > 0 ? "#ff2d55" : "#00d4ff" }}>
                {count}
              </div>
              <div style={{ color: "#4a7a9b", fontSize: "12px" }}>
                Incident{count !== 1 && "s"}
              </div>
              {critical > 0 && (
                <div style={S.criticalTag}>⚡ {critical} Critical</div>
              )}
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
  sub: { color: "#4a7a9b", fontSize: "13px", margin: "0 0 20px", letterSpacing: "1px" },
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
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "20px",
    alignItems: "start"
  },
  mapPanel: {},
  mapFrame: {
    height: "520px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #1a3a6a",
    position: "relative"
  },
  mapBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    background: "rgba(2,11,24,0.9)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    padding: "10px 16px",
    zIndex: 10
  },
  zoneLegend: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    background: "rgba(2,11,24,0.9)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    padding: "10px 14px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  apiNote: {
    marginTop: "10px",
    color: "#4a7a9b",
    fontSize: "11px",
    letterSpacing: "0.5px",
    lineHeight: 1.6
  },
  listPanel: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "12px",
    padding: "18px",
    maxHeight: "540px",
    overflowY: "auto"
  },
  panelTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "13px",
    color: "#e8f4ff",
    letterSpacing: "2px",
    margin: "0 0 16px",
    display: "flex",
    alignItems: "center"
  },
  count: {
    background: "#1d6fe8",
    color: "white",
    borderRadius: "12px",
    padding: "2px 10px",
    fontSize: "12px",
    fontFamily: "'Rajdhani', sans-serif",
    fontWeight: 700
  },
  incRow: {
    border: "1px solid",
    borderLeft: "4px solid",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "10px",
    transition: "background 0.2s"
  },
  incZone: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "11px",
    color: "#00d4ff",
    letterSpacing: "1px"
  },
  incType: {
    fontSize: "14px",
    color: "#e8f4ff",
    fontWeight: 600,
    marginTop: "4px"
  },
  coordBox: {
    marginTop: "10px",
    background: "rgba(0,212,255,0.06)",
    borderRadius: "6px",
    padding: "8px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  zoneGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "14px"
  },
  zoneCard: {
    background: "rgba(7,20,40,0.6)",
    border: "1px solid #1a3a6a",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "center"
  },
  zoneName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "11px",
    color: "#7a9cc0",
    letterSpacing: "1px",
    marginBottom: "6px"
  },
  zoneNum: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1
  },
  criticalTag: {
    marginTop: "8px",
    color: "#ff2d55",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px"
  }
}

export default MapPage