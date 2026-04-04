import { useState, useRef } from 'react';
import { X, Plus, Minus, ChevronRight, ChevronLeft, Check, Package, Calendar, MapPin, Users, Clock, DollarSign, Mail, Phone, User, Building, Luggage, Car, GripVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimeDropdown } from './TimeDropdown';

interface CustomBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bundleData: any) => void;
}

interface DropoffLocation {
  id: string;
  address: string;
  nextPickupTime?: string; // Time to pickup from this location for next leg (intermediate stops)
  dropoffTime?: string; // Final drop-off time (for the last location)
}

interface ServiceDetails {
  pickupTime: string;
  pickupLocation: string;
  dropoffLocations: DropoffLocation[];
  passengers: string;
  luggage: string;
}

interface VehicleType {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  airportRate?: number; // Flat rate for airport transfers
}

interface BundleService {
  id: string;
  name: string;
  description: string;
  category: 'transportation' | 'addon' | 'experience';
  basePrice: number;
  minimumHours?: number; // Minimum hours for the service
  vehicleType?: VehicleType | null; // Selected vehicle for this service
  serviceType?: 'airport-pickup' | 'airport-dropoff' | 'regular';
  details: ServiceDetails;
}

interface VehicleQuantity {
  blackSuv: number;
  sprinter14: number;
  coach25: number;
  coach28: number;
  coach55: number;
}

const ITEM_TYPE = 'SERVICE';
const DROPOFF_ITEM_TYPE = 'DROPOFF';

