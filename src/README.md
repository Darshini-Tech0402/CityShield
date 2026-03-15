# 🛡️ CityShield — Setup Guide

## Files to Replace in your `src/` folder:

| File             | Description                          |
|------------------|--------------------------------------|
| `App.js`         | Main app — hamburger, routing, popups |
| `Login.js`       | Professional login page              |
| `Dashboard.js`   | Stats, charts, mini map              |
| `Incidents.js`   | Report incidents by zone             |
| `Alerts.js`      | Security alerts feed                 |
| `Acknowledged.js`| Acknowledged incident tracker        |
| `CCTV.js`        | Auto camera per zone                 |
| `MapPage.js`     | Full city map                        |
| `CyberAlerts.js` | All cyber threat types + stats       |
| `Devices.js`     | Device management                    |
| `utils.js`       | ⚠️ NEW file — add to your src/       |

---

## Install Dependencies (if not already):
```bash
npm install recharts
npm install @react-google-maps/api
```

---

## Login Credentials:
- **Username:** admin  
- **Password:** admin123

---

## Key Features:
✅ Hamburger sidebar — slides in as overlay (not half-page!)  
✅ Alert popup — appears when new incident is reported  
✅ CCTV — auto-adds camera when a new zone is added  
✅ 18 cyber attack types documented  
✅ Incidents → Alerts → Acknowledged full flow  
✅ Filter tabs on Alerts, CCTV, Devices, CyberAlerts  
✅ Deep blue professional design throughout  
✅ Orbitron + Rajdhani fonts (loads from Google Fonts)  

---

## How the flow works:
1. Login → Dashboard
2. Go to **Incident Report** → Fill form → Submit
3. 🚨 Alert popup appears top-right
4. Click "Open Alerts Page" OR go to **Security Alerts**
5. Click **Acknowledge** → goes to Acknowledged page
6. Update status in **Acknowledged** (Pending → Resolved)
7. If new zone (e.g. Zone H) added, check **CCTV** — new camera auto-appears!
