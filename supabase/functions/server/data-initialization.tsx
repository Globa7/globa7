/**
 * Globa7 Luxury Transportation - Data Initialization
 * 
 * Seeds the database with initial data for testing and demonstration
 */

import * as kv from "./kv_store.tsx";
import type {
  Vehicle,
  Driver,
  ServiceBundle,
  PricingRules,
  Location,
  BusinessMetrics,
} from "./data-schema.tsx";

export async function initializeDatabase() {
  console.log("Starting database initialization...");
  
  try {
    // Check if already initialized
    const initialized = await kv.get("system:initialized");
    if (initialized === "true") {
      console.log("Database already initialized. Skipping...");
      return { success: true, message: "Database already initialized" };
    }
    
    // Initialize all data
    await initializePricing();
    await initializeVehicles();
    await initializeDrivers();
    await initializeBundles();
    await initializeLocations();
    await initializeMetrics();
    
    // Mark as initialized
    await kv.set("system:initialized", "true");
    
    console.log("Database initialization complete!");
    return { success: true, message: "Database initialized successfully" };
  } catch (error) {
    console.error("Error initializing database:", error);
    return { success: false, error: String(error) };
  }
}

export async function resetDatabase() {
  console.log("Resetting database...");
  
  try {
    // Delete all data by prefix
    const prefixes = [
      "vehicle:",
      "driver:",
      "bundle:",
      "location:",
      "booking:",
      "review:",
      "corporate:",
      "pricing:",
      "analytics:",
      "global:bookings:",
    ];
    
    for (const prefix of prefixes) {
      const keys = await kv.getByPrefix(prefix);
      for (const key of keys) {
        await kv.del(key.key);
      }
    }
    
    // Reset initialization flag
    await kv.del("system:initialized");
    
    console.log("Database reset complete!");
    return { success: true, message: "Database reset successfully" };
  } catch (error) {
    console.error("Error resetting database:", error);
    return { success: false, error: String(error) };
  }
}

// ============================================
// PRICING INITIALIZATION
// ============================================
async function initializePricing() {
  console.log("Initializing pricing rules...");
  
  const pricing: PricingRules = {
    id: "pricing:global",
    baseRates: {
      sedan: 75,
      suv: 95,
      luxury: 150,
      sprinter: 200,
      executive: 175,
    },
    hourlyRates: {
      sedan: 60,
      suv: 75,
      luxury: 120,
      sprinter: 150,
      executive: 140,
    },
    zones: {
      airport: 1.0,
      downtown: 1.1,
      uptown: 1.15,
      frenchQuarter: 1.2,
      westBank: 1.2,
      metairie: 1.05,
      suburbs: 1.1,
    },
    timeMultipliers: {
      peakHours: 1.25,
      lateNight: 1.35,
      weekends: 1.15,
      holidays: 1.5,
    },
    perMileRate: 2.5,
    minimumFare: 50,
    airportFee: 5,
    tollPass: 3,
    waitTimePerMinute: 0.75,
    cancelFeePercentage: 25,
    taxRate: 9.45, // New Orleans tax rate
    suggestedGratuity: [15, 18, 20, 25],
    seasonalRates: [
      {
        name: "Mardi Gras Season",
        startDate: "2024-01-15",
        endDate: "2024-03-15",
        multiplier: 1.8,
        applicableServices: ["all"],
      },
      {
        name: "Jazz Fest",
        startDate: "2024-04-25",
        endDate: "2024-05-05",
        multiplier: 1.5,
        applicableServices: ["all"],
      },
    ],
    updatedAt: new Date().toISOString(),
    updatedBy: "system",
  };
  
  await kv.set("pricing:global", JSON.stringify(pricing));
}

