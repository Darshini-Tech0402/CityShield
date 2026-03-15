// ─────────────────────────────────────────────
//  CityShield · App.js  (Main Orchestrator)
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react"
import Login        from "./Login"
import Dashboard    from "./Dashboard"
import Alerts       from "./Alerts"
import Acknowledged from "./Acknowledged"
import Incidents    from "./Incidents"
import MapPage      from "./MapPage"
import CCTV         from "./CCTV"
import CyberAlerts  from "./CyberAlerts"
import Devices      from "./Devices"
import { isCyber, getSeverityColor, formatTime } from "./utils"

// ─── Initial demo data ───────────────────────
const DEMO_INCIDENTS = [
  { id: 1, zone: "Zone A", type: "Car Speeding",        severity: "High",     time: "09:12 AM", category: "Physical" },
  { id: 2, zone: "Zone B", type: "DDoS Cyber Attack",   severity: "Critical", time: "10:45 AM", category: "Cyber"    },
  { id: 3, zone: "Zone C", type: "Unauthorized Access", severity: "Medium",   time: "11:30 AM", category: "Physical" },
]

// ─── Nav items ───────────────────────────────
const NAV = [
  { id: "dashboard",    label: "Dashboard",       icon: "▦",  badge: null  },
  { id: "incidents",    label: "Incident Report",  icon: "📋", badge: null  },
  { id: "alerts",       label: "Security Alerts",  icon: "🚨", badge: "inc" },
  { id: "acknowledged", label: "Acknowledged",     icon: "✅", badge: "ack" },
  { id: "cctv",         label: "CCTV Feeds",       icon: "📷", badge: null  },
  { id: "map",          label: "City Map",          icon: "🗺️", badge: null  },
  { id: "cyber",        label: "Cyber Threats",    icon: "🛡️", badge: null  },
  { id: "devices",      label: "Devices",          icon: "💻", badge: null  },
]

