# Globa7 Luxury Transportation - Admin Dashboard Complete Specification

## 🎯 Project Overview

Build a world-class **Admin Dashboard** for Globa7, a premium New Orleans luxury transportation service. This is a full-featured admin control panel with sophisticated design, comprehensive service management, real-time analytics, and complete business operations oversight.

---

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#D4AF37` - Luxury accent color
- **Black**: `#000000` - Primary background
- **Charcoal**: `#1A1A1A` - Secondary background
- **Dark Gray**: `#2A2A2A` - Card backgrounds
- **Light Gray**: `#6A6A6A` - Secondary text

### Typography
- **Headings**: Cormorant Garamond (serif) - 600 weight
- **Body Text**: Montserrat (sans-serif) - 400/500/600 weights
- Import from Google Fonts

### Design Principles
- Dark luxury theme with gold accents
- Smooth animations using Framer Motion (motion package)
- Glassmorphism effects with backdrop blur
- Hover effects with scale transformations
- Gold shadows on interactive elements
- Responsive design (desktop, tablet, mobile)

---

## 🗺️ Routing Structure

```typescript
Route: /admin
Component: EnhancedAdminDashboard
Protected: Yes (Admin role only)
Redirect: If not admin → /portal
Redirect: If not authenticated → /auth
```

### Navigation Flow
```
Landing Page (/) 
  → Auth Page (/auth)
    → [Login with admin@globa7.com]
      → Admin Dashboard (/admin)
```

---

## 📊 Dashboard Tabs (Main Navigation)

The dashboard uses a **tabbed interface** with 8 main sections:

### 1. 📈 Overview Tab
### 2. 📅 Bookings Tab
### 3. 🚗 Fleet Management Tab
### 4. 👨‍✈️ Drivers Tab
### 5. 🎁 Service Bundles Tab
### 6. 💰 Pricing Management Tab
### 7. ⚙️ Services & Tours Tab
### 8. 🤝 Affiliate Management Tab

---

## 🔐 Authentication & Authorization

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'client' | 'driver';
}
```

### Default Admin Credentials
```
Email: admin@globa7.com
Password: admin123
```

### Auth Requirements
- Uses Supabase Auth
- Token-based authentication
- Session management with `getSession()`
- Auto-redirect if not admin
- Sign out functionality

### Auth Context
```typescript
const { user, signOut } = useAuth();

