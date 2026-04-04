import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { WebsiteBuilder } from '../components/WebsiteBuilder';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

interface Booking {
  id: string;
  serviceType: string;
  vehicleType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  name: string;
  phone: string;
  status: string;
  driverId?: string;
}

interface Pricing {
  baseRates: { [key: string]: number };
  zones: { [key: string]: number };
  timeMultipliers: { [key: string]: number };
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  services: string[];
  price: number;
  discount: number;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  status: string;
}

export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pricing, setPricing] = useState<Pricing>(null);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [editingPricing, setEditingPricing] = useState(false);
  const [newBundle, setNewBundle] = useState<Bundle>(null);
  const [newDriver, setNewDriver] = useState<Driver>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/portal');
      toast.error('Access denied', { description: 'Admin privileges required' });
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

      // Load analytics
      const analyticsRes = await fetch(`${API_BASE}/admin/analytics`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }

      // Load all bookings
      const bookingsRes = await fetch(`${API_BASE}/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings);
      }

      // Load pricing
      const pricingRes = await fetch(`${API_BASE}/admin/pricing`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (pricingRes.ok) {
        const data = await pricingRes.json();
        setPricing(data.pricing);
      }

      // Load bundles
      const bundlesRes = await fetch(`${API_BASE}/admin/bundles`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (bundlesRes.ok) {
        const data = await bundlesRes.json();
        setBundles(data.bundles);
      }

      // Load drivers
      const driversRes = await fetch(`${API_BASE}/admin/drivers`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });
      if (driversRes.ok) {
        const data = await driversRes.json();
        setDrivers(data.drivers);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(bookingId: string, status: string, driverId?: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status, driverId }),
      });

      if (response.ok) {
        await loadData();
        toast.success('Booking updated successfully');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  }

  async function savePricing() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/pricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(pricing),
      });

      if (response.ok) {
        setEditingPricing(false);
        toast.success('Pricing updated successfully');
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing');
    }
  }

  async function createBundle() {
    if (!newBundle) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/bundles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newBundle),
      });

      if (response.ok) {
        await loadData();
        setNewBundle(null);
        toast.success('Bundle created successfully');
      }
    } catch (error) {
      console.error('Error creating bundle:', error);
      toast.error('Failed to create bundle');
    }
  }

  async function deleteBundle(bundleId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/bundles/${bundleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        await loadData();
        toast.success('Bundle deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    }
  }

  async function createDriver() {
    if (!newDriver) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/drivers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(newDriver),
      });

      if (response.ok) {
        await loadData();
        setNewDriver(null);
        toast.success('Driver added successfully');
      }
    } catch (error) {
      console.error('Error creating driver:', error);
      toast.error('Failed to add driver');
    }
  }

  async function updateDriverStatus(driverId: string, status: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/drivers/${driverId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await loadData();
        toast.success('Driver status updated');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Failed to update driver');
    }
  }

  async function deleteDriver(driverId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/drivers/${driverId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      });

      if (response.ok) {
        await loadData();
        toast.success('Driver removed successfully');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to remove driver');
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
                <h1 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  <LayoutDashboard className="w-6 h-6 text-[#D4AF37]" />
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">Globa7 Business Management</p>
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
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#D4AF37]/20 to-[#1A1A1A] border-[#D4AF37]/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-[#D4AF37]/20">
                    <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
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
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analytics?.totalBookings || 0}</p>
                    <p className="text-sm text-gray-400">Total Bookings</p>
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
                  <div className="p-3 rounded-full bg-yellow-500/10">
                    <Clock className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analytics?.pendingBookings || 0}</p>
                    <p className="text-sm text-gray-400">Pending</p>
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
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analytics?.completedBookings || 0}</p>
                    <p className="text-sm text-gray-400">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="bg-[#1A1A1A] border border-[#D4AF37]/20">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="website">
              <Paintbrush className="w-4 h-4 mr-2" />
              Website Builder
            </TabsTrigger>
          </TabsList>

          {/* Bookings Management */}
          <TabsContent value="bookings">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">All Bookings</CardTitle>
                <CardDescription>Manage and track all reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No bookings yet</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-black/40 rounded-lg border border-[#D4AF37]/10"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {booking.serviceType} - {booking.vehicleType}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-400">
                              <p>Pickup: {booking.pickupLocation}</p>
                              {booking.dropoffLocation && <p>Dropoff: {booking.dropoffLocation}</p>}
                              <p>Date: {new Date(booking.pickupDateTime).toLocaleString()}</p>
                              <p>Client: {booking.name} • {booking.phone}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={booking.status}
                            onValueChange={(value) => updateBookingStatus(booking.id, value)}
                          >
                            <SelectTrigger className="w-40 bg-black/40 border-[#D4AF37]/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          {drivers.length > 0 && (
                            <Select
                              value={booking.driverId || ''}
                              onValueChange={(value) => updateBookingStatus(booking.id, booking.status, value)}
                            >
                              <SelectTrigger className="w-48 bg-black/40 border-[#D4AF37]/30">
                                <SelectValue placeholder="Assign Driver" />
                              </SelectTrigger>
                              <SelectContent>
                                {drivers.filter(d => d.status === 'available').map((driver) => (
                                  <SelectItem key={driver.id} value={driver.id}>
                                    {driver.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Management */}
          <TabsContent value="pricing">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Pricing Configuration</CardTitle>
                    <CardDescription>Manage rates, zones, and time multipliers</CardDescription>
                  </div>
                  {!editingPricing ? (
                    <Button
                      onClick={() => setEditingPricing(true)}
                      className="btn-gold"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Pricing
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={savePricing} className="btn-gold">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingPricing(false)}
                        variant="outline"
                        className="border-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {pricing && (
                  <div className="space-y-8">
                    {/* Base Rates */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Base Rates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(pricing.baseRates).map(([vehicle, rate]) => (
                          <div key={vehicle} className="space-y-2">
                            <Label className="text-gray-400 capitalize">{vehicle}</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                              <Input
                                type="number"
                                value={rate}
                                onChange={(e) => editingPricing && setPricing({
                                  ...pricing,
                                  baseRates: { ...pricing.baseRates, [vehicle]: parseFloat(e.target.value) }
                                })}
                                disabled={!editingPricing}
                                className="pl-10 bg-black/40 border-[#D4AF37]/30 text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Zone Multipliers */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Zone Multipliers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(pricing.zones).map(([zone, multiplier]) => (
                          <div key={zone} className="space-y-2">
                            <Label className="text-gray-400 capitalize">{zone}</Label>
                            <div className="relative">
                              <X className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                              <Input
                                type="number"
                                step="0.05"
                                value={multiplier}
                                onChange={(e) => editingPricing && setPricing({
                                  ...pricing,
                                  zones: { ...pricing.zones, [zone]: parseFloat(e.target.value) }
                                })}
                                disabled={!editingPricing}
                                className="pl-10 bg-black/40 border-[#D4AF37]/30 text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Multipliers */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Time-Based Multipliers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(pricing.timeMultipliers).map(([time, multiplier]) => (
                          <div key={time} className="space-y-2">
                            <Label className="text-gray-400 capitalize">{time.replace(/([A-Z])/g, ' $1')}</Label>
                            <div className="relative">
                              <X className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                              <Input
                                type="number"
                                step="0.05"
                                value={multiplier}
                                onChange={(e) => editingPricing && setPricing({
                                  ...pricing,
                                  timeMultipliers: { ...pricing.timeMultipliers, [time]: parseFloat(e.target.value) }
                                })}
                                disabled={!editingPricing}
                                className="pl-10 bg-black/40 border-[#D4AF37]/30 text-white"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bundles Management */}
          <TabsContent value="bundles">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Service Bundles</CardTitle>
                    <CardDescription>Create and manage package deals</CardDescription>
                  </div>
                  <Dialog open={newBundle !== null} onOpenChange={(open) => !open && setNewBundle(null)}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setNewBundle({ name: '', description: '', services: [], price: 0, discount: 0 })}
                        className="btn-gold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Bundle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Create New Bundle</DialogTitle>
                        <DialogDescription>Add a new service package</DialogDescription>
                      </DialogHeader>
                      {newBundle && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-400">Bundle Name</Label>
                            <Input
                              value={newBundle.name}
                              onChange={(e) => setNewBundle({ ...newBundle, name: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                              placeholder="Wedding Premium Package"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-400">Description</Label>
                            <Input
                              value={newBundle.description}
                              onChange={(e) => setNewBundle({ ...newBundle, description: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                              placeholder="Full day luxury transportation"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-gray-400">Price</Label>
                              <Input
                                type="number"
                                value={newBundle.price}
                                onChange={(e) => setNewBundle({ ...newBundle, price: parseFloat(e.target.value) })}
                                className="bg-black/40 border-[#D4AF37]/30 text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-gray-400">Discount %</Label>
                              <Input
                                type="number"
                                value={newBundle.discount}
                                onChange={(e) => setNewBundle({ ...newBundle, discount: parseFloat(e.target.value) })}
                                className="bg-black/40 border-[#D4AF37]/30 text-white"
                              />
                            </div>
                          </div>
                          <Button onClick={createBundle} className="w-full btn-gold">
                            Create Bundle
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {bundles.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No bundles created yet</p>
                ) : (
                  <div className="space-y-4">
                    {bundles.map((bundle) => (
                      <div
                        key={bundle.id}
                        className="p-4 bg-black/40 rounded-lg border border-[#D4AF37]/10 flex items-start justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-white">{bundle.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{bundle.description}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[#D4AF37]">${bundle.price}</span>
                            {bundle.discount > 0 && (
                              <Badge className="bg-green-500/10 text-green-500">
                                {bundle.discount}% Off
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteBundle(bundle.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Management */}
          <TabsContent value="drivers">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Driver Management</CardTitle>
                    <CardDescription>Manage your fleet drivers</CardDescription>
                  </div>
                  <Dialog open={newDriver !== null} onOpenChange={(open) => !open && setNewDriver(null)}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setNewDriver({ name: '', phone: '', email: '', vehicle: '', status: 'available' })}
                        className="btn-gold"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Driver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New Driver</DialogTitle>
                        <DialogDescription>Register a new driver</DialogDescription>
                      </DialogHeader>
                      {newDriver && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-400">Full Name</Label>
                            <Input
                              value={newDriver.name}
                              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-400">Phone</Label>
                            <Input
                              value={newDriver.phone}
                              onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-400">Email</Label>
                            <Input
                              type="email"
                              value={newDriver.email}
                              onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-gray-400">Vehicle</Label>
                            <Input
                              value={newDriver.vehicle}
                              onChange={(e) => setNewDriver({ ...newDriver, vehicle: e.target.value })}
                              className="bg-black/40 border-[#D4AF37]/30 text-white"
                              placeholder="2023 Mercedes S-Class"
                            />
                          </div>
                          <Button onClick={createDriver} className="w-full btn-gold">
                            Add Driver
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {drivers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No drivers registered yet</p>
                ) : (
                  <div className="space-y-4">
                    {drivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="p-4 bg-black/40 rounded-lg border border-[#D4AF37]/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-[#D4AF37]/10">
                              <Users className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{driver.name}</h3>
                              <p className="text-sm text-gray-400">{driver.vehicle}</p>
                            </div>
                          </div>
                          <Badge className={driver.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                            {driver.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-sm text-gray-400 mb-3">
                          <span>{driver.phone}</span>
                          <span>•</span>
                          <span>{driver.email}</span>
                        </div>
                        <div className="flex gap-2">
                          <Select
                            value={driver.status}
                            onValueChange={(value) => updateDriverStatus(driver.id, value)}
                          >
                            <SelectTrigger className="w-40 bg-black/40 border-[#D4AF37]/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="busy">Busy</SelectItem>
                              <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() => deleteDriver(driver.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Website Builder */}
          <TabsContent value="website">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Website Builder</CardTitle>
                <CardDescription>Design and customize your company website</CardDescription>
              </CardHeader>
              <CardContent>
                <WebsiteBuilder />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}