// ─── Main App ────────────────────────────────
function App() {
  const [loggedIn,    setLoggedIn]    = useState(false)
  const [page,        setPage]        = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newAlert,    setNewAlert]    = useState(null)
  const [incidents,   setIncidents]   = useState(DEMO_INCIDENTS)
  const [acknowledged,setAcknowledged]= useState([])

  // inject Google Fonts once
  useEffect(() => {
    if (document.getElementById("cs-fonts")) return
    const link = document.createElement("link")
    link.id   = "cs-fonts"
    link.rel  = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap"
    document.head.appendChild(link)
    document.body.style.cssText = "margin:0;padding:0;background:#020b18;"
  }, [])

  // ── Add new incident ──────────────────────
  function addIncident(inc) {
    const newInc = {
      ...inc,
      id:       Date.now(),
      time:     formatTime(),
      category: isCyber(inc.type) ? "Cyber" : "Physical"
    }
    setIncidents(prev => [newInc, ...prev])
    setNewAlert(newInc)
    setTimeout(() => setNewAlert(null), 7000)
  }

  // ── Acknowledge alert ─────────────────────
  function acknowledge(alert) {
    setAcknowledged(prev => [
      { ...alert, acknowledgedAt: formatTime(), status: "Pending" },
      ...prev
    ])
    setIncidents(prev => prev.filter(i => i.id !== alert.id))
  }

  // ── Not logged in → show Login ────────────
  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />

  // ── Count badges ─────────────────────────
  const getBadge = (key) => {
    if (key === "inc") return incidents.length
    if (key === "ack") return acknowledged.length
    return 0
  }

  return (
    <div style={S.app}>
      <style>{GLOBAL_CSS}</style>

      {/* ══ TOP NAV ══════════════════════════ */}
      <nav style={S.nav}>

        {/* Hamburger button */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={S.hamburger}
          title="Menu"
        >
          <span style={{ ...S.hLine, transform: sidebarOpen ? "rotate(45deg) translate(4px,4px)" : "none" }} />
          <span style={{ ...S.hLine, opacity: sidebarOpen ? 0 : 1, transform: sidebarOpen ? "scaleX(0)" : "none" }} />
          <span style={{ ...S.hLine, transform: sidebarOpen ? "rotate(-45deg) translate(4px,-4px)" : "none" }} />
        </button>

        {/* Logo */}
        <div style={S.navLogo}>
          CITY<span style={{ color: "#1d6fe8" }}>SHIELD</span>
        </div>

        {/* Subtitle (hidden on small screens via media query trick) */}
        <div style={S.navSub} className="nav-sub">
          Hybrid Surveillance & Cyber Security Management System
        </div>

        <div style={{ flex: 1 }} />

        {/* Active alert badge */}
        {incidents.length > 0 && (
          <div
            style={S.navAlertBadge}
            className="pulse"
            onClick={() => setPage("alerts")}
            title="View active alerts"
          >
            🚨 {incidents.length} Active Alert{incidents.length !== 1 && "s"}
          </div>
        )}

        <div style={S.adminLabel}>⬡ ADMIN</div>

        <button
          onClick={() => { setLoggedIn(false); setPage("dashboard") }}
          style={S.logoutBtn}
        >
          ⏻ Logout
        </button>
      </nav>

      {/* ══ SIDEBAR (overlay, slides from left) ══════ */}
      {sidebarOpen && (
        <>
          {/* Dark backdrop — click to close */}
          <div
            style={S.backdrop}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar panel */}
          <div style={S.sidebar} className="sidebar-in">

            {/* Header */}
            <div style={S.sidebarHead}>
              <div style={S.sidebarLogo}>
                CITY<span style={{ color: "#1d6fe8" }}>SHIELD</span>
              </div>
              <p style={S.sidebarSub}>Surveillance System</p>
            </div>

            <div style={S.sep} />

            {/* Nav links */}
            {NAV.map(item => {
              const active  = page === item.id
              const badgeN  = item.badge ? getBadge(item.badge) : 0
              return (
                <div
                  key={item.id}
                  onClick={() => { setPage(item.id); setSidebarOpen(false) }}
                  style={{
                    ...S.navItem,
                    background:   active ? "rgba(0,212,255,0.08)" : "transparent",
                    borderLeft:   active ? "3px solid #00d4ff"    : "3px solid transparent",
                    color:        active ? "#00d4ff"              : "#7a9cc0"
                  }}
                  className="nav-item"
                >
                  <span style={{ fontSize: "17px", lineHeight: 1 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontWeight: active ? 600 : 400, fontSize: "15px" }}>
                    {item.label}
                  </span>
                  {badgeN > 0 && (
                    <span style={{
                      ...S.navBadge,
                      background: item.badge === "inc" ? "#ff2d55" : "#1d6fe8"
                    }}>
                      {badgeN}
                    </span>
                  )}
                </div>
              )
            })}

            <div style={{ flex: 1 }} />
            <div style={S.sep} />

            <div style={S.sidebarFooter}>
              <span style={{ color: "#00ff88" }}>●</span> v2.0 · ALL SYSTEMS ONLINE
            </div>
          </div>
        </>
      )}

      {/* ══ NEW INCIDENT POPUP ════════════════ */}
      {newAlert && (
        <div style={S.alertPop} className="pop-in">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{ fontSize: "26px" }}>🚨</span>
            <div>
              <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "11px", color: "#ff2d55", letterSpacing: "2px" }}>
                INCIDENT DETECTED
              </div>
              <div style={{ color: "#7a9cc0", fontSize: "11px" }}>
                {newAlert.time}
              </div>
            </div>
            <button
              onClick={() => setNewAlert(null)}
              style={S.popClose}
            >✕</button>
          </div>

          {[
            ["Zone",     newAlert.zone,     "#e8f4ff"],
            ["Type",     newAlert.type,     "#e8f4ff"],
            ["Category", newAlert.category, newAlert.category === "Cyber" ? "#00d4ff" : "#ff8800"],
            ["Severity", newAlert.severity, getSeverityColor(newAlert.severity)],
          ].map(([label, value, color]) => (
            <div key={label} style={S.popRow}>
              <span style={{ color: "#4a7a9b", fontSize: "12px", fontWeight: 600 }}>{label}</span>
              <span style={{ color, fontSize: "14px", fontWeight: 600 }}>{value}</span>
            </div>
          ))}

          <button
            onClick={() => { setPage("alerts"); setNewAlert(null) }}
            style={S.popBtn}
          >
            Open Alerts Page →
          </button>
        </div>
      )}

      {/* ══ MAIN PAGE CONTENT ════════════════ */}
      <main style={S.main}>
        {page === "dashboard"    && <Dashboard    incidents={incidents}    setPage={setPage} />}
        {page === "incidents"    && <Incidents    incidents={incidents}    addIncident={addIncident} />}
        {page === "alerts"       && <Alerts       incidents={incidents}    acknowledge={acknowledge} setPage={setPage} />}
        {page === "acknowledged" && <Acknowledged acknowledged={acknowledged} />}
        {page === "cctv"         && <CCTV         incidents={incidents} />}
        {page === "map"          && <MapPage      incidents={incidents} />}
        {page === "cyber"        && <CyberAlerts  incidents={incidents} />}
        {page === "devices"      && <Devices />}
      </main>
    </div>
  )
}

// ── Styles ──────────────────────────────────────