// Check admin role
if (user.role !== 'admin') {
  navigate('/portal');
  toast.error('Access denied', { description: 'Admin privileges required' });
}
```

---

## 📊 Tab 1: Overview Dashboard

### Top Analytics Cards (4 Grid)

**Card 1: Total Revenue**
- Icon: DollarSign (Lucide)
- Value: Display `analytics.totalRevenue` formatted as currency
- Trend: Show percentage increase
- Gradient border: Gold

**Card 2: Total Bookings**
- Icon: Calendar
- Value: `analytics.totalBookings`
- Breakdown: Pending, Confirmed, Completed
- Color indicators for each status

**Card 3: Active Drivers**
- Icon: Users
- Value: `analytics.activeDrivers` / Total drivers
- Average rating display
- Status badges (active/inactive)

**Card 4: Fleet Utilization**
- Icon: Car
- Value: `analytics.utilizationRate`%
- Active vehicles count
- Circular progress indicator

### Recent Bookings Table
- Last 10 bookings
- Columns: ID, Customer, Service, Date/Time, Status, Amount
- Status badges: Pending (yellow), Confirmed (blue), Completed (green), Cancelled (red)
- Quick actions: View details, Assign driver, Update status

### Revenue Chart
- Line chart using Recharts library
- X-axis: Last 30 days
- Y-axis: Daily revenue
- Tooltip on hover
- Gold gradient fill under line
- Responsive design

---

## 📅 Tab 2: Bookings Management

### Features
- **Real-time booking list** with search and filters
- **Status management** (Pending → Confirmed → En Route → Arrived → In Progress → Completed)
- **Driver assignment** dropdown
- **Date range filtering**
- **Export to CSV** functionality

### Booking Card Design
```
┌─────────────────────────────────────────────┐
│ 🚗 [Service Type]        [Status Badge]     │
│                                              │
│ Customer: John Doe                           │
│ Pickup: 123 Royal St, French Quarter        │
│ Dropoff: Louis Armstrong Airport            │
│ Date: Feb 15, 2024 at 3:00 PM              │
│ Vehicle: Luxury Sedan                        │
│ Price: $125.00                               │
│                                              │
│ Driver: [Assign Driver Dropdown ▼]          │
│                                              │
│ [Update Status ▼] [View Details] [Contact]  │
└─────────────────────────────────────────────┘
```

### Status Flow Buttons
- Pending → Confirmed (blue button)
- Confirmed → En Route (purple button)
- En Route → Arrived (orange button)
- Arrived → In Progress (green button)
- In Progress → Completed (gold button)
- Any → Cancel (red button)

### Filters
- Status: All, Pending, Confirmed, In Progress, Completed, Cancelled
- Date Range: Today, This Week, This Month, Custom Range
- Service Type: All, Airport, Wedding, Corporate, Tour, Event
- Vehicle Type: All, Sedan, SUV, Luxury, Sprinter

---

## 🚗 Tab 3: Fleet Management

### Vehicle Grid Display
- Card-based layout (3 columns on desktop)
- Each card shows:
  - Vehicle image placeholder
  - Make & Model (e.g., "Mercedes-Benz S-Class")
  - Year & Color
  - License Plate
  - Vehicle Type badge
  - Capacity (passengers & luggage)
  - Amenities list
  - Status indicator (Available/In Service/Maintenance)
  - Base rate & hourly rate
  - Action buttons: Edit, Delete, View Details

### Add Vehicle Modal
**Form Fields:**
- Make (Input)
- Model (Input)
- Year (Number input)
- Color (Input)
- License Plate (Input)
- VIN (Input)
- Type (Select: Sedan, SUV, Luxury, Sprinter, Executive)
- Capacity (Number)
- Luggage Capacity (Number)
- Amenities (Multi-select checkboxes):
  - WiFi
  - Leather Seats
  - Climate Control
  - Bottled Water
  - Phone Charger
  - Privacy Partition
  - Entertainment System
  - Massage Seats
  - Premium Sound
- Base Rate ($)
- Hourly Rate ($)
- Status (Select: Available, In Service, Maintenance)
- Insurance Expiry (Date)
- Last Service Date (Date)
- Next Service Date (Date)

### Vehicle Actions
```typescript
// Create vehicle
POST /admin/vehicles
Body: { make, model, year, type, capacity, amenities, baseRate, ... }

// Update vehicle
PUT /admin/vehicles/:id
Body: { ...updates }

// Delete vehicle
DELETE /admin/vehicles/:id
```

---

## 👨‍✈️ Tab 4: Drivers Management

### Driver Table
**Columns:**
- Photo (Avatar placeholder)
- Name
- Email
- Phone
- License Number
- Assigned Vehicle
- Status (Active/Inactive/Off Duty)
- Rating (Star display)
- Total Trips
- Total Revenue
- Actions

### Driver Statistics Cards
- Total Drivers
- Active Now
- Average Rating
- Top Performer (highest rated)

### Add Driver Modal
**Form Fields:**
- First Name (Required)
- Last Name (Required)
- Email (Required)
- Phone (Required)
- License Number (Required)
- License Expiry Date (Required)
- CDL Class (Select: A, B, C)
- Certifications (Multi-select):
  - Defensive Driving
  - First Aid
  - CPR
  - Luxury Service Training
  - Passenger Assistance
- Assigned Vehicle (Select from available vehicles)
- Status (Active/Inactive)
- Languages (Multi-select: English, Spanish, French, Mandarin)
- Bio (Textarea)
- Years of Experience (Number)

### Driver Schedule Management
- Weekly availability grid
- Days of week with start/end times
- Toggle availability per day
- Break time scheduling

### Driver Actions
```typescript
// Create driver
POST /admin/drivers
Body: { firstName, lastName, email, phone, licenseNumber, ... }

