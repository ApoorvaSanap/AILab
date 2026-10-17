# ⚡ VoltSpot - Real-Time EV Charging Station Finder

**VoltSpot** is a modern, responsive web application for locating, filtering, and reserving Electric Vehicle (EV) charging stations. Built with interactive OpenStreetMap/Leaflet mapping, real-time plug occupancy simulation, vehicle charge time calculators, and highway trip planning.

![VoltSpot Preview](https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 1. 🗺️ Interactive Live Map
- **Custom Pulse Markers**: Color-coded markers indicating real-time status:
  - 🔵 **Cyan Pulse**: Ultra-Fast Hyperchargers (120 kW - 350 kW)
  - 🟢 **Emerald Pulse**: Available Rapid Chargers (30 kW - 60 kW)
  - 🟡 **Amber**: High demand / Limited plugs
  - 🔴 **Red**: Occupied / Offline
- **Multi-Layer Support**: Switch between **Dark Matter**, **Voyager Light**, and standard **OpenStreetMap** basemaps.
- **GPS Live Geolocation**: One-click "Near Me" button that locates your exact coordinates and automatically computes real-road distances using the **Haversine formula**.
- **Hub Quick Jump**: Quick switcher for major metro hubs (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, San Francisco, New York, London).

### 2. 🔍 Multi-Criteria Smart Filters
- **Connectors**: CCS-2, Type 2 (AC), CHAdeMO, Tesla/NACS, GB/T.
- **Charging Speed**: Standard AC (≤22 kW), Fast DC (30 - 60 kW), Ultra-Fast Hyperchargers (120+ kW).
- **Operators**: Tata Power, Statiq, Jio-bp pulse, Zeon, Shell Recharge, Electrify America, Tesla Superchargers.
- **Availability**: Instant "Available Now" toggle.
- **Amenities**: 24/7 Access, Cafe / Food, Restrooms, Free Wi-Fi, Covered Parking, CCTV Security, Tyre Air Point.
- **Dynamic Sorting**: Nearest First, Fastest Power (kW), Highest Customer Rating, Lowest Tariff, Most Available Plugs.

### 3. 📱 Station Detail Drawer & Community Reviews
- High-resolution imagery, street address, operating hours, and operator info.
- Individual socket breakdown with power rating and live occupancy state.
- Electricity tariff breakdown and parking details.
- 1-Click **"Navigate"** button that directly launches turn-by-turn navigation in Google Maps or Apple Maps.
- Community reviews feed with star ratings and interactive review submission that syncs to browser storage (`localStorage`).

### 4. 📅 Slot Reservation & Pass Generation
- Select your specific EV vehicle model (Tesla Model 3, Tata Nexon EV, Hyundai Ioniq 5, MG ZS EV, etc.).
- Pick your preferred socket/port and estimated arrival window.
- Real-time calculation of **energy delivered (kWh)**, **range added (+km)**, and **total estimated session cost**.
- Instant booking confirmation with confetti celebration, unique reservation ID, and dynamic **QR Code ticket** with a 15-minute countdown hold timer.

### 5. 🛣️ EV Long-Distance Trip Planner
- Enter origin & destination (or select preset express routes like *Mumbai → Pune*, *Delhi → Agra*, *Bengaluru → Mysuru*).
- Select EV model and starting battery state-of-charge.
- Calculates optimal charging stops along the highway, required charging duration, and battery top-up plan.

### 6. 🧮 Charge Time & Cost Calculator
- Interactive sliders for starting % and target battery % (e.g. 20% to 80%).
- Select battery size (kWh) and charger power output (7.4 kW AC up to 240 kW DC).
- Computes exact charging minutes (incorporating fast-charge curve taper above 80%), added driving range, and approximate electricity cost.

### 7. ➕ Add / Host a Charger
- Community contribution modal allowing EV owners and businesses to list their private or commercial chargers.
- Auto-fetches current map coordinates or custom GPS input.
- Automatically persists new stations into `localStorage`.

---

## 🚀 How to Run

### Option 1: Double-Click (Zero Install)
Simply double-click `index.html` in your file explorer. It will open directly in Google Chrome, Microsoft Edge, Brave, or Firefox.

### Option 2: Run via PowerShell Local Server
Open PowerShell in the project directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
This will launch the local HTTP server on `http://localhost:8080/` and automatically open your default browser.

---

## 📁 Project Structure

```
ev-charging-finder/
├── index.html           # Main semantic HTML5 application layout & modals
├── css/
│   └── style.css        # Leaflet custom styling, pulse animations, themes
├── js/
│   ├── data.js          # Stations dataset, EV models specs, hub coordinates
│   └── app.js           # Core map engine, filtering, booking, calculator
├── serve.ps1            # Lightweight PowerShell web server
└── README.md            # Documentation & setup guide
```

---

## 🔌 API Integrations (Optional Next Steps)
The application is structured to easily integrate with third-party real-time APIs:
- **Open Charge Map API**: Replace or supplement `DEFAULT_STATIONS` in `js/data.js` with calls to `https://api.openchargemap.io/v3/poi/`.
- **TomTom EV Charging API**: For real-time connector availability feeds and turn-by-turn routing polylines.
- **Stripe / Razorpay Payment Gateway**: Connect to the booking modal for real payment processing.
