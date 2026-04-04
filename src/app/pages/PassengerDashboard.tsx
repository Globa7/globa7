import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  User,
  Car,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  Star,
  X
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

// Mock ride data - in production this would come from URL params and API
const mockRideData = {
  id: "RIDE-2026-001",
  passengerName: "John Smith",
  pickupLocation: "Louis Armstrong International Airport",
  pickupAddress: "900 Airline Dr, Kenner, LA 70062",
  dropoffLocation: "The Ritz-Carlton, New Orleans",
  dropoffAddress: "921 Canal St, New Orleans, LA 70112",
  scheduledTime: "2:30 PM",
  vehicleType: "Black Cadillac Escalade",
  status: "assigned", // pending, assigned, accepted, enroute, arrived, contact, onboard, completed
  driver: {
    name: "Michael Johnson",
    phone: "+1 (504) 555-0123",
    photo: null,
    rating: 4.9,
    vehicle: "Escalade #1"
  }
};

export default function PassengerDashboard() {
  const [rideData, setRideData] = useState(mockRideData);
  const [isReady, setIsReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  // Simulate status updates - in production this would be real-time via websocket/polling
  useEffect(() => {
    if (rideData.status === "completed") {
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        setShowRatingModal(true);
      }, 3000);
    }
  }, [rideData.status]);

  const handleReadyClick = () => {
    setIsReady(true);
    // In production: send to dispatch dashboard via API
    console.log("Passenger marked as ready - notifying dispatch");
  };

  const handleSubmitRating = () => {
    console.log("Rating submitted:", rating);
    setShowRatingModal(false);
    // In production: deactivate link and redirect
    alert("Thank you for your feedback! This tracking link is now deactivated.");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Ride Pending",
          description: "Waiting for driver assignment",
          color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
          icon: Clock
        };
      case "assigned":
        return {
          label: "Driver Assigned",
          description: "Waiting for driver to accept",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          icon: User
        };
      case "accepted":
        return {
          label: "Ride Accepted",
          description: "Driver has accepted your ride",
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          icon: CheckCircle2
        };
      case "enroute":
        return {
          label: "Driver En Route",
          description: "Driver is on the way to pick you up",
          color: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30",
          icon: Car
        };
      case "arrived":
        return {
          label: "Driver Arrived",
          description: "Driver has arrived at pickup location",
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          icon: MapPin
        };
      case "contact":
        return {
          label: "Contact Made",
          description: "Driver has made contact with you",
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          icon: MessageCircle
        };
      case "onboard":
        return {
          label: "On Board",
          description: "Trip is in progress",
          color: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30",
          icon: Car
        };
      case "completed":
        return {
          label: "Completed",
          description: "Your ride has been completed",
          color: "bg-green-500/10 text-green-400 border-green-500/30",
          icon: CheckCircle2
        };
      default:
        return {
          label: "Unknown",
          description: "",
          color: "bg-gray-500/10 text-gray-400 border-gray-500/30",
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo(rideData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-black border-b border-[#D4AF37]/20 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Globa7 Transportation
          </h1>
          <p className="text-gray-400">Track your luxury ride in real-time</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                    <StatusIcon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <Badge variant="outline" className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                    <p className="text-sm text-gray-400 mt-1">{statusInfo.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Ride ID</p>
                  <p className="text-sm text-white font-mono">{rideData.id}</p>
                </div>
              </div>

              {/* Ready Button */}
              {!isReady && rideData.status === "assigned" && (
                <Button
                  onClick={handleReadyClick}
                  className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  I'm Ready for Pickup
                </Button>
              )}

              {isReady && rideData.status === "assigned" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Dispatch has been notified!</p>
                  <p className="text-sm text-gray-400 mt-1">Waiting for driver to accept...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Trip Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Trip Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 mt-1">
                    <MapPin className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                    <p className="text-white font-semibold">{rideData.pickupLocation}</p>
                    <p className="text-sm text-gray-400">{rideData.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 mt-1">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Drop-off Location</p>
                    <p className="text-white font-semibold">{rideData.dropoffLocation}</p>
                    <p className="text-sm text-gray-400">{rideData.dropoffAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Scheduled Time</p>
                    <p className="text-white font-semibold">{rideData.scheduledTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                    <Car className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                    <p className="text-white font-semibold">{rideData.vehicleType}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Driver Information */}
        {rideData.status !== "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Your Driver
                </h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                    <User className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-white">{rideData.driver.name}</p>
                    <p className="text-sm text-gray-400">{rideData.driver.vehicle}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-sm text-white font-semibold">{rideData.driver.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20"
                    onClick={() => window.location.href = `tel:${rideData.driver.phone}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Driver
                  </Button>
                  <Button 
                    className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20"
                    onClick={() => window.location.href = `sms:${rideData.driver.phone}`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progress Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Trip Progress
              </h2>
              
              <div className="space-y-4">
                {[
                  { status: "assigned", label: "Driver Assigned" },
                  { status: "accepted", label: "Ride Accepted" },
                  { status: "enroute", label: "En Route" },
                  { status: "arrived", label: "Arrived" },
                  { status: "contact", label: "Contact Made" },
                  { status: "onboard", label: "On Board" },
                  { status: "completed", label: "Completed" }
                ].map((step, index) => {
                  const statuses = ["assigned", "accepted", "enroute", "arrived", "contact", "onboard", "completed"];
                  const currentIndex = statuses.indexOf(rideData.status);
                  const stepIndex = statuses.indexOf(step.status);
                  const isCompleted = stepIndex <= currentIndex;
                  const isCurrent = stepIndex === currentIndex;
                  
                  return (
                    <div key={step.status} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isCompleted 
                          ? 'bg-[#D4AF37] border-[#D4AF37]' 
                          : 'bg-[#1A1A1A] border-gray-600'
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-5 h-5 text-black" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${isCurrent ? 'text-[#D4AF37]' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Thank You Message */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-lg p-8 max-w-md text-center"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Thank You for Your Service!
              </h2>
              <p className="text-gray-400">
                We hope you enjoyed your luxury ride with Globa7 Transportation
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Modal */}
      <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
        <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Rate Your Experience
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              How was your ride with {rideData.driver.name}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= rating 
                        ? 'text-[#D4AF37] fill-[#D4AF37]' 
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold disabled:opacity-50"
            >
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