// Update driver
PUT /admin/drivers/:id
Body: { ...updates }

// Delete driver
DELETE /admin/drivers/:id

// Assign to booking
PUT /admin/bookings/:bookingId
Body: { driverId }
```

---

## 🎁 Tab 5: Service Bundles

### Bundle Categories
- 💍 Wedding Packages
- 💼 Corporate Packages
- ✈️ Airport Packages
- 🎭 Tour Packages
- 🎉 Event Packages
- 🎭 Mardi Gras Specials
- 📅 Subscription Plans

### Bundle Card Design
```
┌─────────────────────────────────────────────┐
│ 💍 Premium Wedding Package                  │
│ ─────────────────────────────────────────   │
│ Complete luxury transportation for your     │
│ special day                                  │
│                                              │
│ Base Price: $1,200                          │
│ Discount: 15% OFF                           │
│ Final Price: $1,020                         │
│                                              │
│ ✓ 6 hours luxury vehicle                    │
│ ✓ Red carpet service                        │
│ ✓ Champagne & refreshments                  │
│ ✓ Professional chauffeur                    │
│                                              │
│ Vehicle Types: Luxury, SUV, Sprinter        │
│ Max Passengers: 14                           │
│ Advance Booking: 14 days                    │
│                                              │
│ Sales: 24  •  Revenue: $28,800             │
│                                              │
│ [Edit] [Delete] [Duplicate] [View Stats]   │
└─────────────────────────────────────────────┘
```

### Create Bundle Modal (Multi-Step)

**Step 1: Basic Information**
- Name (Input)
- Description (Textarea)
- Type (Select from categories)
- Duration (Hours)
- Base Price ($)
- Discount Percentage (%)

**Step 2: Included Services**
- Checkboxes for:
  - Driver included
  - Gas/Fuel included
  - Parking fees included
  - Toll fees included
  - Wait time (specify minutes)
  - Multiple stops
  - Red carpet service
  - Champagne service
  - Refreshments
  - WiFi access
  - Phone chargers

**Step 3: Vehicle & Capacity**
- Vehicle Types (Multi-select)
- Max Passengers
- Luggage capacity
- Amenities list

**Step 4: Booking Requirements**
- Minimum advance booking (days)
- Cancellation policy (Select):
  - Flexible (24h free cancellation)
  - Moderate (48h free cancellation)
  - Strict (7 days free cancellation)
  - Non-refundable
- Available days of week
- Seasonal pricing toggle
- Peak season multiplier (if seasonal)

**Step 5: Terms & Features**
- Features list (Textarea - one per line)
- Terms & conditions (Textarea)
- Active/Inactive toggle
- Featured bundle toggle

### Bundle Actions
```typescript
// Create bundle
POST /admin/bundles
Body: { name, description, type, basePrice, discount, includedServices, ... }

// Update bundle
PUT /admin/bundles/:id

// Delete bundle
DELETE /admin/bundles/:id

