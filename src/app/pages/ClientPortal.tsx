import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  User, Mail, Phone, Calendar, MapPin, Clock, Car, CheckCircle, 
  XCircle, Loader, Award, ArrowLeft, LogOut, Edit 
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

interface Booking {
  id: string;
  serviceType: string;
  vehicleType: string;
  pickupDateTime: string;
  pickupLocation: string;
  dropoffLocation?: string;
  status: string;
}

export function ClientPortal() {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Redirect admins to admin dashboard
    if (user.role === 'admin') {
      navigate('/admin');
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      // Load profile
      const profileRes = await fetch(`${API_BASE}/client/profile`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
        setEditedProfile(profileData.profile);
      }

      // Load bookings
      const bookingsRes = await fetch(`${API_BASE}/client/bookings`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileUpdate() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/client/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setEditMode(false);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Loader className="w-4 h-4" />;
    }
  };

  const upcomingBookings = bookings.filter(b => 
    ['pending', 'confirmed'].includes(b.status) && 
    new Date(b.pickupDateTime) > new Date()
  );

  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || 
    new Date(b.pickupDateTime) < new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ x: -5 }}
                onClick={() => navigate('/')}
                className="text-[#D4AF37] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>
                  Client Portal
                </h1>
                <p className="text-sm text-gray-400">Welcome back, {profile?.name}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-[#D4AF37]/10">
                    <Calendar className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{bookings.length}</p>
                    <p className="text-sm text-gray-400">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{upcomingBookings.length}</p>
                    <p className="text-sm text-gray-400">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Car className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{pastBookings.length}</p>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-[#D4AF37]/10">
                    <Award className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{profile?.loyaltyPoints || 0}</p>
                    <p className="text-sm text-gray-400">Loyalty Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border border-[#D4AF37]/20">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Upcoming Bookings */}
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Trips</CardTitle>
                <CardDescription>Your scheduled reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No upcoming bookings</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-black/40 rounded-lg border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-[#D4AF37]/10">
                              <Car className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{booking.serviceType}</h3>
                              <p className="text-sm text-gray-400">{booking.vehicleType}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4 text-[#D4AF37]" />
                            {new Date(booking.pickupDateTime).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-[#D4AF37]" />
                            {booking.pickupLocation}
                          </div>
                        </div>
                        {booking.dropoffLocation && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            {booking.dropoffLocation}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Bookings */}
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Past Trips</CardTitle>
                <CardDescription>Your booking history</CardDescription>
              </CardHeader>
              <CardContent>
                {pastBookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No past bookings</p>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-black/40 rounded-lg border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-gray-800">
                              <Car className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{booking.serviceType}</h3>
                              <p className="text-sm text-gray-400">{booking.vehicleType}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {new Date(booking.pickupDateTime).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription>Manage your account details</CardDescription>
                  </div>
                  {!editMode && (
                    <Button
                      onClick={() => setEditMode(true)}
                      variant="outline"
                      className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-400">Full Name</Label>
                      {editMode ? (
                        <Input
                          value={editedProfile?.name || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="bg-black/40 border-[#D4AF37]/30 text-white"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-white">
                          <User className="w-4 h-4 text-[#D4AF37]" />
                          {profile?.name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Email</Label>
                      <div className="flex items-center gap-2 text-white">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        {profile?.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Phone</Label>
                      {editMode ? (
                        <Input
                          value={editedProfile?.phone || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="bg-black/40 border-[#D4AF37]/30 text-white"
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-white">
                          <Phone className="w-4 h-4 text-[#D4AF37]" />
                          {profile?.phone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400">Member Since</Label>
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        {new Date(profile?.memberSince).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleProfileUpdate}
                        className="btn-gold"
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          setEditedProfile(profile);
                        }}
                        variant="outline"
                        className="border-gray-600 text-gray-400"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Saved Addresses</CardTitle>
                <CardDescription>Quick access to your frequent locations</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.savedAddresses?.length === 0 || !profile?.savedAddresses ? (
                  <p className="text-gray-400 text-center py-8">No saved addresses yet</p>
                ) : (
                  <div className="space-y-4">
                    {profile.savedAddresses.map((address: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-black/40 rounded-lg border border-[#D4AF37]/10"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[#D4AF37] mt-1" />
                          <div>
                            <h3 className="font-semibold text-white">{address.label}</h3>
                            <p className="text-sm text-gray-400">{address.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Loyalty Rewards</CardTitle>
                <CardDescription>Your Globa7 rewards program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="inline-flex p-6 rounded-full bg-[#D4AF37]/10 mb-4">
                    <Award className="w-12 h-12 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{profile?.loyaltyPoints || 0}</h3>
                  <p className="text-gray-400">Loyalty Points</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Earn 10 points for every ride • Redeem for discounts and perks
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}