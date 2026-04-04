import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  User,
  Phone,
  Clock,
  CheckCircle2,
  Navigation,
  UserCheck,
  Users,
  AlertCircle,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

// Mock assigned rides - in production would come from API
const mockAssignedRides = [
  {
    id: "RIDE-2026-001",
    passengerName: "John Smith",
    passengerPhone: "+1 (504) 555-9876",
    pickupLocation: "Louis Armstrong International Airport",
    pickupAddress: "900 Airline Dr, Kenner, LA 70062",
    dropoffLocation: "The Ritz-Carlton, New Orleans",
    dropoffAddress: "921 Canal St, New Orleans, LA 70112",
    scheduledTime: "2:30 PM",
    vehicleType: "Black Cadillac Escalade",
    status: "assigned", // assigned, accepted, enroute, arrived, contact, onboard, completed
    passengerReady: true
  }
];

export default function DriverDashboard() {
  const [rides, setRides] = useState(mockAssignedRides);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const handleAcceptRide = (rideId: string) => {
    setRides(rides.map(ride => 
      ride.id === rideId ? { ...ride, status: "accepted" } : ride
    ));
    console.log("Ride accepted:", rideId);
  };

  const handleStatusUpdate = (rideId: string, newStatus: string) => {
    if (newStatus === "completed") {
      const ride = rides.find(r => r.id === rideId);
      setSelectedRide(ride);
      setShowPinModal(true);
    } else {
      setRides(rides.map(ride => 
        ride.id === rideId ? { ...ride, status: newStatus } : ride
      ));
      console.log("Status updated:", rideId, newStatus);
    }
  };

  const handleCompleteWithPin = () => {
    if (pin.length === 4) {
      setRides(rides.map(ride => 
        ride.id === selectedRide.id ? { ...ride, status: "completed" } : ride
      ));
      setShowPinModal(false);
      setPin("");
      console.log("Ride completed with PIN:", pin);
      // In production: send completion to backend, notify passenger
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "assigned":
        return { label: "Awaiting Acceptance", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" };
      case "accepted":
        return { label: "Accepted", color: "bg-green-500/10 text-green-400 border-green-500/30" };
      case "enroute":
        return { label: "En Route", color: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30" };
      case "arrived":
        return { label: "Arrived", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "contact":
        return { label: "Contact Made", color: "bg-green-500/10 text-green-400 border-green-500/30" };
      case "onboard":
        return { label: "On Board", color: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30" };
      case "completed":
        return { label: "Completed", color: "bg-green-500/10 text-green-400 border-green-500/30" };
      default:
        return { label: "Unknown", color: "bg-gray-500/10 text-gray-400 border-gray-500/30" };
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case "assigned":
        return { label: "Accept Ride", action: "accepted", icon: CheckCircle2, color: "bg-green-600 hover:bg-green-700" };
      case "accepted":
        return { label: "Start Route", action: "enroute", icon: Navigation, color: "bg-[#D4AF37] hover:bg-[#D4AF37]/90" };
      case "enroute":
        return { label: "Mark Arrived", action: "arrived", icon: MapPin, color: "bg-[#D4AF37] hover:bg-[#D4AF37]/90" };
      case "arrived":
        return { label: "Made Contact", action: "contact", icon: UserCheck, color: "bg-[#D4AF37] hover:bg-[#D4AF37]/90" };
      case "contact":
        return { label: "Passenger On Board", action: "onboard", icon: Users, color: "bg-[#D4AF37] hover:bg-[#D4AF37]/90" };
      case "onboard":
        return { label: "Complete Ride", action: "completed", icon: CheckCircle2, color: "bg-green-600 hover:bg-green-700" };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-black border-b border-[#D4AF37]/20 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Driver Dashboard
          </h1>
          <p className="text-gray-400">Manage your assigned rides</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Rides</p>
                  <p className="text-2xl font-bold text-white">
                    {rides.filter(r => r.status !== "completed").length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                  <Navigation className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Accept</p>
                  <p className="text-2xl font-bold text-white">
                    {rides.filter(r => r.status === "assigned").length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {rides.filter(r => ["accepted", "enroute", "arrived", "contact", "onboard"].includes(r.status)).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {rides.filter(r => r.status === "completed").length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Rides */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Your Assigned Rides
          </h2>

          {rides.length === 0 ? (
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400">No rides assigned at this time</p>
              </CardContent>
            </Card>
          ) : (
            rides.map((ride, index) => {
              const statusInfo = getStatusInfo(ride.status);
              const nextAction = getNextAction(ride.status);

              return (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                            {ride.passengerReady && ride.status === "assigned" && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                                Passenger Ready
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">Ride ID: {ride.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Scheduled Time</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-white font-semibold">{ride.scheduledTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Info */}
                      <div className="bg-black/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                            <User className="w-6 h-6 text-black" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{ride.passengerName}</p>
                            <p className="text-sm text-gray-400">{ride.vehicleType}</p>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20"
                            onClick={() => window.location.href = `tel:${ride.passengerPhone}`}
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Pickup</p>
                                <p className="text-white font-medium">{ride.pickupLocation}</p>
                                <p className="text-xs text-gray-400">{ride.pickupAddress}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-red-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Drop-off</p>
                                <p className="text-white font-medium">{ride.dropoffLocation}</p>
                                <p className="text-xs text-gray-400">{ride.dropoffAddress}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {ride.status !== "completed" && nextAction && (
                        <div className="flex gap-3">
                          {ride.status === "assigned" ? (
                            <>
                              <Button
                                onClick={() => handleAcceptRide(ride.id)}
                                className={`flex-1 ${nextAction.color} text-black font-semibold`}
                              >
                                <nextAction.icon className="w-4 h-4 mr-2" />
                                {nextAction.label}
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleStatusUpdate(ride.id, nextAction.action)}
                              className={`flex-1 ${nextAction.color} text-black font-semibold`}
                            >
                              <nextAction.icon className="w-4 h-4 mr-2" />
                              {nextAction.label}
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            </Button>
                          )}
                        </div>
                      )}

                      {ride.status === "completed" && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                          <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                          <p className="text-green-400 font-semibold">Ride Completed</p>
                        </div>
                      )}

                      {/* Progress Steps for accepted rides */}
                      {ride.status !== "assigned" && ride.status !== "completed" && (
                        <div className="mt-4 pt-4 border-t border-[#D4AF37]/10">
                          <div className="flex items-center justify-between text-xs">
                            {["accepted", "enroute", "arrived", "contact", "onboard"].map((step, idx, arr) => {
                              const statuses = ["accepted", "enroute", "arrived", "contact", "onboard"];
                              const currentIndex = statuses.indexOf(ride.status);
                              const stepIndex = statuses.indexOf(step);
                              const isCompleted = stepIndex <= currentIndex;
                              
                              return (
                                <div key={step} className="flex items-center flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                    isCompleted 
                                      ? 'bg-[#D4AF37] border-[#D4AF37]' 
                                      : 'bg-transparent border-gray-600'
                                  }`}>
                                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-black" />}
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-[#D4AF37]' : 'bg-gray-600'}`} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* PIN Confirmation Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Confirm Ride Completion
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your 4-digit PIN to complete this ride
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-300">Driver PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-digit PIN"
                className="bg-black border-[#D4AF37]/30 text-white text-center text-2xl tracking-widest focus:border-[#D4AF37]"
              />
            </div>
            
            <Button
              onClick={handleCompleteWithPin}
              disabled={pin.length !== 4}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Ride
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