// Duplicate bundle
POST /admin/bundles/:id/duplicate
```

---

## 💰 Tab 6: Pricing Management

### Pricing Sections

**1. Base Rates by Vehicle Type**
```
Luxury Sedan:    $75 base / $60 hourly
Executive SUV:    $95 base / $75 hourly
Premium Luxury:   $150 base / $120 hourly
Mercedes Sprinter: $200 base / $150 hourly
Executive Van:     $175 base / $140 hourly
```

**2. Zone Multipliers**
```
Airport:          1.0x
Downtown:         1.1x
Uptown:           1.15x
French Quarter:   1.2x
West Bank:        1.2x
Metairie:         1.05x
Suburbs:          1.1x
```

**3. Time-Based Multipliers**
```
Peak Hours (7-9am, 4-7pm):  1.25x
Late Night (10pm-5am):      1.35x
Weekends:                    1.15x
Holidays:                    1.5x
```

**4. Service Type Pricing**
```
Wedding:          $2,500 base
Corporate:        $350 base
Airport Transfer: $125 base
City Tour:        $450 base
Special Event:    $800 base
Mardi Gras:       $1,200 base
Hourly Service:   $150/hour
Subscription:     $2,000/month
```

**5. Additional Fees**
```
Per Mile Rate:         $2.50
Minimum Fare:          $50
Airport Fee:           $5
Toll Pass:             $3
Wait Time (per min):   $0.75
Cancellation Fee:      25% of booking
Tax Rate:              9.45%
```

**6. Seasonal Pricing**
- Mardi Gras Season (Jan 15 - Mar 15): 1.8x multiplier
- Jazz Fest (Apr 25 - May 5): 1.5x multiplier

### Edit Mode
- All fields become editable inputs
- "Save Pricing" button at top
- "Cancel" button to revert
- Confirmation dialog before saving
- Success toast notification

### Pricing Actions
```typescript
// Get pricing
GET /admin/pricing

