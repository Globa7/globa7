import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Clock, Car, Phone, MessageSquare, Star, Calendar,
  CheckCircle, Loader, Navigation, User, CreditCard, FileText,
  LogOut, Plus, Eye, ChevronRight, Sparkles, Shield, Zap,
  Bell, Settings, History, Receipt, Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../../utils/supabase/client';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

const RIDE_STATUS_STEPS = [
  { status: 'pending', label: 'Booking Confirmed', icon: CheckCircle, color: 'text-blue-400' },
  { status: 'accepted', label: 'Driver Assigned', icon: User, color: 'text-purple-400' },
  { status: 'en_route', label: 'Driver En Route', icon: Navigation, color: 'text-yellow-400' },
  { status: 'arrived', label: 'Driver Arrived', icon: MapPin, color: 'text-orange-400' },
  { status: 'on_board', label: 'Passenger On Board', icon: Car, color: 'text-green-400' },
  { status: 'completed', label: 'Trip Completed', icon: CheckCircle, color: 'text-green-500' },
];

export function PassengerPortal() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  
  // Data states
  const [activeRides, setActiveRides] = useState<any[]>([]);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [rideHistory, setRideHistory] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [liveTracking, setLiveTracking] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchPassengerData();
    
    // Poll for live updates every 10 seconds
    const interval = setInterval(() => {
      if (activeRides.length > 0) {
        fetchLiveUpdates();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const fetchPassengerData = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/passenger/rides`, { headers });
      const data = await res.json();
      
      if (data.success) {
        setActiveRides(data.activeRides || []);
        setUpcomingRides(data.upcomingRides || []);
        setRideHistory(data.rideHistory || []);
      }
    } catch (error) {
      console.error('Error fetching passenger data:', error);
      toast.error('Failed to load your rides');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveUpdates = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/passenger/live-tracking`, { headers });
      const data = await res.json();
      
      if (data.success && data.tracking) {
        setLiveTracking(data.tracking);
      }
    } catch (error) {
      console.error('Error fetching live updates:', error);
    }
  };

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
    };
  };

  const handleViewRide = (ride: any) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  const handleCancelRide = async (rideId: string) => {
    if (!confirm('Are you sure you want to cancel this ride?')) return;
    
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/passenger/rides/${rideId}/cancel`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Ride cancelled successfully');
        fetchPassengerData();
        setShowRideDetails(false);
      } else {
        toast.error('Failed to cancel ride');
      }
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast.error('Failed to cancel ride');
    }
  };

  const getRideStatus = (ride: any) => {
    const currentIndex = RIDE_STATUS_STEPS.findIndex(step => step.status === ride.status);
    return { currentIndex, steps: RIDE_STATUS_STEPS };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gold font-cormorant text-xl">Loading your rides...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
                <p className="text-xs text-gray-400">Passenger Portal</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="border-gold/50 text-gold hover:bg-gold hover:text-black relative"
              >
                <Bell className="h-4 w-4" />
                {activeRides.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {activeRides.length}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={signOut} className="border-gold text-gold hover:bg-gold hover:text-black">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-cormorant text-gold mb-2">
                Welcome, {user?.firstName || 'Guest'}
              </h2>
              <p className="text-gray-400">Manage your luxury transportation experiences</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/reserve')}
                className="bg-gold text-black hover:bg-gold/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </Button>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Rides', value: activeRides.length, icon: Car, color: 'from-green-500 to-green-600' },
              { label: 'Upcoming', value: upcomingRides.length, icon: Calendar, color: 'from-blue-500 to-blue-600' },
              { label: 'Completed', value: rideHistory.length, icon: CheckCircle, color: 'from-gold to-yellow-600' },
              { label: 'Loyalty Points', value: rideHistory.length * 50, icon: Star, color: 'from-purple-500 to-purple-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-charcoal border-gold/20 overflow-hidden group hover:shadow-lg hover:shadow-gold/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-3xl font-cormorant text-white mt-1">{stat.value}</p>
                      </div>
                      <motion.div
                        className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-charcoal border border-gold/20 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Car className="h-4 w-4 mr-2" />
              Active Rides
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Rides Tab */}
          <TabsContent value="active">
            <div className="space-y-6">
              {activeRides.length > 0 ? (
                activeRides.map((ride, index) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-gold/5 to-yellow-500/5 border-gold/30 overflow-hidden">
                      <CardContent className="p-6">
                        {/* Live Status Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="relative"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                              <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                            </motion.div>
                            <div>
                              <h3 className="text-xl font-semibold text-white">LIVE</h3>
                              <p className="text-sm text-gray-400">Ride in progress</p>
                            </div>
                          </div>
                          <Badge className="bg-gold text-black">
                            {ride.serviceType}
                          </Badge>
                        </div>

                        {/* Status Timeline */}
                        <div className="mb-6">
                          <div className="relative">
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gold/20"></div>
                            <div className="relative flex justify-between">
                              {RIDE_STATUS_STEPS.map((step, idx) => {
                                const { currentIndex } = getRideStatus(ride);
                                const isCompleted = idx <= currentIndex;
                                const isCurrent = idx === currentIndex;
                                
                                return (
                                  <div key={step.status} className="flex flex-col items-center">
                                    <motion.div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isCompleted ? 'bg-gold' : 'bg-charcoal'
                                      } ${isCurrent ? 'ring-4 ring-gold/50' : ''}`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: idx * 0.1 }}
                                    >
                                      <step.icon className={`h-5 w-5 ${isCompleted ? 'text-black' : 'text-gray-500'}`} />
                                    </motion.div>
                                    <p className={`text-xs mt-2 text-center max-w-[80px] ${
                                      isCompleted ? 'text-white' : 'text-gray-500'
                                    }`}>
                                      {step.label}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Ride Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 rounded-lg bg-black/30">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gold" />
                              <p className="text-sm text-gray-400">Pickup</p>
                            </div>
                            <p className="text-white font-semibold">{ride.pickupLocation}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-black/30">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-gold" />
                              <p className="text-sm text-gray-400">Drop-off</p>
                            </div>
                            <p className="text-white font-semibold">{ride.dropoffLocation}</p>
                          </div>
                        </div>

                        {/* Driver Info (if assigned) */}
                        {ride.driver && (
                          <motion.div
                            className="p-6 rounded-lg bg-gradient-to-br from-gold/10 to-yellow-500/10 border border-gold/30 mb-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-gold">
                                  <AvatarFallback className="bg-gold text-black text-xl font-semibold">
                                    {ride.driver.firstName[0]}{ride.driver.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="text-lg font-semibold text-white">
                                    {ride.driver.firstName} {ride.driver.lastName}
                                  </h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < ride.driver.rating ? 'text-gold fill-gold' : 'text-gray-600'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-sm text-gray-400 ml-2">
                                      ({ride.driver.totalTrips} trips)
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {ride.vehicle.make} {ride.vehicle.model} • {ride.vehicle.color}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gold text-gold hover:bg-gold hover:text-black"
                                  onClick={() => window.location.href = `tel:${ride.driver.phone}`}
                                >
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gold text-gold hover:bg-gold hover:text-black"
                                  onClick={() => window.location.href = `sms:${ride.driver.phone}`}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* ETA */}
                            {ride.status === 'en_route' && ride.eta && (
                              <motion.div
                                className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-yellow-400" />
                                  <div>
                                    <p className="text-sm text-gray-300">Estimated Arrival</p>
                                    <p className="text-lg font-semibold text-white">{ride.eta} minutes</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleViewRide(ride)}
                            className="flex-1 bg-gold text-black hover:bg-gold/90"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {ride.status === 'pending' && (
                            <Button
                              onClick={() => handleCancelRide(ride.id)}
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Car className="h-16 w-16 mx-auto mb-4 text-gray-600 opacity-50" />
                  <h3 className="text-xl text-gray-400 mb-2">No active rides</h3>
                  <p className="text-gray-500 mb-6">Book a ride to see live tracking here</p>
                  <Button
                    onClick={() => navigate('/reserve')}
                    className="bg-gold text-black hover:bg-gold/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book a Ride
                  </Button>
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* Upcoming Rides Tab */}
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingRides.length > 0 ? (
                upcomingRides.map((ride, index) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-charcoal border-gold/20 hover:border-gold/40 transition-all group cursor-pointer"
                      onClick={() => handleViewRide(ride)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Calendar className="h-5 w-5 text-gold" />
                              <div>
                                <h3 className="text-lg font-semibold text-white">{ride.serviceType}</h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(ride.pickupDateTime).toLocaleDateString()} at {new Date(ride.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-gray-400">
                                <MapPin className="h-4 w-4" />
                                {ride.pickupLocation}
                              </div>
                              <ChevronRight className="h-4 w-4 text-gold" />
                              <div className="flex items-center gap-1 text-gray-400">
                                <MapPin className="h-4 w-4" />
                                {ride.dropoffLocation}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="mb-2">{ride.status}</Badge>
                            <p className="text-xl font-cormorant text-gold">${ride.estimatedPrice}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-600 opacity-50" />
                  <h3 className="text-xl text-gray-400 mb-2">No upcoming rides</h3>
                  <p className="text-gray-500">Schedule your next luxury transportation experience</p>
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              {rideHistory.length > 0 ? (
                rideHistory.map((ride, index) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-charcoal border-gold/20 hover:border-gold/40 transition-all group cursor-pointer"
                      onClick={() => handleViewRide(ride)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <div>
                                <h3 className="text-lg font-semibold text-white">{ride.serviceType}</h3>
                                <p className="text-sm text-gray-400">
                                  {new Date(ride.completedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="h-4 w-4" />
                              <span>{ride.pickupLocation} → {ride.dropoffLocation}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-cormorant text-white mb-2">${ride.finalPrice}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gold/50 text-gold hover:bg-gold hover:text-black"
                            >
                              <Receipt className="h-3 w-3 mr-1" />
                              Receipt
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <History className="h-16 w-16 mx-auto mb-4 text-gray-600 opacity-50" />
                  <h3 className="text-xl text-gray-400 mb-2">No ride history</h3>
                  <p className="text-gray-500">Your completed rides will appear here</p>
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ride Details Modal */}
      <AnimatePresence>
        {showRideDetails && selectedRide && (
          <Dialog open={showRideDetails} onOpenChange={setShowRideDetails}>
            <DialogContent className="bg-charcoal border-gold text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-cormorant text-gold">Ride Details</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Booking ID: {selectedRide.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Trip Information */}
                <div className="p-4 rounded-lg bg-black/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Trip Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Service Type</p>
                      <p className="text-white font-semibold">{selectedRide.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date & Time</p>
                      <p className="text-white font-semibold">
                        {new Date(selectedRide.pickupDateTime).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Passengers</p>
                      <p className="text-white font-semibold">{selectedRide.passengers}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Vehicle</p>
                      <p className="text-white font-semibold">{selectedRide.vehicleType}</p>
                    </div>
                  </div>
                </div>

                {/* Locations */}
                <div className="p-4 rounded-lg bg-black/30">
                  <h3 className="text-lg font-semibold text-white mb-3">Locations</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Pickup</p>
                      <p className="text-white">{selectedRide.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Drop-off</p>
                      <p className="text-white">{selectedRide.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Total</h3>
                    <p className="text-3xl font-cormorant text-gold">${selectedRide.estimatedPrice}</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}