// ============================================
// VEHICLE INITIALIZATION
// ============================================
async function initializeVehicles() {
  console.log("Initializing vehicles...");
  
  const vehicles: Vehicle[] = [
    {
      id: "vehicle:1",
      make: "Mercedes-Benz",
      model: "S-Class",
      year: 2024,
      type: "luxury",
      color: "Black",
      licensePlate: "GLB7-001",
      vin: "WDDUX8GB1PA123456",
      capacity: 4,
      luggageCapacity: 3,
      amenities: ["WiFi", "Leather Seats", "Climate Control", "Bottled Water", "Phone Charger", "Privacy Partition"],
      isLuxury: true,
      mileage: 5000,
      lastServiceDate: "2024-01-15",
      nextServiceDate: "2024-04-15",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 150,
      hourlyRate: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vehicle:2",
      make: "Cadillac",
      model: "Escalade",
      year: 2024,
      type: "suv",
      color: "Black",
      licensePlate: "GLB7-002",
      vin: "1GYS4HKJ6PR234567",
      capacity: 6,
      luggageCapacity: 6,
      amenities: ["WiFi", "Leather Seats", "Climate Control", "Bottled Water", "Phone Charger"],
      isLuxury: true,
      mileage: 8000,
      lastServiceDate: "2024-01-20",
      nextServiceDate: "2024-04-20",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 95,
      hourlyRate: 75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vehicle:3",
      make: "Lincoln",
      model: "Town Car",
      year: 2023,
      type: "sedan",
      color: "Black",
      licensePlate: "GLB7-003",
      vin: "1LNHM82W53Y345678",
      capacity: 4,
      luggageCapacity: 4,
      amenities: ["Leather Seats", "Climate Control", "Bottled Water"],
      isLuxury: false,
      mileage: 15000,
      lastServiceDate: "2024-01-10",
      nextServiceDate: "2024-04-10",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 75,
      hourlyRate: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vehicle:4",
      make: "Mercedes-Benz",
      model: "Sprinter",
      year: 2024,
      type: "sprinter",
      color: "White",
      licensePlate: "GLB7-004",
      vin: "WD3PE8DD5NP456789",
      capacity: 14,
      luggageCapacity: 12,
      amenities: ["WiFi", "Leather Seats", "Climate Control", "Bottled Water", "Phone Chargers", "Entertainment System"],
      isLuxury: true,
      mileage: 10000,
      lastServiceDate: "2024-01-25",
      nextServiceDate: "2024-04-25",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 200,
      hourlyRate: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vehicle:5",
      make: "BMW",
      model: "7 Series",
      year: 2024,
      type: "executive",
      color: "Midnight Blue",
      licensePlate: "GLB7-005",
      vin: "WBA7E2C50NCG567890",
      capacity: 4,
      luggageCapacity: 3,
      amenities: ["WiFi", "Massage Seats", "Climate Control", "Premium Sound", "Bottled Water", "Phone Charger"],
      isLuxury: true,
      mileage: 3000,
      lastServiceDate: "2024-02-01",
      nextServiceDate: "2024-05-01",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 175,
      hourlyRate: 140,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vehicle:6",
      make: "Chevrolet",
      model: "Suburban",
      year: 2023,
      type: "suv",
      color: "Black",
      licensePlate: "GLB7-006",
      vin: "1GNSKCKD5NR678901",
      capacity: 7,
      luggageCapacity: 8,
      amenities: ["WiFi", "Leather Seats", "Climate Control", "Bottled Water"],
      isLuxury: false,
      mileage: 20000,
      lastServiceDate: "2024-01-15",
      nextServiceDate: "2024-04-15",
      insuranceExpiry: "2025-02-01",
      inspectionExpiry: "2025-02-01",
      status: "available",
      baseRate: 95,
      hourlyRate: 75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  for (const vehicle of vehicles) {
    await kv.set(vehicle.id, JSON.stringify(vehicle));
  }
}

// ============================================
// DRIVER INITIALIZATION
// ============================================
async function initializeDrivers() {
  console.log("Initializing drivers...");
  
  const drivers: Driver[] = [
    {
      id: "driver:1",
      firstName: "Michael",
      lastName: "Thompson",
      email: "mthompson@globa7.com",
      phone: "(504) 555-0101",
      licenseNumber: "LA-CDL-123456",
      licenseExpiry: "2026-12-31",
      cdlClass: "B",
      certifications: ["Defensive Driving", "First Aid", "CPR", "Luxury Service Training"],
      assignedVehicle: "vehicle:1",
      status: "active",
      rating: 4.9,
      totalTrips: 347,
      totalRevenue: 52150,
      yearsOfExperience: 8,
      schedule: [
        { dayOfWeek: 1, startTime: "06:00", endTime: "18:00", isAvailable: true },
        { dayOfWeek: 2, startTime: "06:00", endTime: "18:00", isAvailable: true },
        { dayOfWeek: 3, startTime: "06:00", endTime: "18:00", isAvailable: true },
        { dayOfWeek: 4, startTime: "06:00", endTime: "18:00", isAvailable: true },
        { dayOfWeek: 5, startTime: "06:00", endTime: "18:00", isAvailable: true },
      ],
      hireDate: "2018-03-15",
      dateOfBirth: "1985-06-20",
      backgroundCheckDate: "2024-01-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: "Professional chauffeur with 8 years of luxury transportation experience. Specializes in executive and wedding services.",
      languages: ["English", "French"],
    },
    {
      id: "driver:2",
      firstName: "Sarah",
      lastName: "Rodriguez",
      email: "srodriguez@globa7.com",
      phone: "(504) 555-0102",
      licenseNumber: "LA-CDL-234567",
      licenseExpiry: "2027-06-30",
      cdlClass: "B",
      certifications: ["Defensive Driving", "First Aid", "CPR"],
      assignedVehicle: "vehicle:2",
      status: "active",
      rating: 4.95,
      totalTrips: 412,
      totalRevenue: 61800,
      yearsOfExperience: 10,
      schedule: [
        { dayOfWeek: 0, startTime: "08:00", endTime: "20:00", isAvailable: true },
        { dayOfWeek: 5, startTime: "08:00", endTime: "20:00", isAvailable: true },
        { dayOfWeek: 6, startTime: "08:00", endTime: "20:00", isAvailable: true },
      ],
      hireDate: "2016-07-01",
      dateOfBirth: "1983-11-15",
      backgroundCheckDate: "2024-01-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: "Veteran driver specializing in group transportation and special events. Known for exceptional customer service.",
      languages: ["English", "Spanish"],
    },
    {
      id: "driver:3",
      firstName: "James",
      lastName: "Williams",
      email: "jwilliams@globa7.com",
      phone: "(504) 555-0103",
      licenseNumber: "LA-CDL-345678",
      licenseExpiry: "2026-09-30",
      certifications: ["Defensive Driving", "First Aid"],
      assignedVehicle: "vehicle:3",
      status: "active",
      rating: 4.85,
      totalTrips: 289,
      totalRevenue: 43350,
      yearsOfExperience: 6,
      schedule: [
        { dayOfWeek: 1, startTime: "14:00", endTime: "02:00", isAvailable: true },
        { dayOfWeek: 2, startTime: "14:00", endTime: "02:00", isAvailable: true },
        { dayOfWeek: 3, startTime: "14:00", endTime: "02:00", isAvailable: true },
        { dayOfWeek: 4, startTime: "14:00", endTime: "02:00", isAvailable: true },
        { dayOfWeek: 5, startTime: "14:00", endTime: "02:00", isAvailable: true },
        { dayOfWeek: 6, startTime: "14:00", endTime: "02:00", isAvailable: true },
      ],
      hireDate: "2019-04-10",
      dateOfBirth: "1990-02-28",
      backgroundCheckDate: "2024-01-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: "Evening and late-night specialist. Perfect for airport transfers and night-time entertainment trips.",
      languages: ["English"],
    },
    {
      id: "driver:4",
      firstName: "David",
      lastName: "Chen",
      email: "dchen@globa7.com",
      phone: "(504) 555-0104",
      licenseNumber: "LA-CDL-456789",
      licenseExpiry: "2027-03-31",
      cdlClass: "B",
      certifications: ["Defensive Driving", "First Aid", "CPR", "Passenger Assistance"],
      assignedVehicle: "vehicle:4",
      status: "active",
      rating: 4.92,
      totalTrips: 198,
      totalRevenue: 39600,
      yearsOfExperience: 5,
      schedule: [
        { dayOfWeek: 0, startTime: "10:00", endTime: "22:00", isAvailable: true },
        { dayOfWeek: 5, startTime: "10:00", endTime: "22:00", isAvailable: true },
        { dayOfWeek: 6, startTime: "10:00", endTime: "22:00", isAvailable: true },
      ],
      hireDate: "2020-09-01",
      dateOfBirth: "1988-08-12",
      backgroundCheckDate: "2024-01-01",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bio: "Group transportation expert. Specializes in weddings, corporate events, and city tours.",
      languages: ["English", "Mandarin"],
    },
  ];
  
  for (const driver of drivers) {
    await kv.set(driver.id, JSON.stringify(driver));
  }
}

// ============================================
// SERVICE BUNDLE INITIALIZATION
// ============================================
async function initializeBundles() {
  console.log("Initializing service bundles...");
  
  const bundles: ServiceBundle[] = [
    {
      id: "bundle:1",
      name: "Premium Wedding Package",
      description: "Complete luxury transportation for your special day. Includes bride & groom transport, guest shuttle service, and red carpet treatment.",
      type: "wedding",
      basePrice: 1200,
      discount: 15,
      validityPeriod: 365,
      includedServices: [
        "Luxury vehicle for bride & groom (6 hours)",
        "SUV for wedding party (4 hours)",
        "Sprinter for guest shuttle (4 hours)",
        "Red carpet & champagne service",
        "Decorated vehicles with ribbons",
        "Professional chauffeurs in formal attire",
      ],
      vehicleTypes: ["luxury", "suv", "sprinter"],
      hoursIncluded: 14,
      minBookingNotice: 336, // 14 days
      cancellationPolicy: "Full refund if cancelled 30 days before. 50% refund if cancelled 14 days before.",
      refundPolicy: "Refunds processed within 7-10 business days",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 95,
      totalSales: 24,
    },
    {
      id: "bundle:2",
      name: "Corporate Executive Package",
      description: "Monthly corporate transportation solution for executives and business travelers. Priority booking and dedicated account management.",
      type: "corporate",
      basePrice: 2500,
      discount: 20,
      validityPeriod: 30,
      includedServices: [
        "30 hours of luxury sedan service",
        "Priority booking",
        "Dedicated account manager",
        "Airport meet & greet",
        "Monthly billing",
        "24/7 concierge support",
      ],
      vehicleTypes: ["luxury", "executive", "sedan"],
      hoursIncluded: 30,
      minBookingNotice: 4,
      cancellationPolicy: "Cancel up to 2 hours before pickup",
      refundPolicy: "Unused hours roll over to next month",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 88,
      totalSales: 12,
    },
    {
      id: "bundle:3",
      name: "French Quarter Tour Experience",
      description: "Guided luxury tour of New Orleans' historic French Quarter, Garden District, and iconic landmarks. Includes expert commentary and photo stops.",
      type: "tour",
      basePrice: 350,
      discount: 10,
      includedServices: [
        "3-hour guided luxury tour",
        "French Quarter exploration",
        "Garden District mansions",
        "Photo stops at key landmarks",
        "Complimentary bottled water & snacks",
        "Expert local guide/driver",
      ],
      vehicleTypes: ["luxury", "suv"],
      hoursIncluded: 3,
      minBookingNotice: 24,
      cancellationPolicy: "Free cancellation up to 24 hours before tour",
      refundPolicy: "Full refund for cancellations 24+ hours in advance",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 92,
      totalSales: 156,
    },
    {
      id: "bundle:4",
      name: "Airport VIP Transfer",
      description: "Premium airport transfer service with flight tracking, meet & greet, and luggage assistance.",
      type: "event",
      basePrice: 120,
      discount: 5,
      includedServices: [
        "Luxury sedan airport transfer",
        "Flight tracking",
        "Meet & greet at arrivals",
        "Luggage assistance",
        "Complimentary bottled water",
        "30 minutes wait time included",
      ],
      vehicleTypes: ["sedan", "luxury", "suv"],
      minBookingNotice: 6,
      cancellationPolicy: "Free cancellation up to 6 hours before pickup",
      refundPolicy: "Full refund for timely cancellations",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 98,
      totalSales: 428,
    },
    {
      id: "bundle:5",
      name: "Mardi Gras Party Package",
      description: "Safe and stylish transportation for Mardi Gras celebrations. Includes multiple stops and extended hours.",
      type: "event",
      basePrice: 600,
      discount: 12,
      validityPeriod: 60,
      includedServices: [
        "6-hour SUV or Sprinter service",
        "Multiple parade route stops",
        "Cooler for beverages",
        "Decorative Mardi Gras interior",
        "Flexible pickup/dropoff",
        "Professional party-safe driver",
      ],
      vehicleTypes: ["suv", "sprinter"],
      hoursIncluded: 6,
      minBookingNotice: 168, // 7 days
      cancellationPolicy: "50% refund if cancelled 7+ days before. No refund within 7 days.",
      refundPolicy: "Partial refunds based on cancellation timing",
      isActive: true,
      seasonalDates: { start: "2024-01-15", end: "2024-03-15" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularityScore: 100,
      totalSales: 89,
    },
  ];
  
  for (const bundle of bundles) {
    await kv.set(bundle.id, JSON.stringify(bundle));
  }
}

// ============================================
// LOCATION INITIALIZATION
// ============================================
async function initializeLocations() {
  console.log("Initializing popular locations...");
  
  const locations: Location[] = [
    {
      id: "location:1",
      name: "Louis Armstrong New Orleans International Airport",
      type: "airport",
      address: "1 Terminal Drive",
      city: "Kenner",
      state: "LA",
      zipCode: "70062",
      coordinates: { lat: 29.9934, lng: -90.2580 },
      zone: "airport",
      popularityScore: 100,
      totalBookings: 1247,
      pickupInstructions: "Meet at baggage claim area. Driver will have name sign.",
      dropoffInstructions: "Drop off at departures level, curbside",
      parkingInfo: "Short-term parking available",
    },
    {
      id: "location:2",
      name: "The Roosevelt New Orleans",
      type: "hotel",
      address: "123 Baronne Street",
      city: "New Orleans",
      state: "LA",
      zipCode: "70112",
      coordinates: { lat: 29.9501, lng: -90.0701 },
      zone: "downtown",
      popularityScore: 95,
      totalBookings: 342,
      pickupInstructions: "Main entrance on Baronne Street",
      dropoffInstructions: "Main entrance, valet available",
    },
    {
      id: "location:3",
      name: "Jackson Square",
      type: "landmark",
      address: "701 Decatur Street",
      city: "New Orleans",
      state: "LA",
      zipCode: "70116",
      coordinates: { lat: 29.9574, lng: -90.0629 },
      zone: "frenchQuarter",
      popularityScore: 98,
      totalBookings: 567,
      pickupInstructions: "Meet at Decatur Street entrance",
      dropoffInstructions: "Drop off on Decatur Street",
    },
    {
      id: "location:4",
      name: "Mercedes-Benz Superdome",
      type: "venue",
      address: "1500 Sugar Bowl Drive",
      city: "New Orleans",
      state: "LA",
      zipCode: "70112",
      coordinates: { lat: 29.9511, lng: -90.0812 },
      zone: "downtown",
      popularityScore: 92,
      totalBookings: 289,
      pickupInstructions: "Main entrance gates. Specify which gate in booking.",
      dropoffInstructions: "Event traffic - allow extra time",
    },
    {
      id: "location:5",
      name: "New Orleans Convention Center",
      type: "venue",
      address: "900 Convention Center Blvd",
      city: "New Orleans",
      state: "LA",
      zipCode: "70130",
      coordinates: { lat: 29.9426, lng: -90.0629 },
      zone: "downtown",
      popularityScore: 88,
      totalBookings: 412,
      pickupInstructions: "Specify hall entrance in booking notes",
      dropoffInstructions: "Convention Center Boulevard entrance",
    },
  ];
  
  for (const location of locations) {
    await kv.set(location.id, JSON.stringify(location));
  }
}

// ============================================
// ANALYTICS INITIALIZATION
// ============================================
async function initializeMetrics() {
  console.log("Initializing business metrics...");
  
  const metrics: BusinessMetrics = {
    id: "analytics:metrics",
    totalRevenue: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0,
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    vipCustomers: 0,
    newCustomersThisMonth: 0,
    totalVehicles: 6,
    activeVehicles: 6,
    utilizationRate: 0,
    totalDrivers: 4,
    activeDrivers: 4,
    averageDriverRating: 4.9,
    onTimePercentage: 98.5,
    averageRating: 4.9,
    repeatCustomerRate: 65,
    topServices: [],
    topVehicles: [],
    topRoutes: [],
    lastUpdated: new Date().toISOString(),
  };
  
  await kv.set("analytics:metrics", JSON.stringify(metrics));
}