// Update pricing
PUT /admin/pricing
Body: { baseRates, zones, timeMultipliers, servicePricing, fees, ... }
```

---

## ⚙️ Tab 7: Services & Tours Management

### Service Creation Modal (5-Step Wizard)

**Design**: Full-screen modal with progress indicator at top

**Progress Steps:**
```
1. Basic Info → 2. Pricing → 3. Details → 4. Media → 5. Review
```

#### Step 1: Basic Information
```
┌─────────────────────────────────────────────┐
│ Step 1 of 5: Basic Information              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ Service Name *                               │
│ [Input: e.g., "French Quarter Historic..."] │
│                                              │
│ Category *                                   │
│ [Select Dropdown]                            │
│   🎭 City Tour                              │
│   🎉 Festival Event                         │
│   🎭 Mardi Gras Special                     │
│   🎺 Jazz Festival                          │
│   💍 Wedding Package                        │
│   💼 Corporate Event                        │
│   ✈️ Airport Service                        │
│   ⚡ Custom Service                         │
│                                              │
│ Short Description (160 chars) *             │
│ [Textarea]                                   │
│                                              │
│ Long Description *                           │
│ [Rich Textarea]                              │
│                                              │
│        [Cancel]        [Next Step →]        │
└─────────────────────────────────────────────┘
```

#### Step 2: Pricing Details
```
┌─────────────────────────────────────────────┐
│ Step 2 of 5: Pricing Details                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ Base Price * ($)                             │
│ [Input: 450.00]                              │
│                                              │
│ Discount Percentage (%)                      │
│ [Input: 10] = Save $45.00                   │
│                                              │
│ Final Price: $405.00                        │
│                                              │
│ Loyalty Points Earned                        │
│ [Input: 100 points]                          │
│                                              │
│ ☐ Enable Seasonal Pricing                   │
│   Peak Season Multiplier: [1.5x]            │
│                                              │
│        [← Back]        [Next Step →]        │
└─────────────────────────────────────────────┘
```

#### Step 3: Service Details
```
┌─────────────────────────────────────────────┐
│ Step 3 of 5: Service Details                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ Duration (hours) *                           │
│ [Input: 3]                                   │
│                                              │
│ Maximum Capacity (passengers) *              │
│ [Input: 6]                                   │
│                                              │
│ Minimum Booking Notice (days) *              │
│ [Input: 7]                                   │
│                                              │
│ Available Days                               │
│ ☑ Monday    ☑ Tuesday   ☑ Wednesday         │
│ ☑ Thursday  ☑ Friday    ☑ Saturday          │
│ ☑ Sunday                                     │
│                                              │
│ Tour Highlights (for tours)                  │
│ Select popular highlights:                   │
│ ☐ French Quarter Architecture               │
│ ☐ Garden District Mansions                  │
│ ☐ Historic Cemeteries                       │
│ ☐ Jazz History Sites                        │
│ ☐ Creole Cuisine Stops                      │
│ ☐ Mississippi Riverfront                    │
│ ☐ Art Galleries                              │
│ ☐ Photo Opportunities                       │
│                                              │
│ Custom Highlight: [+ Add Custom]            │
│                                              │
│ Itinerary Details                            │
│ [Textarea]                                   │
│                                              │
│ Meeting Point                                │
│ [Input with map icon]                        │
│                                              │
│        [← Back]        [Next Step →]        │
└─────────────────────────────────────────────┘
```

#### Step 4: Inclusions & Media
```
┌─────────────────────────────────────────────┐
│ Step 4 of 5: Inclusions & Media             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ What's Included                              │
│ [Textarea - one item per line]               │
│ Example:                                     │
│ - Professional tour guide                    │
│ - Luxury vehicle transportation              │
│ - Bottled water and snacks                  │
│ - Photo stops at major landmarks            │
│                                              │
│ What's Excluded                              │
│ [Textarea - one item per line]               │
│ Example:                                     │
│ - Meals and alcoholic beverages             │
│ - Gratuities                                 │
│ - Entry fees to attractions                 │
│                                              │
│ Service Image                                │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │     [Upload Image]                      │ │
│ │      or Drag & Drop                     │ │
│ │                                         │ │
│ │   Recommended: 1200x800px, JPG/PNG     │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ [Preview uploaded image with zoom controls] │
│ [🔍+ Zoom In] [🔍- Zoom Out] [🗑️ Delete]  │
│ Zoom: 100%                                   │
│ (Use mouse wheel to zoom 50% - 300%)       │
│                                              │
│        [← Back]        [Next Step →]        │
└─────────────────────────────────────────────┘
```

**Image Upload Features:**
- Drag & drop support
- File type validation (JPEG, PNG only)
- Max size: 5MB
- Image preview with controls
- **Mouse wheel zoom** (50% - 300%)
- Manual zoom buttons (+/-)
- Live zoom percentage display
- Delete and re-upload option
- Smooth zoom transitions

#### Step 5: Review & Publish
```
┌─────────────────────────────────────────────┐
│ Step 5 of 5: Review & Publish               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                              │
│ Review Your Service                          │
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │ [Service Image Preview]                 │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ 🎭 French Quarter Historic Tour             │
│ ──────────────────────────────────────────  │
│                                              │
│ Explore the rich history and architecture   │
│ of New Orleans' famous French Quarter...   │
│                                              │
│ 💰 $405.00 (10% off $450.00)               │
│ ⏱️ 3 hours  •  👥 Up to 6 guests           │
│ 📅 7 days advance booking required          │
│                                              │
│ ✓ Included:                                  │
│   • Professional tour guide                  │
│   • Luxury vehicle transportation            │
│   • Bottled water and snacks                │
│                                              │
│ Highlights:                                  │
│ • French Quarter Architecture               │
│ • Historic Cemeteries                       │
│ • Jazz History Sites                        │
│                                              │
│ Special Requirements                         │
│ [Textarea]                                   │
│                                              │
│ Cancellation Policy                          │
│ [Select: Flexible / Moderate / Strict]      │
│                                              │
│ ☑ Service is Active (visible to customers) │
│ ☐ Featured Service (show on homepage)      │
│                                              │
│    [← Back]  [Save Draft]  [Publish →]     │
└─────────────────────────────────────────────┘
```

### Published Services Grid
- Card-based layout
- Service image
- Name and category
- Price and duration
- Active/Inactive toggle
- Edit and Delete buttons
- View details modal
- Quick stats (bookings count, revenue)

### Service Actions
```typescript
// Create service
POST /admin/services
Body: {
  name, category, description, basePrice, duration,
  maxCapacity, highlights, included, excluded,
  imageUrl, isActive, isFeatured, ...
}

// Update service
PUT /admin/services/:id

// Delete service
DELETE /admin/services/:id

