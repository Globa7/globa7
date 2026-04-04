import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Car,
  Users,
  Package,
  Settings,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Save,
  X,
  Mail,
  Link2,
  FileText,
  Upload,
  Eye,
  BarChart3,
  Star,
  MapPin,
  Sparkles,
  ChevronDown,
  Check,
  Gift,
  Zap,
  Crown,
  Info,
  Calculator,
  Image,
  FileImage,
  ToggleLeft,
  ToggleRight,
  Crop,
  Images,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase} from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ImageCropper } from '../components/ImageCropper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { ServiceCreationModal } from '../components/ServiceCreationModal';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

const SERVICE_TYPES = [
  { value: 'wedding', label: '💍 Wedding', icon: '💍' },
  { value: 'corporate', label: '💼 Corporate', icon: '💼' },
  { value: 'airport', label: '✈️ Airport Transfer', icon: '✈️' },
  { value: 'tour', label: '🎭 City Tour', icon: '🎭' },
  { value: 'event', label: '🎉 Special Event', icon: '🎉' },
  { value: 'mardi_gras', label: '🎭 Mardi Gras', icon: '🎭' },
  { value: 'hourly', label: '⏰ Hourly Service', icon: '⏰' },
  { value: 'subscription', label: '📅 Subscription', icon: '📅' },
];

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Luxury Sedan', capacity: 3 },
  { value: 'suv', label: 'Executive SUV', capacity: 6 },
  { value: 'luxury', label: 'Premium Luxury', capacity: 3 },
  { value: 'sprinter', label: 'Mercedes Sprinter', capacity: 14 },
  { value: 'executive', label: 'Executive Van', capacity: 10 },
];

const AMENITIES = [
  'Champagne Service', 'Red Carpet', 'WiFi', 'Bottled Water', 
  'Phone Chargers', 'Premium Sound System', 'Privacy Partition',
  'Mood Lighting', 'Refreshments', 'Newspapers/Magazines'
];

