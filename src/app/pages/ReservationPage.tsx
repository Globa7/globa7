import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { TimeDropdown } from '../components/TimeDropdown';
import { 
  Calendar, MapPin, Users, Briefcase, Clock, Car, CreditCard, 
  CheckCircle, ArrowRight, ArrowLeft, Plane, Gift, Music, 
  Heart, Building2, PartyPopper, ChevronDown, Info, Sparkles,
  Phone, Mail, User, MessageSquare, Shield, Star, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

const SERVICE_TYPES = [
  { 
    value: 'airport', 
    label: 'Airport Transfer', 
    icon: Plane, 
    color: 'from-blue-500 to-blue-600',
    description: 'MSY pickups & drop-offs with flight tracking',
    basePrice: 125,
    emoji: '✈️'
  },
  { 
    value: 'hourly', 
    label: 'Hourly Service', 
    icon: Clock, 
    color: 'from-purple-500 to-purple-600',
    description: 'Flexible hourly luxury transportation',
    basePrice: 145,
    emoji: '⏰'
  },
  { 
    value: 'wedding', 
    label: 'Wedding', 
    icon: Heart, 
    color: 'from-pink-500 to-pink-600',
    description: 'Your special day deserves perfection',
    basePrice: 2500,
    emoji: '💍'
  },
  { 
    value: 'corporate', 
    label: 'Corporate', 
    icon: Building2, 
    color: 'from-gray-500 to-gray-700',
    description: 'Executive transportation & events',
    basePrice: 350,
    emoji: '💼'
  },
  { 
    value: 'tour', 
    label: 'Private City Tour', 
    icon: MapPin, 
    color: 'from-gold to-yellow-600',
    description: '3-hour curated New Orleans experience',
    basePrice: 450,
    emoji: '🎭'
  },
  { 
    value: 'event', 
    label: 'Special Event', 
    icon: PartyPopper, 
    color: 'from-orange-500 to-red-500',
    description: 'Galas, celebrations & VIP events',
    basePrice: 800,
    emoji: '🎉'
  },
  { 
    value: 'mardi_gras', 
    label: 'Mardi Gras / Festival', 
    icon: Music, 
    color: 'from-green-500 to-purple-600',
    description: 'Jazz Fest, Mardi Gras & special events',
    basePrice: 1200,
    emoji: '🎭'
  },
  { 
    value: 'group', 
    label: 'Group Transportation', 
    icon: Users, 
    color: 'from-teal-500 to-cyan-600',
    description: 'Sprinters & coaches for large groups',
    basePrice: 0,
    emoji: '👥'
  },
];

const VEHICLE_TYPES = [
  {
    value: 'luxury_sedan',
    label: 'Black Luxury SUV',
    capacity: 6,
    luggage: '4-6 bags',
    image: 'luxury-suv.jpg',
    features: ['Leather Interior', 'Climate Control', 'Phone Charging', 'Bottled Water'],
    baseRate: 120,
    hourlyRate: 145,
  },
  {
    value: 'sprinter_14',
    label: '14-Passenger Sprinter Van',
    capacity: 14,
    luggage: 'Ample overhead + rear storage',
    image: 'sprinter.jpg',
    features: ['Executive Seating', 'A/V System', 'Tinted Windows', 'Climate Control'],
    baseRate: 0,
    hourlyRate: 0,
  },
  {
    value: 'mini_coach_28',
    label: '28-Passenger Mini Coach',
    capacity: 28,
    luggage: 'Overhead compartments',
    image: 'mini-coach.jpg',
    features: ['Climate Control', 'PA System', 'Comfortable Seating', 'Large Windows'],
    baseRate: 0,
    hourlyRate: 240,
  },
  {
    value: 'coach_55',
    label: '55-Passenger Coach',
    capacity: 55,
    luggage: 'Full luggage bays',
    image: 'coach.jpg',
    features: ['Restroom', 'A/V System', 'Reclining Seats', 'Luggage Storage'],
    baseRate: 0,
    hourlyRate: 255,
  },
];

const POPULAR_ROUTES = [
  { from: 'MSY Airport', to: 'French Quarter', price: 120 },
  { from: 'MSY Airport', to: 'Garden District', price: 120 },
  { from: 'MSY Airport', to: 'CBD/Downtown', price: 120 },
  { from: 'French Quarter', to: 'Baton Rouge', price: 360 },
];

export function ReservationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Trip Basics
    tripType: 'airport',
    serviceDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    isRoundTrip: false,
    passengers: 1,
    luggage: 0,
    childSeats: 0,
    
    // Step 2: Locations
    pickupLocation: '',
    dropoffLocation: '',
    isMSYPickup: false,
    isMSYDropoff: false,
    additionalStops: [] as string[],
    
    // Flight info (if airport)
    airline: '',
    flightNumber: '',
    arrivalTime: '',
    departureTime: '',
    
    // Step 3: Vehicle & Preferences
    vehicleType: 'luxury_sedan',
    specialRequests: '',
    occasionNotes: '',
    
    // Step 4: Client Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    preferredContact: 'text',
    
    // Step 5: Review & Payment
    agreedToTerms: false,
    agreedToCancellation: false,
    wantsUpdates: true,
  });

  useEffect(() => {
    calculateEstimate();
  }, [formData.tripType, formData.vehicleType, formData.passengers, formData.isRoundTrip]);

  const calculateEstimate = () => {
    const serviceType = SERVICE_TYPES.find(s => s.value === formData.tripType);
    const vehicle = VEHICLE_TYPES.find(v => v.value === formData.vehicleType);
    
    let price = serviceType?.basePrice || 0;
    
    if (formData.tripType === 'hourly' && vehicle) {
      price = vehicle.hourlyRate * 4; // 4-hour minimum
    } else if (formData.tripType === 'airport' && vehicle) {
      price = vehicle.baseRate;
    }
    
    if (formData.isRoundTrip) {
      price = price * 2;
    }
    
    setEstimatedPrice(price);
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.serviceDate || !formData.pickupTime) {
          toast.error('Please select a date and time');
          return false;
        }
        return true;
      case 2:
        if (!formData.pickupLocation || !formData.dropoffLocation) {
          toast.error('Please enter pickup and drop-off locations');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast.error('Please complete all required fields');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 5:
        if (!formData.agreedToTerms) {
          toast.error('Please agree to the terms and conditions');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
          estimatedPrice,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reservation submitted successfully!');
        navigate(`/booking-confirmation/${data.bookingId}`);
      } else {
        toast.error('Failed to submit reservation');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = SERVICE_TYPES.find(s => s.value === formData.tripType);
  const selectedVehicle = VEHICLE_TYPES.find(v => v.value === formData.vehicleType);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <motion.header 
        className="border-b border-charcoal bg-charcoal/50 backdrop-blur-md sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-8 w-8 text-gold" />
              <div>
                <h1 className="text-2xl font-cormorant text-gold">GLOBA7</h1>
                <p className="text-xs text-gray-400">Luxury Transportation</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-4">
              <a href="tel:5046414506" className="text-gold hover:text-gold/80 transition-colors hidden md:flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (504) 641-4506
              </a>
              <Button variant="outline" onClick={() => navigate('/')} className="border-gold text-gold hover:bg-gold hover:text-black">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-cormorant text-gold mb-2">Reserve Your Experience</h2>
            <p className="text-gray-400">Step {currentStep} of 5 - {
              currentStep === 1 ? 'Trip Details' :
              currentStep === 2 ? 'Locations' :
              currentStep === 3 ? 'Vehicle Selection' :
              currentStep === 4 ? 'Your Information' :
              'Review & Confirm'
            }</p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-charcoal rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 5) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.div
                  key={step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep ? 'bg-gold text-black' : 'bg-charcoal text-gray-500'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <Card className="bg-charcoal border-gold/20">
              <CardContent className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Step 1: Trip Basics */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <Label className="text-xl font-cormorant text-gold mb-4 block">Select Your Service Type</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {SERVICE_TYPES.map((service) => (
                            <motion.button
                              key={service.value}
                              type="button"
                              onClick={() => updateFormData({ tripType: service.value })}
                              className={`p-6 rounded-lg border-2 transition-all text-left ${
                                formData.tripType === service.value
                                  ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                                  : 'border-gold/20 hover:border-gold/50 hover:bg-charcoal/50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color}`}>
                                  <service.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl">{service.emoji}</span>
                                    <h3 className="font-semibold text-white">{service.label}</h3>
                                  </div>
                                  <p className="text-sm text-gray-400">{service.description}</p>
                                  <p className="text-gold font-semibold mt-2">From ${service.basePrice}</p>
                                </div>
                                {formData.tripType === service.value && (
                                  <CheckCircle className="h-6 w-6 text-gold flex-shrink-0" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 mb-2 block">Service Date *</Label>
                          <Input
                            type="date"
                            value={formData.serviceDate}
                            onChange={(e) => updateFormData({ serviceDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="bg-black border-gold/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 mb-2 block">Pickup Time *</Label>
                          <TimeDropdown
                            value={formData.pickupTime}
                            onChange={(value) => updateFormData({ pickupTime: value })}
                            placeholder="Select pickup time"
                            required={true}
                            showLabel={false}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-black/30 border border-gold/10">
                        <Checkbox
                          checked={formData.isRoundTrip}
                          onCheckedChange={(checked) => updateFormData({ isRoundTrip: checked as boolean })}
                          className="border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <div>
                          <Label className="text-white font-semibold">Round Trip</Label>
                          <p className="text-sm text-gray-400">Need a return trip? We'll handle both ways</p>
                        </div>
                      </div>

                      {formData.isRoundTrip && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          <div>
                            <Label className="text-gray-300 mb-2 block">Return Date *</Label>
                            <Input
                              type="date"
                              value={formData.returnDate}
                              onChange={(e) => updateFormData({ returnDate: e.target.value })}
                              min={formData.serviceDate}
                              className="bg-black border-gold/20 text-white"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-300 mb-2 block">Return Time *</Label>
                            <TimeDropdown
                              value={formData.returnTime}
                              onChange={(value) => updateFormData({ returnTime: value })}
                              placeholder="Select return time"
                              required={false}
                              showLabel={false}
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-gray-300 mb-2 block">Passengers</Label>
                          <Input
                            type="number"
                            min="1"
                            max="55"
                            value={formData.passengers}
                            onChange={(e) => updateFormData({ passengers: parseInt(e.target.value) })}
                            className="bg-black border-gold/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 mb-2 block">Luggage</Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={formData.luggage}
                            onChange={(e) => updateFormData({ luggage: parseInt(e.target.value) })}
                            className="bg-black border-gold/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 mb-2 block">Child Seats</Label>
                          <Input
                            type="number"
                            min="0"
                            max="4"
                            value={formData.childSeats}
                            onChange={(e) => updateFormData({ childSeats: parseInt(e.target.value) })}
                            className="bg-black border-gold/20 text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Locations */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <Label className="text-xl font-cormorant text-gold mb-4 block">Pickup & Drop-off Locations</Label>
                        
                        {/* Popular Routes */}
                        <div className="mb-6">
                          <Label className="text-sm text-gray-400 mb-3 block">Popular Routes</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {POPULAR_ROUTES.map((route, idx) => (
                              <motion.button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  updateFormData({ 
                                    pickupLocation: route.from, 
                                    dropoffLocation: route.to,
                                    isMSYPickup: route.from.includes('MSY'),
                                    isMSYDropoff: route.to.includes('MSY')
                                  });
                                }}
                                className="p-3 rounded-lg border border-gold/20 hover:border-gold/50 hover:bg-charcoal/50 transition-all text-left"
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <p className="text-white">{route.from} → {route.to}</p>
                                    <p className="text-gold font-semibold">${route.price}</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-gold" />
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gold" />
                              Pickup Location *
                            </Label>
                            <Input
                              type="text"
                              value={formData.pickupLocation}
                              onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                              placeholder="123 Bourbon Street, New Orleans, LA"
                              className="bg-black border-gold/20 text-white"
                              required
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Checkbox
                                checked={formData.isMSYPickup}
                                onCheckedChange={(checked) => {
                                  updateFormData({ 
                                    isMSYPickup: checked as boolean,
                                    pickupLocation: checked ? 'MSY - Louis Armstrong International Airport' : ''
                                  });
                                }}
                                className="border-gold/50"
                              />
                              <Label className="text-sm text-gray-400">Picking up from MSY Airport</Label>
                            </div>
                          </div>

                          <div>
                            <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gold" />
                              Drop-off Location *
                            </Label>
                            <Input
                              type="text"
                              value={formData.dropoffLocation}
                              onChange={(e) => updateFormData({ dropoffLocation: e.target.value })}
                              placeholder="789 Canal Street, New Orleans, LA"
                              className="bg-black border-gold/20 text-white"
                              required
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Checkbox
                                checked={formData.isMSYDropoff}
                                onCheckedChange={(checked) => {
                                  updateFormData({ 
                                    isMSYDropoff: checked as boolean,
                                    dropoffLocation: checked ? 'MSY - Louis Armstrong International Airport' : ''
                                  });
                                }}
                                className="border-gold/50"
                              />
                              <Label className="text-sm text-gray-400">Dropping off at MSY Airport</Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Flight Information */}
                      {(formData.isMSYPickup || formData.isMSYDropoff || formData.tripType === 'airport') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Plane className="h-5 w-5 text-blue-400" />
                            <Label className="text-lg font-semibold text-white">Flight Information</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-300 mb-2 block">Airline</Label>
                              <Input
                                type="text"
                                value={formData.airline}
                                onChange={(e) => updateFormData({ airline: e.target.value })}
                                placeholder="Delta, United, Southwest..."
                                className="bg-black/50 border-blue-500/20 text-white"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 mb-2 block">Flight Number</Label>
                              <Input
                                type="text"
                                value={formData.flightNumber}
                                onChange={(e) => updateFormData({ flightNumber: e.target.value })}
                                placeholder="DL 1234"
                                className="bg-black/50 border-blue-500/20 text-white"
                              />
                            </div>
                            {formData.isMSYPickup && (
                              <div>
                                <Label className="text-gray-300 mb-2 block">Arrival Time</Label>
                                <TimeDropdown
                                  value={formData.arrivalTime}
                                  onChange={(value) => updateFormData({ arrivalTime: value })}
                                  placeholder="Select arrival time"
                                  required={false}
                                  showLabel={false}
                                />
                              </div>
                            )}
                            {formData.isMSYDropoff && (
                              <div>
                                <Label className="text-gray-300 mb-2 block">Departure Time</Label>
                                <TimeDropdown
                                  value={formData.departureTime}
                                  onChange={(value) => updateFormData({ departureTime: value })}
                                  placeholder="Select departure time"
                                  required={false}
                                  showLabel={false}
                                />
                              </div>
                            )}
                          </div>
                          <div className="mt-4 flex items-start gap-2 text-sm text-blue-300">
                            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <p>We track your flight in real-time and adjust pickup for any delays automatically</p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Vehicle Selection */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Label className="text-xl font-cormorant text-gold mb-4 block">Choose Your Vehicle</Label>
                      
                      <div className="space-y-4">
                        {VEHICLE_TYPES.map((vehicle) => (
                          <motion.button
                            key={vehicle.value}
                            type="button"
                            onClick={() => updateFormData({ vehicleType: vehicle.value })}
                            className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                              formData.vehicleType === vehicle.value
                                ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                                : 'border-gold/20 hover:border-gold/50'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Car className="h-6 w-6 text-gold" />
                                  <h3 className="text-xl font-semibold text-white">{vehicle.label}</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                                  <div className="text-gray-400">
                                    <Users className="h-4 w-4 inline mr-1" />
                                    Up to {vehicle.capacity} passengers
                                  </div>
                                  <div className="text-gray-400">
                                    <Briefcase className="h-4 w-4 inline mr-1" />
                                    {vehicle.luggage}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {vehicle.features.map((feature, idx) => (
                                    <Badge key={idx} variant="outline" className="border-gold/30 text-gold">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                                {vehicle.hourlyRate > 0 && (
                                  <p className="text-gold font-semibold">${vehicle.hourlyRate}/hour</p>
                                )}
                              </div>
                              {formData.vehicleType === vehicle.value && (
                                <CheckCircle className="h-8 w-8 text-gold flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300 mb-2 block">Occasion / Dress Code Notes</Label>
                          <Input
                            type="text"
                            value={formData.occasionNotes}
                            onChange={(e) => updateFormData({ occasionNotes: e.target.value })}
                            placeholder="Black-tie wedding, business casual, casual outing..."
                            className="bg-black border-gold/20 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-gray-300 mb-2 block">Special Requests or Requirements</Label>
                          <Textarea
                            value={formData.specialRequests}
                            onChange={(e) => updateFormData({ specialRequests: e.target.value })}
                            placeholder="VIP needs, accessibility requirements, champagne service, red carpet, etc..."
                            rows={4}
                            className="bg-black border-gold/20 text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Client Information */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Label className="text-xl font-cormorant text-gold mb-4 block">Your Information</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                            <User className="h-4 w-4 text-gold" />
                            First Name *
                          </Label>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateFormData({ firstName: e.target.value })}
                            placeholder="John"
                            className="bg-black border-gold/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 mb-2 block">Last Name *</Label>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateFormData({ lastName: e.target.value })}
                            placeholder="Doe"
                            className="bg-black border-gold/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gold" />
                            Email Address *
                          </Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            placeholder="john@example.com"
                            className="bg-black border-gold/20 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gold" />
                            Phone Number *
                          </Label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            placeholder="(504) 555-1234"
                            className="bg-black border-gold/20 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gold" />
                          Company Name (Optional)
                        </Label>
                        <Input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => updateFormData({ companyName: e.target.value })}
                          placeholder="For corporate bookings"
                          className="bg-black border-gold/20 text-white"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 mb-3 block">Preferred Contact Method</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'call', label: 'Call', icon: Phone },
                            { value: 'text', label: 'Text', icon: MessageSquare },
                            { value: 'email', label: 'Email', icon: Mail },
                          ].map((method) => (
                            <motion.button
                              key={method.value}
                              type="button"
                              onClick={() => updateFormData({ preferredContact: method.value })}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                formData.preferredContact === method.value
                                  ? 'border-gold bg-gold/10'
                                  : 'border-gold/20 hover:border-gold/50'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <method.icon className="h-6 w-6 mx-auto mb-2 text-gold" />
                              <div className="text-sm text-white">{method.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Review & Confirm */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <Label className="text-xl font-cormorant text-gold mb-4 block">Review Your Reservation</Label>

                      {/* Reservation Summary */}
                      <div className="space-y-4">
                        <div className="p-6 rounded-lg bg-black/30 border border-gold/20">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-gold" />
                            Trip Details
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400">Service Type</p>
                              <p className="text-white font-semibold">{selectedService?.label}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Date & Time</p>
                              <p className="text-white font-semibold">
                                {formData.serviceDate} at {formData.pickupTime}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Passengers</p>
                              <p className="text-white font-semibold">{formData.passengers} passenger(s)</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Trip Type</p>
                              <p className="text-white font-semibold">{formData.isRoundTrip ? 'Round Trip' : 'One Way'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-black/30 border border-gold/20">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gold" />
                            Locations
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-400">Pickup</p>
                              <p className="text-white font-semibold">{formData.pickupLocation}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Drop-off</p>
                              <p className="text-white font-semibold">{formData.dropoffLocation}</p>
                            </div>
                            {formData.flightNumber && (
                              <div>
                                <p className="text-gray-400">Flight</p>
                                <p className="text-white font-semibold">
                                  {formData.airline} {formData.flightNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-black/30 border border-gold/20">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Car className="h-5 w-5 text-gold" />
                            Vehicle
                          </h3>
                          <div className="text-sm">
                            <p className="text-white font-semibold">{selectedVehicle?.label}</p>
                            <p className="text-gray-400">Up to {selectedVehicle?.capacity} passengers</p>
                          </div>
                        </div>

                        <div className="p-6 rounded-lg bg-black/30 border border-gold/20">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-gold" />
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400">Name</p>
                              <p className="text-white font-semibold">{formData.firstName} {formData.lastName}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Email</p>
                              <p className="text-white font-semibold">{formData.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Phone</p>
                              <p className="text-white font-semibold">{formData.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Contact Via</p>
                              <p className="text-white font-semibold capitalize">{formData.preferredContact}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Terms & Conditions */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30 border border-gold/10">
                          <Checkbox
                            checked={formData.agreedToTerms}
                            onCheckedChange={(checked) => updateFormData({ agreedToTerms: checked as boolean })}
                            className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                            required
                          />
                          <div className="flex-1">
                            <Label className="text-white font-semibold">I agree to the Terms & Conditions *</Label>
                            <p className="text-sm text-gray-400 mt-1">
                              Final pricing may vary based on event dates and special requests. A confirmed quote will be provided before service.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-black/30 border border-gold/10">
                          <Checkbox
                            checked={formData.agreedToCancellation}
                            onCheckedChange={(checked) => updateFormData({ agreedToCancellation: checked as boolean })}
                            className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                            required
                          />
                          <div className="flex-1">
                            <Label className="text-white font-semibold">I acknowledge the cancellation policy *</Label>
                            <p className="text-sm text-gray-400 mt-1">
                              Please provide reasonable notice for any changes or cancellations.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-gold/10 border border-gold/30">
                          <Checkbox
                            checked={formData.wantsUpdates}
                            onCheckedChange={(checked) => updateFormData({ wantsUpdates: checked as boolean })}
                            className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <div className="flex-1">
                            <Label className="text-white font-semibold">Send me ride updates and exclusive offers</Label>
                            <p className="text-sm text-gray-400 mt-1">
                              Get SMS/email notifications about your ride and special promotions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="p-6 rounded-lg bg-gradient-to-br from-gold/10 to-yellow-500/10 border border-gold/30">
                        <div className="flex items-start gap-3 mb-4">
                          <Shield className="h-6 w-6 text-gold flex-shrink-0" />
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Payment Information</h3>
                            <p className="text-sm text-gray-300">
                              Payment will be arranged after we confirm your reservation and provide a final quote. We accept all major credit cards, Apple Pay, Google Pay, cash, and offer NET-30 billing for approved corporate accounts.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="border-gold/50 text-gold">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Credit Cards
                          </Badge>
                          <Badge variant="outline" className="border-gold/50 text-gold">Apple Pay</Badge>
                          <Badge variant="outline" className="border-gold/50 text-gold">Google Pay</Badge>
                          <Badge variant="outline" className="border-gold/50 text-gold">NET-30</Badge>
                          <Badge variant="outline" className="border-gold/50 text-gold">Payment Plans</Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gold/20">
                  {currentStep > 1 && (
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="border-gray-500 text-gray-400 hover:bg-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  {currentStep < 5 ? (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gold text-black hover:bg-gold/90 ml-auto"
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !formData.agreedToTerms}
                      className="bg-gold text-black hover:bg-gold/90 ml-auto"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            className="h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Reservation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Estimate & Benefits */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Estimate */}
            <motion.div
              className="sticky top-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-gold/10 to-yellow-500/10 border-gold">
                <CardHeader>
                  <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Estimated Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <motion.div
                      className="text-5xl font-cormorant text-white mb-2"
                      key={estimatedPrice}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      ${estimatedPrice.toLocaleString()}
                    </motion.div>
                    <p className="text-sm text-gray-400">Final quote will be confirmed</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white font-semibold">{selectedService?.label}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Vehicle</span>
                      <span className="text-white font-semibold">{selectedVehicle?.label.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Passengers</span>
                      <span className="text-white font-semibold">{formData.passengers}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Star className="h-3 w-3 text-gold" />
                      <span>15-minute early arrival guaranteed</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Shield className="h-3 w-3 text-gold" />
                      <span>Licensed & bonded chauffeur</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Zap className="h-3 w-3 text-gold" />
                      <span>Real-time flight tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-charcoal border-gold/20 mt-6">
                <CardContent className="p-6">
                  <h3 className="text-white font-semibold mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <a 
                      href="tel:5046414506" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                    >
                      <Phone className="h-4 w-4 text-gold" />
                      <div>
                        <p className="text-sm text-white font-semibold">(504) 641-4506</p>
                        <p className="text-xs text-gray-400">Call us</p>
                      </div>
                    </a>
                    <a 
                      href="sms:3103595277" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-gold" />
                      <div>
                        <p className="text-sm text-white font-semibold">(310) 359-5277</p>
                        <p className="text-xs text-gray-400">Text us</p>
                      </div>
                    </a>
                    <a 
                      href="mailto:booking@globa7.com" 
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-gold" />
                      <div>
                        <p className="text-sm text-white font-semibold">booking@globa7.com</p>
                        <p className="text-xs text-gray-400">Email us</p>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