// Toggle active status
PATCH /admin/services/:id/toggle-active
```

---

## 🤝 Tab 8: Affiliate Management

### Features
- Generate driver invitation links
- View affiliate applications
- Approve/reject applications
- Manage affiliate drivers

### Generate Invite Link Section
```
┌─────────────────────────────────────────────┐
│ Generate Driver Invitation Link             │
│                                              │
│ Create a unique link to invite affiliate    │
│ drivers to join the Globa7 network.         │
│                                              │
│ [Generate New Link] button                  │
│                                              │
│ Generated Link:                              │
│ https://globa7.com/driver-app?invite=abc123 │
│ [📋 Copy Link] [📧 Send via Email]         │
│                                              │
│ Link Expires: March 15, 2024                │
└─────────────────────────────────────────────┘
```

### Pending Applications Table
**Columns:**
- Applicant Name
- Email
- Phone
- Vehicle Type
- License Number
- Application Date
- Status (Pending/Approved/Rejected)
- Actions (View Details, Approve, Reject)

### Application Details Modal
```
┌─────────────────────────────────────────────┐
│ Driver Application Details                  │
│ ─────────────────────────────────────────   │
│                                              │
│ Personal Information                         │
│ Name: John Smith                             │
│ Email: john@example.com                     │
│ Phone: (504) 555-0123                       │
│ License #: LA-CDL-123456                    │
│ License Expiry: 12/31/2025                  │
│                                              │
│ Vehicle Information                          │
│ Make/Model: Mercedes-Benz S-Class           │
│ Year: 2023                                   │
│ License Plate: ABC-123                      │
│ Insurance Expiry: 06/30/2025               │
│                                              │
│ Experience                                   │
│ Years of Experience: 5 years                │
│ Previous Employers: ABC Limo Service        │
│ Certifications:                              │
│ ✓ Defensive Driving                         │
│ ✓ First Aid                                 │
│ ✓ CPR                                       │
│                                              │
│ Background Check: ✓ Passed                  │
│ References: ✓ Verified                      │
│                                              │
│    [Reject] [Request More Info] [Approve]   │
└─────────────────────────────────────────────┘
```

### Affiliate Actions
```typescript
// Generate invite link
POST /admin/generate-affiliate-invite
Response: { inviteCode, inviteUrl, expiresAt }

// Get pending applications
GET /admin/affiliate-applications
Response: { applications: [...] }

// Approve application
POST /admin/affiliate-applications/:id/approve
Body: { assignVehicleId?, startDate }

// Reject application
POST /admin/affiliate-applications/:id/reject
Body: { reason }
```

---

## 🎨 UI Components Needed

### From Shadcn/UI or Custom Build

1. **Card** - with CardHeader, CardContent, CardDescription, CardTitle
2. **Button** - with variants (default, gold, outline, ghost, destructive)
3. **Input** - text, number, email, password, date
4. **Label** - for form fields
5. **Textarea** - for long text
6. **Select** - with SelectTrigger, SelectValue, SelectContent, SelectItem
7. **Tabs** - with TabsList, TabsTrigger, TabsContent
8. **Dialog** - with DialogContent, DialogHeader, DialogTitle, DialogFooter
9. **Badge** - for status indicators
10. **Checkbox** - for multi-select
11. **Switch** - for toggle states
12. **Progress** - for loading indicators
13. **Toast/Sonner** - for notifications

### Custom Components to Build

1. **ServiceCreationModal** - 5-step wizard with image upload
2. **StatCard** - Analytics display card
3. **BookingCard** - Booking information card
4. **VehicleCard** - Fleet vehicle card
5. **DriverCard** - Driver profile card
6. **BundleCard** - Service bundle card
7. **ApplicationCard** - Affiliate application card

---

## 📊 Data Models

### Analytics
```typescript
interface Analytics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  activeDrivers: number;
  totalDrivers: number;
  averageDriverRating: number;
  utilizationRate: number;
  activeVehicles: number;
  totalVehicles: number;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  user_id: string;
  service_id?: string;
  service_name: string;
  pickup_location: string;
  dropoff_location?: string;
  pickup_datetime: string;
  passengers: number;
  vehicle_type: string;
  price: number;
  status: 'pending' | 'confirmed' | 'en-route' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  driver_id?: string;
  special_requests?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}