export function EnhancedAdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [servicePricing, setServicePricing] = useState<any>({
    wedding: 2500,
    corporate: 350,
    airport: 125,
    tour: 450,
    event: 800,
    mardi_gras: 1200,
    hourly: 150,
    subscription: 2000,
  });
  const [affiliateApplications, setAffiliateApplications] = useState<any[]>([]);

  // Modal states
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showServicePricingModal, setShowServicePricingModal] = useState(false);
  const [showServiceCreationModal, setShowServiceCreationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  
  // Form states
  const [vehicleForm, setVehicleForm] = useState<any>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    capacity: 4,
    type: 'sedan',
    status: 'available',
    baseRate: 140,
    licensePlate: '',
    imageUrl: '',
  });
  const [vehicleImageFile, setVehicleImageFile] = useState<File | null>(null);
  const [vehicleImagePreview, setVehicleImagePreview] = useState<string>('');
  const [uploadingVehicleImage, setUploadingVehicleImage] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [fleetShowcaseImages, setFleetShowcaseImages] = useState<any[]>([]);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryUploadFile, setGalleryUploadFile] = useState<File | null>(null);
  const [galleryUploadPreview, setGalleryUploadPreview] = useState<string>('');
  const [galleryUploadCategory, setGalleryUploadCategory] = useState<string>('Cadillac');
  const [uploadingToGallery, setUploadingToGallery] = useState(false);
  const [driverForm, setDriverForm] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    isAffiliate: false,
    status: 'active',
    rating: 5,
    totalTrips: 0,
    licenseImageUrl: '',
    licensePlateImageUrl: '',
    vehicleRegistrationUrl: '',
    isActive: true,
  });
  const [showDriverDetailsModal, setShowDriverDetailsModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [bundleForm, setBundleForm] = useState<any>({
    name: '',
    description: '',
    type: 'wedding',
    basePrice: 0,
    discount: 0,
    duration: 4,
    includedVehicles: [],
    amenities: [],
    maxPassengers: 0,
    includesDriver: true,
    includesGas: true,
    includesParking: false,
    advanceBookingDays: 7,
    cancellationPolicy: 'flexible',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    seasonalPricing: false,
    peakSeasonMultiplier: 1.5,
    isActive: true,
    features: '',
    terms: '',
  });
  const [inviteLink, setInviteLink] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Check session validity
    const checkSession = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        toast.error('Your session has expired. Please log in again.');
        await signOut();
        navigate('/auth');
        return;
      }
    };
    
    checkSession();
    
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/portal');
      return;
    }
    
    fetchAllData();
    fetchGalleryImages(); // Load gallery images on mount
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchBookings(),
        fetchVehicles(),
        fetchDrivers(),
        fetchBundles(),
        fetchPricing(),
        fetchAffiliateApplications(),
        fetchGalleryImages(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
    };
  };

  const fetchAnalytics = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/analytics`, { headers });
    const data = await res.json();
    setAnalytics(data.analytics || {});
  };

  const fetchBookings = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/bookings`, { headers });
    const data = await res.json();
    setBookings(data.bookings || []);
  };

  const fetchVehicles = async () => {
    const res = await fetch(`${API_BASE}/vehicles`);
    const data = await res.json();
    setVehicles(data.vehicles || []);
  };

  const fetchDrivers = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/drivers`, { headers });
    const data = await res.json();
    setDrivers(data.drivers || []);
  };

  const fetchBundles = async () => {
    const res = await fetch(`${API_BASE}/bundles`);
    const data = await res.json();
    setBundles(data.bundles || []);
  };

  const fetchPricing = async () => {
    const res = await fetch(`${API_BASE}/pricing`);
    const data = await res.json();
    setPricing(data.pricing || {});
  };

  const fetchAffiliateApplications = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/admin/affiliate-applications`, { headers });
    const data = await res.json();
    setAffiliateApplications(data.applications || []);
  };

  const handleGenerateInvite = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/generate-affiliate-invite`, {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      
      if (data.success) {
        setInviteLink(data.inviteUrl);
        toast.success('Invite link generated!');
      } else {
        toast.error('Failed to generate invite');
      }
    } catch (error) {
      console.error('Error generating invite:', error);
      toast.error('Failed to generate invite link');
    }
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVehicleImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      console.log('Fetching images directly from Supabase storage...');
      
      // Get list of all buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        toast.error('Failed to connect to Supabase storage');
        setLoadingGallery(false);
        return;
      }

      console.log('All buckets:', buckets?.map(b => b.name));

      // Filter for vehicle-related buckets
      const vehicleBuckets = buckets?.filter(bucket => 
        bucket.name.startsWith('make-12e765ba-') && 
        (bucket.name.toLowerCase().includes('vehicle') || 
         bucket.name.toLowerCase().includes('passenger') || 
         bucket.name.toLowerCase().includes('sprinter') || 
         bucket.name.toLowerCase().includes('coach') || 
         bucket.name.toLowerCase().includes('minibus') || 
         bucket.name.toLowerCase().includes('cadillac'))
      ) || [];

      console.log('Vehicle buckets found:', vehicleBuckets.map(b => b.name));

      const allImages: any[] = [];

      // Fetch files from each bucket
      for (const bucket of vehicleBuckets) {
        const { data: files, error: filesError } = await supabase.storage
          .from(bucket.name)
          .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (filesError) {
          console.error(`Error listing files from ${bucket.name}:`, filesError);
          continue;
        }

        console.log(`Files in ${bucket.name}:`, files?.length);

        if (files && files.length > 0) {
          for (const file of files) {
            // Build public URL directly
            const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket.name}/${file.name}`;
            
            console.log(`Image URL: ${publicUrl}`);

            allImages.push({
              name: file.name,
              url: publicUrl,
              bucket: bucket.name,
              size: file.metadata?.size || 0,
              createdAt: file.created_at,
            });
          }
        }
      }

      console.log(`Total images found: ${allImages.length}`, allImages);
      setGalleryImages(allImages);
      
      // Categorize images for fleet showcase
      const showcase = [
        {
          title: 'Black Luxury SUV',
          subtitle: 'Cadillac Escalade / GMC Yukon XL',
          passengers: 'Up to 6 passengers',
          luggage: '4-6 large bags',
          features: 'Leather interior, climate control',
          image: allImages.find(img => 
            img.bucket === 'make-12e765ba-Cadillac' ||
            img.bucket.toLowerCase().includes('cadillac') || 
            img.name.toLowerCase().includes('cadillac') ||
            img.name.toLowerCase().includes('escalade') ||
            img.name.toLowerCase().includes('suv')
          )?.url
        },
        {
          title: '14-Passenger Sprinter',
          subtitle: 'Mercedes-Benz Executive',
          passengers: 'Up to 14 passengers',
          luggage: '8-10 large bags',
          features: 'Wi-Fi, charging ports, premium sound',
          image: allImages.find(img => 
            img.bucket === 'make-12e765ba-14-Passenger-Sprinter' ||
            img.bucket.toLowerCase().includes('sprinter') ||
            img.name.toLowerCase().includes('14') ||
            img.name.toLowerCase().includes('sprinter')
          )?.url
        },
        {
          title: '28-Passenger Mini Coach',
          subtitle: 'Ideal for medium weddings & corporate shuttles',
          passengers: 'Up to 28 passengers',
          luggage: '12-15 large bags',
          features: 'Restroom, PA system, climate control',
          image: allImages.find(img => 
            img.bucket === 'make-12e765ba-28-Passenger-Mini-Coach' ||
            img.bucket.toLowerCase().includes('28') || 
            img.bucket.toLowerCase().includes('minibus') ||
            img.name.toLowerCase().includes('28') ||
            img.name.toLowerCase().includes('mini')
          )?.url
        },
        {
          title: '55-Passenger Coach',
          subtitle: 'Full-size luxury with restroom & A/V',
          passengers: 'Up to 55 passengers',
          luggage: '20+ large bags',
          features: 'Restroom, entertainment system, Wi-Fi',
          image: allImages.find(img => 
            img.bucket === 'make-12e765ba-55-Passenger-Coach' ||
            img.bucket.toLowerCase().includes('55') || 
            img.bucket.toLowerCase().includes('coach') ||
            img.name.toLowerCase().includes('55') ||
            img.name.toLowerCase().includes('coach')
          )?.url
        }
      ];
      
      console.log('Showcase images:', showcase);
      setFleetShowcaseImages(showcase.filter(item => item.image));
      
      if (allImages.length === 0) {
        toast.info('No vehicle images found in storage buckets');
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleSelectGalleryImage = (imageUrl: string) => {
    setVehicleImagePreview(imageUrl);
    setVehicleForm({ ...vehicleForm, imageUrl });
    setShowImageGallery(false);
    toast.success('Image selected from gallery');
  };

  const handleCropImage = () => {
    if (vehicleImagePreview) {
      setImageToCrop(vehicleImagePreview);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setVehicleImagePreview(croppedImage);
    // Convert base64 to file
    fetch(croppedImage)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        setVehicleImageFile(file);
      });
    setImageToCrop(null);
    toast.success('Image cropped successfully');
  };

  const uploadVehicleImage = async () => {
    if (!vehicleImageFile) return null;

    try {
      setUploadingVehicleImage(true);
      
      // Upload via server endpoint to bypass RLS
      const formData = new FormData();
      formData.append('file', vehicleImageFile);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Handle session errors
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast.error('Your session has expired. Please log in again.');
        await signOut();
        navigate('/auth');
        return null;
      }

      const response = await fetch(`${API_BASE}/admin/vehicles/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      console.log('Upload response:', data);
      
      // Handle authentication errors
      if (response.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        await signOut();
        navigate('/auth');
        return null;
      }
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Image uploaded successfully!');
      return data.url;
    } catch (error) {
      console.error('Error uploading vehicle image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setUploadingVehicleImage(false);
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGalleryUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToGallery = async () => {
    if (!galleryUploadFile || !galleryUploadCategory) {
      toast.error('Please select a file and category');
      return;
    }

    try {
      setUploadingToGallery(true);
      
      const formData = new FormData();
      formData.append('file', galleryUploadFile);
      formData.append('category', galleryUploadCategory);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        toast.error('Your session has expired. Please log in again.');
        await signOut();
        navigate('/auth');
        return;
      }

      const response = await fetch(`${API_BASE}/admin/vehicles/upload-to-gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        await signOut();
        navigate('/auth');
        return;
      }
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast.success('Image uploaded to gallery successfully!');
      setShowGalleryUpload(false);
      setGalleryUploadFile(null);
      setGalleryUploadPreview('');
      setGalleryUploadCategory('Cadillac');
      
      // Refresh gallery
      await fetchGalleryImages();
    } catch (error) {
      console.error('Error uploading to gallery:', error);
      toast.error(`Failed to upload: ${error.message}`);
    } finally {
      setUploadingToGallery(false);
    }
  };

  const handleAddVehicle = async () => {
    try {
      // Upload image first if there's one
      let imageUrl = vehicleForm.imageUrl;
      if (vehicleImageFile) {
        const uploadedUrl = await uploadVehicleImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/vehicles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...vehicleForm,
          imageUrl,
          mileage: 0,
          lastServiceDate: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Vehicle added successfully!');
        setShowVehicleModal(false);
        setVehicleForm({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          color: '',
          capacity: 4,
          type: 'sedan',
          status: 'available',
          baseRate: 140,
          licensePlate: '',
          imageUrl: '',
        });
        setVehicleImageFile(null);
        setVehicleImagePreview('');
        setEditingVehicle(null);
        fetchVehicles();
      } else {
        toast.error('Failed to add vehicle');
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Failed to add vehicle');
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    
    try {
      // Upload image first if there's a new one
      let imageUrl = vehicleForm.imageUrl;
      if (vehicleImageFile) {
        const uploadedUrl = await uploadVehicleImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...vehicleForm,
          imageUrl,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Vehicle updated successfully!');
        setShowVehicleModal(false);
        setVehicleForm({
          make: '',
          model: '',
          year: new Date().getFullYear(),
          color: '',
          capacity: 4,
          type: 'sedan',
          status: 'available',
          baseRate: 140,
          licensePlate: '',
        });
        setEditingVehicle(null);
        fetchVehicles();
      } else {
        toast.error('Failed to update vehicle');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle');
    }
  };

  const handleEditVehicle = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      capacity: vehicle.capacity,
      type: vehicle.type,
      status: vehicle.status,
      baseRate: vehicle.baseRate,
      licensePlate: vehicle.licensePlate || '',
      imageUrl: vehicle.imageUrl || '',
    });
    setVehicleImagePreview(vehicle.imageUrl || '');
    setVehicleImageFile(null);
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/vehicles/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Vehicle deleted successfully!');
        fetchVehicles();
      } else {
        toast.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    }
  };

  const handleAddDriver = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/drivers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(driverForm),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Driver added successfully!');
        setShowDriverModal(false);
        setDriverForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          isAffiliate: false,
          status: 'active',
          rating: 5,
          totalTrips: 0,
          licenseImageUrl: '',
          licensePlateImageUrl: '',
          vehicleRegistrationUrl: '',
          isActive: true,
        });
        setEditingDriver(null);
        fetchDrivers();
      } else {
        toast.error('Failed to add driver');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Failed to add driver');
    }
  };

  const handleUpdateDriver = async () => {
    if (!editingDriver) return;
    
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/drivers/${editingDriver.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(driverForm),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Driver updated successfully!');
        setShowDriverModal(false);
        setDriverForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          isAffiliate: false,
          status: 'active',
          rating: 5,
          totalTrips: 0,
          licenseImageUrl: '',
          licensePlateImageUrl: '',
          vehicleRegistrationUrl: '',
          isActive: true,
        });
        setEditingDriver(null);
        fetchDrivers();
      } else {
        toast.error('Failed to update driver');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Failed to update driver');
    }
  };

  const handleEditDriver = (driver: any) => {
    setEditingDriver(driver);
    setDriverForm({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber || '',
      isAffiliate: driver.isAffiliate || false,
      status: driver.status,
      rating: driver.rating || 5,
      totalTrips: driver.totalTrips || 0,
      licenseImageUrl: driver.licenseImageUrl || '',
      licensePlateImageUrl: driver.licensePlateImageUrl || '',
      vehicleRegistrationUrl: driver.vehicleRegistrationUrl || '',
      isActive: driver.isActive !== undefined ? driver.isActive : true,
    });
    setShowDriverModal(true);
  };

  const handleViewDriverDetails = (driver: any) => {
    setSelectedDriver(driver);
    setShowDriverDetailsModal(true);
  };

  const handleToggleDriverStatus = async (driver: any) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/drivers/${driver.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...driver,
          isActive: !driver.isActive,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Driver ${!driver.isActive ? 'activated' : 'deactivated'} successfully!`);
        fetchDrivers();
      } else {
        toast.error('Failed to update driver status');
      }
    } catch (error) {
      console.error('Error toggling driver status:', error);
      toast.error('Failed to update driver status');
    }
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`https://${projectId}.supabase.co/storage/v1/object/make-12e765ba-drivers/${Date.now()}_${file.name}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });
      
      if (res.ok) {
        const { data } = await res.json();
        const imageUrl = `https://${projectId}.supabase.co/storage/v1/object/public/make-12e765ba-drivers/${data.path}`;
        setDriverForm({ ...driverForm, [fieldName]: imageUrl });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleDeleteDriver = async (id: string) => {
    if (!confirm('Are you sure you want to delete this driver?')) return;
    
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/drivers/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Driver deleted successfully!');
        fetchDrivers();
      } else {
        toast.error('Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const handleAddBundle = async () => {
    try {
      const headers = await getAuthHeaders();
      
      // Calculate final price based on service type
      const baseServicePrice = servicePricing[bundleForm.type] || 0;
      const finalPrice = bundleForm.basePrice || baseServicePrice;
      
      const bundleData = {
        ...bundleForm,
        basePrice: finalPrice,
        includedServices: bundleForm.features.split(',').map((s: string) => s.trim()).filter(Boolean),
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      };
      
      const res = await fetch(`${API_BASE}/admin/bundles`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bundleData),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Service bundle created successfully!');
        setShowBundleModal(false);
        setBundleForm({
          name: '',
          description: '',
          type: 'wedding',
          basePrice: 0,
          discount: 0,
          duration: 4,
          includedVehicles: [],
          amenities: [],
          maxPassengers: 0,
          includesDriver: true,
          includesGas: true,
          includesParking: false,
          advanceBookingDays: 7,
          cancellationPolicy: 'flexible',
          availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          seasonalPricing: false,
          peakSeasonMultiplier: 1.5,
          isActive: true,
          features: '',
          terms: '',
        });
        setCurrentStep(1);
        fetchBundles();
      } else {
        toast.error('Failed to add bundle');
      }
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Failed to add bundle');
    }
  };

  const handleDeleteBundle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/bundles/${id}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Bundle deleted successfully!');
        fetchBundles();
      } else {
        toast.error('Failed to delete bundle');
      }
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Failed to delete bundle');
    }
  };

  const handleUpdatePricing = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/pricing`, {
        method: 'POST',
        headers,
        body: JSON.stringify(pricing),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Pricing updated successfully!');
      } else {
        toast.error('Failed to update pricing');
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast.error('Failed to update pricing');
    }
  };

  const handleApplicationAction = async (appId: string, status: string, notes?: string, rejectionReason?: string) => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/admin/affiliate-applications/${appId}/status`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ status, reviewNotes: notes, rejectionReason }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Application ${status}!`);
        setShowApplicationModal(false);
        fetchAffiliateApplications();
        fetchDrivers();
      } else {
        toast.error('Failed to update application');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const toggleAmenity = (amenity: string) => {
    setBundleForm((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleVehicle = (vehicleType: string) => {
    setBundleForm((prev: any) => ({
      ...prev,
      includedVehicles: prev.includedVehicles.includes(vehicleType)
        ? prev.includedVehicles.filter((v: string) => v !== vehicleType)
        : [...prev.includedVehicles, vehicleType],
    }));
  };

  const toggleDay = (day: string) => {
    setBundleForm((prev: any) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d: string) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-gold font-cormorant text-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading Dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Header */}
      <motion.header 
        className="border-b border-charcoal bg-charcoal/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Crown className="h-8 w-8 text-gold" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-cormorant text-gold">Admin Dashboard</h1>
                  <p className="text-sm text-gray-400">Globa7 Business Management</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button onClick={signOut} variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TabsList className="grid w-full grid-cols-7 bg-charcoal border border-gold/20 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <Calendar className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="fleet" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <Car className="h-4 w-4 mr-2" />
                Fleet
              </TabsTrigger>
              <TabsTrigger value="drivers" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <Users className="h-4 w-4 mr-2" />
                Drivers
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="bundles" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="affiliates" className="data-[state=active]:bg-gold data-[state=active]:text-black transition-all duration-300">
                <Users className="h-4 w-4 mr-2" />
                Affiliates
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Total Revenue', value: `$${analytics?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-gold', bgColor: 'bg-gold/10' },
                  { title: 'Total Bookings', value: analytics?.totalBookings || 0, icon: Calendar, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
                  { title: 'Pending', value: analytics?.pendingBookings || 0, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
                  { title: 'Completed', value: analytics?.completedBookings || 0, icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-400/10' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <Card className="bg-charcoal border-gold/20 overflow-hidden group">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                        <motion.div 
                          className={`h-10 w-10 rounded-full ${stat.bgColor} flex items-center justify-center`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </motion.div>
                      </CardHeader>
                      <CardContent>
                        <motion.div 
                          className={`text-3xl font-cormorant ${stat.color}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 * (index + 1), type: "spring" }}
                        >
                          {stat.value}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-charcoal border-gold/20">
                    <CardHeader>
                      <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Fleet Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: 'Total Vehicles', value: vehicles.length, icon: Car },
                          { label: 'Total Drivers', value: drivers.length, icon: Users },
                          { label: 'Service Bundles', value: bundles.length, icon: Package },
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            className="flex justify-between items-center p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4 text-gold" />
                              <span className="text-gray-400">{item.label}</span>
                            </div>
                            <span className="text-2xl font-cormorant text-white">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-charcoal border-gold/20">
                    <CardHeader>
                      <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bookings.slice(0, 5).map((booking, index) => (
                          <motion.div
                            key={booking.id}
                            className="flex justify-between items-center text-sm p-2 rounded hover:bg-black/30 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                          >
                            <span className="text-gray-400">{booking.name}</span>
                            <Badge variant={
                              booking.status === 'completed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' : 'outline'
                            }>
                              {booking.status}
                            </Badge>
                          </motion.div>
                        ))}
                        {bookings.length === 0 && (
                          <motion.div
                            className="text-center py-8 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No recent activity</p>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold font-cormorant">All Bookings</CardTitle>
                  <CardDescription className="text-gray-400">Manage and track all reservations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        className="border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{booking.name}</h3>
                            <p className="text-sm text-gray-400">{booking.phone}</p>
                            <p className="text-sm text-gray-400 mt-2">{booking.pickupLocation} → {booking.dropoffLocation}</p>
                            <p className="text-xs text-gray-500 mt-1">{booking.pickupDateTime}</p>
                          </div>
                          <Badge>{booking.status}</Badge>
                        </div>
                      </motion.div>
                    ))}
                    {bookings.length === 0 && (
                      <motion.div
                        className="text-center py-12 text-gray-400"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No bookings yet</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gold font-cormorant">Fleet Management</CardTitle>
                      <CardDescription className="text-gray-400">Manage your vehicle inventory</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => setShowVehicleModal(true)} className="bg-gold text-black hover:bg-gold/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Fleet Showcase Images - "Your Ride, Perfected" */}
                  <div className="mb-8">
                    <div className="mb-6">
                      <p className="text-gold text-sm font-semibold tracking-widest mb-2">THE FLEET</p>
                      <h2 className="text-white font-cormorant text-4xl font-bold mb-1">Your Ride, Perfected</h2>
                      <div className="h-0.5 w-16 bg-gold"></div>
                    </div>
                    
                    {fleetShowcaseImages.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fleetShowcaseImages.map((vehicle, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <div className="relative overflow-hidden rounded-lg border border-gold/20 hover:border-gold/50 transition-all bg-black">
                              <div className="flex flex-col md:flex-row h-full">
                                {/* Image Section */}
                                <div className="md:w-2/5 relative overflow-hidden">
                                  <img
                                    src={vehicle.image}
                                    alt={vehicle.title}
                                    className="w-full h-full min-h-[300px] object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>

                                {/* Details Section */}
                                <div className="md:w-3/5 p-6 flex flex-col justify-between">
                                  <div>
                                    <h3 className="text-white font-cormorant text-3xl font-bold mb-2">
                                      {vehicle.title}
                                    </h3>
                                    <p className="text-gold text-base mb-6">
                                      {vehicle.subtitle}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                      <div className="flex items-center text-gray-300">
                                        <Users className="h-5 w-5 text-gold mr-3" />
                                        <span className="text-sm">{vehicle.passengers}</span>
                                      </div>
                                      <div className="flex items-center text-gray-300">
                                        <Briefcase className="h-5 w-5 text-gold mr-3" />
                                        <span className="text-sm">{vehicle.luggage}</span>
                                      </div>
                                      <div className="flex items-center text-gray-300">
                                        <Star className="h-5 w-5 text-gold mr-3" />
                                        <span className="text-sm">{vehicle.features}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <Button
                                    variant="outline"
                                    className="w-full border-gold/30 text-gold hover:bg-gold hover:text-black font-semibold"
                                    onClick={() => {
                                      setShowImageGallery(true);
                                    }}
                                  >
                                    BOOK {vehicle.title.split(' ')[vehicle.title.split(' ').length - 1].toUpperCase()}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gold/20 rounded-lg p-12 text-center">
                        <FileImage className="h-16 w-16 mx-auto mb-4 text-gold/30" />
                        <p className="text-gray-400 mb-2">No fleet images uploaded yet</p>
                        <p className="text-sm text-gray-500 mb-4">Upload vehicle images to showcase your fleet</p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="outline"
                            className="border-gold/30 text-gold hover:bg-gold/10"
                            onClick={() => {
                              setShowImageGallery(true);
                              setTimeout(() => setShowGalleryUpload(true), 300);
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Fleet Images
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gold/30 text-gold hover:bg-gold/10"
                            onClick={() => setShowVehicleModal(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Vehicle
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Inventory Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicles.map((vehicle, index) => (
                      <motion.div
                        key={vehicle.id}
                        className="border border-gold/10 rounded-lg overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        {vehicle.imageUrl && (
                          <div className="relative h-40 overflow-hidden">
                            <ImageWithFallback
                              src={vehicle.imageUrl}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-white">{vehicle.make} {vehicle.model}</h3>
                              <p className="text-sm text-gray-400">{vehicle.year} • {vehicle.color}</p>
                            </div>
                            <Badge variant={vehicle.status === 'available' ? 'default' : 'secondary'}>
                              {vehicle.status}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1 mb-3">
                            <p className="text-gray-400">Capacity: {vehicle.capacity} passengers</p>
                            <p className="text-gray-400">Type: {vehicle.type}</p>
                            <p className="text-gold">${vehicle.baseRate}/trip</p>
                          </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-gold text-gold hover:bg-gold hover:text-black"
                            onClick={() => handleEditVehicle(vehicle)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gold font-cormorant">Driver Management</CardTitle>
                      <CardDescription className="text-gray-400">View and manage all drivers (including affiliates)</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => setShowDriverModal(true)} className="bg-gold text-black hover:bg-gold/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Driver
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {drivers.map((driver, index) => (
                      <motion.div
                        key={driver.id}
                        className="border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                              <motion.div 
                                className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                {driver.firstName?.[0]}{driver.lastName?.[0]}
                              </motion.div>
                              <div>
                                <h3 className="font-semibold text-white">{driver.firstName} {driver.lastName}</h3>
                                <p className="text-sm text-gray-400">{driver.email}</p>
                                <p className="text-sm text-gray-400">{driver.phone}</p>
                                {driver.isAffiliate && (
                                  <Badge variant="outline" className="mt-1 border-gold text-gold">
                                    <Star className="h-3 w-3 mr-1" />
                                    Affiliate
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="flex items-center justify-end gap-2">
                                <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>{driver.status}</Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`p-1 h-auto ${driver.isActive ? 'text-green-500' : 'text-gray-500'}`}
                                  onClick={() => handleToggleDriverStatus(driver)}
                                >
                                  {driver.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">{driver.isActive ? 'Active Account' : 'Deactivated'}</p>
                              <p className="text-sm text-gray-400">Rating: {driver.rating}/5</p>
                              <p className="text-sm text-gray-400">Trips: {driver.totalTrips}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                              onClick={() => handleViewDriverDetails(driver)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-gold text-gold hover:bg-gold hover:text-black"
                              onClick={() => handleEditDriver(driver)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() => handleDeleteDriver(driver.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Pricing Explanation Panel */}
              <Card className="bg-black/50 border-gold/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gold/10 rounded-lg">
                      <Info className="h-6 w-6 text-gold" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <h3 className="text-lg font-semibold text-gold font-cormorant">Understanding Your Pricing System</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        {/* Service Package Pricing Explanation */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-gold" />
                            <h4 className="font-semibold text-white">Service Package Pricing</h4>
                          </div>
                          <p className="text-gray-400 leading-relaxed">
                            These are <strong className="text-white">fixed starting prices</strong> for complete service packages. 
                            Set these based on your business needs—they represent the minimum price customers see for each service category.
                          </p>
                          <div className="p-2 bg-black/40 rounded border border-gold/10 text-xs text-gray-500">
                            Example: Wedding ($2,500) is your base wedding package price
                          </div>
                        </div>

                        {/* Dynamic Pricing Explanation */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-gold" />
                            <h4 className="font-semibold text-white">Vehicle & Zone Pricing (Dynamic)</h4>
                          </div>
                          <p className="text-gray-400 leading-relaxed">
                            This system calculates custom quotes using a <strong className="text-white">multiplier formula</strong>:
                          </p>
                          <div className="p-3 bg-gold/5 rounded border border-gold/20">
                            <code className="text-gold text-xs font-mono">
                              Final Price = (Base Rate × Hours) × Zone × Time
                            </code>
                          </div>
                          <div className="p-2 bg-black/40 rounded border border-gold/10 text-xs text-gray-500">
                            Example: SUV 4hrs to Airport on Weekend<br/>
                            ($140 × 4) × 1.2 × 1.15 = <strong className="text-gold">$773.60</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Pricing Card */}
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                        <Gift className="h-5 w-5" />
                        Service Package Pricing
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Fixed base prices for complete service packages
                        <span className="block text-xs mt-1 text-gray-500">💡 These are your starting prices shown to customers</span>
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowServiceCreationModal(true)}
                      className="bg-gold text-black hover:bg-gold/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SERVICE_TYPES.map((service, index) => (
                      <motion.div
                        key={service.value}
                        className="p-4 rounded-lg bg-black/30 border border-gold/10 hover:border-gold/30 transition-all"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{service.icon}</span>
                          <Label className="text-white font-semibold">{service.label.replace(/^.+\s/, '')}</Label>
                        </div>
                        <Input
                          type="number"
                          value={servicePricing[service.value]}
                          onChange={(e) => setServicePricing({ ...servicePricing, [service.value]: parseFloat(e.target.value) })}
                          className="bg-black border-gold/20 text-white text-xl font-cormorant"
                          prefix="$"
                        />
                        <p className="text-xs text-gray-500 mt-2">Base price for {service.label.replace(/^.+\s/, '').toLowerCase()} services</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Standard Pricing Configuration */}
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Vehicle & Zone Pricing
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Dynamic pricing with multiplier calculations
                    <span className="block text-xs mt-1 text-gray-500">💡 Final Price = (Base Rate × Hours) × Zone × Time</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pricing && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Car className="h-5 w-5 text-gold" />
                            Base Rates
                          </h3>
                          <span className="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                            💲 Per hour pricing
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(pricing.baseRates || {}).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-gray-400 capitalize">{key}</Label>
                              <Input
                                type="number"
                                value={value as number}
                                onChange={(e) => setPricing({
                                  ...pricing,
                                  baseRates: { ...pricing.baseRates, [key]: parseFloat(e.target.value) }
                                })}
                                className="mt-1 bg-black border-gold/20 text-white"
                              />
                              <p className="text-xs text-gray-600 mt-1">${value}/hour</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-gold" />
                            Zone Multipliers
                          </h3>
                          <span className="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                            ✕ Location adjustments
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(pricing.zones || {}).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-gray-400 capitalize">{key}</Label>
                              <Input
                                type="number"
                                step="0.05"
                                value={value as number}
                                onChange={(e) => setPricing({
                                  ...pricing,
                                  zones: { ...pricing.zones, [key]: parseFloat(e.target.value) }
                                })}
                                className="mt-1 bg-black border-gold/20 text-white"
                              />
                              <p className="text-xs text-gray-600 mt-1">
                                {value === 1 ? 'No adjustment' : value > 1 ? `+${((value - 1) * 100).toFixed(0)}%` : `-${((1 - value) * 100).toFixed(0)}%`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gold" />
                            Time Multipliers
                          </h3>
                          <span className="text-xs text-gray-500 bg-black/30 px-3 py-1 rounded-full">
                            ✕ Peak time adjustments
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(pricing.timeMultipliers || {}).map(([key, value]) => (
                            <div key={key}>
                              <Label className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                              <Input
                                type="number"
                                step="0.05"
                                value={value as number}
                                onChange={(e) => setPricing({
                                  ...pricing,
                                  timeMultipliers: { ...pricing.timeMultipliers, [key]: parseFloat(e.target.value) }
                                })}
                                className="mt-1 bg-black border-gold/20 text-white"
                              />
                              <p className="text-xs text-gray-600 mt-1">
                                {value === 1 ? 'No adjustment' : value > 1 ? `+${((value - 1) * 100).toFixed(0)}%` : `-${((1 - value) * 100).toFixed(0)}%`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleUpdatePricing} className="bg-gold text-black hover:bg-gold/90 w-full md:w-auto">
                          <Save className="h-4 w-4 mr-2" />
                          Save All Pricing Changes
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Bundles Tab */}
          <TabsContent value="bundles">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Service Bundles & Packages
                      </CardTitle>
                      <CardDescription className="text-gray-400">Create and manage package deals</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => {setShowBundleModal(true); setCurrentStep(1);}} className="bg-gold text-black hover:bg-gold/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Bundle
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bundles.map((bundle, index) => (
                      <motion.div
                        key={bundle.id}
                        className="border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white flex items-center gap-2">
                              {SERVICE_TYPES.find(s => s.value === bundle.type)?.icon}
                              {bundle.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{bundle.description}</p>
                          </div>
                          <Badge className="capitalize">{bundle.type}</Badge>
                        </div>
                        <div className="text-sm space-y-2 mb-3">
                          <p className="text-gold font-semibold text-xl">${bundle.basePrice}</p>
                          {bundle.discount > 0 && (
                            <p className="text-green-400">Save {bundle.discount}%</p>
                          )}
                          <p className="text-gray-400">Sales: {bundle.totalSales || 0}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-gold text-gold hover:bg-gold hover:text-black">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDeleteBundle(bundle.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    {bundles.length === 0 && (
                      <motion.div
                        className="col-span-2 text-center py-12 text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg mb-2">No bundles created yet</p>
                        <p className="text-sm">Create your first service package to get started</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gold font-cormorant flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Affiliate Driver Program
                      </CardTitle>
                      <CardDescription className="text-gray-400">Invite and manage affiliate drivers</CardDescription>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => {setShowInviteModal(true); handleGenerateInvite();}} className="bg-gold text-black hover:bg-gold/90">
                        <Mail className="h-4 w-4 mr-2" />
                        Generate Invite Link
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-charcoal border-gold/20">
                <CardHeader>
                  <CardTitle className="text-gold font-cormorant">Affiliate Applications</CardTitle>
                  <CardDescription className="text-gray-400">Review and manage driver applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {affiliateApplications.map((app, index) => (
                      <motion.div
                        key={app.id}
                        className="border border-gold/10 rounded-lg p-4 hover:border-gold/30 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">{app.firstName} {app.lastName}</h3>
                            <p className="text-sm text-gray-400">{app.email} • {app.phone}</p>
                            <p className="text-sm text-gray-400 mt-2">Vehicle: {app.vehicleMake} {app.vehicleModel} ({app.vehicleYear})</p>
                            <p className="text-xs text-gray-500 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              app.status === 'approved' ? 'default' :
                              app.status === 'rejected' ? 'destructive' :
                              app.status === 'under_review' ? 'secondary' : 'outline'
                            }>
                              {app.status}
                            </Badge>
                            {app.status === 'pending' && (
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gold text-gold hover:bg-gold hover:text-black"
                                  onClick={() => {setSelectedApplication(app); setShowApplicationModal(true);}}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {affiliateApplications.length === 0 && (
                      <motion.div
                        className="text-center py-12 text-gray-400"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No affiliate applications yet</p>
                        <p className="text-sm mt-2">Generate an invite link to get started</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Bundle Creation Modal */}
      <AnimatePresence>
        {showBundleModal && (
          <Dialog open={showBundleModal} onOpenChange={setShowBundleModal}>
            <DialogContent className="bg-charcoal border-gold text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-gold font-cormorant text-3xl flex items-center gap-2">
                  <Sparkles className="h-8 w-8" />
                  Create New Service Bundle
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Step {currentStep} of 4 - Build your perfect package
                </DialogDescription>
              </DialogHeader>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-black rounded-full overflow-hidden mb-6">
                <motion.div 
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 4) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-gray-300 text-lg mb-3 block">Service Type *</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SERVICE_TYPES.map((service) => (
                          <motion.button
                            key={service.value}
                            type="button"
                            onClick={() => {
                              setBundleForm({ ...bundleForm, type: service.value, basePrice: servicePricing[service.value] });
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              bundleForm.type === service.value
                                ? 'border-gold bg-gold/10 text-white'
                                : 'border-gold/20 hover:border-gold/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-3xl mb-2">{service.icon}</div>
                            <div className="text-sm font-medium">{service.label.replace(/^.+\s/, '')}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Bundle Name *</Label>
                      <Input
                        value={bundleForm.name}
                        onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="Wedding Premium Package"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Description *</Label>
                      <Textarea
                        value={bundleForm.description}
                        onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                        className="mt-2 bg-black border-gold/20 text-white"
                        rows={4}
                        placeholder="Elegant luxury transportation for your special day..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Base Price ($) *</Label>
                        <Input
                          type="number"
                          value={bundleForm.basePrice}
                          onChange={(e) => setBundleForm({ ...bundleForm, basePrice: parseFloat(e.target.value) })}
                          className="mt-2 bg-black border-gold/20 text-white text-xl font-cormorant"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Suggested: ${servicePricing[bundleForm.type]}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-300">Discount (%)</Label>
                        <Input
                          type="number"
                          value={bundleForm.discount}
                          onChange={(e) => setBundleForm({ ...bundleForm, discount: parseFloat(e.target.value) })}
                          className="mt-2 bg-black border-gold/20 text-white text-xl font-cormorant"
                          max="100"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Vehicle & Capacity */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-gray-300 text-lg mb-3 block">Select Included Vehicles *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {VEHICLE_TYPES.map((vehicle) => (
                          <motion.button
                            key={vehicle.value}
                            type="button"
                            onClick={() => toggleVehicle(vehicle.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              bundleForm.includedVehicles.includes(vehicle.value)
                                ? 'border-gold bg-gold/10'
                                : 'border-gold/20 hover:border-gold/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-white">{vehicle.label}</div>
                                <div className="text-sm text-gray-400">Up to {vehicle.capacity} passengers</div>
                              </div>
                              {bundleForm.includedVehicles.includes(vehicle.value) && (
                                <Check className="h-5 w-5 text-gold" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Duration (hours) *</Label>
                        <Input
                          type="number"
                          value={bundleForm.duration}
                          onChange={(e) => setBundleForm({ ...bundleForm, duration: parseInt(e.target.value) })}
                          className="mt-2 bg-black border-gold/20 text-white"
                          min="1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Max Passengers</Label>
                        <Input
                          type="number"
                          value={bundleForm.maxPassengers}
                          onChange={(e) => setBundleForm({ ...bundleForm, maxPassengers: parseInt(e.target.value) })}
                          className="mt-2 bg-black border-gold/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 text-lg mb-3 block">What's Included?</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gold" />
                            <span>Professional Driver</span>
                          </div>
                          <Switch
                            checked={bundleForm.includesDriver}
                            onCheckedChange={(checked) => setBundleForm({ ...bundleForm, includesDriver: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-gold" />
                            <span>Fuel/Gas</span>
                          </div>
                          <Switch
                            checked={bundleForm.includesGas}
                            onCheckedChange={(checked) => setBundleForm({ ...bundleForm, includesGas: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gold" />
                            <span>Parking Fees</span>
                          </div>
                          <Switch
                            checked={bundleForm.includesParking}
                            onCheckedChange={(checked) => setBundleForm({ ...bundleForm, includesParking: checked })}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Amenities & Features */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-gray-300 text-lg mb-3 block">Select Amenities</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AMENITIES.map((amenity) => (
                          <motion.button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm ${
                              bundleForm.amenities.includes(amenity)
                                ? 'border-gold bg-gold/10 text-white'
                                : 'border-gold/20 hover:border-gold/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{amenity}</span>
                              {bundleForm.amenities.includes(amenity) && (
                                <Check className="h-4 w-4 text-gold flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Special Features</Label>
                      <Textarea
                        value={bundleForm.features}
                        onChange={(e) => setBundleForm({ ...bundleForm, features: e.target.value })}
                        className="mt-2 bg-black border-gold/20 text-white"
                        rows={4}
                        placeholder="Red carpet service, Custom decorations, Photo opportunities..."
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Seasonal Pricing</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Switch
                          checked={bundleForm.seasonalPricing}
                          onCheckedChange={(checked) => setBundleForm({ ...bundleForm, seasonalPricing: checked })}
                        />
                        <span className="text-sm text-gray-400">
                          Enable peak season pricing
                        </span>
                      </div>
                      {bundleForm.seasonalPricing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <Label className="text-gray-300">Peak Season Multiplier</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={bundleForm.peakSeasonMultiplier}
                            onChange={(e) => setBundleForm({ ...bundleForm, peakSeasonMultiplier: parseFloat(e.target.value) })}
                            className="mt-2 bg-black border-gold/20 text-white"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Price during peak season: ${(bundleForm.basePrice * bundleForm.peakSeasonMultiplier).toFixed(2)}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Policies & Availability */}
                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Advance Booking (days)</Label>
                        <Input
                          type="number"
                          value={bundleForm.advanceBookingDays}
                          onChange={(e) => setBundleForm({ ...bundleForm, advanceBookingDays: parseInt(e.target.value) })}
                          className="mt-2 bg-black border-gold/20 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Cancellation Policy</Label>
                        <Select 
                          value={bundleForm.cancellationPolicy} 
                          onValueChange={(value) => setBundleForm({ ...bundleForm, cancellationPolicy: value })}
                        >
                          <SelectTrigger className="mt-2 bg-black border-gold/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-charcoal border-gold text-white">
                            <SelectItem value="flexible">Flexible (24h)</SelectItem>
                            <SelectItem value="moderate">Moderate (72h)</SelectItem>
                            <SelectItem value="strict">Strict (7 days)</SelectItem>
                            <SelectItem value="non_refundable">Non-Refundable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 text-lg mb-3 block">Available Days</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <motion.button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day.toLowerCase())}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              bundleForm.availableDays.includes(day.toLowerCase())
                                ? 'border-gold bg-gold/10 text-white'
                                : 'border-gold/20 hover:border-gold/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-xs font-medium">{day.substring(0, 3)}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Terms & Conditions</Label>
                      <Textarea
                        value={bundleForm.terms}
                        onChange={(e) => setBundleForm({ ...bundleForm, terms: e.target.value })}
                        className="mt-2 bg-black border-gold/20 text-white"
                        rows={4}
                        placeholder="Gratuity not included, 20% gratuity recommended..."
                      />
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gold/10 border border-gold/30">
                      <Switch
                        checked={bundleForm.isActive}
                        onCheckedChange={(checked) => setBundleForm({ ...bundleForm, isActive: checked })}
                      />
                      <div>
                        <Label className="text-white font-semibold">Activate Bundle</Label>
                        <p className="text-xs text-gray-400">Make this bundle available for booking</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <DialogFooter className="flex justify-between mt-6">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-gray-500 text-gray-400"
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {setShowBundleModal(false); setCurrentStep(1);}}
                    className="border-gray-500 text-gray-400"
                  >
                    Cancel
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-gold text-black hover:bg-gold/90"
                    >
                      Next Step
                      <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddBundle}
                      className="bg-gold text-black hover:bg-gold/90"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Bundle
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Vehicle Modal */}
      <Dialog open={showVehicleModal} onOpenChange={setShowVehicleModal}>
        <DialogContent className="bg-charcoal border-gold/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-cormorant text-2xl">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingVehicle ? 'Update vehicle information' : 'Add a new vehicle to your fleet'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Make</Label>
                <Input
                  value={vehicleForm.make}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                  placeholder="e.g., Mercedes-Benz"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  placeholder="e.g., S-Class"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={vehicleForm.year}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, year: parseInt(e.target.value) })}
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Color</Label>
                <Input
                  value={vehicleForm.color}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                  placeholder="e.g., Black"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>License Plate</Label>
                <Input
                  value={vehicleForm.licensePlate}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                  placeholder="e.g., ABC123"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Capacity (Passengers)</Label>
                <Input
                  type="number"
                  value={vehicleForm.capacity}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) })}
                  className="bg-black border-gold/20 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={vehicleForm.type} onValueChange={(value) => setVehicleForm({ ...vehicleForm, type: value })}>
                  <SelectTrigger className="bg-black border-gold/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/20">
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sprinter">Sprinter Van</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={vehicleForm.status} onValueChange={(value) => setVehicleForm({ ...vehicleForm, status: value })}>
                  <SelectTrigger className="bg-black border-gold/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/20">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in-use">In Use</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Base Rate (per trip)</Label>
              <Input
                type="number"
                value={vehicleForm.baseRate}
                onChange={(e) => setVehicleForm({ ...vehicleForm, baseRate: parseFloat(e.target.value) })}
                className="bg-black border-gold/20 text-white"
              />
            </div>

            {/* Vehicle Image Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white">Vehicle Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-gold/30 text-gold hover:bg-gold/10"
                  onClick={() => {
                    fetchGalleryImages();
                    setShowImageGallery(true);
                  }}
                >
                  <Images className="h-4 w-4 mr-2" />
                  Browse Gallery
                </Button>
              </div>
              <div className="mt-2">
                {vehicleImagePreview ? (
                  <div className="relative">
                    <img
                      src={vehicleImagePreview}
                      alt="Vehicle preview"
                      className="w-full h-48 object-cover rounded-lg border border-gold/20"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-black/80 border-gold/30 text-gold hover:bg-gold/20"
                        onClick={handleCropImage}
                      >
                        <Crop className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-black/80 border-gold/30 text-white hover:bg-red-500/80"
                        onClick={() => {
                          setVehicleImagePreview('');
                          setVehicleImageFile(null);
                          setVehicleForm({ ...vehicleForm, imageUrl: '' });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gold/20 rounded-lg p-8 text-center hover:border-gold/40 transition-colors">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gold/50" />
                    <p className="text-sm text-gray-400 mb-2">Upload vehicle image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleVehicleImageChange}
                      className="hidden"
                      id="vehicle-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gold/30 text-gold hover:bg-gold/10"
                      onClick={() => document.getElementById('vehicle-image-upload')?.click()}
                    >
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowVehicleModal(false);
              setEditingVehicle(null);
              setVehicleForm({
                make: '',
                model: '',
                year: new Date().getFullYear(),
                color: '',
                capacity: 4,
                type: 'sedan',
                status: 'available',
                baseRate: 140,
                licensePlate: '',
                imageUrl: '',
              });
              setVehicleImageFile(null);
              setVehicleImagePreview('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle}
              className="bg-gold text-black hover:bg-gold/90"
              disabled={uploadingVehicleImage}
            >
              {uploadingVehicleImage ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Upload className="h-4 w-4" />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <Car className="h-4 w-4 mr-2" />
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver Modal */}
      <Dialog open={showDriverModal} onOpenChange={setShowDriverModal}>
        <DialogContent className="bg-charcoal border-gold/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-cormorant text-2xl">
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingDriver ? 'Update driver information' : 'Add a new driver to your team'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={driverForm.firstName}
                  onChange={(e) => setDriverForm({ ...driverForm, firstName: e.target.value })}
                  placeholder="John"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={driverForm.lastName}
                  onChange={(e) => setDriverForm({ ...driverForm, lastName: e.target.value })}
                  placeholder="Doe"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={driverForm.email}
                  onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                  placeholder="driver@globa7.com"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={driverForm.phone}
                  onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                  placeholder="(504) 555-0123"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>License Number</Label>
                <Input
                  value={driverForm.licenseNumber}
                  onChange={(e) => setDriverForm({ ...driverForm, licenseNumber: e.target.value })}
                  placeholder="DL123456"
                  className="bg-black border-gold/20 text-white"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={driverForm.status} onValueChange={(value) => setDriverForm({ ...driverForm, status: value })}>
                  <SelectTrigger className="bg-black border-gold/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/20">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-trip">On Trip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="affiliate"
                checked={driverForm.isAffiliate}
                onCheckedChange={(checked) => setDriverForm({ ...driverForm, isAffiliate: checked })}
                className="border-gold data-[state=checked]:bg-gold data-[state=checked]:text-black"
              />
              <label
                htmlFor="affiliate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-gold" />
                Affiliate Driver
              </label>
            </div>

            {/* Document Uploads */}
            <div className="space-y-3 pt-4 border-t border-gold/10">
              <h3 className="text-sm font-semibold text-gold">Required Documents</h3>
              
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileImage className="h-4 w-4 text-gold" />
                  Driver's License
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'licenseImageUrl');
                    }}
                    className="bg-black border-gold/20 text-white"
                  />
                  {driverForm.licenseImageUrl && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-gold" />
                  License Plate Photo
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'licensePlateImageUrl');
                    }}
                    className="bg-black border-gold/20 text-white"
                  />
                  {driverForm.licensePlateImageUrl && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gold" />
                  Vehicle Registration
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'vehicleRegistrationUrl');
                    }}
                    className="bg-black border-gold/20 text-white"
                  />
                  {driverForm.vehicleRegistrationUrl && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDriverModal(false);
              setEditingDriver(null);
              setDriverForm({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                licenseNumber: '',
                isAffiliate: false,
                status: 'active',
                rating: 5,
                totalTrips: 0,
                licenseImageUrl: '',
                licensePlateImageUrl: '',
                vehicleRegistrationUrl: '',
                isActive: true,
              });
            }}>
              Cancel
            </Button>
            <Button 
              onClick={editingDriver ? handleUpdateDriver : handleAddDriver}
              className="bg-gold text-black hover:bg-gold/90"
            >
              <Users className="h-4 w-4 mr-2" />
              {editingDriver ? 'Update Driver' : 'Add Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver Details Modal */}
      <Dialog open={showDriverDetailsModal} onOpenChange={setShowDriverDetailsModal}>
        <DialogContent className="bg-charcoal border-gold/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold font-cormorant text-2xl flex items-center gap-3">
              <Users className="h-6 w-6" />
              Driver Profile Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete driver information and documentation
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-black/30 p-4 rounded-lg border border-gold/10">
                <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-white font-semibold">{selectedDriver.firstName} {selectedDriver.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-white">{selectedDriver.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-white">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">License Number</p>
                    <p className="text-white">{selectedDriver.licenseNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge variant={selectedDriver.status === 'active' ? 'default' : 'secondary'}>
                      {selectedDriver.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Account Status</p>
                    <div className="flex items-center gap-2">
                      {selectedDriver.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Deactivated</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold hover:text-black"
                        onClick={() => {
                          handleToggleDriverStatus(selectedDriver);
                          setShowDriverDetailsModal(false);
                        }}
                      >
                        {selectedDriver.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-white flex items-center gap-1">
                      <Star className="h-4 w-4 text-gold fill-gold" />
                      {selectedDriver.rating || 5}/5
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Trips</p>
                    <p className="text-white">{selectedDriver.totalTrips || 0}</p>
                  </div>
                  {selectedDriver.isAffiliate && (
                    <div className="col-span-2">
                      <Badge variant="outline" className="border-gold text-gold">
                        <Star className="h-3 w-3 mr-1 fill-gold" />
                        Affiliate Driver
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-black/30 p-4 rounded-lg border border-gold/10">
                <h3 className="text-lg font-semibold text-gold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Verification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Driver's License */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-gold" />
                      <p className="text-sm font-semibold text-white">Driver's License</p>
                    </div>
                    {selectedDriver.licenseImageUrl ? (
                      <div className="relative group">
                        <img
                          src={selectedDriver.licenseImageUrl}
                          alt="Driver's License"
                          className="w-full h-48 object-cover rounded-lg border border-gold/20"
                        />
                        <a
                          href={selectedDriver.licenseImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                        >
                          <Eye className="h-8 w-8 text-gold" />
                        </a>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-black/50 rounded-lg border border-gold/10 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* License Plate */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-gold" />
                      <p className="text-sm font-semibold text-white">License Plate</p>
                    </div>
                    {selectedDriver.licensePlateImageUrl ? (
                      <div className="relative group">
                        <img
                          src={selectedDriver.licensePlateImageUrl}
                          alt="License Plate"
                          className="w-full h-48 object-cover rounded-lg border border-gold/20"
                        />
                        <a
                          href={selectedDriver.licensePlateImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                        >
                          <Eye className="h-8 w-8 text-gold" />
                        </a>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-black/50 rounded-lg border border-gold/10 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Registration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold" />
                      <p className="text-sm font-semibold text-white">Vehicle Registration</p>
                    </div>
                    {selectedDriver.vehicleRegistrationUrl ? (
                      <div className="relative group">
                        <img
                          src={selectedDriver.vehicleRegistrationUrl}
                          alt="Vehicle Registration"
                          className="w-full h-48 object-cover rounded-lg border border-gold/20"
                        />
                        <a
                          href={selectedDriver.vehicleRegistrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                        >
                          <Eye className="h-8 w-8 text-gold" />
                        </a>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-black/50 rounded-lg border border-gold/10 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No document uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDriverDetailsModal(false)}
              className="border-gold text-gold hover:bg-gold hover:text-black"
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                if (selectedDriver) {
                  handleEditDriver(selectedDriver);
                  setShowDriverDetailsModal(false);
                }
              }}
              className="bg-gold text-black hover:bg-gold/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Creation Modal */}
      <ServiceCreationModal
        open={showServiceCreationModal}
        onOpenChange={setShowServiceCreationModal}
        onServiceCreated={() => {
          toast.success('Service created successfully!');
          // Refresh services list
          fetchAllData();
        }}
      />

      {/* Image Gallery Modal */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="bg-charcoal border-gold/20 text-white max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-gold font-cormorant text-2xl">
                  Vehicle Image Gallery
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select an image from your uploaded fleet images
                </DialogDescription>
              </div>
              <Button
                onClick={() => setShowGalleryUpload(true)}
                className="bg-gold text-black hover:bg-gold/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </DialogHeader>

          {loadingGallery ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full"
              />
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-12">
              <FileImage className="h-16 w-16 mx-auto mb-4 text-gold/30" />
              <p className="text-gray-400">No images in gallery yet</p>
              <p className="text-sm text-gray-500 mt-2">Upload vehicle images to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer rounded-lg overflow-hidden border border-gold/20 hover:border-gold/50 transition-all"
                  onClick={() => handleSelectGalleryImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center">
                      <Check className="h-8 w-8 mx-auto mb-2 text-gold" />
                      <p className="text-white text-sm">Select Image</p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs truncate">{image.name}</p>
                    <p className="text-gold text-xs">{image.bucket.replace('make-12e765ba-', '')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImageGallery(false)}
              className="border-gold/30 text-white hover:bg-gold/10"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Upload Dialog */}
      <Dialog open={showGalleryUpload} onOpenChange={setShowGalleryUpload}>
        <DialogContent className="bg-charcoal border-gold/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gold font-cormorant text-2xl">
              Upload Image to Gallery
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Upload a vehicle image to your fleet gallery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Vehicle Category *</Label>
              <Select value={galleryUploadCategory} onValueChange={setGalleryUploadCategory}>
                <SelectTrigger className="bg-black border-gold/20 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-charcoal border-gold/20">
                  <SelectItem value="Cadillac">Black Luxury SUV (Cadillac/GMC)</SelectItem>
                  <SelectItem value="14-Passenger-Sprinter">14-Passenger Sprinter</SelectItem>
                  <SelectItem value="28-Passenger-Mini-Coach">28-Passenger Mini Coach</SelectItem>
                  <SelectItem value="55-Passenger-Coach">55-Passenger Coach</SelectItem>
                  <SelectItem value="vehicles">General Vehicles</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Choose the category to organize your fleet images
              </p>
            </div>

            <div>
              <Label className="text-gray-300">Image File *</Label>
              {galleryUploadPreview ? (
                <div className="relative mt-2">
                  <img
                    src={galleryUploadPreview}
                    alt="Upload preview"
                    className="w-full h-64 object-cover rounded-lg border border-gold/20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/80 border-gold/30 text-white hover:bg-red-500/80"
                    onClick={() => {
                      setGalleryUploadPreview('');
                      setGalleryUploadFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gold/20 rounded-lg p-8 text-center hover:border-gold/40 transition-colors mt-2">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gold/50" />
                  <p className="text-sm text-gray-400 mb-2">Upload vehicle image</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFileChange}
                    className="hidden"
                    id="gallery-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                    onClick={() => document.getElementById('gallery-image-upload')?.click()}
                  >
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowGalleryUpload(false);
                setGalleryUploadFile(null);
                setGalleryUploadPreview('');
                setGalleryUploadCategory('Cadillac');
              }}
              className="border-gold/30 text-white hover:bg-gold/10"
              disabled={uploadingToGallery}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadToGallery}
              className="bg-gold text-black hover:bg-gold/90"
              disabled={uploadingToGallery || !galleryUploadFile}
            >
              {uploadingToGallery ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Upload className="h-4 w-4" />
                  </motion.div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to Gallery
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Cropper */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setImageToCrop(null)}
          aspect={16 / 9}
        />
      )}
    </div>
  );
}
