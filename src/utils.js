// ─────────────────────────────────────────────
//  CityShield · Shared Utilities
// ─────────────────────────────────────────────

export const CYBER_KEYWORDS = [
  "attack","malware","ddos","phishing","cyber","hack","ransomware",
  "sql","injection","brute force","zero-day","mitm","intrusion",
  "spyware","trojan","botnet","xss","credential","exploit","breach",
  "scam","virus","worm","keylogger","rootkit","backdoor","eavesdrop"
]

export function isCyber(type) {
  return CYBER_KEYWORDS.some(k => type.toLowerCase().includes(k))
}

export function getSeverityColor(severity) {
  switch (severity) {
    case "Critical": return "#ff2d55"
    case "High":     return "#ff8800"
    case "Medium":   return "#ffcc00"
    case "Low":      return "#00ff88"
    default:         return "#7a9cc0"
  }
}

export function getSeverityBg(severity) {
  switch (severity) {
    case "Critical": return "rgba(255,45,85,0.15)"
    case "High":     return "rgba(255,136,0,0.15)"
    case "Medium":   return "rgba(255,204,0,0.12)"
    case "Low":      return "rgba(0,255,136,0.10)"
    default:         return "rgba(122,156,192,0.10)"
  }
}

export function formatTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}