```

### Service
```typescript
interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  discount_percent: number;
  final_price: number;
  duration: number;
  max_capacity: number;
  min_booking_days: number;
  available_days: string[];
  tour_highlights?: string[];
  itinerary?: string;
  meeting_point?: string;
  included: string[];
  excluded: string[];
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
```

### Driver
```typescript
interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  cdl_class?: string;
  certifications: string[];
  assigned_vehicle?: string;
  status: 'active' | 'inactive' | 'off-duty';
  rating: number;
  total_trips: number;
  total_revenue: number;
  years_experience: number;
  languages: string[];
  bio?: string;
  created_at: string;
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'luxury' | 'sprinter' | 'executive';
  color: string;
  license_plate: string;
  vin: string;
  capacity: number;
  luggage_capacity: number;
  amenities: string[];
  is_luxury: boolean;
  status: 'available' | 'in-service' | 'maintenance';
  base_rate: number;
  hourly_rate: number;
  insurance_expiry: string;
  last_service_date: string;
  next_service_date: string;
}
```

### Bundle
```typescript
interface Bundle {
  id: string;
  name: string;
  description: string;
  type: string;
  base_price: number;
  discount: number;
  included_services: string[];
  vehicle_types: string[];
  hours_included: number;
  min_booking_notice: number;
  cancellation_policy: string;
  is_active: boolean;
  total_sales: number;
  created_at: string;
}
```

---

## 🔌 API Integration (Supabase)

### Setup Supabase Client
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Database Tables Required
- `user_profiles` - User information with roles
- `services` - Tour and service offerings
- `bookings` - Customer reservations
- `drivers` - Driver profiles and info
- `vehicles` - Fleet management
- `service_bundles` - Package deals
- `affiliate_applications` - Driver applications
- `analytics_metrics` - Business metrics

### API Calls (Replace with Supabase queries)

**Analytics:**
```typescript
const { data: bookings } = await supabase
  .from('bookings')
  .select('*');

// Calculate analytics from bookings
const analytics = {
  totalRevenue: bookings.reduce((sum, b) => sum + b.price, 0),
  totalBookings: bookings.length,
  completedBookings: bookings.filter(b => b.status === 'completed').length,
  // ... more calculations
};
```

**Bookings:**
```typescript
// Get all bookings
const { data } = await supabase
  .from('bookings')
  .select('*')
  .order('created_at', { ascending: false });

// Update booking status
const { error } = await supabase
  .from('bookings')
  .update({ status: 'confirmed', driver_id: driverId })
  .eq('id', bookingId);
```

**Services:**
```typescript
// Create service
const { data, error } = await supabase
  .from('services')
  .insert([serviceData])
  .select()
  .single();

// Get all services
const { data } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true);

// Update service
await supabase
  .from('services')
  .update(updates)
  .eq('id', serviceId);

// Delete service
await supabase
  .from('services')
  .delete()
  .eq('id', serviceId);
```

**Drivers:**
```typescript
// Get all drivers
const { data } = await supabase
  .from('drivers')
  .select('*');

// Create driver
const { error } = await supabase
  .from('drivers')
  .insert([driverData]);
```

**Vehicles:**
```typescript
// Get all vehicles
const { data } = await supabase
  .from('vehicles')
  .select('*');

// Create vehicle
const { error } = await supabase
  .from('vehicles')
  .insert([vehicleData]);
```

**Bundles:**
```typescript
// Get all bundles
const { data } = await supabase
  .from('service_bundles')
  .select('*');

// Create bundle
const { error } = await supabase
  .from('service_bundles')
  .insert([bundleData]);
```

---

## 🎭 Animations & Interactions

### Page Entry Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Card Hover Effects
```typescript
<motion.div
  whileHover={{ scale: 1.02, y: -5 }}
  transition={{ duration: 0.2 }}
  className="cursor-pointer"
