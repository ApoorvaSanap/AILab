/**
 * VoltSpot - EV Charging Station Finder Application Engine
 * Interactive Map, Filtering, Live Geolocation, Booking Simulator, Calculator & LocalStorage Sync.
 */

// Application State
let map;
let markerLayerGroup;
let userMarker = null;
let userLocation = null; // { lat, lng }
let stations = [];
let activeFilters = {
  searchQuery: "",
  selectedCity: "Mumbai",
  maxDistanceKm: 30, // MAX 30 KM NEARBY LIMIT AS REQUESTED
  connectorTypes: new Set(),
  speedCategories: new Set(),
  operators: new Set(),
  amenities: new Set(),
  statusAvailableOnly: false,
  freeOnly: false,
};
let currentReferenceCenter = { lat: 19.0760, lng: 72.8777, name: "Mumbai" };
let radiusCircle = null;
let currentSort = "nearest";
let selectedStation = null;
let favoriteStationIds = new Set();
let currentMapLayerIndex = 0;
let mapTileLayer = null;
let reservationCountdownInterval = null;

// Map Tile Providers (Dark matter, Voyager light, OpenStreetMap)
const TILE_LAYERS = [
  {
    name: "Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }
  },
  {
    name: "Voyager Light",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }
  },
  {
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  }
];

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
  initMap();
  recomputeDistances();
  updateRadiusCircle();
  initVehiclesDropdowns();
  bindSearchEvents();
  renderStationFeed();
  runCalculator();

  // Try silent geolocation or default to Mumbai/nearest hub
  attemptAutoGeolocation();
});

// Load persistent data from LocalStorage
function loadSavedData() {
  try {
    const savedStations = localStorage.getItem("voltspot_stations");
    if (savedStations) {
      const parsed = JSON.parse(savedStations);
      // Merge custom added stations with latest DEFAULT_STATIONS
      const customOnes = parsed.filter(s => s.id && s.id.startsWith("st-custom-"));
      stations = [...DEFAULT_STATIONS, ...customOnes];
    } else {
      stations = [...DEFAULT_STATIONS];
      saveStationsToLocalStorage();
    }

    const savedFavs = localStorage.getItem("voltspot_favorites");
    if (savedFavs) {
      favoriteStationIds = new Set(JSON.parse(savedFavs));
      updateFavCountBadge();
    }
  } catch (e) {
    console.warn("LocalStorage access failed, fallback to defaults", e);
    stations = [...DEFAULT_STATIONS];
  }
}

function saveStationsToLocalStorage() {
  try {
    localStorage.setItem("voltspot_stations", JSON.stringify(stations));
  } catch (e) {
    console.error("Could not persist stations", e);
  }
}

function saveFavoritesToLocalStorage() {
  try {
    localStorage.setItem("voltspot_favorites", JSON.stringify([...favoriteStationIds]));
    updateFavCountBadge();
  } catch (e) {
    console.error("Could not persist favorites", e);
  }
}

function updateFavCountBadge() {
  const badge = document.getElementById("favCountBadge");
  if (!badge) return;
  if (favoriteStationIds.size > 0) {
    badge.textContent = favoriteStationIds.size;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

// -------------------------------------------------------------
// Leaflet Map Initialization
// -------------------------------------------------------------
function initMap() {
  // Center on Mumbai as default hub, or India / global view
  const defaultCenter = [19.0760, 72.8777];
  
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true
  }).setView(defaultCenter, 12);

  // Position zoom control bottom right
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Add initial dark tile layer
  const isDark = document.documentElement.classList.contains("dark");
  currentMapLayerIndex = isDark ? 0 : 1;
  applyMapTileLayer(currentMapLayerIndex);

  markerLayerGroup = L.layerGroup().addTo(map);

  // Map click handler to close popup or update coords
  map.on("click", (e) => {
    // Optional click handler
  });
}

function applyMapTileLayer(index) {
  if (mapTileLayer) {
    map.removeLayer(mapTileLayer);
  }
  const config = TILE_LAYERS[index];
  mapTileLayer = L.tileLayer(config.url, config.options).addTo(map);
}

function cycleMapLayer() {
  currentMapLayerIndex = (currentMapLayerIndex + 1) % TILE_LAYERS.length;
  applyMapTileLayer(currentMapLayerIndex);
}

// -------------------------------------------------------------
// Geolocation & Haversine Distance
// -------------------------------------------------------------
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function attemptAutoGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleUserCoords(pos.coords.latitude, pos.coords.longitude, false);
      },
      (err) => {
        console.log("Geolocation permission skipped or unavailable, using hub center.");
      },
      { timeout: 7000 }
    );
  }
}

