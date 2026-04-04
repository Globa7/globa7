/**
 * Globa7 Luxury Transportation - Data Schema Definitions
 * 
 * This file defines all data structures for the business operations
 */

// ============================================
// CUSTOMER SCHEMA
// ============================================
export interface Customer {
  id: string; // user:{userId}:profile
  userId: string; // Supabase auth user ID
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  
  // Loyalty Program
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  loyaltyPoints: number;
  memberSince: string; // ISO date
  totalSpent: number;
  totalBookings: number;
  
  // Preferences
  preferredVehicle?: string;
  preferredDriver?: string;
  specialRequirements?: string[];
  
  // Saved Information
  savedAddresses: SavedAddress[];
  paymentMethods: PaymentMethod[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastBookingDate?: string;
  status: 'active' | 'inactive' | 'vip';
}

export interface SavedAddress {
  id: string;
  label: string; // "Home", "Office", "Hotel", etc.
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'corporate_account' | 'invoice';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingAddress?: string;
}

// ============================================
// VEHICLE SCHEMA
// ============================================
export interface Vehicle {
  id: string; // vehicle:{vehicleId}
  make: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'luxury' | 'sprinter' | 'executive';
  
  // Specifications
  color: string;
  licensePlate: string;
  vin: string;
  capacity: number; // passenger capacity
  luggageCapacity: number;
  
  // Features
  amenities: string[]; // ["WiFi", "Leather Seats", "Climate Control", "Bottled Water", "Phone Charger"]
  isLuxury: boolean;
  
  // Maintenance
  mileage: number;
  lastServiceDate: string;
  nextServiceDate: string;
  insuranceExpiry: string;
  inspectionExpiry: string;
  
  // Availability
  status: 'available' | 'in_service' | 'maintenance' | 'retired';
  currentLocation?: string;
  
  // Pricing
  baseRate: number;
  hourlyRate: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

// ============================================
// DRIVER SCHEMA
// ============================================
export interface Driver {
  id: string; // driver:{driverId}
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Credentials
  licenseNumber: string;
  licenseExpiry: string;
  cdlClass?: string;
  certifications: string[]; // ["Defensive Driving", "First Aid", "CPR"]
  
  // Assignment
  assignedVehicle?: string; // vehicle ID
  status: 'active' | 'inactive' | 'on_trip' | 'off_duty';
  
  // Performance
  rating: number; // 0-5
  totalTrips: number;
  totalRevenue: number;
  yearsOfExperience: number;
  
  // Availability
  schedule: DriverSchedule[];
  currentLocation?: string;
  
  // Background
  hireDate: string;
  dateOfBirth: string;
  backgroundCheckDate: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  profileImageUrl?: string;
  bio?: string;
  languages: string[];
}

export interface DriverSchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "08:00"
  endTime: string; // "18:00"
  isAvailable: boolean;
}

// ============================================
// BOOKING SCHEMA
// ============================================
export interface Booking {
  id: string; // booking:{timestamp}:{random}
  bookingNumber: string; // "GLB7-2024-001234"
  
  // Customer Information
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Service Details
  serviceType: 'airport_transfer' | 'hourly' | 'point_to_point' | 'wedding' | 'corporate' | 'tour' | 'event';
  vehicleType: 'sedan' | 'suv' | 'luxury' | 'sprinter' | 'executive';
  
  // Assignment
  assignedVehicleId?: string;
  assignedDriverId?: string;
  
  // Trip Details
  pickupAddress: string;
  pickupCity: string;
  pickupCoordinates?: { lat: number; lng: number };
  dropoffAddress: string;
  dropoffCity: string;
  dropoffCoordinates?: { lat: number; lng: number };
  
  // Timing
  pickupDate: string; // ISO date
  pickupTime: string; // "14:30"
  estimatedDuration: number; // minutes
  estimatedDistance: number; // miles
  actualPickupTime?: string;
  actualDropoffTime?: string;
  
  // Passengers
  passengerCount: number;
  luggageCount: number;
  