const S = {
  app: {
    background: "#020b18",
    minHeight: "100vh",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#e8f4ff"
  },
  nav: {
    background: "linear-gradient(90deg, #020b18, #050f20)",
    borderBottom: "1px solid #1a3a6a",
    height: "60px",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 20px rgba(0,0,0,0.6)"
  },
  hamburger: {
    background: "transparent",
    border: "1px solid #1a3a6a",
    borderRadius: "6px",
    padding: "8px 10px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    alignItems: "center",
    flexShrink: 0
  },
  hLine: {
    display: "block",
    width: "18px",
    height: "2px",
    background: "#00d4ff",
    borderRadius: "2px",
    transition: "all 0.25s ease"
  },
  navLogo: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "17px",
    color: "#00d4ff",
    letterSpacing: "3px",
    fontWeight: 700,
    flexShrink: 0
  },
  navSub: {
    color: "#2a4a6a",
    fontSize: "10px",
    letterSpacing: "1.5px",
    borderLeft: "1px solid #1a3a6a",
    paddingLeft: "16px",
    textTransform: "uppercase"
  },
  navAlertBadge: {
    background: "rgba(255,45,85,0.12)",
    border: "1px solid #ff2d55",
    color: "#ff2d55",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    cursor: "pointer",
    flexShrink: 0
  },
  adminLabel: {
    color: "#4a7a9b",
    fontSize: "12px",
    letterSpacing: "2px",
    flexShrink: 0
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #ff2d55",
    color: "#ff2d55",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "12px",
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: "1px",
    cursor: "pointer",
    flexShrink: 0
  },

  // ── Sidebar ──
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(3px)",
    zIndex: 199
  },
  sidebar: {
    position: "fixed",
    top: 0, left: 0,
    width: "260px",
    height: "100vh",
    background: "linear-gradient(180deg, #030e1c, #050f20)",
    borderRight: "1px solid #1a3a6a",
    zIndex: 200,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    boxShadow: "6px 0 40px rgba(0,0,0,0.8)"
  },
  sidebarHead: {
    padding: "24px 24px 16px"
  },
  sidebarLogo: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "22px",
    color: "#00d4ff",
    letterSpacing: "3px",
    fontWeight: 700
  },
  sidebarSub: {
    color: "#2a4a6a",
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    margin: "4px 0 0"
  },
  sep: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #1a3a6a, transparent)",
    margin: "4px 0"
  },
  navItem: {
    padding: "13px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s",
    letterSpacing: "0.5px",
    borderLeft: "3px solid transparent"
  },
  navBadge: {
    color: "white",
    borderRadius: "12px",
    padding: "2px 9px",
    fontSize: "11px",
    fontWeight: 700
  },
  sidebarFooter: {
    padding: "16px 24px",
    color: "#2a4a6a",
    fontSize: "11px",
    letterSpacing: "2px"
  },

  // ── Alert popup ──
  alertPop: {
    position: "fixed",
    top: "70px",
    right: "20px",
    background: "linear-gradient(160deg, #15040c, #220810)",
    border: "1px solid #ff2d55",
    borderRadius: "12px",
    padding: "20px",
    zIndex: 300,
    minWidth: "290px",
    maxWidth: "320px",
    boxShadow: "0 0 40px rgba(255,45,85,0.25), 0 16px 40px rgba(0,0,0,0.7)"
  },
  popClose: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "#4a7a9b",
    cursor: "pointer",
    fontSize: "16px",
    padding: "2px 6px"
  },
  popRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)"
  },
  popBtn: {
    marginTop: "14px",
    width: "100%",
    background: "linear-gradient(90deg, #cc1f3f, #ff2d55)",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "10px",
    cursor: "pointer",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1px"
  },

  main: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto"
  }
}

// ── Global CSS ────────────────────────────────
const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #020b18; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #020b18; }
  ::-webkit-scrollbar-thumb { background: #1a3a6a; border-radius: 3px; }

  @keyframes pulse {
    0%,100% { opacity: 1; box-shadow: 0 0 8px rgba(255,45,85,0.4); }
    50%      { opacity:.7; box-shadow: 0 0 20px rgba(255,45,85,0.8); }
  }
  @keyframes sidebarIn {
    from { transform: translateX(-100%); }
    to   { transform: translateX(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pulse        { animation: pulse 2s infinite; }
  .sidebar-in   { animation: sidebarIn 0.25s ease; }
  .pop-in       { animation: popIn 0.3s ease; }
  .fade-up      { animation: fadeUp 0.4s ease both; }

  .nav-item:hover {
    background: rgba(0,212,255,0.05) !important;
    color: #a0c4e8 !important;
  }
  .nav-sub {
    display: none;
  }
  @media (min-width: 900px) {
    .nav-sub { display: block !important; }
  }
`

export default App