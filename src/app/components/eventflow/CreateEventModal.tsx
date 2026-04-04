import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TimeDropdown } from '../TimeDropdown';
import { 
  X,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  User,
  Plane,
  Car,
  Check,
  Building2,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateEventModal({ open, onClose }: CreateEventModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Event Info
    eventName: "",
    eventType: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    address: "",
    // Coordinator Details
    coordinatorFirstName: "",
    coordinatorLastName: "",
    coordinatorPhone: "",
    coordinatorEmail: "",
    coordinatorCompany: "",
    // Event Details
    estimatedGuests: "",
    expectedArrivals: "",
    expectedDepartures: "",
    expectedShuttles: "",
    arrivalTimeStart: "",
    arrivalTimeEnd: "",
    departureTimeStart: "",
    departureTimeEnd: "",
    guestManifest: "",
    specialRequirements: "",
    // Additional Notes
    notes: "",
  });

  const eventTypes = [
    "Conference",
    "Wedding",
    "Corporate Retreat",
    "Festival",
    "Funeral Service",
    "Concert/Show",
    "Sports Event",
    "Private Event",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Creating event:", formData);
    // Here you would make the API call to create the event
    onClose();
    // Reset form
    setFormData({
      eventName: "",
      eventType: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      location: "",
      address: "",
      coordinatorFirstName: "",
      coordinatorLastName: "",
      coordinatorPhone: "",
      coordinatorEmail: "",
      coordinatorCompany: "",
      estimatedGuests: "",
      expectedArrivals: "",
      expectedDepartures: "",
      expectedShuttles: "",
      arrivalTimeStart: "",
      arrivalTimeEnd: "",
      departureTimeStart: "",
      departureTimeEnd: "",
      guestManifest: "",
      specialRequirements: "",
      notes: "",
    });
    setStep(1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.eventName && formData.eventType && formData.startDate && formData.location;
      case 2:
        return formData.coordinatorFirstName && formData.coordinatorLastName && formData.coordinatorPhone && formData.coordinatorEmail;
      case 3:
        return formData.estimatedGuests;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: "Event Info", icon: Calendar },
    { number: 2, title: "Coordinator", icon: User },
    { number: 3, title: "Details", icon: Users },
    { number: 4, title: "Review", icon: Check },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Create New Event
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <DialogDescription className="sr-only">
            Create a new event with event information, coordinator details, and logistics
          </DialogDescription>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    animate={{
                      backgroundColor: step >= s.number ? '#D4AF37' : '#1A1A1A',
                      borderColor: step >= s.number ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)',
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      step === s.number ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#1A1A1A]' : ''
                    }`}
                  >
                    <s.icon className={`w-6 h-6 ${step >= s.number ? 'text-black' : 'text-gray-500'}`} />
                  </motion.div>
                  <span className={`text-xs mt-2 ${step >= s.number ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-[#D4AF37]/20 mx-2 mb-6">
                    <motion.div
                      animate={{
                        width: step > s.number ? '100%' : '0%',
                      }}
                      className="h-full bg-[#D4AF37]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto py-6 px-1">
          <AnimatePresence mode="wait">
            {/* Step 1: Event Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="eventName" className="text-gray-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      Event Name *
                    </Label>
                    <Input
                      id="eventName"
                      value={formData.eventName}
                      onChange={(e) => handleInputChange('eventName', e.target.value)}
                      placeholder="e.g., Tech Conference 2026"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType" className="text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      Event Type *
                    </Label>
                    <select
                      id="eventType"
                      value={formData.eventType}
                      onChange={(e) => handleInputChange('eventType', e.target.value)}
                      className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-md px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="">Select event type...</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Start Time
                    </Label>
                    <TimeDropdown
                      value={formData.startTime}
                      onChange={(value) => handleInputChange('startTime', value)}
                      placeholder="Select start time"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      min={formData.startDate}
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      End Time
                    </Label>
                    <TimeDropdown
                      value={formData.endTime}
                      onChange={(value) => handleInputChange('endTime', value)}
                      placeholder="Select end time"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      Venue Name *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Marriott Convention Center"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address" className="text-gray-300 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                      Full Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address, city, state, zip"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Coordinator Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-300">
                    Primary coordinator who will be the main point of contact for this event.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="coordinatorFirstName" className="text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      First Name *
                    </Label>
                    <Input
                      id="coordinatorFirstName"
                      value={formData.coordinatorFirstName}
                      onChange={(e) => handleInputChange('coordinatorFirstName', e.target.value)}
                      placeholder="e.g., Sarah"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinatorLastName" className="text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      Last Name *
                    </Label>
                    <Input
                      id="coordinatorLastName"
                      value={formData.coordinatorLastName}
                      onChange={(e) => handleInputChange('coordinatorLastName', e.target.value)}
                      placeholder="e.g., Johnson"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinatorCompany" className="text-gray-300 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      Company/Organization
                    </Label>
                    <Input
                      id="coordinatorCompany"
                      value={formData.coordinatorCompany}
                      onChange={(e) => handleInputChange('coordinatorCompany', e.target.value)}
                      placeholder="e.g., Tech Corp Inc."
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinatorPhone" className="text-gray-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      Phone Number *
                    </Label>
                    <Input
                      id="coordinatorPhone"
                      type="tel"
                      value={formData.coordinatorPhone}
                      onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                      placeholder="(504) 555-0123"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coordinatorEmail" className="text-gray-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      Email Address *
                    </Label>
                    <Input
                      id="coordinatorEmail"
                      type="email"
                      value={formData.coordinatorEmail}
                      onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                      placeholder="coordinator@company.com"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Event Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-300 font-semibold mb-2">
                    Transportation Planning & Guest Details
                  </p>
                  <p className="text-xs text-gray-400">
                    Provide estimated numbers, arrival/departure windows, and guest information. For weddings, include ceremony times and venue locations. For corporate events, add flight details and hotel information. This helps us optimize driver assignments and vehicle allocations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedGuests" className="text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Estimated Total Guests *
                    </Label>
                    <Input
                      id="estimatedGuests"
                      type="number"
                      value={formData.estimatedGuests}
                      onChange={(e) => handleInputChange('estimatedGuests', e.target.value)}
                      placeholder="e.g., 250"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedArrivals" className="text-gray-300 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-green-400" />
                      Expected Arrivals
                    </Label>
                    <Input
                      id="expectedArrivals"
                      type="number"
                      value={formData.expectedArrivals}
                      onChange={(e) => handleInputChange('expectedArrivals', e.target.value)}
                      placeholder="e.g., 150"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                    <p className="text-xs text-gray-500">Number of guests needing pickup</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedDepartures" className="text-gray-300 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-purple-400" />
                      Expected Departures
                    </Label>
                    <Input
                      id="expectedDepartures"
                      type="number"
                      value={formData.expectedDepartures}
                      onChange={(e) => handleInputChange('expectedDepartures', e.target.value)}
                      placeholder="e.g., 140"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                    <p className="text-xs text-gray-500">Number of guests needing drop-off</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedShuttles" className="text-gray-300 flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-400" />
                      Expected Shuttle Runs
                    </Label>
                    <Input
                      id="expectedShuttles"
                      type="number"
                      value={formData.expectedShuttles}
                      onChange={(e) => handleInputChange('expectedShuttles', e.target.value)}
                      placeholder="e.g., 20"
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                    />
                    <p className="text-xs text-gray-500">Round trips between locations</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-black/50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-[#D4AF37] mb-2">Arrival & Departure Timeframes</p>
                      <p className="text-xs text-gray-400">Specify the window when guests will be arriving and departing</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalTimeStart" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Arrival Time Start
                    </Label>
                    <TimeDropdown
                      value={formData.arrivalTimeStart}
                      onChange={(value) => handleInputChange('arrivalTimeStart', value)}
                      placeholder="Select arrival time start"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalTimeEnd" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Arrival Time End
                    </Label>
                    <TimeDropdown
                      value={formData.arrivalTimeEnd}
                      onChange={(value) => handleInputChange('arrivalTimeEnd', value)}
                      placeholder="Select arrival time end"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureTimeStart" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Departure Time Start
                    </Label>
                    <TimeDropdown
                      value={formData.departureTimeStart}
                      onChange={(value) => handleInputChange('departureTimeStart', value)}
                      placeholder="Select departure time start"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureTimeEnd" className="text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Departure Time End
                    </Label>
                    <TimeDropdown
                      value={formData.departureTimeEnd}
                      onChange={(value) => handleInputChange('departureTimeEnd', value)}
                      placeholder="Select departure time end"
                      required={false}
                      showLabel={false}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="guestManifest" className="text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Guest Manifest & Itinerary
                    </Label>
                    <Textarea
                      id="guestManifest"
                      value={formData.guestManifest}
                      onChange={(e) => handleInputChange('guestManifest', e.target.value)}
                      placeholder="List guest names, flight information, hotel details, and contact numbers.&#10;&#10;Example:&#10;• John Smith - Delta Flight 1234 arriving 3:30 PM - Marriott Hotel - (504) 555-1234&#10;• Sarah Johnson - United Flight 5678 arriving 5:00 PM - Ritz Carlton - (504) 555-5678"
                      rows={5}
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37] resize-none"
                    />
                    <p className="text-xs text-gray-500">Include guest names, flight numbers, arrival times, hotel locations, and contact info</p>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="specialRequirements" className="text-gray-300 flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#D4AF37]" />
                      Special Requirements
                    </Label>
                    <Textarea
                      id="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      placeholder="E.g., Wheelchair accessible vehicles, VIP services, child car seats, specific vehicle types (luxury sedans, SUVs, sprinters), champagne service, red carpet treatment..."
                      rows={3}
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37] resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes" className="text-gray-300">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any other important information...&#10;&#10;For Weddings: Ceremony time, reception location, bridal party needs&#10;For Corporate: Meeting times, VIP attendees, dress code&#10;For Funerals: Service time, processional route, family vehicle needs"
                      rows={4}
                      className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Review your event details before creating. You can edit these later.
                  </p>
                </div>

                {/* Event Info Summary */}
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    Event Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Event Name</p>
                      <p className="text-white font-semibold">{formData.eventName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Event Type</p>
                      <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30">
                        {formData.eventType || "—"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="text-white font-semibold">
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">End Date</p>
                      <p className="text-white font-semibold">
                        {formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : "Same day"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white font-semibold">{formData.location || "—"}</p>
                      {formData.address && (
                        <p className="text-sm text-gray-500">{formData.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Coordinator Summary */}
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#D4AF37]" />
                    Coordinator
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="text-white font-semibold">{formData.coordinatorFirstName + " " + formData.coordinatorLastName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Company</p>
                      <p className="text-white font-semibold">{formData.coordinatorCompany || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white font-semibold">{formData.coordinatorPhone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-semibold">{formData.coordinatorEmail || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Event Details Summary */}
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    Event Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Estimated Guests</p>
                      <p className="text-white font-semibold text-2xl">{formData.estimatedGuests || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected Arrivals</p>
                      <p className="text-white font-semibold text-2xl">{formData.expectedArrivals || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected Departures</p>
                      <p className="text-white font-semibold text-2xl">{formData.expectedDepartures || "0"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expected Shuttles</p>
                      <p className="text-white font-semibold text-2xl">{formData.expectedShuttles || "0"}</p>
                    </div>
                    {formData.specialRequirements && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-400">Special Requirements</p>
                        <p className="text-white">{formData.specialRequirements}</p>
                      </div>
                    )}
                    {formData.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-400">Notes</p>
                        <p className="text-white">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20">
          <div className="text-sm text-gray-400">
            Step {step} of {steps.length}
          </div>
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-[#D4AF37]/30 text-gray-400 hover:bg-black"
              >
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
              >
                <Check className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}