  // Special Requirements
  specialRequests?: string;
  flightNumber?: string; // for airport transfers
  occasionType?: string; // for weddings/events
  
  // Pricing
  basePrice: number;
  surcharges: Surcharge[];
  discounts: Discount[];
  taxAmount: number;
  gratuity: number;
  totalPrice: number;
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partial';
  paymentMethod?: string;
  transactionId?: string;
  
  // Status Tracking
  status: 'pending' | 'confirmed' | 'assigned' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  statusHistory: StatusChange[];
  
  // Bundle/Package
  bundleId?: string;
  isRecurring?: boolean;
  recurringSchedule?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  
  // Post-Service
  rating?: number;
  review?: string;
  reviewDate?: string;
}

export interface Surcharge {
  type: string; // "Late Night", "Peak Hours", "Holiday", "Tolls", "Parking"
  amount: number;
  description: string;
}

export interface Discount {
  type: string; // "Loyalty", "Promo Code", "Corporate", "Bundle"
  amount: number;
  code?: string;
  description: string;
}

export interface StatusChange {
  status: string;
  timestamp: string;
  updatedBy?: string;
  notes?: string;
}

// ============================================
// SERVICE BUNDLE SCHEMA
// ============================================
export interface ServiceBundle {
  id: string; // bundle:{bundleId}
  name: string;
  description: string;
  type: 'wedding' | 'corporate' | 'event' | 'tour' | 'subscription';
  
  // Pricing
  basePrice: number;
  discount: number; // percentage
  validityPeriod?: number; // days
  
  // Inclusions
  includedServices: string[];
  vehicleTypes: string[];
  hoursIncluded?: number;
  milesIncluded?: number;
  
  // Terms
  minBookingNotice: number; // hours
  cancellationPolicy: string;
  refundPolicy: string;
  
  // Availability
  isActive: boolean;
  seasonalDates?: { start: string; end: string };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  popularityScore: number;
  totalSales: number;
}

// ============================================
// PRICING RULES SCHEMA
// ============================================
export interface PricingRules {
  id: 'pricing:global';
  
  // Base Rates by Vehicle Type
  baseRates: {
    sedan: number;
    suv: number;
    luxury: number;
    sprinter: number;
    executive: number;
  };
  
  // Hourly Rates
  hourlyRates: {
    sedan: number;
    suv: number;
    luxury: number;
    sprinter: number;
    executive: number;
  };
  
  // Zone Multipliers
  zones: {
    [zoneName: string]: number; // "airport": 1.0, "downtown": 1.1, etc.
  };
  
  // Time-based Multipliers
  timeMultipliers: {
    peakHours: number; // 1.25 (7-9am, 4-7pm)
    lateNight: number; // 1.35 (10pm-5am)
    weekends: number; // 1.15
    holidays: number; // 1.5
  };
  
  // Distance Pricing
  perMileRate: number;
  minimumFare: number;
  
  // Additional Fees
  airportFee: number;
  tollPass: number;
  waitTimePerMinute: number;
  cancelFeePercentage: number;
  
  // Tax & Gratuity
  taxRate: number; // percentage
  suggestedGratuity: number[]; // [15, 18, 20, 25]
  
  // Seasonal Rates
  seasonalRates?: SeasonalRate[];
  
  updatedAt: string;
  updatedBy: string;
}

export interface SeasonalRate {
  name: string;
  startDate: string;
  endDate: string;
  multiplier: number;
  applicableServices: string[];
}

// ============================================
// LOCATION/ROUTE SCHEMA
// ============================================
export interface Location {
  id: string; // location:{locationId}
  name: string;
  type: 'airport' | 'hotel' | 'venue' | 'landmark' | 'corporate';
  
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  
  // Metadata
  zone?: string;
  popularityScore: number;
  totalBookings: number;
  
  // Special Instructions
  pickupInstructions?: string;
  dropoffInstructions?: string;
  parkingInfo?: string;
}

// ============================================
// REVIEW SCHEMA
// ============================================
export interface Review {
  id: string; // review:{reviewId}
  bookingId: string;
  customerId: string;
  customerName: string;
  