function locateUser() {
  if (!("geolocation" in navigator)) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  const btn = event?.currentTarget;
  if (btn) btn.classList.add("animate-spin");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (btn) btn.classList.remove("animate-spin");
      handleUserCoords(pos.coords.latitude, pos.coords.longitude, true);
    },
    (err) => {
      if (btn) btn.classList.remove("animate-spin");
      alert("Unable to fetch your location: " + err.message + "\nYou can select a city hub from the top menu.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function handleUserCoords(lat, lng, flyTo = true) {
  userLocation = { lat, lng };
  currentReferenceCenter = { lat, lng, name: "Your Location" };
  activeFilters.selectedCity = null; // Prioritize real GPS location

  // Clear city chip selection
  document.querySelectorAll(".city-chip").forEach(c => {
    c.classList.remove("bg-brand-600", "text-white");
    c.classList.add("text-slate-300");
  });

  // Calculate distances for all stations
  recomputeDistances();
  updateRadiusCircle();

  // Create or update User Location marker
  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    const userIcon = L.divIcon({
      className: "user-marker-container",
      html: `
        <div class="user-marker">
          <div class="user-marker-pulse"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    userMarker.bindTooltip("You are here", { direction: "top", offset: [0, -10] });
  }

  if (flyTo) {
    map.flyTo([lat, lng], 12, { duration: 1.2 });
  }

  renderStationFeed();
}

function recomputeDistances() {
  if (!currentReferenceCenter) return;
  stations.forEach((st) => {
    st.distanceKm = calculateDistanceKm(
      currentReferenceCenter.lat,
      currentReferenceCenter.lng,
      st.lat,
      st.lng
    );
  });
}

// -------------------------------------------------------------
// 30 KM Radius Boundary Circle & Slider Handler
// -------------------------------------------------------------
function updateRadiusCircle() {
  if (!map || !currentReferenceCenter) return;
  if (radiusCircle) {
    map.removeLayer(radiusCircle);
  }
  const radiusMeters = activeFilters.maxDistanceKm * 1000;
  radiusCircle = L.circle([currentReferenceCenter.lat, currentReferenceCenter.lng], {
    radius: radiusMeters,
    color: '#10b981',
    fillColor: '#10b981',
    fillOpacity: 0.05,
    weight: 2,
    dashArray: '6, 8',
    interactive: false
  }).addTo(map);

  // Update UI values
  const displaySpan = document.getElementById("radiusKmDisplay");
  if (displaySpan) displaySpan.textContent = `${activeFilters.maxDistanceKm} km`;
  const headerSpan = document.getElementById("radiusHeaderSpan");
  if (headerSpan) headerSpan.textContent = `${activeFilters.maxDistanceKm} km`;
  const centerSpan = document.getElementById("radiusCenterName");
  if (centerSpan) {
    const isGps = currentReferenceCenter.name === "Your Location";
    centerSpan.innerHTML = `<i class="fa-solid ${isGps ? 'fa-location-dot text-brand-400' : 'fa-city text-cyan-400'} mr-1"></i>${currentReferenceCenter.name}`;
  }
}

function handleRadiusSliderChange(val) {
  const km = Math.min(30, Math.max(1, parseInt(val) || 30));
  activeFilters.maxDistanceKm = km;

  // Update slider input value if changed programmatically
  const slider = document.getElementById("radiusRangeSlider");
  if (slider && parseInt(slider.value) !== km) slider.value = km;

  // Update preset chip styling
  document.querySelectorAll(".radius-chip").forEach((chip) => {
    const chipKm = parseInt(chip.getAttribute("data-radius"));
    if (chipKm === km) {
      chip.classList.add("bg-brand-600", "text-white", "font-bold");
      chip.classList.remove("bg-slate-800", "text-slate-300");
    } else {
      chip.classList.remove("bg-brand-600", "text-white", "font-bold");
      chip.classList.add("bg-slate-800", "text-slate-300");
    }
  });

  updateRadiusCircle();
  renderStationFeed();
}

function setRadiusFilter(km) {
  handleRadiusSliderChange(km);
}

// -------------------------------------------------------------
// City Quick Switcher
// -------------------------------------------------------------
function switchCity(cityName) {
  const hub = CITY_COORDINATES[cityName];
  if (!hub) return;

  activeFilters.selectedCity = cityName;
  currentReferenceCenter = { lat: hub.lat, lng: hub.lng, name: cityName };
  
  // Highlight active city chip
  document.querySelectorAll(".city-chip").forEach((chip) => {
    if (chip.textContent.trim().toLowerCase().includes(cityName.toLowerCase())) {
      chip.classList.add("bg-brand-600", "text-white");
      chip.classList.remove("text-slate-300");
    } else {
      chip.classList.remove("bg-brand-600", "text-white");
      chip.classList.add("text-slate-300");
    }
  });

  recomputeDistances();
  updateRadiusCircle();
  map.flyTo([hub.lat, hub.lng], hub.zoom, { duration: 1.2 });
  renderStationFeed();
}

function fitAllStations() {
  if (stations.length === 0) return;
  const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
  map.fitBounds(bounds, { padding: [50, 50] });
}

// -------------------------------------------------------------
// Search & Filter Engine
// -------------------------------------------------------------
function bindSearchEvents() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  searchInput.addEventListener("input", (e) => {
    activeFilters.searchQuery = e.target.value.trim().toLowerCase();
    if (activeFilters.searchQuery.length > 0) {
      clearBtn.classList.remove("hidden");
    } else {
      clearBtn.classList.add("hidden");
    }
    renderStationFeed();
  });
}

function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  activeFilters.searchQuery = "";
  document.getElementById("clearSearchBtn").classList.add("hidden");
  renderStationFeed();
}

function toggleFilterDrawer() {
  const drawer = document.getElementById("filterDrawer");
  drawer.classList.toggle("hidden");
}

function quickFilterSpeed(speed) {
  if (activeFilters.speedCategories.has(speed)) {
    activeFilters.speedCategories.delete(speed);
  } else {
    activeFilters.speedCategories.add(speed);
  }
  updateFilterButtons();
  renderStationFeed();
}

function quickFilterStatus(status) {
  activeFilters.statusAvailableOnly = !activeFilters.statusAvailableOnly;
  updateFilterButtons();
  renderStationFeed();
}

function quickFilterConnector(conn) {
  if (activeFilters.connectorTypes.has(conn)) {
    activeFilters.connectorTypes.delete(conn);
  } else {
    activeFilters.connectorTypes.add(conn);
  }
  updateFilterButtons();
  renderStationFeed();
}

function toggleConnectorFilter(type) {
  if (activeFilters.connectorTypes.has(type)) {
    activeFilters.connectorTypes.delete(type);
  } else {
    activeFilters.connectorTypes.add(type);
  }
  updateFilterButtons();
  renderStationFeed();
}

function toggleOperatorFilter(operator) {
  if (activeFilters.operators.has(operator)) {
    activeFilters.operators.delete(operator);
  } else {
    activeFilters.operators.add(operator);
  }
  updateFilterButtons();
  renderStationFeed();
}

function toggleAmenityFilter(amenity) {
  if (activeFilters.amenities.has(amenity)) {
    activeFilters.amenities.delete(amenity);
  } else {
    activeFilters.amenities.add(amenity);
  }
  updateFilterButtons();
  renderStationFeed();
}

function resetAllFilters() {
  activeFilters = {
    searchQuery: "",
    selectedCity: currentReferenceCenter.name !== "Your Location" ? currentReferenceCenter.name : null,
    maxDistanceKm: 30, // Maintains strict 30 km nearby cap
    connectorTypes: new Set(),
    speedCategories: new Set(),
    operators: new Set(),
    amenities: new Set(),
    statusAvailableOnly: false,
    freeOnly: false,
  };
  document.getElementById("searchInput").value = "";
  document.getElementById("clearSearchBtn").classList.add("hidden");
  
  // Reset slider to 30 km
  const slider = document.getElementById("radiusRangeSlider");
  if (slider) slider.value = 30;
  setRadiusFilter(30);

  updateFilterButtons();
  renderStationFeed();
}

function updateFilterButtons() {
  // Update badges & button active styles
  let totalActive = 0;
  if (activeFilters.connectorTypes.size) totalActive += activeFilters.connectorTypes.size;
  if (activeFilters.speedCategories.size) totalActive += activeFilters.speedCategories.size;
  if (activeFilters.operators.size) totalActive += activeFilters.operators.size;
  if (activeFilters.amenities.size) totalActive += activeFilters.amenities.size;
  if (activeFilters.statusAvailableOnly) totalActive += 1;

  const badge = document.getElementById("activeFilterBadge");
  if (totalActive > 0) {
    badge.textContent = totalActive;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  // Quick chips
  const quickSpeed = document.querySelector('.quick-speed-chip[data-speed="ultrafast"]');
  if (quickSpeed) {
    if (activeFilters.speedCategories.has("ultrafast")) {
      quickSpeed.classList.add("bg-electric-500/20", "border-electric-400", "text-electric-300");
    } else {
      quickSpeed.classList.remove("bg-electric-500/20", "border-electric-400", "text-electric-300");
    }
  }

  const quickStatus = document.querySelector('.quick-status-chip[data-status="available"]');
  if (quickStatus) {
    if (activeFilters.statusAvailableOnly) {
      quickStatus.classList.add("bg-brand-500/20", "border-brand-400", "text-brand-300");
    } else {
      quickStatus.classList.remove("bg-brand-500/20", "border-brand-400", "text-brand-300");
    }
  }

  const quickConn = document.querySelector('.quick-connector-chip[data-connector="CCS-2"]');
  if (quickConn) {
    if (activeFilters.connectorTypes.has("CCS-2")) {
      quickConn.classList.add("bg-cyan-500/20", "border-cyan-400", "text-cyan-300");
    } else {
      quickConn.classList.remove("bg-cyan-500/20", "border-cyan-400", "text-cyan-300");
    }
  }

  // Connector buttons
  document.querySelectorAll(".connector-btn").forEach((btn) => {
    const val = btn.getAttribute("data-value");
    if (activeFilters.connectorTypes.has(val)) {
      btn.classList.add("bg-brand-600", "text-white", "border-brand-500");
    } else {
      btn.classList.remove("bg-brand-600", "text-white", "border-brand-500");
    }
  });

  // Operator buttons
  document.querySelectorAll(".operator-btn").forEach((btn) => {
    const val = btn.getAttribute("data-value");
    if (activeFilters.operators.has(val)) {
      btn.classList.add("bg-brand-600", "text-white", "border-brand-500");
    } else {
      btn.classList.remove("bg-brand-600", "text-white", "border-brand-500");
    }
  });

  // Amenity buttons
  document.querySelectorAll(".amenity-btn").forEach((btn) => {
    const val = btn.getAttribute("data-value");
    if (activeFilters.amenities.has(val)) {
      btn.classList.add("bg-brand-600", "text-white", "border-brand-500");
    } else {
      btn.classList.remove("bg-brand-600", "text-white", "border-brand-500");
    }
  });
}

function applySorting() {
  currentSort = document.getElementById("sortSelect").value;
  renderStationFeed();
}

// -------------------------------------------------------------
// Filtering and Rendering Pipeline
// -------------------------------------------------------------
function getFilteredStations() {
  return stations.filter((station) => {
    // 1. STRICT NEARBY RADIUS FILTER (MAX 30 KM):
    // Exclude any station that exceeds activeFilters.maxDistanceKm
    if (activeFilters.maxDistanceKm !== null && station.distanceKm !== undefined) {
      if (station.distanceKm > activeFilters.maxDistanceKm) {
        return false;
      }
    }

    // Search query match
    if (activeFilters.searchQuery) {
      const q = activeFilters.searchQuery;
      const matchText = (
        station.name + " " +
        station.operator + " " +
        station.address + " " +
        station.city
      ).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // City filter (applies when searching specific city)
    if (activeFilters.selectedCity) {
      if (station.city.toLowerCase() !== activeFilters.selectedCity.toLowerCase()) {
        return false;
      }
    }

    // Status filter
    if (activeFilters.statusAvailableOnly) {
      if (station.status !== "available" || station.availablePorts <= 0) return false;
    }

    // Speed categories filter
    if (activeFilters.speedCategories.size > 0) {
      if (!activeFilters.speedCategories.has(station.speedCategory)) return false;
    }

    // Connectors filter
    if (activeFilters.connectorTypes.size > 0) {
      const stationConnectors = new Set(station.connectors.map((c) => c.type));
      let matchAny = false;
      for (const ct of activeFilters.connectorTypes) {
        if (stationConnectors.has(ct)) {
          matchAny = true;
          break;
        }
      }
      if (!matchAny) return false;
    }

    // Operators filter
    if (activeFilters.operators.size > 0) {
      if (!activeFilters.operators.has(station.operator)) return false;
    }

    // Amenities filter
    if (activeFilters.amenities.size > 0) {
      const stationAmenities = new Set(station.amenities);
      for (const am of activeFilters.amenities) {
        if (!stationAmenities.has(am)) return false;
      }
    }

    return true;
  });
}

function sortStations(filtered) {
  return [...filtered].sort((a, b) => {
    if (currentSort === "nearest") {
      const distA = a.distanceKm !== undefined ? a.distanceKm : 99999;
      const distB = b.distanceKm !== undefined ? b.distanceKm : 99999;
      return distA - distB;
    } else if (currentSort === "speed") {
      return b.powerKW - a.powerKW;
    } else if (currentSort === "rating") {
      return b.rating - a.rating;
    } else if (currentSort === "priceLow") {
      return a.pricePerKwh - b.pricePerKwh;
    } else if (currentSort === "available") {
      return b.availablePorts - a.availablePorts;
    }
    return 0;
  });
}

function renderStationFeed() {
  const filtered = getFilteredStations();
  const sorted = sortStations(filtered);

  // Update counter
  document.getElementById("stationCount").textContent = sorted.length;

  // Render cards in sidebar
  renderStationCards(sorted);

  // Update map markers
  renderMapMarkers(sorted);
}

function renderStationCards(stationList) {
  const container = document.getElementById("stationListContainer");
  if (!container) return;

  if (stationList.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 space-y-3">
        <div class="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <i class="fa-solid fa-charging-station text-xl"></i>
        </div>
        <p class="text-sm font-semibold text-slate-300">No stations found within ${activeFilters.maxDistanceKm} km</p>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">No charging points detected within ${activeFilters.maxDistanceKm} km of ${currentReferenceCenter.name}. Try expanding the radius slider up to 30 km or use your GPS location.</p>
        <div class="flex items-center justify-center gap-2 pt-1">
          <button onclick="setRadiusFilter(30)" class="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow">
            Expand to 30 km (Max)
          </button>
          <button onclick="locateUser()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold">
            <i class="fa-solid fa-crosshairs mr-1 text-brand-400"></i> Use GPS
          </button>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = stationList.map((st) => {
    const isFav = favoriteStationIds.has(st.id);
    const distanceText = st.distanceKm !== undefined ? `${st.distanceKm.toFixed(1)} km away` : st.city;
    
    // Status color
    let statusClass = "bg-brand-500/10 text-brand-400 border-brand-500/20";
    let statusLabel = `${st.availablePorts}/${st.totalPorts} Plugs Free`;
    if (st.status === "busy" || (st.availablePorts === 1)) {
      statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      statusLabel = `${st.availablePorts}/${st.totalPorts} Plugs Free`;
    } else if (st.status === "offline" || st.availablePorts === 0) {
      statusClass = "bg-red-500/10 text-red-400 border-red-500/20";
      statusLabel = "Full / Busy";
    }

    // Connector tags preview
    const uniqueConnectors = [...new Set(st.connectors.map(c => c.type))];
    const connectorBadges = uniqueConnectors.map(c => 
      `<span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">${c}</span>`
    ).join("");

    const distBadge = st.distanceKm !== undefined ? `
      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-500/15 text-brand-300 border border-brand-500/30 flex items-center gap-1">
        <i class="fa-solid fa-location-arrow text-[9px] text-brand-400"></i> ${st.distanceKm.toFixed(1)} km
      </span>
    ` : "";

    return `
      <div class="station-card group p-3.5 rounded-2xl bg-slate-850 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition cursor-pointer shadow-sm relative overflow-hidden" onclick="focusStationOnMap('${st.id}')">
        
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">${st.operator}</span>
              <span class="text-slate-600">•</span>
              <span class="text-[11px] text-slate-400"><i class="fa-solid fa-location-dot mr-1 text-slate-500"></i>${distanceText}</span>
            </div>
            <h3 class="text-sm font-bold text-white group-hover:text-brand-300 transition line-clamp-1">${st.name}</h3>
          </div>

          <button onclick="event.stopPropagation(); toggleFavoriteStation('${st.id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition" title="Save Station">
            <i class="${isFav ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart text-sm"></i>
          </button>
        </div>

        <p class="text-xs text-slate-400 mt-1 line-clamp-1">${st.address}</p>

        <!-- Speed, Distance & Plugs Badges -->
        <div class="flex items-center flex-wrap gap-1.5 mt-2.5">
          ${distBadge}
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
            <i class="fa-solid fa-bolt text-cyan-400"></i> ${st.powerKW} kW
          </span>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusClass} border">
            ${statusLabel}
          </span>
          ${connectorBadges}
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs">
          <div class="flex items-center gap-3">
            <span class="font-bold text-slate-200 font-display">${st.currency}${st.pricePerKwh}<span class="text-[10px] text-slate-400 font-normal">/kWh</span></span>
            <span class="text-amber-400 flex items-center gap-1 text-[11px] font-semibold">
              <i class="fa-solid fa-star text-[10px]"></i> ${st.rating}
              <span class="text-slate-500">(${st.reviewCount})</span>
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="event.stopPropagation(); openDetailModal('${st.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 hover:border-slate-600 transition">
              Details
            </button>
            <button onclick="event.stopPropagation(); openBookingForStation('${st.id}')" class="px-2.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow transition">
              Reserve
            </button>
          </div>
        </div>

      </div>
    `;
  }).join("");
}

