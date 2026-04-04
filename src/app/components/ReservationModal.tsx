import { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Users, Luggage, Car, User, Mail, Phone, Building, Plus, Trash2, GripVertical, Flag } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'motion/react';
import { TimeDropdown } from './TimeDropdown';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: string;
}

interface VehicleQuantity {
  blackSuv: number;
  sprinter14: number;
  coach25: number;
  coach28: number;
  coach55: number;
}

interface AdditionalStop {
  id: string;
  address: string;
  pickupTime?: string;
}

interface BookingForm {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  eventName: string;
  travelDate: string;
  pickupTime: string;
  pickupAddress: string;
  additionalStops: AdditionalStop[];
  dropoffAddress: string;
  endTripTime: string;
  passengers: string;
  luggage: string;
  tripType: string;
  hours: string;
  flightNumber: string;
  vehicles: VehicleQuantity;
  specialRequest: string;
}

// Draggable Stop Component
interface DraggableStopProps {
  index: number;
  stop: AdditionalStop;
  totalStops: number;
  onUpdate: (updates: Partial<AdditionalStop>) => void;
  onRemove: () => void;
  moveStop: (dragIndex: number, hoverIndex: number) => void;
}

const ITEM_TYPE = 'STOP';

function DraggableStop({ index, stop, totalStops, onUpdate, onRemove, moveStop }: DraggableStopProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveStop(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  preview(drop(ref));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: opacity, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      style={{ opacity }}
      className="bg-black/40 border border-white/20 rounded-md p-3 mb-3"
      data-handler-id={handlerId}
    >
      <div className="flex items-start gap-2">
        <div
          ref={drag}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#D4AF37] transition-colors mt-2"
        >
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
            <input
              type="text"
              value={stop.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              placeholder={`Stop ${index + 1} address`}
              className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 pr-12 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
            />
          </div>
          
          {/* Pickup Time at this stop - always shown */}
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-white text-xs font-medium mb-2">
              Pickup Time at this stop
            </label>
            <TimeDropdown
              value={stop.pickupTime || ''}
              onChange={(value) => onUpdate({ pickupTime: value })}
              placeholder="Select pickup time"
              required={false}
              showLabel={false}
            />
          </motion.div>
        </div>
        
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove stop"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

export function ReservationModal({ isOpen, onClose, initialServiceType = '' }: ReservationModalProps) {
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    eventName: '',
    travelDate: '',
    pickupTime: '',
    pickupAddress: '',
    additionalStops: [],
    dropoffAddress: '',
    endTripTime: '',
    passengers: '',
    luggage: '',
    tripType: initialServiceType || '',
    hours: '',
    flightNumber: '',
    vehicles: {
      blackSuv: 0,
      sprinter14: 0,
      coach25: 0,
      coach28: 0,
      coach55: 0
    },
    specialRequest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHoursField, setShowHoursField] = useState(false);
  const [prevDropoffValue, setPrevDropoffValue] = useState('');
  const [endTimeError, setEndTimeError] = useState('');
  const [hoursWarning, setHoursWarning] = useState('');
  const [isRecommendedSelection, setIsRecommendedSelection] = useState(true);
  const [capacityWarning, setCapacityWarning] = useState('');

  useEffect(() => {
    if (initialServiceType) {
      setBookingForm(prev => ({ ...prev, tripType: initialServiceType }));
    }
  }, [initialServiceType]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle hours field animation when trip type changes
  useEffect(() => {
    if (bookingForm.tripType === 'hourly') {
      setTimeout(() => setShowHoursField(true), 100);
    } else {
      setShowHoursField(false);
    }
  }, [bookingForm.tripType]);

  // Auto-calculate hours from pickup time and end trip time
  useEffect(() => {
    if (bookingForm.pickupTime && bookingForm.endTripTime) {
      // Parse times (format: "HH:MM AM/PM")
      const parseTime = (timeStr: string): Date => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const pickupDate = parseTime(bookingForm.pickupTime);
      const endDate = parseTime(bookingForm.endTripTime);

      // Validate end time is after pickup time
      if (endDate <= pickupDate) {
        setEndTimeError('End time must be after your pickup time.');
        setBookingForm(prev => ({ ...prev, hours: '' }));
        setHoursWarning('');
        return;
      } else {
        setEndTimeError('');
      }

      // Calculate difference in hours (rounded to nearest 0.25)
      const diffMs = endDate.getTime() - pickupDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const roundedHours = Math.ceil(diffHours * 4) / 4; // Round up to nearest 0.25

      // Update hours field
      setBookingForm(prev => ({ ...prev, hours: roundedHours.toString() }));

      // Show warning if less than 4 hours
      if (roundedHours < 4) {
        setHoursWarning('Minimum booking is 4 hours.');
      } else {
        setHoursWarning('');
      }
    } else {
      setEndTimeError('');
      setHoursWarning('');
    }
  }, [bookingForm.pickupTime, bookingForm.endTripTime]);

  // Auto-select vehicles based on passenger count
  useEffect(() => {
    const passengers = parseInt(bookingForm.passengers) || 0;
    if (passengers === 0) return;

    // Calculate optimal vehicle combination
    const calculateVehicles = (passengerCount: number): VehicleQuantity => {
      const vehicles: VehicleQuantity = {
        blackSuv: 0,
        sprinter14: 0,
        coach25: 0,
        coach28: 0,
        coach55: 0
      };

      if (passengerCount <= 0) return vehicles;

      // 1–6 passengers → 1 Black SUV
      if (passengerCount <= 6) {
        vehicles.blackSuv = 1;
      }
      // 7–12 passengers → 2 Black SUVs
      else if (passengerCount <= 12) {
        vehicles.blackSuv = 2;
      }
      // 13–20 passengers → 1 Black SUV + 1 14-Passenger Sprinter
      else if (passengerCount <= 20) {
        vehicles.blackSuv = 1;
        vehicles.sprinter14 = 1;
      }
      // 21–26 passengers → 2 Black SUVs + 1 14-Passenger Sprinter
      else if (passengerCount <= 26) {
        vehicles.blackSuv = 2;
        vehicles.sprinter14 = 1;
      }
      // 27–34 passengers → 1 Black SUV + 1 28-Passenger Bus
      else if (passengerCount <= 34) {
        vehicles.blackSuv = 1;
        vehicles.coach28 = 1;
      }
      // 35–40 passengers → 2 Black SUVs + 1 28-Passenger Bus
      else if (passengerCount <= 40) {
        vehicles.blackSuv = 2;
        vehicles.coach28 = 1;
      }
      // 41–55 passengers → 1 Black SUV + 1 55-Passenger Coach
      else if (passengerCount <= 55) {
        vehicles.blackSuv = 1;
        vehicles.coach55 = 1;
      }
      // 56–61 passengers → 2 Black SUVs + 1 55-Passenger Coach
      else if (passengerCount <= 61) {
        vehicles.blackSuv = 2;
        vehicles.coach55 = 1;
      }
      // 62+ passengers → calculate most efficient combination
      else {
        vehicles.blackSuv = 1; // Always start with 1 Black SUV
        let remaining = passengerCount - 6;
        
        // Fill with 55-passenger coaches first (most efficient for large groups)
        while (remaining > 28) {
          vehicles.coach55++;
          remaining -= 55;
        }
        
        // Fill remaining with 28-passenger buses if needed
        if (remaining > 14) {
          vehicles.coach28++;
          remaining -= 28;
        }
        
        // Fill remaining with sprinters or SUVs
        if (remaining > 6) {
          vehicles.sprinter14++;
        } else if (remaining > 0) {
          vehicles.blackSuv++;
        }
      }

      return vehicles;
    };

    const recommendedVehicles = calculateVehicles(passengers);
    setBookingForm(prev => ({ ...prev, vehicles: recommendedVehicles }));
    setIsRecommendedSelection(true);
    setCapacityWarning('');
  }, [bookingForm.passengers]);

  // Check capacity warning when vehicles change manually
  useEffect(() => {
    const passengers = parseInt(bookingForm.passengers) || 0;
    const totalCapacity = getTotalCapacity();
    
    if (passengers > 0 && totalCapacity < passengers) {
      setCapacityWarning(`Your current vehicle selection may not accommodate all ${passengers} passengers.`);
    } else {
      setCapacityWarning('');
    }
  }, [bookingForm.vehicles, bookingForm.passengers]);

  // Internal pricing constants
  const vehicleRates = {
    blackSuv: { hourly: 140, oneWay: 140, label: 'Black SUV', capacity: 6 },
    sprinter14: { hourly: 160, oneWay: 240, label: '14 Passenger Sprinter', capacity: 14 },
    coach25: { hourly: 210, oneWay: 395, label: '25 Passenger Bus', capacity: 25 },
    coach28: { hourly: 240, oneWay: 425, label: '28 Passenger Bus', capacity: 28 },
    coach55: { hourly: 255, oneWay: 600, label: '55 Passenger Bus', capacity: 55 }
  };

  // Helper functions - must be defined before calculateProgress
  const getTotalVehicles = (): number => {
    const vehicles = bookingForm.vehicles;
    return vehicles.blackSuv + vehicles.sprinter14 + vehicles.coach25 + vehicles.coach28 + vehicles.coach55;
  };

  const getTotalCapacity = (): number => {
    const vehicles = bookingForm.vehicles;
    return (
      vehicles.blackSuv * vehicleRates.blackSuv.capacity +
      vehicles.sprinter14 * vehicleRates.sprinter14.capacity +
      vehicles.coach25 * vehicleRates.coach25.capacity +
      vehicles.coach28 * vehicleRates.coach28.capacity +
      vehicles.coach55 * vehicleRates.coach55.capacity
    );
  };

  // Calculate form completion progress
  const calculateProgress = (): number => {
    const requiredFields = [
      bookingForm.firstName,
      bookingForm.lastName,
      bookingForm.email,
      bookingForm.phone,
      bookingForm.eventName,
      bookingForm.travelDate,
      bookingForm.pickupTime,
      bookingForm.pickupAddress,
      bookingForm.dropoffAddress,
      bookingForm.passengers,
      bookingForm.tripType,
      getTotalVehicles() > 0 ? 'vehicles' : '',
    ];

    if (bookingForm.tripType === 'hourly') {
      requiredFields.push(bookingForm.hours);
    }

    const filledFields = requiredFields.filter(field => field && field.toString().trim() !== '').length;
    return (filledFields / requiredFields.length) * 100;
  };

  const progress = calculateProgress();
  const isFormComplete = progress === 100;

  const calculateEstimate = (): number => {
    if (!bookingForm.tripType) return 0;

    let total = 0;
    const vehicles = bookingForm.vehicles;

    if (bookingForm.tripType === 'hourly') {
      const hours = parseInt(bookingForm.hours) || 0;
      const billableHours = Math.max(hours, 4);

      total += vehicles.blackSuv * vehicleRates.blackSuv.hourly * billableHours;
      total += vehicles.sprinter14 * vehicleRates.sprinter14.hourly * billableHours;
      total += vehicles.coach25 * vehicleRates.coach25.hourly * billableHours;
      total += vehicles.coach28 * vehicleRates.coach28.hourly * billableHours;
      total += vehicles.coach55 * vehicleRates.coach55.hourly * billableHours;
    } else if (bookingForm.tripType === 'one-way' || bookingForm.tripType === 'airport') {
      total += vehicles.blackSuv * vehicleRates.blackSuv.oneWay;
      total += vehicles.sprinter14 * vehicleRates.sprinter14.oneWay;
      total += vehicles.coach25 * vehicleRates.coach25.oneWay;
      total += vehicles.coach28 * vehicleRates.coach28.oneWay;
      total += vehicles.coach55 * vehicleRates.coach55.oneWay;
    }

    return total;
  };

  const handleBookingFormChange = (field: keyof BookingForm, value: string) => {
    if (field === 'dropoffAddress') {
      setPrevDropoffValue(bookingForm.dropoffAddress);
    }
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleQuantityChange = (vehicleKey: keyof VehicleQuantity, delta: number) => {
    setIsRecommendedSelection(false); // Mark as custom selection
    setBookingForm(prev => ({
      ...prev,
      vehicles: { 
        ...prev.vehicles, 
        [vehicleKey]: Math.max(0, prev.vehicles[vehicleKey] + delta) 
      }
    }));
  };

  const validateBookingForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!bookingForm.firstName.trim()) {
      alert('Please enter your first name.');
      return false;
    }
    if (!bookingForm.lastName.trim()) {
      alert('Please enter your last name.');
      return false;
    }
    if (!bookingForm.email.trim() || !emailRegex.test(bookingForm.email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (!bookingForm.phone.trim()) {
      alert('Please enter your phone number.');
      return false;
    }
    if (!bookingForm.travelDate) {
      alert('Please select a travel date.');
      return false;
    }
    if (!bookingForm.pickupTime) {
      alert('Please select a pickup time.');
      return false;
    }
    if (!bookingForm.pickupAddress.trim()) {
      alert('Please enter a pickup address.');
      return false;
    }
    if (!bookingForm.dropoffAddress.trim()) {
      alert('Please enter a drop-off address.');
      return false;
    }
    if (!bookingForm.passengers || parseInt(bookingForm.passengers) < 1) {
      alert('Please enter the number of passengers.');
      return false;
    }
    if (!bookingForm.tripType) {
      alert('Please select a trip type.');
      return false;
    }
    if (bookingForm.tripType === 'hourly' && endTimeError) {
      alert('Please correct the end trip time. End time must be after your pickup time.');
      return false;
    }
    if (bookingForm.tripType === 'hourly' && (!bookingForm.hours || parseInt(bookingForm.hours) < 4)) {
      alert('Hourly service requires a minimum of 4 hours.');
      return false;
    }

    if (getTotalVehicles() === 0) {
      alert('Please select at least one vehicle.');
      return false;
    }

    const passengers = parseInt(bookingForm.passengers);
    const totalCapacity = getTotalCapacity();
    if (totalCapacity < passengers) {
      alert('Based on your group size, you need more or larger vehicles. Please increase your vehicle quantities or choose larger vehicles.');
      return false;
    }

    if ((bookingForm.tripType === 'one-way' || bookingForm.tripType === 'airport') && bookingForm.vehicles.blackSuv > 0) {
      const luggage = parseInt(bookingForm.luggage) || 0;
      if (passengers >= 5 || luggage >= 6) {
        alert('Because of the passenger and luggage count, you must choose a larger vehicle.');
        return false;
      }
    }

    return true;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBookingForm()) {
      return;
    }

    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    const estimate = calculateEstimate();
    setIsSubmitting(true);

    try {
      const vehicleList = [];
      if (bookingForm.vehicles.blackSuv > 0) vehicleList.push(`${bookingForm.vehicles.blackSuv} × Black SUV`);
      if (bookingForm.vehicles.sprinter14 > 0) vehicleList.push(`${bookingForm.vehicles.sprinter14} × 14 Passenger Sprinter`);
      if (bookingForm.vehicles.coach25 > 0) vehicleList.push(`${bookingForm.vehicles.coach25} × 25 Passenger Bus`);
      if (bookingForm.vehicles.coach28 > 0) vehicleList.push(`${bookingForm.vehicles.coach28} × 28 Passenger Bus`);
      if (bookingForm.vehicles.coach55 > 0) vehicleList.push(`${bookingForm.vehicles.coach55} × 55 Passenger Coach`);

      const gratuity = estimate * 0.20;
      const totalWithGratuity = estimate + gratuity;

      let journeyItinerary = '';
      if (bookingForm.additionalStops.length > 0) {
        journeyItinerary = '\n\n--- JOURNEY ITINERARY ---\n';
        journeyItinerary += `1. Pickup at ${bookingForm.pickupTime} - ${bookingForm.pickupAddress}\n`;
        
        bookingForm.additionalStops.forEach((stop, index) => {
          journeyItinerary += `   Drop-off: ${stop.address}\n`;
          if (stop.pickupTime) {
            journeyItinerary += `${index + 2}. Pickup at ${stop.pickupTime} - ${stop.address}\n`;
          }
        });
        
        journeyItinerary += `   Final Drop-off: ${bookingForm.dropoffAddress}`;
      }

      const emailBody = `
New Globa7 Booking Request

--- RIDER INFO ---
First Name: ${bookingForm.firstName}
Last Name: ${bookingForm.lastName}
Company Name: ${bookingForm.companyName || 'N/A'}
Email: ${bookingForm.email}
Phone: ${bookingForm.phone}

--- TRIP DETAILS ---
Event Name: ${bookingForm.eventName || 'N/A'}
Travel Date: ${bookingForm.travelDate}
Pickup Time: ${bookingForm.pickupTime}
Pickup Address: ${bookingForm.pickupAddress}
${bookingForm.additionalStops.length > 0 ? `Additional Stops: ${bookingForm.additionalStops.length}` : ''}
Drop-Off Address: ${bookingForm.dropoffAddress}
${bookingForm.flightNumber ? `Flight Number: ${bookingForm.flightNumber}` : ''}
${bookingForm.endTripTime ? `End Trip Time: ${bookingForm.endTripTime}` : ''}
Number of Passengers: ${bookingForm.passengers}
${bookingForm.luggage ? `Luggage Pieces: ${bookingForm.luggage}` : ''}${journeyItinerary}

--- SERVICE & VEHICLE ---
Trip Type: ${getTripTypeLabel(bookingForm.tripType)}
${bookingForm.tripType === 'hourly' ? `Number of Hours: ${bookingForm.hours}` : ''}
Vehicles: ${vehicleList.join(', ')}

--- SPECIAL REQUESTS ---
${bookingForm.specialRequest || 'None'}

--- PRICING ---
Base Fare: $${estimate.toFixed(2)}
Gratuity (20%): $${gratuity.toFixed(2)}
Total: $${totalWithGratuity.toFixed(2)}
      `.trim();

      // Send via Web3Forms API
      const formData = new FormData();
      formData.append('access_key', '48234969-164c-40a4-9f05-63ae4a207351');
      formData.append('subject', `New Globa7 Booking Request – ${bookingForm.firstName} ${bookingForm.lastName}`);
      formData.append('from_name', `${bookingForm.firstName} ${bookingForm.lastName}`);
      formData.append('email', bookingForm.email);
      formData.append('message', emailBody);
      formData.append('to', 'booking@globa7.com');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send booking request');
      }

      // Reset form after successful submission
      setBookingForm({
        firstName: '',
        lastName: '',
        companyName: '',
        email: '',
        phone: '',
        eventName: '',
        travelDate: '',
        pickupTime: '',
        pickupAddress: '',
        additionalStops: [],
        dropoffAddress: '',
        endTripTime: '',
        passengers: '',
        luggage: '',
        tripType: '',
        hours: '',
        flightNumber: '',
        vehicles: {
          blackSuv: 0,
          sprinter14: 0,
          coach25: 0,
          coach28: 0,
          coach55: 0
        },
        specialRequest: ''
      });

      setTimeout(() => {
        setShowPreview(false);
        onClose();
        alert('Your booking request has been sent to booking@globa7.com! We\'ll contact you shortly.');
      }, 500);

    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while sending your booking request. Please try again or contact booking@globa7.com directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTripTypeLabel = (tripType: string): string => {
    const labels: { [key: string]: string } = {
      'airport': 'Airport Transfer',
      'hourly': 'Hourly Service',
      'wedding': 'Wedding / Event',
      'tour': 'Private City Tour',
      'corporate': 'Corporate',
      'gameday': 'Festival / Game Day'
    };
    return labels[tripType] || tripType;
  };

  const getVehicleList = (): { label: string; quantity: number }[] => {
    const vehicles = [];
    if (bookingForm.vehicles.blackSuv > 0) vehicles.push({ label: 'Black SUV', quantity: bookingForm.vehicles.blackSuv });
    if (bookingForm.vehicles.sprinter14 > 0) vehicles.push({ label: '14 Passenger Sprinter', quantity: bookingForm.vehicles.sprinter14 });
    if (bookingForm.vehicles.coach25 > 0) vehicles.push({ label: '25 Passenger Bus', quantity: bookingForm.vehicles.coach25 });
    if (bookingForm.vehicles.coach28 > 0) vehicles.push({ label: '28 Passenger Bus', quantity: bookingForm.vehicles.coach28 });
    if (bookingForm.vehicles.coach55 > 0) vehicles.push({ label: '55 Passenger Coach', quantity: bookingForm.vehicles.coach55 });
    return vehicles;
  };

  const addStop = () => {
    const newStop: AdditionalStop = {
      id: `stop-${Date.now()}-${Math.random()}`,
      address: '',
      pickupTime: ''
    };
    setBookingForm(prev => ({
      ...prev,
      additionalStops: [...prev.additionalStops, newStop]
    }));
  };

  const removeStop = (index: number) => {
    setBookingForm(prev => ({
      ...prev,
      additionalStops: prev.additionalStops.filter((_, i) => i !== index)
    }));
  };

  const updateStop = (index: number, updates: Partial<AdditionalStop>) => {
    setBookingForm(prev => ({
      ...prev,
      additionalStops: prev.additionalStops.map((stop, i) => 
        i === index ? { ...stop, ...updates } : stop
      )
    }));
  };

  const moveStop = (dragIndex: number, hoverIndex: number) => {
    setBookingForm(prev => {
      const stops = [...prev.additionalStops];
      const draggedStop = stops[dragIndex];
      stops.splice(dragIndex, 1);
      stops.splice(hoverIndex, 0, draggedStop);
      return { ...prev, additionalStops: stops };
    });
  };

  if (!isOpen) return null;

  const baseFare = calculateEstimate();
  const gratuity = baseFare * 0.20;
  const totalWithGratuity = baseFare + gratuity;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
          <div className="bg-[#1A1A1A] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#D4AF37]/40 shadow-2xl relative z-10">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 p-6">
              <h2 className="text-3xl font-bold text-black text-center" style={{ fontFamily: 'var(--font-serif)' }}>
                Review Your Booking
              </h2>
              <p className="text-center text-black/80 mt-2 font-medium">Please confirm your details before submitting</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-white font-medium">{bookingForm.firstName} {bookingForm.lastName}</p>
                  </div>
                  {bookingForm.companyName && (
                    <div>
                      <p className="text-gray-400">Company</p>
                      <p className="text-white font-medium">{bookingForm.companyName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white font-medium">{bookingForm.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-medium">{bookingForm.phone}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                  Trip Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Event Name</p>
                    <p className="text-white font-medium">{bookingForm.eventName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="text-white font-medium">{new Date(bookingForm.travelDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Pickup Time</p>
                      <p className="text-white font-medium">{bookingForm.pickupTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400">Pickup Location</p>
                    <p className="text-white font-medium">{bookingForm.pickupAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Drop-off Location</p>
                    <p className="text-white font-medium">{bookingForm.dropoffAddress}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400">Passengers</p>
                      <p className="text-white font-medium">{bookingForm.passengers}</p>
                    </div>
                    {bookingForm.luggage && (
                      <div>
                        <p className="text-gray-400">Luggage</p>
                        <p className="text-white font-medium">{bookingForm.luggage} pieces</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Service & Vehicles */}
              <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                  Service & Vehicles
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-400">Trip Type</p>
                    <p className="text-white font-medium">{getTripTypeLabel(bookingForm.tripType)}</p>
                  </div>
                  {bookingForm.tripType === 'hourly' && (
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="text-white font-medium">{bookingForm.hours} hours</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 mb-2">Selected Vehicles</p>
                    <div className="space-y-1">
                      {getVehicleList().map((vehicle, index) => (
                        <p key={index} className="text-white font-medium flex justify-between">
                          <span>{vehicle.label}</span>
                          <span className="text-[#D4AF37]">× {vehicle.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                  {bookingForm.specialRequest && (
                    <div>
                      <p className="text-gray-400">Special Requests</p>
                      <p className="text-white font-medium">{bookingForm.specialRequest}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                  <p className="text-gray-400 text-xs text-center">
                    By submitting this booking, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-[#D4AF37] hover:text-yellow-500 underline transition-colors"
                    >
                      Terms & Conditions
                    </button>
                  </p>
                </div>
              </div>

              {/* Service Details & Policies */}
              <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                  Service Details & Policies
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white">
                      <span className="font-semibold text-[#D4AF37]">Payment:</span> We accept all major credit cards
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white">
                      <span className="font-semibold text-[#D4AF37]">Included:</span> Professional chauffeur and ice cold water
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white">
                      <span className="font-semibold text-[#D4AF37]">Additional Items:</span> Additional drinks or items available upon request
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white">
                      <span className="font-semibold text-red-400">Cancellation Policy:</span> 24-hour non-refundable cancellation policy applies
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white">
                      <span className="font-semibold text-red-400">Pre-Payment:</span> Services over a certain amount must be prepaid
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="flex-1 bg-black/60 hover:bg-black/80 text-white font-semibold py-3 rounded-lg border border-[#D4AF37]/30 transition-all"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Booking Modal */}
      {!showPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1A1A1A] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#D4AF37]/30 shadow-2xl relative z-10"
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 rounded-t-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-600"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Header */}
            <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#D4AF37]/20 p-6 flex justify-between items-center z-10 mt-1">
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                Book Your Ride
              </h2>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

        <form onSubmit={handleBookingSubmit} className="p-6 space-y-8">
          {/* Luxury Transportation Ride Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              Luxury Transportation Ride Info
            </h3>

            {/* First Name & Last Name */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2">
                  First Name <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={bookingForm.firstName}
                    onChange={(e) => handleBookingFormChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2">
                  Last Name <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={bookingForm.lastName}
                    onChange={(e) => handleBookingFormChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Company Name */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mb-4 relative group"
            >
              <label className="block text-white text-sm font-medium mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={bookingForm.companyName}
                  onChange={(e) => handleBookingFormChange('companyName', e.target.value)}
                  placeholder="Enter your company name (optional)"
                  className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                />
              </div>
            </motion.div>

            {/* Email & Phone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => handleBookingFormChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number <span className="text-[#D4AF37]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => handleBookingFormChange('phone', e.target.value)}
                    placeholder="Best number to reach you"
                    className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 pl-10 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Trip Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              Trip Details
            </h3>

            {/* Event Name */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-4 relative group"
            >
              <label className="block text-white text-sm font-medium mb-2">
                Event Name <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                value={bookingForm.eventName}
                onChange={(e) => handleBookingFormChange('eventName', e.target.value)}
                placeholder="Happy Hour Wine Down"
                className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
              />
            </motion.div>

            {/* Travel Date & Pickup Time */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  Travel Date <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={bookingForm.travelDate}
                  onChange={(e) => handleBookingFormChange('travelDate', e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                />
              </div>

              <div>
                <TimeDropdown
                  value={bookingForm.pickupTime}
                  onChange={(value) => handleBookingFormChange('pickupTime', value)}
                  placeholder="Select pickup time"
                  required={true}
                  label="Pickup Time"
                  showLabel={true}
                />
              </div>
            </motion.div>

            {/* Pickup Address */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-4 relative group"
            >
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                Pickup Address <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                value={bookingForm.pickupAddress}
                onChange={(e) => handleBookingFormChange('pickupAddress', e.target.value)}
                placeholder="Start typing your pickup address"
                className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
              />
            </motion.div>

            {/* Additional Stops */}
            <DndProvider backend={HTML5Backend}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mb-4"
              >
                {bookingForm.additionalStops.length > 0 && (
                  <label className="block text-white text-sm font-medium mb-3">
                    Additional Stops
                  </label>
                )}
                
                <AnimatePresence>
                  {bookingForm.additionalStops.map((stop, index) => (
                    <DraggableStop
                      key={stop.id}
                      index={index}
                      stop={stop}
                      totalStops={bookingForm.additionalStops.length}
                      onUpdate={(updates) => updateStop(index, updates)}
                      onRemove={() => removeStop(index)}
                      moveStop={moveStop}
                    />
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={addStop}
                  className="flex items-center gap-2 text-[#D4AF37] hover:text-yellow-500 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Stop
                </button>
                {bookingForm.additionalStops.length > 0 && (
                  <p className="text-gray-400 text-xs mt-2">
                    Drag and drop to reorder stops
                  </p>
                )}
              </motion.div>
            </DndProvider>

            {/* Drop-Off Address with End Trip Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mb-4 relative group"
            >
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                Drop-Off Address <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                required
                value={bookingForm.dropoffAddress}
                onChange={(e) => handleBookingFormChange('dropoffAddress', e.target.value)}
                placeholder="Where would you like to be dropped off?"
                className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
              />
            </motion.div>

            {/* Flight Number - Show only for Airport Transfer */}
            <AnimatePresence>
              {bookingForm.tripType === 'airport' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden relative"
                >
                  <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Flight Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={bookingForm.flightNumber}
                    onChange={(e) => handleBookingFormChange('flightNumber', e.target.value)}
                    placeholder="e.g., AA 1234 or Delta 567"
                    className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    We'll monitor your flight for any delays or early arrivals
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* End Trip Time - Hide for Airport Transfer */}
            <AnimatePresence>
              {bookingForm.tripType !== 'airport' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden relative"
                >
                  <label className="block text-white text-sm font-medium mb-2">
                    End Trip Time
                  </label>
                  <TimeDropdown
                    value={bookingForm.endTripTime}
                    onChange={(value) => handleBookingFormChange('endTripTime', value)}
                    placeholder="Select end time"
                    required={false}
                    showLabel={false}
                  />
                  {endTimeError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#D4AF37] text-xs mt-2"
                    >
                      {endTimeError}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Number of Passengers & Luggage */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  Number of Passengers <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={bookingForm.passengers}
                  onChange={(e) => handleBookingFormChange('passengers', e.target.value)}
                  placeholder="How many passengers?"
                  className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                />
              </div>

              <div className="relative group">
                <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                  <Luggage className="w-4 h-4 text-gray-400" />
                  Luggage Pieces
                </label>
                <input
                  type="number"
                  min="0"
                  value={bookingForm.luggage}
                  onChange={(e) => handleBookingFormChange('luggage', e.target.value)}
                  placeholder="Number of luggage pieces"
                  className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Service & Vehicle Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              Service & Vehicle
            </h3>

            {/* Trip Type */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              className="mb-4 relative group"
            >
              <label className="block text-white text-sm font-medium mb-2">
                Trip Type <span className="text-[#D4AF37]">*</span>
              </label>
              <select
                required
                value={bookingForm.tripType}
                onChange={(e) => handleBookingFormChange('tripType', e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)]"
              >
                <option value="">Select trip type</option>
                <option value="airport">Airport Transfer</option>
                <option value="hourly">Hourly Service</option>
                <option value="wedding">Wedding / Event</option>
                <option value="tour">Private City Tour</option>
                <option value="corporate">Corporate</option>
                <option value="gameday">Festival / Game Day</option>
              </select>
              <p className="text-gray-400 text-xs mt-1">
                Choose the service type that best fits your transportation needs.
              </p>
            </motion.div>

            {/* Hours (conditional with slide-down animation) */}
            <AnimatePresence>
              {bookingForm.tripType === 'hourly' && showHoursField && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden relative group"
                >
                  <label className="block text-white text-sm font-medium mb-2">
                    Number of Hours <span className="text-[#D4AF37]">*</span> (4 hour minimum)
                  </label>
                  <input
                    type="number"
                    required
                    min="4"
                    value={bookingForm.hours}
                    readOnly
                    placeholder="Auto-calculated from times"
                    className="w-full bg-black/40 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 cursor-not-allowed opacity-70"
                  />
                  {hoursWarning && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#D4AF37] text-xs mt-2"
                    >
                      {hoursWarning}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vehicle Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mb-4"
            >
              <label className="block text-white text-sm font-medium mb-3 flex items-center gap-2">
                <Car className="w-4 h-4 text-[#D4AF37]" />
                Vehicle Selection <span className="text-[#D4AF37]">*</span>
              </label>
              
              {/* Recommendation Banner */}
              <AnimatePresence>
                {parseInt(bookingForm.passengers) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-3 px-4 py-2 rounded-md border ${
                      isRecommendedSelection 
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]' 
                        : 'bg-[#D4AF37]/5 border-[#D4AF37]/20 text-[#D4AF37]/60'
                    } text-sm`}
                  >
                    {isRecommendedSelection 
                      ? `✨ Recommended for ${bookingForm.passengers} passenger${parseInt(bookingForm.passengers) !== 1 ? 's' : ''}`
                      : '🔧 Custom Selection'
                    }
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-4 space-y-3">
                {/* Black SUV */}
                <motion.div 
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
                    bookingForm.vehicles.blackSuv > 0 
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]' 
                      : ''
                  }`}
                  animate={bookingForm.vehicles.blackSuv > 0 && isRecommendedSelection ? {
                    boxShadow: [
                      '0 0 20px rgba(212,175,55,0.4)',
                      '0 0 35px rgba(212,175,55,0.6)',
                      '0 0 20px rgba(212,175,55,0.4)',
                    ]
                  } : bookingForm.vehicles.blackSuv > 0 ? {
                    boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                  } : {}}
                  transition={{ duration: 1.5, repeat: bookingForm.vehicles.blackSuv > 0 && isRecommendedSelection ? Infinity : 0 }}
                >
                  <div>
                    <p className="text-white font-medium">Black SUV</p>
                    <p className="text-gray-400 text-xs">Up to 6 passengers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('blackSuv', -1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-mono text-lg min-w-[2rem] text-center">
                      {bookingForm.vehicles.blackSuv}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('blackSuv', 1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* 14 Passenger Sprinter */}
                <motion.div 
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
                    bookingForm.vehicles.sprinter14 > 0 
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]' 
                      : ''
                  }`}
                  animate={bookingForm.vehicles.sprinter14 > 0 && isRecommendedSelection ? {
                    boxShadow: [
                      '0 0 20px rgba(212,175,55,0.4)',
                      '0 0 35px rgba(212,175,55,0.6)',
                      '0 0 20px rgba(212,175,55,0.4)',
                    ]
                  } : bookingForm.vehicles.sprinter14 > 0 ? {
                    boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                  } : {}}
                  transition={{ duration: 1.5, repeat: bookingForm.vehicles.sprinter14 > 0 && isRecommendedSelection ? Infinity : 0 }}
                >
                  <div>
                    <p className="text-white font-medium">14 Passenger Sprinter</p>
                    <p className="text-gray-400 text-xs">Up to 14 passengers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('sprinter14', -1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-mono text-lg min-w-[2rem] text-center">
                      {bookingForm.vehicles.sprinter14}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('sprinter14', 1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* 25 Passenger Bus */}
                <motion.div 
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
                    bookingForm.vehicles.coach25 > 0 
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]' 
                      : ''
                  }`}
                  animate={bookingForm.vehicles.coach25 > 0 && isRecommendedSelection ? {
                    boxShadow: [
                      '0 0 20px rgba(212,175,55,0.4)',
                      '0 0 35px rgba(212,175,55,0.6)',
                      '0 0 20px rgba(212,175,55,0.4)',
                    ]
                  } : bookingForm.vehicles.coach25 > 0 ? {
                    boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                  } : {}}
                  transition={{ duration: 1.5, repeat: bookingForm.vehicles.coach25 > 0 && isRecommendedSelection ? Infinity : 0 }}
                >
                  <div>
                    <p className="text-white font-medium">25 Passenger Bus</p>
                    <p className="text-gray-400 text-xs">Up to 25 passengers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach25', -1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-mono text-lg min-w-[2rem] text-center">
                      {bookingForm.vehicles.coach25}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach25', 1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* 28 Passenger Bus */}
                <motion.div 
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
                    bookingForm.vehicles.coach28 > 0 
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]' 
                      : ''
                  }`}
                  animate={bookingForm.vehicles.coach28 > 0 && isRecommendedSelection ? {
                    boxShadow: [
                      '0 0 20px rgba(212,175,55,0.4)',
                      '0 0 35px rgba(212,175,55,0.6)',
                      '0 0 20px rgba(212,175,55,0.4)',
                    ]
                  } : bookingForm.vehicles.coach28 > 0 ? {
                    boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                  } : {}}
                  transition={{ duration: 1.5, repeat: bookingForm.vehicles.coach28 > 0 && isRecommendedSelection ? Infinity : 0 }}
                >
                  <div>
                    <p className="text-white font-medium">28 Passenger Bus</p>
                    <p className="text-gray-400 text-xs">Up to 28 passengers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach28', -1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-mono text-lg min-w-[2rem] text-center">
                      {bookingForm.vehicles.coach28}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach28', 1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* 55 Passenger Coach */}
                <motion.div 
                  className={`flex items-center justify-between py-2 px-3 rounded-md transition-all duration-300 ${
                    bookingForm.vehicles.coach55 > 0 
                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40 shadow-[0_0_20px_rgba(201,168,76,0.3)]' 
                      : ''
                  }`}
                  animate={bookingForm.vehicles.coach55 > 0 && isRecommendedSelection ? {
                    boxShadow: [
                      '0 0 20px rgba(212,175,55,0.4)',
                      '0 0 35px rgba(212,175,55,0.6)',
                      '0 0 20px rgba(212,175,55,0.4)',
                    ]
                  } : bookingForm.vehicles.coach55 > 0 ? {
                    boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                  } : {}}
                  transition={{ duration: 1.5, repeat: bookingForm.vehicles.coach55 > 0 && isRecommendedSelection ? Infinity : 0 }}
                >
                  <div>
                    <p className="text-white font-medium">55 Passenger Coach</p>
                    <p className="text-gray-400 text-xs">Up to 55 passengers</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach55', -1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      −
                    </button>
                    <span className="text-white font-mono text-lg min-w-[2rem] text-center">
                      {bookingForm.vehicles.coach55}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVehicleQuantityChange('coach55', 1)}
                      className="w-8 h-8 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-white rounded border border-[#D4AF37]/40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              </div>
              <p className="text-gray-400 text-xs mt-2">
                You can choose one or a combination of vehicles. Enter how many of each you need.
              </p>
              
              {/* Capacity Warning */}
              <AnimatePresence>
                {capacityWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 px-3 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md"
                  >
                    <p className="text-[#D4AF37] text-xs">
                      ⚠️ {capacityWarning}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Special Requests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            <h3 className="text-xl font-semibold text-[#D4AF37] mb-6 pb-2 border-b border-[#D4AF37]/20">
              Special Requests
            </h3>

            <div className="mb-4 relative group">
              <label className="block text-white text-sm font-medium mb-2">
                Special Request
              </label>
              <textarea
                rows={4}
                value={bookingForm.specialRequest}
                onChange={(e) => handleBookingFormChange('specialRequest', e.target.value)}
                placeholder="Tell us about any special requests (alternative beverages, special occasions, child seats, etc.)"
                className="w-full bg-black/60 border border-white/20 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#C9A84C] focus:outline-none transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.2)] resize-none"
              />
              <p className="text-gray-400 text-xs mt-1">
                Additional items may appear as separate line items on your invoice.
              </p>
            </div>

            <p className="text-center text-gray-400 text-sm">
              All vehicles are non-smoking.
            </p>
          </motion.div>

          {/* Submit Button with Premium Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || !isFormComplete}
              className={`
                btn-gold relative w-full py-4 rounded-lg uppercase tracking-wider text-base font-bold transition-all transform overflow-hidden
                ${!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              whileHover={isFormComplete && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isFormComplete && !isSubmitting ? { scale: 0.98 } : {}}
              animate={isFormComplete ? {
                boxShadow: [
                  '0 0 20px rgba(212, 175, 55, 0.4)',
                  '0 0 35px rgba(212, 175, 55, 0.6)',
                  '0 0 20px rgba(212, 175, 55, 0.4)',
                ]
              } : {}}
              transition={{ duration: 2, repeat: isFormComplete ? Infinity : 0 }}
            >
              {/* Hover sweep effect */}
              {isFormComplete && !isSubmitting && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
              <span className="relative z-10">
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowTerms(false)}></div>
          <div className="bg-[#1A1A1A] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#D4AF37]/40 shadow-2xl relative z-10">
            {/* Terms Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37] to-yellow-600 p-6 z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-serif)' }}>
                  Terms & Conditions
                </h2>
                <p className="text-black/80 mt-1">Last Updated: February 28, 2026</p>
              </div>
              <button 
                onClick={() => setShowTerms(false)} 
                className="text-black hover:text-black/70 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-gray-300">
              {/* Cancellation Policy - Highlighted */}
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Cancellation Policy</h3>
                <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/40 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-white font-semibold text-lg">
                      24-Hour Non-Refundable Cancellation Policy
                    </p>
                  </div>
                  <div className="space-y-2 text-gray-200">
                    <p>
                      All cancellations must be made at least <span className="font-bold text-red-400">24 hours prior</span> to 
                      the scheduled pickup time to receive a full refund.
                    </p>
                    <p>
                      Cancellations made less than 24 hours before pickup are <span className="font-bold text-red-400">non-refundable</span>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Payment Terms */}
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Payment Terms</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>We accept all major credit cards</li>
                  <li>Payment is required at the time of booking</li>
                  <li>A 20% gratuity is automatically included</li>
                  <li>Services over a certain amount must be prepaid in full</li>
                </ul>
              </section>

              {/* Service Includes */}
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">What's Included</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Professional, licensed chauffeur</li>
                  <li>Ice cold bottled water</li>
                  <li>Climate-controlled vehicle</li>
                  <li>All applicable taxes and fees</li>
                </ul>
              </section>

              {/* Additional Terms */}
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Additional Terms</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>All vehicles are non-smoking</li>
                  <li>Hourly service requires a 4-hour minimum</li>
                  <li>Additional stops may incur extra charges</li>
                  <li>Wait time beyond the agreed schedule may result in additional fees</li>
                  <li>Globa7 reserves the right to refuse service</li>
                </ul>
              </section>

              {/* Contact */}
              <section>
                <h3 className="text-xl font-bold text-[#D4AF37] mb-3">Questions?</h3>
                <p>
                  Contact us at <a href="mailto:booking@globa7.com" className="text-[#D4AF37] hover:text-yellow-500 underline">booking@globa7.com</a> for any questions regarding these terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