  // Ratings
  overallRating: number; // 1-5
  driverRating: number;
  vehicleRating: number;
  punctualityRating: number;
  serviceRating: number;
  
  // Feedback
  comment?: string;
  compliments?: string[];
  complaints?: string[];
  
  // Driver/Vehicle
  driverId?: string;
  vehicleId?: string;
  
  // Response
  adminResponse?: string;
  adminResponseDate?: string;
  
  // Metadata
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ANALYTICS SCHEMA
// ============================================
export interface BusinessMetrics {
  id: 'analytics:metrics';
  
  // Revenue
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  
  // Bookings
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  
  // Customers
  totalCustomers: number;
  activeCustomers: number;
  vipCustomers: number;
  newCustomersThisMonth: number;
  
  // Fleet
  totalVehicles: number;
  activeVehicles: number;
  utilizationRate: number; // percentage
  
  // Drivers
  totalDrivers: number;
  activeDrivers: number;
  averageDriverRating: number;
  
  // Performance
  onTimePercentage: number;
  averageRating: number;
  repeatCustomerRate: number;
  
  // Popular Services
  topServices: { service: string; count: number }[];
  topVehicles: { vehicle: string; count: number }[];
  topRoutes: { route: string; count: number }[];
  
  lastUpdated: string;
}

// ============================================
// CORPORATE ACCOUNT SCHEMA
// ============================================
export interface CorporateAccount {
  id: string; // corporate:{accountId}
  companyName: string;
  accountNumber: string;
  
  // Billing
  billingEmail: string;
  billingAddress: string;
  billingContact: string;
  billingPhone: string;
  paymentTerms: string; // "Net 30", "Net 60", etc.
  creditLimit: number;
  currentBalance: number;
  
  // Contract
  contractStartDate: string;
  contractEndDate: string;
  discountRate: number;
  
  // Authorized Users
  authorizedUsers: string[]; // customer IDs
  
  // Usage
  monthlySpend: number;
  totalBookings: number;
  
  // Status
  status: 'active' | 'suspended' | 'closed';
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AFFILIATE DRIVER SCHEMA
// ============================================
export interface AffiliateApplication {
  id: string; // affiliate_app:{applicationId}
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // License Information
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  cdlClass?: string;
  
  // Company Information (Optional)
  companyName?: string;
  companyEIN?: string;
  llcRegistration?: string;
  
  // Vehicle Information
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  vehicleLicensePlate: string;
  vehicleVIN: string;
  vehicleType: string;
  vehicleCapacity: number;
  
  // Payment Information
  paymentMethod: 'bank_account' | 'debit_card';
  bankName?: string;
  accountHolderName?: string;
  routingNumber?: string;
  accountNumber?: string;
  cardLast4?: string;
  
  // Tax Information (for 1099)
  taxIdType: 'ssn' | 'ein';
  taxIdNumber: string; // encrypted
  w9Completed: boolean;
  
  // Documents (Supabase Storage URLs)
  documents: {
    profilePhoto?: string;
    vehiclePhotos: string[]; // multiple photos
    registration: string;
    insurance: string;
    driverLicense: string;
    permits?: string[];
    bondDocuments?: string[];
    w9Form?: string;
  };
  
  // Background Check
  backgroundCheckConsent: boolean;
  backgroundCheckStatus?: 'pending' | 'cleared' | 'failed';
  backgroundCheckDate?: string;
  
  // Insurance Verification
  insuranceProvider: string;
  insurancePolicyNumber: string;
  insuranceExpiry: string;
  insuranceCoverageAmount: number;
  
  // Availability
  availableForWork: boolean;
  preferredZones: string[];
  maxHoursPerWeek: number;
  
  // Commission Structure
  commissionRate: number; // percentage
  
  // Invitation
  invitedBy?: string; // admin user ID
  inviteCode: string;
  
  // Review Notes
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface AffiliateDriver extends Driver {
  affiliateId: string;
  isAffiliate: true;
  commissionRate: number;
  totalEarnings: number;
  pendingPayout: number;
  lastPayoutDate?: string;
  joinedDate: string;
}