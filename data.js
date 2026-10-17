/**
 * VoltSpot - EV Charging Station Finder Data
 * Comprehensive realistic station data across key hubs with connectors, live states, tariffs, and amenities.
 */

const DEFAULT_STATIONS = [
  // ===================== MUMBAI HUB (Center: 19.0760, 72.8777) =====================
  {
    id: "st-mum-01",
    name: "Tata Power Mega EV Hub - BKC",
    operator: "Tata Power",
    address: "G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051",
    city: "Mumbai",
    lat: 19.0657,
    lng: 72.8686,
    status: "available",
    availablePorts: 4,
    totalPorts: 6,
    rating: 4.8,
    reviewCount: 142,
    pricePerKwh: 18.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 150,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "in-use" },
      { id: "P4", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P6", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["restroom", "cafe", "wifi", "parking_covered", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 22 6665 8282",
    reviews: [
      { user: "Aditya S.", rating: 5, date: "Yesterday", comment: "Super fast 150kW speed! Went from 18% to 80% on my Ioniq 5 in 21 mins. Starbucks right next door." },
      { user: "Priya Nair", rating: 4, date: "3 days ago", comment: "Clean and well maintained. Security guard helps with parking." }
    ]
  },
  {
    id: "st-mum-02",
    name: "Jio-bp pulse Station - Phoenix Palladium",
    operator: "Jio-bp pulse",
    address: "Lower Parel 462, Senapati Bapat Marg, Mumbai, Maharashtra 400013",
    city: "Mumbai",
    lat: 18.9953,
    lng: 72.8242,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.6,
    reviewCount: 98,
    pricePerKwh: 19.0,
    currency: "₹",
    isFree: false,
    accessHours: "10:00 AM - 11:30 PM",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "CHAdeMO", power: "50 kW", status: "in-use" }
    ],
    amenities: ["mall", "cafe", "restroom", "wifi", "parking_covered", "cctv"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+91 22 4333 9999",
    reviews: [
      { user: "Sameer K.", rating: 5, date: "5 days ago", comment: "Mall parking charges apply, but charger is very reliable. Grabbed lunch while charging." }
    ]
  },
  {
    id: "st-mum-03",
    name: "Statiq EV Station - Andheri Metro Hub",
    operator: "Statiq",
    address: "Andheri Ghatkopar Link Rd, Chakala, Andheri East, Mumbai 400093",
    city: "Mumbai",
    lat: 19.1136,
    lng: 72.8697,
    status: "busy",
    availablePorts: 1,
    totalPorts: 4,
    rating: 4.3,
    reviewCount: 74,
    pricePerKwh: 17.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "in-use" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "in-use" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "GB/T", power: "30 kW", status: "in-use" }
    ],
    amenities: ["restroom", "cctv", "open_24_7", "air_tyre"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+91 9999 008822",
    reviews: [
      { user: "Rajesh M.", rating: 4, date: "1 week ago", comment: "Can get busy during evening rush hour. Recommended to book slot ahead." }
    ]
  },
  {
    id: "st-mum-04",
    name: "Zeon Charging - Navi Mumbai Express Hub",
    operator: "Zeon",
    address: "Sion-Panvel Expy, Near Vashi Toll Plaza, Navi Mumbai 400703",
    city: "Mumbai",
    lat: 19.0664,
    lng: 72.9982,
    status: "available",
    availablePorts: 5,
    totalPorts: 6,
    rating: 4.9,
    reviewCount: 215,
    pricePerKwh: 21.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 180,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "180 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "180 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P4", type: "CCS-2", power: "120 kW", status: "in-use" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P6", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["cafe", "restroom", "wifi", "parking_covered", "cctv", "open_24_7", "air_tyre"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 8000 123456",
    reviews: [
      { user: "Vikram R.", rating: 5, date: "Yesterday", comment: "Best highway charging station! Blazing 180kW speed and food court right beside it." }
    ]
  },
  {
    id: "st-mum-05",
    name: "Tata Power - Viviana Mall Hub Thane",
    operator: "Tata Power",
    address: "Eastern Express Hwy, Laxmi Nagar, Thane West, Maharashtra 400606",
    city: "Mumbai",
    lat: 19.2084,
    lng: 72.9715,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.7,
    reviewCount: 110,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "10:00 AM - 11:00 PM",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["mall", "cafe", "restroom", "parking_covered", "wifi", "cctv"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    phone: "+91 22 6170 1000",
    reviews: [
      { user: "Ritesh P.", rating: 5, date: "3 days ago", comment: "Conveniently located at basement 2 of Viviana Mall Thane. Within 20km from city center." }
    ]
  },
  {
    id: "st-mum-06",
    name: "Statiq - Borivali Link Road Charging Station",
    operator: "Statiq",
    address: "New Link Rd, Borivali West, Mumbai, Maharashtra 400092",
    city: "Mumbai",
    lat: 19.2307,
    lng: 72.8567,
    status: "available",
    availablePorts: 2,
    totalPorts: 4,
    rating: 4.5,
    reviewCount: 88,
    pricePerKwh: 17.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 50,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "50 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "50 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["open_24_7", "restroom", "air_tyre", "cctv"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+91 9999 443322",
    reviews: [
      { user: "Kavita G.", rating: 4, date: "5 days ago", comment: "Great suburban spot for north Mumbai EV owners. ~18km from central hub." }
    ]
  },
  {
    id: "st-mum-07",
    name: "Jio-bp pulse - Kharghar Central Park Hub",
    operator: "Jio-bp pulse",
    address: "Sector 23, Kharghar, Navi Mumbai, Maharashtra 410210",
    city: "Mumbai",
    lat: 19.0435,
    lng: 73.0673,
    status: "available",
    availablePorts: 4,
    totalPorts: 4,
    rating: 4.8,
    reviewCount: 62,
    pricePerKwh: 19.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "parking_covered", "cctv"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 22 4988 1234",
    reviews: [
      { user: "Nitin B.", rating: 5, date: "1 week ago", comment: "Located at Kharghar ~26km from center, perfect high-speed top-up." }
    ]
  },
  // Station beyond 30 km (Will be cleanly excluded when max 30 km filter is active!)
  {
    id: "st-mum-08-far",
    name: "Tata Power - Panvel Old Highway Outpost",
    operator: "Tata Power",
    address: "Old Mumbai-Pune Hwy, Panvel, Navi Mumbai 410206",
    city: "Mumbai",
    lat: 18.9894,
    lng: 73.1175,
    status: "available",
    availablePorts: 2,
    totalPorts: 2,
    rating: 4.1,
    reviewCount: 40,
    pricePerKwh: 18.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 50,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "50 kW", status: "available" },
      { id: "P2", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "restroom", "air_tyre"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+91 22 6665 0000",
    reviews: [
      { user: "Suresh", rating: 4, date: "2 weeks ago", comment: "Located ~34km from center, excluded when 30km filter is ON." }
    ]
  },

  // ===================== DELHI NCR HUB (Center: 28.6139, 77.2090) =====================
  {
    id: "st-del-01",
    name: "Tata Power Supercharge - Connaught Place",
    operator: "Tata Power",
    address: "Block A, Inner Circle, Connaught Place, New Delhi 110001",
    city: "Delhi",
    lat: 28.6328,
    lng: 77.2197,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.7,
    reviewCount: 180,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["cafe", "restroom", "wifi", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    phone: "+91 11 6717 8000",
    reviews: [
      { user: "Karan G.", rating: 5, date: "4 days ago", comment: "Very central location in CP. Plugged in and went for breakfast." }
    ]
  },
  {
    id: "st-del-02",
    name: "Statiq Ultra Charging Park - Cyber City",
    operator: "Statiq",
    address: "DLF Cyber City, Sector 24, Gurugram, Haryana 122002",
    city: "Delhi",
    lat: 28.4952,
    lng: 77.0891,
    status: "available",
    availablePorts: 6,
    totalPorts: 8,
    rating: 4.9,
    reviewCount: 310,
    pricePerKwh: 19.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 240,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "240 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "240 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P4", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P6", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P7", type: "CHAdeMO", power: "50 kW", status: "available" },
      { id: "P8", type: "GB/T", power: "30 kW", status: "available" }
    ],
    amenities: ["cafe", "restroom", "mall", "wifi", "parking_covered", "cctv", "open_24_7", "air_tyre"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 9999 112233",
    reviews: [
      { user: "Devansh T.", rating: 5, date: "3 days ago", comment: "240kW is monstrous! Nexon EV maxed out at its charging peak effortlessly." }
    ]
  },
  {
    id: "st-del-03",
    name: "Jio-bp pulse - Aerocity Delhi Airport",
    operator: "Jio-bp pulse",
    address: "Hospitality District, Aerocity, IGI Airport, New Delhi 110037",
    city: "Delhi",
    lat: 28.5518,
    lng: 77.1215,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.8,
    reviewCount: 165,
    pricePerKwh: 20.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 150,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "wifi", "cctv", "open_24_7", "parking_covered"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+91 11 4988 5000",
    reviews: [
      { user: "Simran Kaur", rating: 5, date: "2 weeks ago", comment: "Great spot before airport drop offs. Fast and smooth app initiation." }
    ]
  },
  {
    id: "st-del-04",
    name: "Statiq - Noida Sector 62 Electronic City Hub",
    operator: "Statiq",
    address: "Sector 62, Noida, Uttar Pradesh 201309",
    city: "Delhi",
    lat: 28.6258,
    lng: 77.3752,
    status: "available",
    availablePorts: 4,
    totalPorts: 6,
    rating: 4.6,
    reviewCount: 122,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "wifi"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+91 9999 554433",
    reviews: [
      { user: "Manish S.", rating: 5, date: "4 days ago", comment: "Located in Noida IT zone, ~16km from central Delhi." }
    ]
  },
  {
    id: "st-del-05",
    name: "Tata Power - Faridabad Crown Plaza Hub",
    operator: "Tata Power",
    address: "Mathura Rd, Sector 15A, Faridabad, Haryana 121007",
    city: "Delhi",
    lat: 28.4089,
    lng: 77.3178,
    status: "available",
    availablePorts: 2,
    totalPorts: 4,
    rating: 4.4,
    reviewCount: 79,
    pricePerKwh: 18.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["mall", "cafe", "restroom", "open_24_7", "parking_covered"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    phone: "+91 129 400 1234",
    reviews: [
      { user: "Aakash T.", rating: 4, date: "1 week ago", comment: "~24km from Delhi center. Good mall charging spot." }
    ]
  },

  // ===================== BENGALURU HUB (Center: 12.9716, 77.5946) =====================
  {
    id: "st-blr-01",
    name: "Shell Recharge - Koramangala Hub",
    operator: "Shell Recharge",
    address: "80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    status: "available",
    availablePorts: 4,
    totalPorts: 5,
    rating: 4.9,
    reviewCount: 220,
    pricePerKwh: 19.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "wifi", "cctv", "open_24_7", "air_tyre"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 80 4112 0000",
    reviews: [
      { user: "Arjun Reddy", rating: 5, date: "Yesterday", comment: "Shell Select store has hot coffee while you wait. Very fast and clean (~5.5km from MG Road)." }
    ]
  },
  {
    id: "st-blr-02",
    name: "Zeon Charging - Whitefield Tech Oasis",
    operator: "Zeon",
    address: "ITPL Main Rd, Whitefield, Bengaluru, Karnataka 560066",
    city: "Bengaluru",
    lat: 12.9863,
    lng: 77.7342,
    status: "available",
    availablePorts: 2,
    totalPorts: 4,
    rating: 4.7,
    reviewCount: 135,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P4", type: "Type 2", power: "11 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "cctv", "parking_covered", "open_24_7"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+91 80 2841 2345",
    reviews: [
      { user: "Naveen P.", rating: 4, date: "4 days ago", comment: "Good station for IT crowd in Whitefield (~18km)." }
    ]
  },
  {
    id: "st-blr-03",
    name: "Tata Power - Indiranagar 100ft Rd",
    operator: "Tata Power",
    address: "100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru 560038",
    city: "Bengaluru",
    lat: 12.9719,
    lng: 77.6412,
    status: "available",
    availablePorts: 2,
    totalPorts: 3,
    rating: 4.5,
    reviewCount: 89,
    pricePerKwh: 18.5,
    currency: "₹",
    isFree: false,
    accessHours: "07:00 AM - 11:00 PM",
    powerKW: 50,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "50 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "50 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "cctv"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+91 80 6665 0000",
    reviews: [
      { user: "Shreya B.", rating: 5, date: "3 weeks ago", comment: "Located near popular cafes. Very convenient (~4.8km)." }
    ]
  },
  {
    id: "st-blr-04",
    name: "Jio-bp pulse - Electronic City Phase 1",
    operator: "Jio-bp pulse",
    address: "Hosur Rd, Phase 1, Electronic City, Bengaluru 560100",
    city: "Bengaluru",
    lat: 12.8452,
    lng: 77.6602,
    status: "available",
    availablePorts: 4,
    totalPorts: 4,
    rating: 4.8,
    reviewCount: 140,
    pricePerKwh: 19.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "wifi", "parking_covered"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 80 4988 2211",
    reviews: [
      { user: "Girish K.", rating: 5, date: "5 days ago", comment: "Near toll plaza, ~16km from city center. Fast 120kW." }
    ]
  },
  {
    id: "st-blr-05",
    name: "Tata Power - Yelahanka New Town Station",
    operator: "Tata Power",
    address: "Major Sandeep Unnikrishnan Rd, Yelahanka, Bengaluru 560064",
    city: "Bengaluru",
    lat: 13.1007,
    lng: 77.5963,
    status: "available",
    availablePorts: 2,
    totalPorts: 3,
    rating: 4.6,
    reviewCount: 71,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["open_24_7", "restroom", "air_tyre"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    phone: "+91 80 6665 1122",
    reviews: [
      { user: "Chandrashekhar", rating: 4, date: "1 week ago", comment: "North Bengaluru hub on route to airport, ~15km from center." }
    ]
  },

  // ===================== PUNE HUB (Center: 18.5204, 73.8567) =====================
  {
    id: "st-pun-01",
    name: "Tata Power Mega Hub - Hinjawadi Phase 1",
    operator: "Tata Power",
    address: "Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune, Maharashtra 411057",
    city: "Pune",
    lat: 18.5913,
    lng: 73.7389,
    status: "available",
    availablePorts: 4,
    totalPorts: 5,
    rating: 4.8,
    reviewCount: 160,
    pricePerKwh: 17.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "wifi", "parking_covered", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 20 6665 4321",
    reviews: [
      { user: "Omkar J.", rating: 5, date: "Yesterday", comment: "Great speed, ample parking space in the tech park (~16km from Pune center)." }
    ]
  },
  {
    id: "st-pun-02",
    name: "Zeon Charging - Baner Express Hub",
    operator: "Zeon",
    address: "Baner - Pashan Link Rd, Baner, Pune, Maharashtra 411045",
    city: "Pune",
    lat: 18.5596,
    lng: 73.7799,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.9,
    reviewCount: 112,
    pricePerKwh: 19.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 150,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["restroom", "cafe", "cctv", "wifi", "open_24_7"],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    phone: "+91 20 2729 0011",
    reviews: [
      { user: "Tanmay D.", rating: 5, date: "4 days ago", comment: "Super convenient location right off the bypass highway (~9km)." }
    ]
  },
  {
    id: "st-pun-03",
    name: "Statiq - Viman Nagar Airport Junction",
    operator: "Statiq",
    address: "Symbiosis Rd, Viman Nagar, Pune, Maharashtra 411014",
    city: "Pune",
    lat: 18.5679,
    lng: 73.9143,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.7,
    reviewCount: 85,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "open_24_7", "wifi"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+91 20 4040 3344",
    reviews: [
      { user: "Harish M.", rating: 5, date: "6 days ago", comment: "Near airport, ~8km from Pune station. Fast charge." }
    ]
  },

  // ===================== HYDERABAD HUB (Center: 17.3850, 78.4867) =====================
  {
    id: "st-hyd-01",
    name: "Statiq Supercharge - HITEC City",
    operator: "Statiq",
    address: "Madhapur, HITEC City, Hyderabad, Telangana 500081",
    city: "Hyderabad",
    lat: 17.4474,
    lng: 78.3762,
    status: "available",
    availablePorts: 4,
    totalPorts: 6,
    rating: 4.8,
    reviewCount: 145,
    pricePerKwh: 18.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 120,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "120 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P5", type: "Type 2", power: "22 kW", status: "in-use" },
      { id: "P6", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "wifi", "parking_covered", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 40 4040 1234",
    reviews: [
      { user: "Praneeth C.", rating: 5, date: "2 days ago", comment: "Very quick and stable 120kW charge (~14km from center)." }
    ]
  },
  {
    id: "st-hyd-02",
    name: "Tata Power - Gachibowli Financial District",
    operator: "Tata Power",
    address: "Nanakramguda, Gachibowli, Hyderabad, Telangana 500032",
    city: "Hyderabad",
    lat: 17.4208,
    lng: 78.3392,
    status: "available",
    availablePorts: 3,
    totalPorts: 4,
    rating: 4.7,
    reviewCount: 92,
    pricePerKwh: 18.5,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 60,
    speedCategory: "fast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P3", type: "Type 2", power: "22 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "parking_covered"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+91 40 6665 9988",
    reviews: [
      { user: "Sanjay R.", rating: 5, date: "4 days ago", comment: "Heart of Financial District, ~17km." }
    ]
  },
  {
    id: "st-hyd-03",
    name: "Zeon Charging - Shamshabad Airport Hub",
    operator: "Zeon",
    address: "RGIA Airport Approach Rd, Shamshabad, Hyderabad 500409",
    city: "Hyderabad",
    lat: 17.2403,
    lng: 78.4294,
    status: "available",
    availablePorts: 4,
    totalPorts: 4,
    rating: 4.9,
    reviewCount: 160,
    pricePerKwh: 20.0,
    currency: "₹",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 150,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "60 kW", status: "available" },
      { id: "P4", type: "Type 2", power: "22 kW", status: "available" }
    ],
    amenities: ["open_24_7", "cafe", "restroom", "wifi", "air_tyre"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+91 40 2400 8899",
    reviews: [
      { user: "Venkatesh", rating: 5, date: "3 days ago", comment: "Conveniently located ~22km south before RGIA terminal." }
    ]
  },

  // ===================== INTERNATIONAL HUBS =====================
  {
    id: "st-sf-01",
    name: "Electrify America - San Francisco Financial Plaza",
    operator: "Electrify America",
    address: "555 California St, San Francisco, CA 94104",
    city: "San Francisco",
    lat: 37.7925,
    lng: -122.4042,
    status: "available",
    availablePorts: 6,
    totalPorts: 8,
    rating: 4.8,
    reviewCount: 380,
    pricePerKwh: 0.42,
    currency: "$",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 350,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "350 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "350 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P4", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P5", type: "Tesla / NACS", power: "350 kW", status: "available" },
      { id: "P6", type: "Tesla / NACS", power: "350 kW", status: "available" },
      { id: "P7", type: "CHAdeMO", power: "50 kW", status: "in-use" },
      { id: "P8", type: "Type 2", power: "19 kW", status: "in-use" }
    ],
    amenities: ["restroom", "cafe", "wifi", "parking_covered", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1558441719-8b489c63f736?auto=format&fit=crop&w=800&q=80",
    phone: "+1 833 632 2778",
    reviews: [
      { user: "Elena Brooks", rating: 5, date: "3 days ago", comment: "Plug & Charge worked like magic on my Porsche Taycan at 270kW peak!" }
    ]
  },
  {
    id: "st-ny-01",
    name: "Tesla Supercharger & Urban Hub - Manhattan Midtown",
    operator: "Tesla Supercharger",
    address: "450 W 33rd St, Manhattan, New York, NY 10001",
    city: "New York",
    lat: 40.7533,
    lng: -74.0006,
    status: "available",
    availablePorts: 8,
    totalPorts: 12,
    rating: 4.9,
    reviewCount: 520,
    pricePerKwh: 0.38,
    currency: "$",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 250,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "Tesla / NACS", power: "250 kW", status: "available" },
      { id: "P2", type: "Tesla / NACS", power: "250 kW", status: "available" },
      { id: "P3", type: "Tesla / NACS", power: "250 kW", status: "available" },
      { id: "P4", type: "Tesla / NACS", power: "250 kW", status: "available" },
      { id: "P5", type: "CCS-2", power: "250 kW", status: "available" },
      { id: "P6", type: "CCS-2", power: "250 kW", status: "available" },
      { id: "P7", type: "CCS-2", power: "150 kW", status: "in-use" },
      { id: "P8", type: "CCS-2", power: "150 kW", status: "in-use" }
    ],
    amenities: ["mall", "cafe", "restroom", "wifi", "parking_covered", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    phone: "+1 888 518 3752",
    reviews: [
      { user: "Marcus Vance", rating: 5, date: "Yesterday", comment: "Magic Dock handles non-Tesla EVs smoothly. Best charger in Midtown." }
    ]
  },
  {
    id: "st-lon-01",
    name: "BP pulse Hypercharge - Central London",
    operator: "BP pulse",
    address: "240 Marylebone Rd, London NW1 6JQ, United Kingdom",
    city: "London",
    lat: 51.5202,
    lng: -0.1636,
    status: "available",
    availablePorts: 4,
    totalPorts: 6,
    rating: 4.7,
    reviewCount: 290,
    pricePerKwh: 0.69,
    currency: "£",
    isFree: false,
    accessHours: "24/7 Open",
    powerKW: 150,
    speedCategory: "ultrafast",
    connectors: [
      { id: "P1", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P2", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P3", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P4", type: "CCS-2", power: "150 kW", status: "available" },
      { id: "P5", type: "CHAdeMO", power: "50 kW", status: "in-use" },
      { id: "P6", type: "Type 2", power: "22 kW", status: "in-use" }
    ],
    amenities: ["cafe", "restroom", "wifi", "cctv", "open_24_7"],
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
    phone: "+44 800 464 3444",
    reviews: [
      { user: "Oliver Davies", rating: 4, date: "1 week ago", comment: "Fast contactless payment via card reader, no mandatory app sign up." }
    ]
  }
];

// Supported EV models for range & charge calculators
const EV_VEHICLE_DATABASE = [
  { name: "Tata Nexon EV (Long Range)", batteryKwh: 40.5, maxChargeKw: 50, efficiencyKmPerKwh: 7.0, rangeKm: 280, socket: "CCS-2" },
  { name: "Tata Punch EV (LR)", batteryKwh: 35.0, maxChargeKw: 45, efficiencyKmPerKwh: 7.2, rangeKm: 250, socket: "CCS-2" },
  { name: "Mahindra XUV400 EV", batteryKwh: 39.4, maxChargeKw: 50, efficiencyKmPerKwh: 6.8, rangeKm: 260, socket: "CCS-2" },
  { name: "MG ZS EV", batteryKwh: 50.3, maxChargeKw: 75, efficiencyKmPerKwh: 6.5, rangeKm: 325, socket: "CCS-2" },
  { name: "Hyundai Ioniq 5", batteryKwh: 72.6, maxChargeKw: 240, efficiencyKmPerKwh: 6.2, rangeKm: 450, socket: "CCS-2" },
  { name: "Kia EV6", batteryKwh: 77.4, maxChargeKw: 240, efficiencyKmPerKwh: 6.1, rangeKm: 470, socket: "CCS-2" },
  { name: "BYD Atto 3", batteryKwh: 60.48, maxChargeKw: 80, efficiencyKmPerKwh: 6.6, rangeKm: 400, socket: "CCS-2" },
  { name: "Tesla Model 3 / Model Y", batteryKwh: 75.0, maxChargeKw: 250, efficiencyKmPerKwh: 6.8, rangeKm: 510, socket: "Tesla / NACS" },
  { name: "Porsche Taycan", batteryKwh: 93.4, maxChargeKw: 270, efficiencyKmPerKwh: 4.8, rangeKm: 440, socket: "CCS-2" },
  { name: "BMW iX / i4", batteryKwh: 76.6, maxChargeKw: 200, efficiencyKmPerKwh: 5.5, rangeKm: 420, socket: "CCS-2" }
];

// Predefined City Quick Jump coordinates
const CITY_COORDINATES = {
  "Mumbai": { lat: 19.0760, lng: 72.8777, zoom: 11 },
  "Delhi": { lat: 28.6139, lng: 77.2090, zoom: 11 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946, zoom: 11 },
  "Pune": { lat: 18.5204, lng: 73.8567, zoom: 11 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867, zoom: 11 },
  "San Francisco": { lat: 37.7749, lng: -122.4194, zoom: 12 },
  "New York": { lat: 40.7128, lng: -74.0060, zoom: 12 },
  "London": { lat: 51.5074, lng: -0.1278, zoom: 12 }
};