// -------------------------------------------------------------
// Leaflet Map Markers & Popups
// -------------------------------------------------------------
function renderMapMarkers(stationList) {
  if (!markerLayerGroup) return;
  markerLayerGroup.clearLayers();

  stationList.forEach((st) => {
    // Determine pin style class
    let pinClass = "available";
    let iconClass = "fa-bolt";

    if (st.powerKW >= 120) {
      pinClass = "ultrafast";
      iconClass = "fa-bolt-lightning";
    } else if (st.status === "busy" || st.availablePorts === 1) {
      pinClass = "busy";
    } else if (st.status === "offline" || st.availablePorts === 0) {
      pinClass = "offline";
    }

    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-pulse ${pinClass}"></div>
        <div class="marker-pin ${pinClass}">
          <i class="fa-solid ${iconClass} marker-icon"></i>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -38]
    });

    const marker = L.marker([st.lat, st.lng], { icon: customIcon });

    // Popup Content
    const popupHtml = `
      <div class="p-3 text-slate-200">
        <div class="flex items-center justify-between text-[11px] text-brand-400 font-semibold mb-1">
          <span>${st.operator}</span>
          <span class="text-slate-400">${st.powerKW} kW DC</span>
        </div>
        <h4 class="text-sm font-bold text-white font-display mb-1">${st.name}</h4>
        <p class="text-xs text-slate-400 mb-2 line-clamp-1">${st.address}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span class="text-emerald-400 font-bold">${st.availablePorts} of ${st.totalPorts} Plugs Free</span>
          <button onclick="openDetailModal('${st.id}')" class="px-2 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs font-semibold">
            View Details
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    marker.on("click", () => {
      // Pan smoothly
      map.panTo([st.lat, st.lng]);
    });

    markerLayerGroup.addLayer(marker);
  });
}

function focusStationOnMap(stationId) {
  const st = stations.find((s) => s.id === stationId);
  if (!st) return;

  map.flyTo([st.lat, st.lng], 15, { duration: 0.8 });

  // Open corresponding popup
  markerLayerGroup.eachLayer((layer) => {
    const latLng = layer.getLatLng();
    if (Math.abs(latLng.lat - st.lat) < 0.0001 && Math.abs(latLng.lng - st.lng) < 0.0001) {
      layer.openPopup();
    }
  });

  // On mobile, switch back to map view
  if (window.innerWidth < 1024) {
    toggleMobileView(true); // force map
  }
}

// -------------------------------------------------------------
// Station Detail Slideout Modal
// -------------------------------------------------------------
function openDetailModal(stationId) {
  const st = stations.find((s) => s.id === stationId);
  if (!st) return;
  selectedStation = st;

  // Populate Hero
  document.getElementById("detailHeroImage").src = st.image;
  document.getElementById("detailStationName").textContent = st.name;
  document.getElementById("detailOperatorBadge").textContent = st.operator;
  
  const statusBadge = document.getElementById("detailStatusBadge");
  if (st.status === "available") {
    statusBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    statusBadge.textContent = "Open & Operational";
  } else if (st.status === "busy") {
    statusBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30";
    statusBadge.textContent = "High Demand / Busy";
  } else {
    statusBadge.className = "px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30";
    statusBadge.textContent = "Plugs Full";
  }

  // Location & Navigation
  document.getElementById("detailAddress").textContent = st.address;
  document.getElementById("detailHours").innerHTML = `<i class="fa-regular fa-clock mr-1 text-slate-500"></i>${st.accessHours}`;
  const dist = st.distanceKm !== undefined ? `${st.distanceKm.toFixed(1)} km away` : st.city;
  document.getElementById("detailDistance").innerHTML = `<i class="fa-solid fa-route mr-1 text-slate-500"></i>${dist}`;
  document.getElementById("detailDirectionsBtn").href = `https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`;

  // Pricing & Metrics
  document.getElementById("detailTariff").textContent = `${st.currency}${st.pricePerKwh} / kWh`;
  document.getElementById("detailMaxPower").textContent = `${st.powerKW} kW`;
  document.getElementById("detailRating").innerHTML = `<i class="fa-solid fa-star text-amber-400 text-sm"></i> ${st.rating} <span class="text-xs text-slate-400 font-normal">(${st.reviewCount} reviews)</span>`;

  // Ports List
  document.getElementById("detailAvailableSummary").textContent = `${st.availablePorts} of ${st.totalPorts} Available`;
  const portsContainer = document.getElementById("detailPortsList");
  portsContainer.innerHTML = st.connectors.map((conn) => {
    const isAvail = conn.status === "available";
    const portBadgeClass = isAvail
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-slate-800 text-slate-400 border-slate-700";
    const portStatusText = isAvail ? "Available" : "In Use";

    return `
      <div class="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 text-sm font-mono font-bold">
            ${conn.id}
          </div>
          <div>
            <h4 class="text-xs font-bold text-white">${conn.type}</h4>
            <span class="text-[11px] text-slate-400 font-medium">${conn.power} Max</span>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded text-[11px] font-semibold border ${portBadgeClass}">
          ${portStatusText}
        </span>
      </div>
    `;
  }).join("");

  // Amenities Chips
  const amenitiesContainer = document.getElementById("detailAmenitiesList");
  const amenityMap = {
    open_24_7: { label: "24/7 Access", icon: "fa-clock", color: "text-brand-400" },
    cafe: { label: "Cafe / Food", icon: "fa-mug-hot", color: "text-amber-400" },
    restroom: { label: "Restrooms", icon: "fa-restroom", color: "text-blue-400" },
    wifi: { label: "Free Wi-Fi", icon: "fa-wifi", color: "text-emerald-400" },
    mall: { label: "Shopping Mall", icon: "fa-bag-shopping", color: "text-pink-400" },
    parking_covered: { label: "Covered Parking", icon: "fa-warehouse", color: "text-purple-400" },
    cctv: { label: "CCTV Security", icon: "fa-shield-halved", color: "text-cyan-400" },
    air_tyre: { label: "Tyre Air Point", icon: "fa-gauge-high", color: "text-yellow-400" },
  };

  amenitiesContainer.innerHTML = st.amenities.map((am) => {
    const item = amenityMap[am] || { label: am, icon: "fa-check", color: "text-brand-400" };
    return `
      <span class="px-3 py-1 rounded-lg bg-slate-850 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5">
        <i class="fa-solid ${item.icon} ${item.color}"></i> ${item.label}
      </span>
    `;
  }).join("");

  // Reviews List
  renderDetailReviews(st);

  // Favorite button state
  const isFav = favoriteStationIds.has(st.id);
  const favBtn = document.getElementById("detailFavBtn");
  favBtn.innerHTML = `<i class="${isFav ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart text-lg text-rose-400"></i>`;

  // Show modal with slide animation
  const modal = document.getElementById("stationDetailModal");
  const drawer = document.getElementById("stationDetailDrawer");
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    drawer.classList.remove("translate-x-full");
  }, 10);
}

function renderDetailReviews(st) {
  const reviewsContainer = document.getElementById("detailReviewsList");
  if (!st.reviews || st.reviews.length === 0) {
    reviewsContainer.innerHTML = `<p class="text-xs text-slate-500 italic">No reviews yet. Be the first to check in!</p>`;
    return;
  }

  reviewsContainer.innerHTML = st.reviews.map((rev) => {
    const stars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
    return `
      <div class="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-white">${rev.user}</span>
          <span class="text-amber-400">${stars}</span>
        </div>
        <p class="text-xs text-slate-300">${rev.comment}</p>
        <span class="text-[10px] text-slate-500 block text-right">${rev.date}</span>
      </div>
    `;
  }).join("");
}

function closeDetailModal() {
  const modal = document.getElementById("stationDetailModal");
  const drawer = document.getElementById("stationDetailDrawer");
  drawer.classList.add("translate-x-full");
  modal.classList.add("opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
  }, 250);
}

function toggleReviewForm() {
  const container = document.getElementById("addReviewFormContainer");
  container.classList.toggle("hidden");
}

function submitStationReview() {
  if (!selectedStation) return;
  const author = document.getElementById("reviewAuthorInput").value.trim() || "EV Driver";
  const rating = parseInt(document.getElementById("reviewRatingInput").value) || 5;
  const comment = document.getElementById("reviewCommentInput").value.trim();

  if (!comment) {
    alert("Please write a short review before submitting.");
    return;
  }

  const newReview = {
    user: author,
    rating: rating,
    date: "Just now",
    comment: comment
  };

  if (!selectedStation.reviews) selectedStation.reviews = [];
  selectedStation.reviews.unshift(newReview);
  selectedStation.reviewCount = (selectedStation.reviewCount || 0) + 1;

  // Persist
  saveStationsToLocalStorage();
  renderDetailReviews(selectedStation);

  // Reset & close form
  document.getElementById("reviewCommentInput").value = "";
  toggleReviewForm();
}

// -------------------------------------------------------------
// Favorites Handling
// -------------------------------------------------------------
function toggleFavoriteStation(stationId) {
  if (favoriteStationIds.has(stationId)) {
    favoriteStationIds.delete(stationId);
  } else {
    favoriteStationIds.add(stationId);
  }
  saveFavoritesToLocalStorage();
  renderStationFeed();
  renderFavoritesDrawer();
}

function toggleCurrentStationFavorite() {
  if (!selectedStation) return;
  toggleFavoriteStation(selectedStation.id);
  const isFav = favoriteStationIds.has(selectedStation.id);
  const favBtn = document.getElementById("detailFavBtn");
  favBtn.innerHTML = `<i class="${isFav ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart text-lg text-rose-400"></i>`;
}

function toggleFavoritesDrawer() {
  const drawer = document.getElementById("favoritesDrawer");
  const isOpen = !drawer.classList.contains("translate-x-full");
  if (isOpen) {
    drawer.classList.add("translate-x-full");
  } else {
    renderFavoritesDrawer();
    drawer.classList.remove("translate-x-full");
  }
}

function renderFavoritesDrawer() {
  const container = document.getElementById("favoritesListContainer");
  const favStations = stations.filter((s) => favoriteStationIds.has(s.id));

  if (favStations.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400 space-y-2">
        <i class="fa-regular fa-heart text-3xl text-slate-600"></i>
        <p class="text-sm font-semibold text-slate-300">No saved stations yet</p>
        <p class="text-xs text-slate-500">Click the heart icon on any charging station card to save your favorites here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favStations.map((st) => `
    <div class="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
      <div class="flex items-start justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-brand-400">${st.operator}</span>
          <h4 class="text-xs font-bold text-white">${st.name}</h4>
          <p class="text-[11px] text-slate-400">${st.address}</p>
        </div>
        <button onclick="toggleFavoriteStation('${st.id}')" class="text-rose-500 hover:text-rose-400">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>
      <div class="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
        <span class="text-cyan-400 font-bold">${st.powerKW} kW</span>
        <button onclick="toggleFavoritesDrawer(); focusStationOnMap('${st.id}')" class="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded text-xs">
          View on Map
        </button>
      </div>
    </div>
  `).join("");
}

// -------------------------------------------------------------
// Slot Reservation & Booking Engine
// -------------------------------------------------------------
function openBookingForCurrentStation() {
  if (!selectedStation) return;
  closeDetailModal();
  openBookingForStation(selectedStation.id);
}

function openBookingForStation(stationId) {
  const st = stations.find((s) => s.id === stationId);
  if (!st) return;
  selectedStation = st;

  document.getElementById("bookingStationSubtitle").textContent = `${st.name} • ${st.operator}`;

  // Reset steps
  document.getElementById("bookingFormStep").classList.remove("hidden");
  document.getElementById("bookingConfirmationStep").classList.add("hidden");

  // Populate Ports dropdown
  const portSelect = document.getElementById("bookingPortSelect");
  portSelect.innerHTML = st.connectors.map((c) => `
    <option value="${c.id}" ${c.status !== 'available' ? 'disabled' : ''}>
      Port ${c.id}: ${c.type} (${c.power}) - ${c.status === 'available' ? 'Available' : 'Occupied'}
    </option>
  `).join("");

  updateBookingCostEstimate();
  openModal("bookingModal");
}

function updateBookingCostEstimate() {
  if (!selectedStation) return;

  const vehicleIdx = document.getElementById("bookingVehicleSelect").value;
  const vehicle = EV_VEHICLE_DATABASE[vehicleIdx] || EV_VEHICLE_DATABASE[0];
  const durationMins = parseInt(document.getElementById("bookingDurationSelect").value) || 45;

  // Calculate power delivery
  const chargerKw = selectedStation.powerKW || 50;
  const maxKw = Math.min(chargerKw, vehicle.maxChargeKw);
  const hours = durationMins / 60;
  const energyKwh = Math.min(vehicle.batteryKwh * 0.8, maxKw * hours * 0.9); // Realistic taper
  const rangeAddedKm = Math.round(energyKwh * vehicle.efficiencyKmPerKwh);
  const totalCost = (energyKwh * selectedStation.pricePerKwh).toFixed(2);

  document.getElementById("bookingEstimatedEnergy").textContent = `~${energyKwh.toFixed(1)} kWh`;
  document.getElementById("bookingEstimatedRange").textContent = `+${rangeAddedKm} km`;
  document.getElementById("bookingTotalCost").textContent = `${selectedStation.currency}${totalCost}`;
}

function confirmSlotBooking() {
  if (!selectedStation) return;

  // Trigger celebration confetti
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Populate ticket
  const randomPassId = "VOLT-" + Math.floor(10000 + Math.random() * 90000);
  const portId = document.getElementById("bookingPortSelect").value;
  document.getElementById("ticketId").textContent = randomPassId;
  document.getElementById("ticketStation").textContent = selectedStation.name;
  document.getElementById("ticketPort").textContent = `Port ${portId}`;

  // Start 15-min countdown timer
  startReservationCountdown(15 * 60);

  // Switch step
  document.getElementById("bookingFormStep").classList.add("hidden");
  document.getElementById("bookingConfirmationStep").classList.remove("hidden");
}

function startReservationCountdown(durationSeconds) {
  if (reservationCountdownInterval) clearInterval(reservationCountdownInterval);
  let timer = durationSeconds;
  const display = document.getElementById("countdownTimer");

  reservationCountdownInterval = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    display.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (--timer < 0) {
      clearInterval(reservationCountdownInterval);
      display.textContent = "Expired";
    }
  }, 1000);
}

// -------------------------------------------------------------
// EV Trip Route Planner
// -------------------------------------------------------------
function setTripRoute(origin, dest) {
  document.getElementById("tripOriginInput").value = origin;
  document.getElementById("tripDestInput").value = dest;
  calculateTripRoute();
}

function calculateTripRoute() {
  const origin = document.getElementById("tripOriginInput").value.trim();
  const dest = document.getElementById("tripDestInput").value.trim();
  const vehicleIdx = document.getElementById("tripVehicleSelect").value;
  const vehicle = EV_VEHICLE_DATABASE[vehicleIdx] || EV_VEHICLE_DATABASE[0];
  const startBatteryPercent = parseInt(document.getElementById("tripBatteryStart").value) || 80;

  if (!origin || !dest) {
    alert("Please enter both origin and destination cities.");
    return;
  }

  // Preset route data simulation
  let distanceKm = 160;
  let drivingTime = "2h 45m";
  let stops = [];

  const routeKey = `${origin.toLowerCase()} to ${dest.toLowerCase()}`;
  if (routeKey.includes("mumbai") && routeKey.includes("pune")) {
    distanceKm = 148;
    drivingTime = "2h 50m";
    stops = [
      {
        name: "Tata Power Mega Hub - Khalapur Toll Plaza",
        location: "Mumbai-Pune Expressway (KM 42)",
        charger: "150 kW DC Fast",
        chargeTime: "18 mins",
        addedSoc: "+45% (to 85%)",
        amenities: "Food Court, Restroom, Starbucks"
      }
    ];
  } else if (routeKey.includes("delhi") && routeKey.includes("agra")) {
    distanceKm = 230;
    drivingTime = "3h 30m";
    stops = [
      {
        name: "Statiq Supercharge - Yamuna Expressway Mile 68",
        location: "Yamuna Expressway Rest Area",
        charger: "120 kW CCS-2",
        chargeTime: "25 mins",
        addedSoc: "+55% (to 85%)",
        amenities: "Restrooms, Cafe, 24/7 Canopy"
      }
    ];
  } else if (routeKey.includes("bengaluru") && routeKey.includes("mysuru")) {
    distanceKm = 145;
    drivingTime = "2h 15m";
    stops = [
      {
        name: "Zeon Charging - Mandya Express Stop",
        location: "Bengaluru-Mysuru Expy Rest Stop",
        charger: "120 kW DC",
        chargeTime: "15 mins",
        addedSoc: "+40% (to 90%)",
        amenities: "Dosa Corner, Restrooms, Fuel Station"
      }
    ];
  } else {
    // Generic calculation
    distanceKm = Math.floor(180 + Math.random() * 120);
    drivingTime = `${Math.floor(distanceKm / 60)}h ${distanceKm % 60}m`;
    stops = [
      {
        name: "VoltSpot Highway Super Hub",
        location: `Midpoint on route to ${dest}`,
        charger: "120 kW CCS-2 Fast Charger",
        chargeTime: "22 mins",
        addedSoc: "+50%",
        amenities: "Cafe, Restrooms, Wi-Fi"
      }
    ];
  }

  // Display results
  document.getElementById("tripResultDistance").textContent = `${distanceKm} km`;
  document.getElementById("tripResultTime").textContent = drivingTime;
  document.getElementById("tripResultStopsCount").textContent = `${stops.length} Stop`;

  const itineraryContainer = document.getElementById("tripItineraryList");
  itineraryContainer.innerHTML = stops.map((stop, idx) => `
    <div class="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
      <div class="flex items-center justify-between text-xs">
        <span class="px-2 py-0.5 rounded font-bold bg-brand-500/20 text-brand-300">Stop ${idx + 1}</span>
        <span class="text-cyan-400 font-semibold">${stop.charger}</span>
      </div>
      <h4 class="text-xs font-bold text-white">${stop.name}</h4>
      <p class="text-[11px] text-slate-400">${stop.location}</p>
      <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-300">
        <span>Charge: <strong>${stop.chargeTime}</strong> (${stop.addedSoc})</span>
        <span class="text-slate-400">${stop.amenities}</span>
      </div>
    </div>
  `).join("");

  document.getElementById("tripResultContainer").classList.remove("hidden");
}

// -------------------------------------------------------------
// EV Charge Time & Cost Calculator
// -------------------------------------------------------------
function initVehiclesDropdowns() {
  const optionsHtml = EV_VEHICLE_DATABASE.map((v, idx) => `
    <option value="${idx}">${v.name} (${v.batteryKwh} kWh, ${v.rangeKm}km Range)</option>
  `).join("");

  const calcSelect = document.getElementById("calcVehicleSelect");
  if (calcSelect) calcSelect.innerHTML = optionsHtml;

  const bookSelect = document.getElementById("bookingVehicleSelect");
  if (bookSelect) bookSelect.innerHTML = optionsHtml;

  const tripSelect = document.getElementById("tripVehicleSelect");
  if (tripSelect) tripSelect.innerHTML = optionsHtml;
}

function onCalcVehicleChange() {
  const idx = document.getElementById("calcVehicleSelect").value;
  const vehicle = EV_VEHICLE_DATABASE[idx];
  if (vehicle) {
    document.getElementById("calcBatteryKwh").value = vehicle.batteryKwh;
    runCalculator();
  }
}

function onCalcSliderChange() {
  const startVal = parseInt(document.getElementById("calcStartSlider").value);
  const targetVal = parseInt(document.getElementById("calcTargetSlider").value);

  // Enforce target > start
  if (startVal >= targetVal) {
    document.getElementById("calcTargetSlider").value = Math.min(100, startVal + 10);
  }

  document.getElementById("calcStartPercentText").textContent = `${document.getElementById("calcStartSlider").value}%`;
  document.getElementById("calcTargetPercentText").textContent = `${document.getElementById("calcTargetSlider").value}%`;

  runCalculator();
}

function runCalculator() {
  const batteryKwh = parseFloat(document.getElementById("calcBatteryKwh")?.value) || 40.5;
  const chargerKw = parseFloat(document.getElementById("calcChargerSpeed")?.value) || 50;
  const startPct = parseInt(document.getElementById("calcStartSlider")?.value) || 20;
  const targetPct = parseInt(document.getElementById("calcTargetSlider")?.value) || 80;
  const tariff = parseFloat(document.getElementById("calcRateInput")?.value) || 18.5;

  const deltaPct = Math.max(0, targetPct - startPct);
  const energyNeededKwh = (deltaPct / 100) * batteryKwh;

  // Realistic charging curve taper above 80%
  let effectiveKw = chargerKw;
  if (targetPct > 80) {
    effectiveKw = chargerKw * 0.75;
  }
  const hours = energyNeededKwh / effectiveKw;
  const minutes = Math.round(hours * 60);

  const rangeAddedKm = Math.round(energyNeededKwh * 6.5);
  const cost = (energyNeededKwh * tariff).toFixed(1);

  // Update UI outputs
  const timeOut = document.getElementById("calcOutputTime");
  const rangeOut = document.getElementById("calcOutputRange");
  const costOut = document.getElementById("calcOutputCost");

  if (timeOut) timeOut.textContent = minutes < 60 ? `${minutes} mins` : `${Math.floor(minutes/60)}h ${minutes%60}m`;
  if (rangeOut) rangeOut.textContent = `+${rangeAddedKm} km`;
  if (costOut) costOut.textContent = `₹/${cost}`;
}

// -------------------------------------------------------------
// Add / Host New Station
// -------------------------------------------------------------
function fillNewStationFromMapCenter() {
  const center = map.getCenter();
  document.getElementById("newStationLat").value = center.lat.toFixed(5);
  document.getElementById("newStationLng").value = center.lng.toFixed(5);
}

function handleAddNewStation(e) {
  e.preventDefault();

  const name = document.getElementById("newStationName").value.trim();
  const operator = document.getElementById("newStationOperator").value.trim();
  const city = document.getElementById("newStationCity").value.trim();
  const address = document.getElementById("newStationAddress").value.trim();
  const kw = parseFloat(document.getElementById("newStationKw").value) || 60;
  const price = parseFloat(document.getElementById("newStationPrice").value) || 18;

  let lat = parseFloat(document.getElementById("newStationLat").value);
  let lng = parseFloat(document.getElementById("newStationLng").value);

  if (isNaN(lat) || isNaN(lng)) {
    const center = map.getCenter();
    lat = center.lat;
    lng = center.lng;
  }

  const newStation = {
    id: "st-custom-" + Date.now(),
    name: name,
    operator: operator,
    address: address,
    city: city,
    lat: lat,
    lng: lng,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 5.0,
    reviewCount: 1,
    pricePerKwh: price,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: kw,
    speedCategory: kw >= 120 ? "ultrafast" : kw >= 30 ? "fast" : "standard",
    connectors: [
      { id: "P1", type: "CCS-2", power: `${kw} kW`, status: "available" },
      { id: "P2", type: "CCS-2", power: `${kw} kW`, status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "wifi"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    reviews: [
      { user: "Community Contributor", rating: 5, date: "Today", comment: "Verified new charging spot. Fully functional!" }
    ]
  };

  stations.unshift(newStation);
  saveStationsToLocalStorage();
  recomputeDistances();
  renderStationFeed();

  closeModal("addStationModal");
  document.getElementById("addStationForm").reset();

  // Fly to new station
  map.flyTo([lat, lng], 15, { duration: 1 });
  alert("🎉 Your EV station has been successfully added to the map!");
}

// -------------------------------------------------------------
// UI Utilities: Modals, Mobile Views & Theme Toggle
// -------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hidden");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  currentMapLayerIndex = isDark ? 0 : 1;
  applyMapTileLayer(currentMapLayerIndex);
}

let isMobileListView = false;
function toggleMobileView(forceMap = false) {
  const sidebar = document.getElementById("sidebarPanel");
  const icon = document.getElementById("mobileViewIcon");
  const text = document.getElementById("mobileViewText");

  if (forceMap || isMobileListView) {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("w-full");
    icon.className = "fa-solid fa-list";
    text.textContent = "List";
    isMobileListView = false;
    setTimeout(() => map.invalidateSize(), 200);
  } else {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("w-full");
    icon.className = "fa-solid fa-map";
    text.textContent = "Map";
    isMobileListView = true;
  }
}