>
```

### Button Interactions
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="btn-gold"
>
```

### Tab Transitions
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
```

### Modal Animations
```typescript
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column, stacked cards
- **Tablet**: 768px - 1024px - 2 column grid
- **Desktop**: > 1024px - 3-4 column grid

### Mobile Optimizations
- Hamburger menu for tabs
- Collapsible cards
- Touch-friendly buttons (min 44px)
- Swipe gestures for navigation
- Bottom sheet modals

### Tailwind Responsive Classes
```
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
```

---

## 🎨 Styling Guidelines

### Gold Button Class
```css
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
  color: black;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
}
```

### Card Glass Effect
```css
.card-glass {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 0.75rem;
}
```

### Status Badge Colors
```typescript
const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'en-route': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  arrived: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'in-progress': 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-gold/20 text-gold border-gold/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};
```

---

## 🚨 Error Handling & Loading States

### Loading State
```typescript
{loading ? (
  <div className="flex items-center justify-center h-96">
    <Loader className="w-8 h-8 animate-spin text-gold" />
    <span className="ml-3 text-gray-400">Loading dashboard...</span>
  </div>
) : (
  // ... content
)}
```

### Error Toasts
```typescript
import { toast } from 'sonner';

// Success
toast.success('Service created successfully!');

// Error
toast.error('Failed to create service', {
  description: error.message || 'Please try again.',
});

// Warning
toast.warning('Please fill in all required fields');

// Info
toast.info('Service saved as draft');
```

### Form Validation
```typescript
const validateForm = () => {
  if (!formData.name) {
    toast.error('Service name is required');
    return false;
  }
  if (!formData.basePrice || formData.basePrice <= 0) {
    toast.error('Please enter a valid base price');
    return false;
  }
  // ... more validations
  return true;
};
```

---

## ✅ Required Libraries

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "@supabase/supabase-js": "^2.39.0",
    "motion": "^11.11.17",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.0",
    "date-fns": "^3.3.1",
    "recharts": "^2.12.0"
  }
}
```

---

## 🎯 User Flow Example

1. User navigates to `/auth`
2. Logs in with `admin@globa7.com` / `admin123`
3. Redirected to `/admin` (EnhancedAdminDashboard)
4. Sees Overview tab with analytics
5. Clicks "Services & Tours" tab
6. Clicks "+ Create New Service" button
7. ServiceCreationModal opens (5-step wizard)
8. Fills out form across 5 steps
9. Uploads service image with zoom preview
10. Reviews and publishes service
11. Service appears in services grid
12. Toast notification confirms success
13. Can edit, delete, or view service details

---

## 🔒 Security Considerations

- **Admin-only access**: Check user role on mount
- **Redirect non-admins**: Navigate to `/portal`
- **Secure API calls**: Include auth token in headers
- **Input sanitization**: Validate all form inputs
- **XSS prevention**: Escape user-generated content
- **CSRF protection**: Use Supabase's built-in security

---

## 🎨 Final Polish

- Smooth page transitions
- Loading skeletons for data fetching
- Empty states with helpful messages
- Confirmation dialogs for destructive actions
- Keyboard shortcuts (Cmd+K for search, Esc to close modals)
- Tooltips on hover for icons
- Success/error feedback for all actions
- Responsive design tested on multiple devices

---

## 📝 Additional Notes

- Use **Tailwind CSS** for all styling
- Follow **mobile-first** responsive design
- Implement **dark mode** as default (no light mode needed)
- Use **motion** package (not framer-motion) for animations
- All icons from **lucide-react**
- Toast notifications with **sonner**
- Forms should have **loading states** during submission
- Tables should be **sortable and filterable**
- All modals should **close on ESC key**
- All forms should **validate on submit**

---

This is a **complete, production-ready admin dashboard** for a luxury transportation service. Build it with attention to detail, smooth animations, and a premium feel throughout!
