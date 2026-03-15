// ─────────────────────────────────────────────
//  CityShield · Login Page
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react"

function Login({ setLoggedIn }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [time, setTime]         = useState("")
  const [showPass, setShowPass] = useState(false)

  // Live clock in login screen
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN"))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogin = () => {
    setError("")
    if (!username || !password) {
      setError("Please enter both username and password.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        setLoggedIn(true)
      } else {
        setError("Invalid credentials. Access denied.")
        setLoading(false)
      }
    }, 1200)
  }

  const handleKey = (e) => { if (e.key === "Enter") handleLogin() }

  return (
    <div style={S.page}>
      <style>{css}</style>

      {/* Animated background grid */}
      <div style={S.grid} />
      <div style={S.gridOverlay} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`particle p${i}`} style={{ ...S.particle, animationDelay: `${i * 0.8}s` }} />
      ))}

      {/* Top status bar */}
      <div style={S.statusBar}>
        <span style={{ color: "#00ff88" }}>● SYSTEM ONLINE</span>
        <span style={S.statusCenter}>HYBRID SURVEILLANCE & CYBER SECURITY MANAGEMENT SYSTEM</span>
        <span style={{ color: "#7a9cc0" }}>{time}</span>
      </div>

      {/* Login card */}
      <div style={S.card} className="login-card">

        {/* Shield icon + project title */}
        <div style={S.logoWrap}>
          <div style={S.shieldIcon}>🛡</div>
          <h1 style={S.projectName}>
            CITY<span style={{ color: "#1d6fe8" }}>SHIELD</span>
          </h1>
          <p style={S.tagline}>Hybrid Surveillance & Cyber Security Management System</p>
        </div>

        <div style={S.divider} />

        <h3 style={S.loginTitle}>ADMIN ACCESS</h3>
        <p style={S.loginSub}>Authorised personnel only</p>

        {/* Username */}
        <div style={S.inputWrap}>
          <span style={S.inputIcon}>👤</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKey}
            style={S.input}
            autoComplete="off"
          />
        </div>

        {/* Password */}
        <div style={S.inputWrap}>
          <span style={S.inputIcon}>🔒</span>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            style={S.input}
            autoComplete="off"
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{ ...S.inputIcon, right: "12px", left: "auto", cursor: "pointer" }}
          >
            {showPass ? "🙈" : "👁"}
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div style={S.errorBox}>
            ⚠ {error}
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ ...S.loginBtn, opacity: loading ? 0.7 : 1 }}
          className="login-btn"
        >
          {loading ? (
            <span className="spinner">◌ AUTHENTICATING...</span>
          ) : (
            "LOGIN TO SYSTEM →"
          )}
        </button>

        <div style={S.hint}>
          <span style={{ color: "#4a7a9b" }}>Demo · </span>
          <span style={{ color: "#7a9cc0" }}>admin / admin123</span>
        </div>
      </div>

      {/* Bottom branding */}
      <div style={S.footer}>
        © 2025 CityShield · All systems secured
      </div>
    </div>
  )
}

// ── Styles ──────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020b18 0%, #030e22 50%, #020b18 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  grid: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
    zIndex: 0
  },
  gridOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse at center, transparent 40%, #020b18 100%)",
    zIndex: 1
  },
  particle: {
    position: "fixed",
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "#00d4ff",
    opacity: 0.4,
    animation: "float 6s ease-in-out infinite",
    zIndex: 1
  },
  statusBar: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: "36px",
    background: "rgba(2,11,24,0.9)",
    borderBottom: "1px solid #1a3a6a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    fontSize: "11px",
    letterSpacing: "1px",
    fontFamily: "'Rajdhani', sans-serif",
    color: "#4a7a9b",
    zIndex: 10
  },
  statusCenter: {
    color: "#2a5a8a",
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "9px",
    letterSpacing: "2px"
  },
  card: {
    position: "relative",
    zIndex: 10,
    background: "linear-gradient(160deg, #071428 0%, #050f1e 60%, #071a38 100%)",
    border: "1px solid #1a3a6a",
    borderRadius: "16px",
    padding: "44px 48px",
    width: "420px",
    boxShadow: `
      0 0 0 1px rgba(0,212,255,0.05),
      0 20px 60px rgba(0,0,0,0.8),
      0 0 80px rgba(0,100,200,0.1)
    `
  },
  logoWrap: {
    textAlign: "center",
    marginBottom: "8px"
  },
  shieldIcon: {
    fontSize: "42px",
    filter: "drop-shadow(0 0 12px rgba(0,212,255,0.6))"
  },
  projectName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "30px",
    color: "#00d4ff",
    letterSpacing: "4px",
    margin: "10px 0 6px",
    fontWeight: 900
  },
  tagline: {
    color: "#4a7a9b",
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    margin: 0
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #1a3a6a, transparent)",
    margin: "24px 0"
  },
  loginTitle: {
    fontFamily: "'Orbitron', sans-serif",
    color: "#e8f4ff",
    fontSize: "14px",
    letterSpacing: "3px",
    margin: "0 0 4px",
    textAlign: "center"
  },
  loginSub: {
    color: "#4a7a9b",
    fontSize: "12px",
    textAlign: "center",
    marginBottom: "24px",
    letterSpacing: "1px"
  },
  inputWrap: {
    position: "relative",
    marginBottom: "14px"
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    zIndex: 2
  },
  input: {
    width: "100%",
    padding: "13px 14px 13px 38px",
    background: "rgba(7,20,40,0.8)",
    border: "1px solid #1a3a6a",
    borderRadius: "8px",
    color: "#e8f4ff",
    fontSize: "15px",
    fontFamily: "'Rajdhani', sans-serif",
    letterSpacing: "1px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  },
  errorBox: {
    background: "rgba(255,45,85,0.12)",
    border: "1px solid rgba(255,45,85,0.4)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#ff6b85",
    fontSize: "13px",
    marginBottom: "14px",
    letterSpacing: "0.5px"
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #0a4f9e, #1d6fe8)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: "2px",
    cursor: "pointer",
    marginTop: "4px",
    boxShadow: "0 4px 20px rgba(29,111,232,0.4)",
    transition: "all 0.2s"
  },
  hint: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "12px",
    letterSpacing: "1px"
  },
  footer: {
    position: "fixed",
    bottom: "16px",
    color: "#2a4a6a",
    fontSize: "11px",
    letterSpacing: "2px",
    zIndex: 10
  }
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; }

  .login-card { animation: cardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(30px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-20px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .spinner { display: inline-block; animation: pulse 1s infinite; }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  .p0 { top: 20%; left: 10%; animation-duration: 7s; }
  .p1 { top: 70%; left: 5%;  animation-duration: 9s; }
  .p2 { top: 30%; left: 90%; animation-duration: 6s; }
  .p3 { top: 80%; left: 85%; animation-duration: 8s; }
  .p4 { top: 15%; left: 50%; animation-duration: 10s; }
  .p5 { top: 60%; left: 60%; animation-duration: 7.5s; }

  input:focus {
    border-color: #00d4ff !important;
    box-shadow: 0 0 0 2px rgba(0,212,255,0.15) !important;
  }
  .login-btn:hover:not(:disabled) {
    background: linear-gradient(90deg, #1d6fe8, #00d4ff) !important;
    box-shadow: 0 6px 30px rgba(0,212,255,0.4) !important;
    transform: translateY(-1px);
  }
`

export default Login