// Draggable Drop-off Location Component
interface DraggableDropoffProps {
  dropoff: DropoffLocation;
  index: number;
  totalDropoffs: number;
  onUpdate: (updates: Partial<DropoffLocation>) => void;
  onRemove: () => void;
  moveDropoff: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableDropoff({ dropoff, index, totalDropoffs, onUpdate, onRemove, moveDropoff }: DraggableDropoffProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: DROPOFF_ITEM_TYPE,
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

      moveDropoff(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: DROPOFF_ITEM_TYPE,
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  preview(drop(ref));

  const isLastDropoff = index === totalDropoffs - 1;

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className="bg-black/20 border border-[#D4AF37]/20 rounded p-3 mb-2"
    >
      <div className="flex items-start gap-2">
        <button
          ref={drag}
          className="cursor-move text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors mt-1"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1">
              Drop-off Location {index + 1}
            </label>
            <input
              type="text"
              placeholder="Enter drop-off address"
              value={dropoff.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              className="w-full bg-black/40 border border-[#D4AF37]/30 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          {/* Next Pickup Time - only show if not the last dropoff */}
          {!isLastDropoff && (
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Next Pickup Time (from this location)
              </label>
              <TimeDropdown
                value={dropoff.nextPickupTime || ''}
                onChange={(value) => onUpdate({ nextPickupTime: value })}
                placeholder="Time to pickup from this location"
                required={false}
                showLabel={false}
              />
              <p className="text-xs text-gray-500 mt-1">
                What time should we pick up from {dropoff.address || 'this location'}?
              </p>
            </div>
          )}

          {/* Drop-off Time - only show for the last dropoff */}
          {isLastDropoff && (
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Drop-off Time (End of Service)
              </label>
              <TimeDropdown
                value={dropoff.dropoffTime || ''}
                onChange={(value) => onUpdate({ dropoffTime: value })}
                placeholder="Final drop-off time"
                required={false}
                showLabel={false}
              />
              <p className="text-xs text-gray-500 mt-1">
                What time will the service end at {dropoff.address || 'this location'}?
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-500 transition-colors mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Helper function to calculate actual duration from pickup to last dropoff
function calculateActualDuration(service: BundleService): number {
  // Airport services don't have duration
  if (service.serviceType === 'airport-pickup' || service.serviceType === 'airport-dropoff') {
    return 0;
  }

  // If no pickup time, return minimum hours
  if (!service.details?.pickupTime) {
    return service.minimumHours || 0;
  }

  // If there are dropoffs, calculate from first pickup to last dropoff
  const dropoffs = service.details?.dropoffLocations || [];
  if (dropoffs.length === 0) {
    return service.minimumHours || 0;
  }

  const lastDropoff = dropoffs[dropoffs.length - 1];
  
  // Check if the last dropoff has either dropoffTime or nextPickupTime
  const endTime = lastDropoff.dropoffTime || lastDropoff.nextPickupTime;
  
  if (!endTime) {
    return service.minimumHours || 0;
  }

  // Calculate duration from pickup time to end time
  const [startHour, startMin] = service.details.pickupTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  let durationMinutes = endMinutes - startMinutes;
  
  // Handle overnight trips
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  const durationHours = durationMinutes / 60;

  // Return the greater of actual duration or minimum hours
  return Math.max(durationHours, service.minimumHours || 0);
}

// Draggable Service Card Component
interface DraggableServiceCardProps {
  service: BundleService;
  index: number;
  onUpdate: (updates: Partial<BundleService>) => void;
  onRemove: () => void;
  moveService: (dragIndex: number, hoverIndex: number) => void;
  updateVehicle: (vehicleId: string) => void; // Changed from updateQuantity
  addDropoff: () => void;
  updateDropoff: (dropoffId: string, updates: Partial<DropoffLocation>) => void;
  removeDropoff: (dropoffId: string) => void;
  moveDropoff: (dragIndex: number, hoverIndex: number) => void;
  updateDetails: (updates: Partial<ServiceDetails>) => void;
  vehicleOptions: VehicleType[]; // Added vehicleOptions
}

function DraggableServiceCard({ 
  service, 
  index, 
  onUpdate, 
  onRemove, 
  moveService, 
  updateVehicle,
  addDropoff,
  updateDropoff,
  removeDropoff,
  moveDropoff,
  updateDetails,
  vehicleOptions
}: DraggableServiceCardProps) {
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

      moveService(dragIndex, hoverIndex);
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

  const isAirportPickup = service.serviceType === 'airport-pickup';
  const isAirportDropoff = service.serviceType === 'airport-dropoff';
  const isAddon = service.category === 'addon';

  // ---------- PRICE HELPER ----------
  const getDisplayPrice = () => {
    if (!service.vehicleType) return '$0';
    if (service.serviceType === 'airport-pickup' || service.serviceType === 'airport-dropoff') {
      const airportRates: Record<string, number> = {
        blackSuv: 140,
        sprinter14: 240,
        coach25: 395,
        coach28: 425,
        coach55: 600,
      };
      return `$${airportRates[service.vehicleType.id] ?? 140}`;
    }
    if (service.id === 'city-tour' && service.vehicleType.id === 'blackSuv') return '$425';
    if (service.minimumHours && service.minimumHours > 0) {
      return `$${service.vehicleType.pricePerHour * service.minimumHours}`;
    }
    return `$${service.vehicleType.pricePerHour}`;
  };

  // Calculate dynamic price based on selected vehicle
  const calculateServicePrice = () => {
    if (isAddon) {
      return service.basePrice;
    }
    if (service.vehicleType) {
      // HARDCODED AIRPORT FLAT RATES - No calculations
      if (isAirportPickup || isAirportDropoff) {
        switch (service.vehicleType.id) {
          case 'blackSuv':
            return 140;
          case 'sprinter14':
            return 240;
          case 'coach25':
            return 395;
          case 'coach28':
            return 425;
          case 'coach55':
            return 600;
          default:
            return 140;
        }
      }
      // Special case: City Tour - $425 flat rate for Black SUV only
      if (service.id === 'city-tour' && service.vehicleType.id === 'blackSuv') {
        return 425;
      }
      if (service.minimumHours && service.minimumHours > 0) {
        // Hourly service with minimum
        return service.vehicleType.pricePerHour * service.minimumHours;
      } else {
        // Flat rate service - use vehicle hourly rate
        return service.vehicleType.pricePerHour;
      }
    }
    // No vehicle selected - don't show a price yet
    return 0;
  };

  // Helper function to get the display rate for dropdown options
  const getVehicleDisplayRate = (vehicle: VehicleType) => {
    if (isAirportPickup || isAirportDropoff) {
      // HARDCODED airport flat rates by vehicle ID
      switch (vehicle.id) {
        case 'blackSuv':
          return '$140';
        case 'sprinter14':
          return '$240';
        case 'coach25':
          return '$395';
        case 'coach28':
          return '$425';
        case 'coach55':
          return '$600';
        default:
          return '$140';
      }
    } else {
      // For hourly services, show hourly rate
      return `$${vehicle.pricePerHour}/hr`;
    }
  };

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      style={{ opacity }}
      className={`border-2 rounded-lg p-4 mb-4 ${
        isAddon 
          ? 'bg-green-500/5 border-green-500/30' 
          : 'bg-[#D4AF37]/10 border-[#D4AF37]'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          ref={drag}
          className="cursor-move text-[#D4AF37] hover:text-yellow-500 transition-colors mt-1"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="text-white font-semibold flex items-center gap-2">
                {service.name}
                {isAddon && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                    Add-on
                  </span>
                )}
              </h5>
              <p className="text-gray-400 text-sm">{service.description}</p>
              {service.vehicleType ? (
                null
              ) : (
                <p className="text-gray-500 italic mt-1 text-sm">
                  Select vehicle to see pricing
                </p>
              )}
            </div>
            
            <button
              onClick={onRemove}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Only show full form for non-addon services */}
          {!isAddon && (
            <>
              {/* Vehicle Selection - This is a parameter that was previously updateQuantity */}
              <div className="mb-4 pb-4 border-b border-[#D4AF37]/20 mt-4">
            <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-1">
              <Car className="w-4 h-4" /> Select Vehicle Type
            </label>
            <select
              value={service.vehicleType?.id || ''}
              onChange={(e) => updateVehicle(e.target.value)}
              className="w-full bg-black/60 border border-[#D4AF37]/30 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="" className="bg-black">Select a vehicle...</option>
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id} className="bg-black">
                  {vehicle.name} - {getVehicleDisplayRate(vehicle)}
                </option>
              ))}
            </select>
            {service.vehicleType && (
              <div className="mt-2 p-3 bg-[#D4AF37]/10 rounded text-sm border border-[#D4AF37]/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-300">
                      <strong className="text-[#D4AF37]">{service.vehicleType.name}</strong>
                    </p>
                    <p className="text-gray-400 text-xs">
                      Capacity: {service.vehicleType.capacity} passengers | ${service.vehicleType.pricePerHour}/hour
                    </p>
                    {(isAirportPickup || isAirportDropoff) && (
                      <p className="text-[#D4AF37] text-xs mt-1 font-semibold">
                        Airport Rate: ${(() => {
                          switch (service.vehicleType.id) {
                            case 'blackSuv': return 140;
                            case 'sprinter14': return 240;
                            case 'coach25': return 395;
                            case 'coach28': return 425;
                            case 'coach55': return 600;
                            default: return 140;
                          }
                        })()} (flat rate)
                      </p>
                    )}
                    {service.id === 'city-tour' && service.vehicleType.id === 'blackSuv' && (
                      <p className="text-[#D4AF37] text-xs mt-1 font-semibold">
                        Special Rate: $425 (3-hour flat rate)
                      </p>
                    )}
                    {service.id === 'city-tour' && service.vehicleType.id !== 'blackSuv' && (() => {
                      const actualDuration = calculateActualDuration(service);
                      return (
                        <p className="text-gray-400 text-xs mt-1">
                          Larger vehicles: {actualDuration} hours × ${service.vehicleType.pricePerHour}/hr = ${service.vehicleType.pricePerHour * actualDuration}
                        </p>
                      );
                    })()}
                    {service.minimumHours && service.minimumHours > 0 && !(isAirportPickup || isAirportDropoff) && service.id !== 'city-tour' && (() => {
                      const actualDuration = calculateActualDuration(service);
                      return (
                        <p className="text-gray-400 text-xs mt-1">
                          {actualDuration > service.minimumHours ? (
                            <>Actual duration: {actualDuration} hours - Total: ${service.vehicleType.pricePerHour * actualDuration}</>
                          ) : (
                            <>Minimum {service.minimumHours} hours - Base: ${service.vehicleType.pricePerHour * service.minimumHours}</>
                          )}
                        </p>
                      );
                    })()}
                  </div>
                  {service.minimumHours && service.minimumHours > 0 && (() => {
                    const actualDuration = calculateActualDuration(service);
                    if (actualDuration === 0) return null;
                    return (
                      <div className="flex items-center gap-1 bg-[#D4AF37]/20 px-2 py-1 rounded">
                        <Clock className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[#D4AF37] font-bold text-sm">{actualDuration}hr</span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Passenger and Luggage Inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#D4AF37]/20">
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" /> Passengers
              </label>
              <input
                type="number"
                placeholder="0"
                value={service.details?.passengers || ''}
                onChange={(e) => updateDetails({ passengers: e.target.value })}
                className="w-full bg-black/40 border border-[#D4AF37]/30 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1 flex items-center gap-1">
                <Luggage className="w-3 h-3" /> Luggage Count
              </label>
              <input
                type="number"
                placeholder="0"
                value={service.details?.luggage || ''}
                onChange={(e) => updateDetails({ luggage: e.target.value })}
                className="w-full bg-black/40 border border-[#D4AF37]/30 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                min="0"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <h6 className="text-sm font-semibold text-[#D4AF37]">
              {isAirportPickup ? 'Pickup & Drop-off Details' : isAirportDropoff ? 'Pickup & Drop-off Details' : 'Location Details'}
            </h6>

            {/* Pickup Time */}
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1">
                Pickup Time
              </label>
              <TimeDropdown
                value={service.details?.pickupTime || ''}
                onChange={(value) => updateDetails({ pickupTime: value })}
                placeholder="Select pickup time"
                required={false}
                showLabel={false}
              />
              {/* Show estimated end time if pickup time is set */}
              {service.details?.pickupTime && (() => {
                const actualDuration = calculateActualDuration(service);
                if (actualDuration === 0) return null;

                const [hours, minutes] = service.details.pickupTime.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes + (actualDuration * 60);
                const endHours = Math.floor(totalMinutes / 60) % 24;
                const endMinutes = totalMinutes % 60;
                const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
                return (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Estimated end: {endTime} ({actualDuration}hr duration)
                  </p>
                );
              })()}
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-xs font-semibold text-[#D4AF37]/80 mb-1">
                {isAirportPickup ? 'Pickup Location (Airport)' : 'Pickup Location'}
              </label>
              <input
                type="text"
                placeholder={isAirportPickup ? "MSY or Lakefront Airport" : "Enter pickup address"}
                value={service.details?.pickupLocation || ''}
                onChange={(e) => updateDetails({ pickupLocation: e.target.value })}
                className="w-full bg-black/40 border border-[#D4AF37]/30 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            {/* Drop-off Locations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#D4AF37]/80">
                  Drop-off Location{(service.details?.dropoffLocations?.length || 0) > 1 ? 's' : ''}
                </label>
                <button
                  onClick={addDropoff}
                  className="flex items-center gap-1 px-3 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 rounded text-xs text-[#D4AF37] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Drop-off
                </button>
              </div>

              {!service.details?.dropoffLocations || service.details.dropoffLocations.length === 0 ? (
                <div className="bg-black/20 border border-dashed border-[#D4AF37]/30 rounded p-4 text-center">
                  <MapPin className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No drop-off locations added</p>
                  <p className="text-gray-500 text-xs mt-1">Click "Add Drop-off" to add destination</p>
                </div>
              ) : (
                <div>
                  {service.details.dropoffLocations.map((dropoff, dropoffIndex) => (
                    <DraggableDropoff
                      key={dropoff.id}
                      dropoff={dropoff}
                      index={dropoffIndex}
                      totalDropoffs={service.details.dropoffLocations.length}
                      onUpdate={(updates) => updateDropoff(dropoff.id, updates)}
                      onRemove={() => removeDropoff(dropoff.id)}
                      moveDropoff={moveDropoff}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CustomBundleModal({ isOpen, onClose, onSubmit }: CustomBundleModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bundleData, setBundleData] = useState({
    // Bundle Details
    bundleName: '',
    travelDate: '',
    totalPassengers: '',
    totalLuggage: '',
    
    // Trip Details
    tripType: 'one-way',
    hours: '',
    pickupAddress: '',
    dropoffAddress: '',
    
    // Contact Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    eventName: '',
    
    // Vehicle Selection
    vehicles: {
      blackSuv: 0,
      sprinter14: 0,
      coach25: 0,
      coach28: 0,
      coach55: 0,
    } as VehicleQuantity,
    
    // Selected Services
    selectedServices: [] as BundleService[],
    
    // Additional Details
    specialRequests: '',
  });

  /*
   * GLOBA7 VEHICLE PRICING STRUCTURE (March 2026)
   * 
   * HOURLY RATES:
   * - Black Luxury SUV (6 passengers): $140/hr
   * - 14-Passenger Sprinter: $160/hr
   * - 25-Passenger Bus: $210/hr
   * - 28-Passenger Bus: $240/hr
   * - 55-Passenger Coach: $255/hr
   * 
   * AIRPORT TRANSFERS (MSY/Lakefront to Greater New Orleans):
   * - Black Luxury SUV: $140 (hourly rate)
   * - 14-Passenger Sprinter: $240 flat rate
   * - 25-Passenger Bus: $395 flat rate
   * - 28-Passenger Bus: $425 flat rate
   * - 55-Passenger Coach: $600 flat rate
   * Note: Pricing may vary if destination is outside Orleans or Jefferson Parish
   * 
   * SPECIAL SERVICES:
   * - Private 3-Hour City Tour (Black SUV only): $425 flat rate
   * - Larger vehicles for tours: Use hourly rate with 4-hour minimum
   * - Weddings (6+ hours): $145/hr with 4-hour minimum
   * - Festivals/LSU Games: $145/hr with 4-hour minimum
   */

  const vehicleOptions: VehicleType[] = [
    { id: 'blackSuv', name: 'Black Luxury SUV', capacity: 6, pricePerHour: 140, airportRate: 140 },
    { id: 'sprinter14', name: '14-Passenger Sprinter', capacity: 14, pricePerHour: 160, airportRate: 240 },
    { id: 'coach25', name: '25-Passenger Bus', capacity: 25, pricePerHour: 210, airportRate: 395 },
    { id: 'coach28', name: '28-Passenger Bus', capacity: 28, pricePerHour: 240, airportRate: 425 },
    { id: 'coach55', name: '55-Passenger Coach', capacity: 55, pricePerHour: 255, airportRate: 600 },
  ];

  const transportationServices = [
    {
      id: 'airport-pickup',
      name: 'Airport Pickup (MSY/Lakefront)',
      description: 'Meet & greet at Louis Armstrong or Lakefront Airport - pricing varies by vehicle',
      category: 'transportation' as const,
      basePrice: 140,
      minimumHours: 0,
      serviceType: 'airport-pickup' as const,
    },
    {
      id: 'airport-dropoff',
      name: 'Airport Drop-off (MSY/Lakefront)',
      description: 'Timely departure service to airport - pricing varies by vehicle',
      category: 'transportation' as const,
      basePrice: 140,
      minimumHours: 0,
      serviceType: 'airport-dropoff' as const,
    },
    {
      id: 'city-tour',
      name: 'Private 3-Hour City Tour',
      description: '$425 for Black SUV only - 3 hours anywhere in New Orleans (larger vehicles use hourly service)',
      category: 'transportation' as const,
      basePrice: 425,
      minimumHours: 3,
      serviceType: 'regular' as const,
    },
    {
      id: 'point-to-point',
      name: 'Point-to-Point Transfer',
      description: 'Garden District to Downtown or similar',
      category: 'transportation' as const,
      basePrice: 120,
      minimumHours: 0,
      serviceType: 'regular' as const,
    },
    {
      id: 'hourly-service',
      name: 'Hourly Service',
      description: 'Dedicated vehicle and chauffeur by the hour (4hr min)',
      category: 'transportation' as const,
      basePrice: 140,
      minimumHours: 4,
      serviceType: 'regular' as const,
    },
    {
      id: 'baton-rouge',
      name: 'Baton Rouge Transfer',
      description: 'One-way transfer to Baton Rouge',
      category: 'transportation' as const,
      basePrice: 360,
      minimumHours: 0,
      serviceType: 'regular' as const,
    },
    {
      id: 'wedding-day',
      name: 'Wedding Day Transportation',
      description: 'Full wedding day coverage (4hr min, 6+ hours at $145/hr)',
      category: 'transportation' as const,
      basePrice: 145,
      minimumHours: 4,
      serviceType: 'regular' as const,
    },
  ];

  const experienceServices = [
    {
      id: 'dinner-transport',
      name: 'Dinner Transportation',
      description: 'Round-trip to restaurant with wait time (3hr min)',
      category: 'experience' as const,
      basePrice: 140,
      minimumHours: 3,
      serviceType: 'regular' as const,
    },
    {
      id: 'event-transport',
      name: 'Special Event Transportation',
      description: 'Concert, festival, or sporting event',
      category: 'experience' as const,
      basePrice: 160,
      minimumHours: 3,
      serviceType: 'regular' as const,
    },
    {
      id: 'multi-venue',
      name: 'Multi-Venue Experience',
      description: 'Visit multiple destinations in one booking - Conditions Apply',
      category: 'experience' as const,
      basePrice: 200,
      serviceType: 'regular' as const,
    },
  ];

  const addonServices = [
    {
      id: 'red-carpet',
      name: 'Red Carpet Service',
      description: 'Premium arrival experience',
      category: 'addon' as const,
      basePrice: 150,
      serviceType: 'regular' as const,
    },
    {
      id: 'champagne',
      name: 'Champagne & Refreshments',
      description: 'Premium beverages for your journey',
      category: 'addon' as const,
      basePrice: 75,
      serviceType: 'regular' as const,
    },
    {
      id: 'decorations',
      name: 'Vehicle Decorations',
      description: 'Balloons, complimentary bottle of Lamarca & orange juice - decorations customizable',
      category: 'addon' as const,
      basePrice: 250,
      serviceType: 'regular' as const,
    },
    {
      id: 'wifi',
      name: 'Premium WiFi',
      description: 'High-speed internet during your ride',
      category: 'addon' as const,
      basePrice: 25,
      serviceType: 'regular' as const,
    },
  ];

  // Calculate total hours booked across all services
  const calculateTotalHours = () => {
    let totalHours = 0;
    
    bundleData.selectedServices.forEach(service => {
      // Only count transportation/experience services
      if (service.category !== 'addon') {
        const actualDuration = calculateActualDuration(service);
        // Ensure we count at least the minimum hours even if calculation returns 0
        const effectiveDuration = actualDuration > 0 ? actualDuration : (service.minimumHours || 0);
        totalHours += effectiveDuration;
      }
    });
    
    return totalHours;
  };

  // Check for time conflicts between services
  const getTimeConflicts = () => {
    const conflicts: string[] = [];
    const servicesWithTimes = bundleData.selectedServices.filter(
      s => s.category !== 'addon' && s.details?.pickupTime && s.minimumHours && s.minimumHours > 0
    );

    for (let i = 0; i < servicesWithTimes.length - 1; i++) {
      const current = servicesWithTimes[i];
      const next = servicesWithTimes[i + 1];
      
      if (current.details.pickupTime && next.details.pickupTime && current.minimumHours) {
        // Parse times
        const [currentHour, currentMin] = current.details.pickupTime.split(':').map(Number);
        const [nextHour, nextMin] = next.details.pickupTime.split(':').map(Number);
        
        const currentStart = currentHour * 60 + currentMin;
        const currentEnd = currentStart + (current.minimumHours * 60);
        const nextStart = nextHour * 60 + nextMin;
        
        // Check if next service starts before current one ends
        if (nextStart < currentEnd) {
          conflicts.push(`"${current.name}" and "${next.name}" may overlap`);
        }
      }
    }
    
    return conflicts;
  };

  const calculateSubtotal = () => {
    let total = 0;
    
    // Calculate prices based on services with their vehicles and actual duration
    bundleData.selectedServices.forEach(service => {
      // Add-ons are simple line items
      if (service.category === 'addon') {
        total += service.basePrice;
      } else if (service.vehicleType) {
        const actualDuration = calculateActualDuration(service);
        const vehicleRate = service.vehicleType.pricePerHour;
        const isAirport = service.serviceType === 'airport-pickup' || service.serviceType === 'airport-dropoff';
        
        if (isAirport) {
          // HARDCODED airport flat rates
          switch (service.vehicleType.id) {
            case 'blackSuv':
              total += 140;
              break;
            case 'sprinter14':
              total += 240;
              break;
            case 'coach25':
              total += 395;
              break;
            case 'coach28':
              total += 425;
              break;
            case 'coach55':
              total += 600;
              break;
            default:
              total += 140;
          }
        } else if (service.id === 'city-tour' && service.vehicleType.id === 'blackSuv') {
          // Special case: City Tour with Black SUV is $425 flat
          total += 425;
        } else if (actualDuration > 0) {
          // Hourly service - use actual duration (or minimum, whichever is greater)
          total += vehicleRate * actualDuration;
        } else {
          // No duration calculated yet - use minimum hours if available
          const minimumDuration = service.minimumHours || 0;
          if (minimumDuration > 0) {
            total += vehicleRate * minimumDuration;
          } else {
            // Fallback: use vehicle hourly rate once
            total += vehicleRate;
          }
        }
      }
    });
    
    return total;
  };

  const calculateDiscount = () => {
    return 0; // Discount removed temporarily
  };

  const calculateTotal = () => {
    return calculateSubtotal(); // No discount applied
  };

  const toggleService = (service: any) => {
    const existingIndex = bundleData.selectedServices.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      // Remove service
      setBundleData({
        ...bundleData,
        selectedServices: bundleData.selectedServices.filter(s => s.id !== service.id)
      });
    } else {
      // Add-ons are simple line items - no form needed
      if (service.category === 'addon') {
        const newService: BundleService = {
          ...service,
          vehicleType: null,
          details: {
            pickupTime: '',
            pickupLocation: '',
            dropoffLocations: [],
            passengers: '',
            luggage: '',
          }
        };
        
        setBundleData({
          ...bundleData,
          selectedServices: [...bundleData.selectedServices, newService]
        });
      } else {
        // Transportation/experience services need full details
        const newService: BundleService = {
          ...service,
          vehicleType: null,
          details: {
            pickupTime: '',
            pickupLocation: '',
            dropoffLocations: [],
            passengers: '',
            luggage: '',
          }
        };
        
        setBundleData({
          ...bundleData,
          selectedServices: [...bundleData.selectedServices, newService]
        });
      }
    }
  };

  const updateServiceDetails = (serviceId: string, updates: Partial<BundleService>) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          return { ...service, ...updates };
        }
        return service;
      })
    });
  };

  const updateServiceVehicle = (serviceId: string, vehicleId: string) => {
    const selectedVehicle = vehicleOptions.find(v => v.id === vehicleId);
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          return { ...service, vehicleType: selectedVehicle || null };
        }
        return service;
      })
    });
  };

  // Old updateServiceDetailsFields removed - replaced with auto-calculating version below

  const addDropoffToService = (serviceId: string) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          const newDropoff: DropoffLocation = {
            id: `${serviceId}-dropoff-${Date.now()}-${Math.random()}`,
            address: ''
          };
          return {
            ...service,
            details: {
              ...service.details,
              dropoffLocations: [...(service.details.dropoffLocations || []), newDropoff]
            }
          };
        }
        return service;
      })
    });
  };

  const updateServiceDropoff = (serviceId: string, dropoffId: string, updates: Partial<DropoffLocation>) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            details: {
              ...service.details,
              dropoffLocations: (service.details.dropoffLocations || []).map(dropoff => 
                dropoff.id === dropoffId ? { ...dropoff, ...updates } : dropoff
              )
            }
          };
        }
        return service;
      })
    });
  };

  const removeServiceDropoff = (serviceId: string, dropoffId: string) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          return {
            ...service,
            details: {
              ...service.details,
              dropoffLocations: (service.details.dropoffLocations || []).filter(dropoff => dropoff.id !== dropoffId)
            }
          };
        }
        return service;
      })
    });
  };

  const moveServiceDropoff = (serviceId: string, dragIndex: number, hoverIndex: number) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.map(service => {
        if (service.id === serviceId) {
          const dropoffs = service.details.dropoffLocations || [];
          const dragDropoff = dropoffs[dragIndex];
          const newDropoffs = [...dropoffs];
          newDropoffs.splice(dragIndex, 1);
          newDropoffs.splice(hoverIndex, 0, dragDropoff);
          return {
            ...service,
            details: {
              ...service.details,
              dropoffLocations: newDropoffs
            }
          };
        }
        return service;
      })
    });
  };

  const moveService = (dragIndex: number, hoverIndex: number) => {
    const dragService = bundleData.selectedServices[dragIndex];
    const newServices = [...bundleData.selectedServices];
    newServices.splice(dragIndex, 1);
    newServices.splice(hoverIndex, 0, dragService);
    setBundleData({
      ...bundleData,
      selectedServices: newServices
    });
  };

  const removeService = (serviceId: string) => {
    setBundleData({
      ...bundleData,
      selectedServices: bundleData.selectedServices.filter(s => s.id !== serviceId)
    });
  };

  const updateVehicleQuantity = (vehicleId: string, change: number) => {
    setBundleData({
      ...bundleData,
      vehicles: {
        ...bundleData.vehicles,
        [vehicleId]: Math.max(0, bundleData.vehicles[vehicleId as keyof VehicleQuantity] + change)
      }
    });
  };

  const isServiceSelected = (serviceId: string) => {
    return bundleData.selectedServices.some(s => s.id === serviceId);
  };

  // Auto-calculate next pickup time based on previous service minimum hours
  const calculateNextPickupTime = (currentPickupTime: string, minimumHours: number): string => {
    if (!currentPickupTime || !minimumHours) return '';
    
    try {
      const [hours, minutes] = currentPickupTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + (minimumHours * 60);
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      
      return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  };

  // Update service details and auto-populate next service pickup time
  const updateServiceDetailsFields = (serviceId: string, updates: Partial<ServiceDetails>) => {
    setBundleData(prev => {
      const serviceIndex = prev.selectedServices.findIndex(s => s.id === serviceId);
      const updatedServices = prev.selectedServices.map((service, idx) => {
        if (service.id === serviceId) {
          return { ...service, details: { ...service.details, ...updates } };
        }
        return service;
      });

      // If pickup time changed and there's a next service, auto-populate its pickup time
      if (updates.pickupTime && serviceIndex >= 0 && serviceIndex < prev.selectedServices.length - 1) {
        const currentService = prev.selectedServices[serviceIndex];
        const nextService = updatedServices[serviceIndex + 1];
        const minimumHours = currentService.minimumHours || 0;

        // Only auto-calculate if current service has minimum hours
        if (minimumHours > 0 && nextService) {
          const autoPickupTime = calculateNextPickupTime(updates.pickupTime, minimumHours);
          if (autoPickupTime) {
            // Always update next service pickup time when previous service time changes
            updatedServices[serviceIndex + 1] = {
              ...nextService,
              details: {
                ...nextService.details,
                pickupTime: autoPickupTime
              }
            };
          }
        }
      }

      return { ...prev, selectedServices: updatedServices };
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...bundleData,
      pricing: {
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        total: calculateTotal(),
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Services & Vehicles
        // Add-ons don't need vehicles, only transportation/experience services do
        return bundleData.selectedServices.length > 0 && 
               bundleData.selectedServices.every(s => 
                 s.category === 'addon' || s.vehicleType !== null
               );
      case 2:
        // Step 2: Contact Info
        return bundleData.firstName && bundleData.lastName && bundleData.email && bundleData.phone;
      case 3:
        // Step 3: Review
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
        
        <div className="bg-[#1A1A1A] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg border border-[#D4AF37]/40 shadow-2xl relative z-10">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37] to-yellow-600 p-6 z-20">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  Custom Bundle Builder
                </h2>
                <p className="text-black/80">Build your perfect package</p>
              </div>
              <button 
                onClick={onClose}
                className="text-black hover:text-black/70 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-black">Step {currentStep} of 3</span>
                <span className="text-xs font-semibold text-black">{Math.round((currentStep / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* REMOVED Old Step 1: Basic Info - No longer needed */}
              {false && currentStep === 998 && (
                <motion.div
                  key="step998"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                      Bundle Details
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                        Bundle Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Wedding Weekend Package"
                        value={bundleData.bundleName}
                        onChange={(e) => setBundleData({ ...bundleData, bundleName: e.target.value })}
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                        Event Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Smith Family Reunion"
                        value={bundleData.eventName}
                        onChange={(e) => setBundleData({ ...bundleData, eventName: e.target.value })}
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Travel Date *
                        </label>
                        <input
                          type="date"
                          value={bundleData.travelDate}
                          onChange={(e) => setBundleData({ ...bundleData, travelDate: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Total Passengers *
                        </label>
                        <input
                          type="number"
                          placeholder="How many passengers?"
                          value={bundleData.totalPassengers}
                          onChange={(e) => setBundleData({ ...bundleData, totalPassengers: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                          <Luggage className="w-4 h-4" /> Total Luggage
                        </label>
                        <input
                          type="number"
                          placeholder="Number of bags"
                          value={bundleData.totalLuggage}
                          onChange={(e) => setBundleData({ ...bundleData, totalLuggage: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                          Trip Type
                        </label>
                        <select
                          value={bundleData.tripType}
                          onChange={(e) => {
                            const newTripType = e.target.value;
                            setBundleData({ 
                              ...bundleData, 
                              tripType: newTripType,
                              // Automatically set 4 hours when hourly is selected
                              hours: newTripType === 'hourly' ? '4' : bundleData.hours
                            });
                          }}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        >
                          <option value="one-way">One Way</option>
                          <option value="round-trip">Round Trip</option>
                          <option value="hourly">Hourly</option>
                          <option value="multi-day">Multi-Day</option>
                        </select>
                      </div>
                    </div>

                    {bundleData.tripType === 'hourly' && (
                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                          Number of Hours (4 hour minimum)
                        </label>
                        <input
                          type="number"
                          placeholder="How many hours?"
                          value={bundleData.hours}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numValue = parseInt(value);
                            if (value === '' || numValue >= 4) {
                              setBundleData({ ...bundleData, hours: value });
                            }
                          }}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                          min="4"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* REMOVED Step 2: Addresses - No longer needed */}
              {false && currentStep === 999 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                      Trip Details
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                        Pickup Address *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter pickup location"
                        value={bundleData.pickupAddress}
                        onChange={(e) => setBundleData({ ...bundleData, pickupAddress: e.target.value })}
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                        Drop-off Address *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter drop-off location"
                        value={bundleData.dropoffAddress}
                        onChange={(e) => setBundleData({ ...bundleData, dropoffAddress: e.target.value })}
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Select Services & Vehicles */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Car className="w-8 h-8 text-[#D4AF37]" />
                      <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                        Select Vehicles & Services
                      </h3>
                    </div>
                    
                    {/* Smart Bundle Timer */}
                    {calculateTotalHours() > 0 && (
                      <div className="bg-[#D4AF37]/20 border-2 border-[#D4AF37] rounded-lg px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Clock className="w-6 h-6 text-[#D4AF37]" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Total Time Booked</p>
                            <p className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-serif)' }}>
                              {calculateTotalHours()} {calculateTotalHours() === 1 ? 'Hour' : 'Hours'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    {/* Selected Services (Draggable) */}
                    {bundleData.selectedServices.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                          Your Selected Services (Drag to Reorder)
                        </h4>
                        <div>
                          {bundleData.selectedServices.map((service, index) => (
                            <DraggableServiceCard
                              key={service.id}
                              service={service}
                              index={index}
                              onUpdate={(updates) => updateServiceDetails(service.id, updates)}
                              onRemove={() => removeService(service.id)}
                              moveService={moveService}
                              updateVehicle={(vehicleId) => updateServiceVehicle(service.id, vehicleId)}
                              addDropoff={() => addDropoffToService(service.id)}
                              updateDropoff={(dropoffId, updates) => updateServiceDropoff(service.id, dropoffId, updates)}
                              removeDropoff={(dropoffId) => removeServiceDropoff(service.id, dropoffId)}
                              moveDropoff={(dragIndex, hoverIndex) => moveServiceDropoff(service.id, dragIndex, hoverIndex)}
                              updateDetails={(updates) => updateServiceDetailsFields(service.id, updates)}
                              vehicleOptions={vehicleOptions}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Smart Bundle Summary */}
                    {bundleData.selectedServices.length > 0 && (
                      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-lg p-5">
                        <h4 className="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Smart Bundle Summary
                        </h4>

                        {/* Timeline View - Services in chronological order */}
                        {bundleData.selectedServices.filter(s => s.category !== 'addon' && s.details?.pickupTime).length > 1 && (
                          <div className="mb-4 pb-4 border-b border-[#D4AF37]/20">
                            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Your Day Timeline</p>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                              {bundleData.selectedServices
                                .filter(s => s.category !== 'addon' && s.details?.pickupTime)
                                .sort((a, b) => {
                                  const timeA = a.details.pickupTime || '00:00';
                                  const timeB = b.details.pickupTime || '00:00';
                                  return timeA.localeCompare(timeB);
                                })
                                .map((service, idx, arr) => (
                                  <div key={service.id} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center min-w-[120px]">
                                      <div className="bg-[#D4AF37]/20 border border-[#D4AF37] rounded-lg px-3 py-2 text-center">
                                        <p className="text-[#D4AF37] font-bold text-sm">{service.details.pickupTime}</p>
                                        <p className="text-white text-xs truncate max-w-[100px]">{service.name}</p>
                                        {(() => {
                                          const actualDuration = calculateActualDuration(service);
                                          if (actualDuration === 0) return null;
                                          return <p className="text-gray-400 text-xs">{actualDuration}hr</p>;
                                        })()}
                                      </div>
                                    </div>
                                    {idx < arr.length - 1 && (
                                      <ChevronRight className="w-4 h-4 text-[#D4AF37]/50 flex-shrink-0" />
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Services</p>
                            <p className="text-white font-semibold">{bundleData.selectedServices.length} Selected</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Time</p>
                            <p className="text-white font-semibold">
                              {calculateTotalHours()} {calculateTotalHours() === 1 ? 'Hour' : 'Hours'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Estimated Total</p>
                            <p className="text-[#D4AF37] font-bold text-lg">${calculateTotal().toFixed(2)}</p>
                          </div>
                        </div>
                        
                        {/* Time Conflict Warnings */}
                        {getTimeConflicts().length > 0 && (
                          <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-yellow-500 font-semibold text-sm mb-1">Time Overlap Warning</p>
                                  {getTimeConflicts().map((conflict, idx) => (
                                    <p key={idx} className="text-yellow-400 text-xs">{conflict}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transportation Services */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                        Add Transportation Services
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {transportationServices.map((service) => {
                          const selected = isServiceSelected(service.id);
                          
                          return (
                            <div
                              key={service.id}
                              onClick={() => toggleService(service)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'bg-green-500/10 border-green-500'
                                  : 'bg-black/40 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-white font-semibold mb-1">{service.name}</h5>
                                  <p className="text-gray-400 text-sm">{service.description}</p>
                                  <p className="text-[#D4AF37] text-sm mt-1">
                                    {service.minimumHours && service.minimumHours > 0 
                                      ? `Starting at $${service.basePrice}/hr` 
                                      : `From $${service.basePrice}`}
                                  </p>
                                </div>
                                {selected && (
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Experience Services */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-b border-[#D4AF37]/20">
                        Add Experience Packages
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {experienceServices.map((service) => {
                          const selected = isServiceSelected(service.id);
                          
                          return (
                            <div
                              key={service.id}
                              onClick={() => toggleService(service)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'bg-green-500/10 border-green-500'
                                  : 'bg-black/40 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-white font-semibold mb-1">{service.name}</h5>
                                  <p className="text-gray-400 text-sm">{service.description}</p>
                                  <p className="text-[#D4AF37] text-sm mt-1">
                                    {service.minimumHours && service.minimumHours > 0 
                                      ? `Starting at $${service.basePrice}/hr` 
                                      : `From $${service.basePrice}`}
                                  </p>
                                </div>
                                {selected && (
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add-on Services */}
                    <div>
                      <h4 className="text-lg font-semibold text-[#D4AF37] mb-4 pb-2 border-[#D4AF37]/20">
                        Add Premium Add-ons
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {addonServices.map((service) => {
                          const selected = isServiceSelected(service.id);
                          
                          return (
                            <div
                              key={service.id}
                              onClick={() => toggleService(service)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selected
                                  ? 'bg-green-500/10 border-green-500'
                                  : 'bg-black/40 border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-white font-semibold mb-1">{service.name}</h5>
                                  <p className="text-gray-400 text-sm">{service.description}</p>
                                  <p className="text-[#D4AF37] text-sm mt-1">${service.basePrice}</p>
                                </div>
                                {selected && (
                                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                      Contact Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={bundleData.firstName}
                          onChange={(e) => setBundleData({ ...bundleData, firstName: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={bundleData.lastName}
                          onChange={(e) => setBundleData({ ...bundleData, lastName: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> Email Address *
                        </label>
                        <input
                          type="email"
                          value={bundleData.email}
                          onChange={(e) => setBundleData({ ...bundleData, email: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={bundleData.phone}
                          onChange={(e) => setBundleData({ ...bundleData, phone: e.target.value })}
                          className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4" /> Company Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={bundleData.companyName}
                        onChange={(e) => setBundleData({ ...bundleData, companyName: e.target.value })}
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#D4AF37] mb-2">
                        Special Requests or Notes (Optional)
                      </label>
                      <textarea
                        value={bundleData.specialRequests}
                        onChange={(e) => setBundleData({ ...bundleData, specialRequests: e.target.value })}
                        rows={4}
                        placeholder="Any special requirements or additional information..."
                        className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Pricing Preview */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-8 h-8 text-[#D4AF37]" />
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                      Review Your Bundle & Pricing
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* REMOVED: Bundle Details - No longer collecting this info */}

                    {/* REMOVED: Global Locations - each service now has its own pickup/dropoff */}

                    {/* REMOVED: Selected Vehicles section - now vehicles are selected per service */}

                    {/* Transportation & Experience Services */}
                    {bundleData.selectedServices.filter(s => s.category !== 'addon').length > 0 && (
                      <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">Transportation & Experience Services</h4>
                        <ul className="space-y-4">
                          {bundleData.selectedServices.filter(s => s.category !== 'addon').map((service) => (
                            <li key={service.id} className="border-b border-[#D4AF37]/10 pb-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-start gap-3">
                                  <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-white font-semibold">{service.name}</p>
                                    <p className="text-sm text-gray-400">{service.description}</p>
                                    {service.vehicleType && (
                                      <p className="text-sm text-[#D4AF37] mt-1 flex items-center gap-1">
                                        <Car className="w-3 h-3" />
                                        {service.vehicleType.name} - {service.vehicleType.capacity} passengers
                                        {(() => {
                                          const actualDuration = calculateActualDuration(service);
                                          if (actualDuration === 0) return null;
                                          const isOverMinimum = service.minimumHours && actualDuration > service.minimumHours;
                                          return (
                                            <span className="ml-2">
                                              ({actualDuration}hr {isOverMinimum ? 'actual' : 'minimum'} @ ${service.vehicleType.pricePerHour}/hr)
                                            </span>
                                          );
                                        })()}
                                      </p>
                                    )}
                                    {service.details?.passengers && (
                                      <p className="text-sm text-gray-400 mt-1">Passengers: {service.details.passengers}</p>
                                    )}
                                    {service.details?.luggage && (
                                      <p className="text-sm text-gray-400">Luggage: {service.details.luggage} bags</p>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[#D4AF37] font-semibold">
                                  ${service.vehicleType 
                                    ? ((service.serviceType === 'airport-pickup' || service.serviceType === 'airport-dropoff')
                                        ? (() => {
                                            switch (service.vehicleType.id) {
                                              case 'blackSuv': return 140;
                                              case 'sprinter14': return 240;
                                              case 'coach25': return 395;
                                              case 'coach28': return 425;
                                              case 'coach55': return 600;
                                              default: return 140;
                                            }
                                          })()
                                        : (service.id === 'city-tour' && service.vehicleType.id === 'blackSuv')
                                            ? 425
                                            : (service.minimumHours && service.minimumHours > 0
                                                ? service.vehicleType.pricePerHour * service.minimumHours
                                                : service.vehicleType.pricePerHour))
                                    : service.basePrice}
                                </p>
                              </div>
                              {/* Show location details */}
                              <div className="ml-8 mt-3 space-y-2">
                                {service.details?.pickupTime && (
                                  <p className="text-sm text-gray-400">
                                    <Clock className="w-3 h-3 inline mr-1" /> Pickup Time: {service.details.pickupTime}
                                  </p>
                                )}
                                {service.details?.pickupLocation && (
                                  <p className="text-sm text-gray-400">
                                    <MapPin className="w-3 h-3 inline mr-1" /> Pickup: {service.details.pickupLocation}
                                  </p>
                                )}
                                {service.details?.dropoffLocations && service.details.dropoffLocations.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold text-[#D4AF37]">Journey Itinerary:</p>
                                    {service.details.dropoffLocations.map((dropoff, index) => (
                                      <div key={dropoff.id} className="ml-4 space-y-1">
                                        <p className="text-sm text-gray-400">
                                          {index + 1}. Drop-off: {dropoff.address || '(not specified)'}
                                        </p>
                                        {dropoff.nextPickupTime && (
                                          <p className="text-xs text-[#D4AF37] ml-4">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            Next pickup at {dropoff.nextPickupTime}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Premium Add-ons */}
                    {bundleData.selectedServices.filter(s => s.category === 'addon').length > 0 && (
                      <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Premium Add-ons
                        </h4>
                        <ul className="space-y-3">
                          {bundleData.selectedServices.filter(s => s.category === 'addon').map((service) => (
                            <li key={service.id} className="flex items-center justify-between border-b border-green-500/10 pb-3">
                              <div className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-white font-semibold">{service.name}</p>
                                  <p className="text-sm text-gray-400">{service.description}</p>
                                </div>
                              </div>
                              <p className="text-green-400 font-semibold">${service.basePrice}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="bg-black/40 border border-[#D4AF37]/20 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-[#D4AF37] mb-4">Contact Information</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="text-white font-semibold">{bundleData.firstName} {bundleData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white font-semibold">{bundleData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white font-semibold">{bundleData.phone}</p>
                        </div>
                        {bundleData.companyName && (
                          <div>
                            <p className="text-sm text-gray-400">Company</p>
                            <p className="text-white font-semibold">{bundleData.companyName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Summary */}
                    <div className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border-2 border-[#D4AF37] rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-[#D4AF37] mb-6 flex items-center gap-2">
                        <DollarSign className="w-6 h-6" />
                        Pricing Summary
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-gray-300 pb-3 border-b border-[#D4AF37]/20">
                          <span className="text-lg">Subtotal</span>
                          <span className="text-xl font-semibold text-white">${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                            Total
                          </span>
                          <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-serif)' }}>
                            ${calculateTotal().toFixed(2)}
                          </span>
                        </div>


                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-[#D4AF37]/20 p-6">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#D4AF37]/50 text-white hover:bg-[#D4AF37]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === currentStep
                        ? 'bg-[#D4AF37] w-8'
                        : step < currentStep
                        ? 'bg-[#D4AF37]/50'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                >
                  <Check className="w-5 h-5" />
                  Submit Bundle Request
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
