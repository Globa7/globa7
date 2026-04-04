import { useState, useRef } from 'react';
import { X, Upload, AlertCircle, Check, ImageIcon, Sparkles, DollarSign, Tag, FileText, Clock, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SERVICE_CATEGORIES = [
  { value: 'tour', label: 'City Tour', icon: '🎭', color: 'from-purple-500 to-purple-600' },
  { value: 'festival', label: 'Festival Event', icon: '🎉', color: 'from-orange-500 to-red-500' },
  { value: 'mardi_gras', label: 'Mardi Gras Special', icon: '🎭', color: 'from-green-500 to-purple-600' },
  { value: 'jazz_fest', label: 'Jazz Festival', icon: '🎺', color: 'from-blue-500 to-indigo-600' },
  { value: 'wedding', label: 'Wedding Package', icon: '💍', color: 'from-pink-500 to-pink-600' },
  { value: 'corporate', label: 'Corporate Event', icon: '💼', color: 'from-gray-600 to-gray-700' },
  { value: 'airport', label: 'Airport Service', icon: '✈️', color: 'from-blue-400 to-blue-600' },
  { value: 'custom', label: 'Custom Service', icon: '⚡', color: 'from-gold to-yellow-600' },
];

const TOUR_HIGHLIGHTS = [
  'French Quarter Architecture',
  'Garden District Mansions',
  'Historic Cemeteries',
  'Jazz History Sites',
  'Creole Cuisine Stops',
  'Mississippi Riverfront',
  'Art Galleries',
  'Local Markets',
  'Hidden Courtyards',
  'Photo Opportunities',
];

interface ServiceCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceCreated: () => void;
}

export function ServiceCreationModal({ open, onOpenChange, onServiceCreated }: ServiceCreationModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageZoom, setImageZoom] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    category: 'tour',
    shortDescription: '',
    longDescription: '',
    
    // Pricing
    basePrice: 0,
    discountPercent: 0,
    loyaltyPoints: 0,
    seasonalPricing: false,
    peakSeasonMultiplier: 1.5,
    
    // Service Details
    duration: 3,
    maxCapacity: 6,
    minBookingDays: 7,
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    
    // Tour Specific
    tourHighlights: [] as string[],
    itinerary: '',
    meetingPoint: '',
    
    // Included/Excluded
    included: [] as string[],
    excluded: [] as string[],
    
    // Requirements
    specialRequirements: '',
    cancellationPolicy: 'flexible',
    
    // Image
    imageUrl: '',
    
    // Status
    isActive: true,
    isFeatured: false,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageZoom(1); // Reset zoom when new image is uploaded
        updateFormData({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setImageZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const toggleHighlight = (highlight: string) => {
    updateFormData({
      tourHighlights: formData.tourHighlights.includes(highlight)
        ? formData.tourHighlights.filter(h => h !== highlight)
        : [...formData.tourHighlights, highlight]
    });
  };

  const addIncluded = (item: string) => {
    if (item.trim()) {
      updateFormData({ included: [...formData.included, item.trim()] });
    }
  };

  const removeIncluded = (index: number) => {
    updateFormData({ included: formData.included.filter((_, i) => i !== index) });
  };

  const addExcluded = (item: string) => {
    if (item.trim()) {
      updateFormData({ excluded: [...formData.excluded, item.trim()] });
    }
  };

  const removeExcluded = (index: number) => {
    updateFormData({ excluded: formData.excluded.filter((_, i) => i !== index) });
  };

  const toggleDay = (day: string) => {
    updateFormData({
      availableDays: formData.availableDays.includes(day)
        ? formData.availableDays.filter(d => d !== day)
        : [...formData.availableDays, day]
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shortDescription || formData.basePrice <= 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Creating service with data:', formData);
      console.log('Session:', session ? 'Found' : 'Not found');
      
      const response = await fetch(`${API_BASE}/admin/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        toast.success('Service created successfully! 🎉');
        onServiceCreated();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(data.error || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create service';
      
      // Show helpful message if authentication error
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Please log in with an admin account to create services.');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        toast.error('Admin access required. Please ensure you have administrator privileges.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'tour',
      shortDescription: '',
      longDescription: '',
      basePrice: 0,
      discountPercent: 0,
      loyaltyPoints: 0,
      seasonalPricing: false,
      peakSeasonMultiplier: 1.5,
      duration: 3,
      maxCapacity: 6,
      minBookingDays: 7,
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      tourHighlights: [],
      itinerary: '',
      meetingPoint: '',
      included: [],
      excluded: [],
      specialRequirements: '',
      cancellationPolicy: 'flexible',
      imageUrl: '',
      isActive: true,
      isFeatured: false,
    });
    setImagePreview('');
    setCurrentStep(1);
  };

  const selectedCategory = SERVICE_CATEGORIES.find(c => c.value === formData.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-gold text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-cormorant text-gold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            Create New Service
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Step {currentStep} of 4 - Build your premium service offering
          </DialogDescription>
        </DialogHeader>

        {/* Auth Warning */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 mb-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-orange-500 font-semibold mb-1">Authentication Required</h4>
                <p className="text-sm text-gray-300 mb-2">
                  You need to log in with an admin account before creating services.
                </p>
                <p className="text-xs text-gray-400">
                  1. Go to <a href="/auth" className="text-gold hover:underline">/auth</a> to sign up or login<br />
                  2. Contact an administrator to get admin access<br />
                  3. Create your service!
                </p>
              </div>
            </div>
          </motion.div>
        )}

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
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-xl font-cormorant text-gold mb-4 block">Service Category</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SERVICE_CATEGORIES.map((category) => (
                      <motion.button
                        key={category.value}
                        type="button"
                        onClick={() => updateFormData({ category: category.value })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.category === category.value
                            ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                            : 'border-gold/20 hover:border-gold/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="text-xs font-medium text-white">{category.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Service Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder="French Quarter & Garden District Tour"
                    className="bg-black border-gold/20 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Short Description *</Label>
                  <Textarea
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                    placeholder="A captivating journey through New Orleans' most iconic neighborhoods..."
                    rows={3}
                    className="bg-black border-gold/20 text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This appears on service cards</p>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Full Description</Label>
                  <Textarea
                    value={formData.longDescription}
                    onChange={(e) => updateFormData({ longDescription: e.target.value })}
                    placeholder="Detailed description of the experience, what guests will see and do..."
                    rows={6}
                    className="bg-black border-gold/20 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Shown in the service details modal</p>
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-gray-300 mb-2 block">Service Image</Label>
                  <div className="border-2 border-dashed border-gold/20 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <div 
                          className="w-full h-48 overflow-hidden rounded-lg flex items-center justify-center bg-black"
                          onWheel={handleImageWheel}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                            style={{ transform: `scale(${imageZoom})` }}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => {
                            setImagePreview('');
                            setImageZoom(1);
                            updateFormData({ imageUrl: '' });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 left-2 border-gold text-gold hover:bg-gold hover:text-black"
                          onClick={() => setImageZoom(prev => Math.max(0.5, prev - 0.1))}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-12 left-2 border-gold text-gold hover:bg-gold hover:text-black"
                          onClick={() => setImageZoom(prev => Math.min(3, prev + 0.1))}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-gray-400 mt-2">Use mouse wheel or buttons to zoom • Zoom: {Math.round(imageZoom * 100)}%</p>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-500" />
                        <p className="text-gray-400 mb-2">Click to upload service image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="service-image"
                        />
                        <label htmlFor="service-image">
                          <Button type="button" variant="outline" className="mt-3 border-gold text-gold hover:bg-gold hover:text-black" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Image
                            </span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pricing & Capacity */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Base Price ($) *</Label>
                    <Input
                      type="number"
                      value={formData.basePrice || ''}
                      onChange={(e) => updateFormData({ basePrice: parseFloat(e.target.value) || 0 })}
                      className="bg-black border-gold/20 text-white text-xl font-cormorant"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Discount Percentage</Label>
                    <Input
                      type="number"
                      value={formData.discountPercent || ''}
                      onChange={(e) => updateFormData({ discountPercent: parseFloat(e.target.value) || 0 })}
                      className="bg-black border-gold/20 text-white text-xl font-cormorant"
                      placeholder="0"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Loyalty Points Earned</Label>
                    <Input
                      type="number"
                      value={formData.loyaltyPoints || ''}
                      onChange={(e) => updateFormData({ loyaltyPoints: parseInt(e.target.value) || 0 })}
                      className="bg-black border-gold/20 text-white text-xl font-cormorant"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gold/10 border border-gold/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Seasonal Pricing</h3>
                      <p className="text-sm text-gray-400">Adjust pricing for peak seasons</p>
                    </div>
                    <Switch
                      checked={formData.seasonalPricing}
                      onCheckedChange={(checked) => updateFormData({ seasonalPricing: checked })}
                    />
                  </div>
                  {formData.seasonalPricing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Label className="text-gray-300 mb-2 block">Peak Season Multiplier</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.peakSeasonMultiplier || ''}
                        onChange={(e) => updateFormData({ peakSeasonMultiplier: parseFloat(e.target.value) || 1.5 })}
                        className="bg-black border-gold/20 text-white"
                        min="1"
                        max="3"
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Peak price: ${(formData.basePrice * formData.peakSeasonMultiplier).toFixed(2)}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold" />
                      Duration (hours)
                    </Label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => updateFormData({ duration: parseInt(e.target.value) })}
                      className="bg-black border-gold/20 text-white"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                      <Users className="h-4 w-4 text-gold" />
                      Max Capacity
                    </Label>
                    <Input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => updateFormData({ maxCapacity: parseInt(e.target.value) })}
                      className="bg-black border-gold/20 text-white"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold" />
                      Min Booking (days)
                    </Label>
                    <Input
                      type="number"
                      value={formData.minBookingDays}
                      onChange={(e) => updateFormData({ minBookingDays: parseInt(e.target.value) })}
                      className="bg-black border-gold/20 text-white"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block">Available Days</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <motion.button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day.toLowerCase())}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.availableDays.includes(day.toLowerCase())
                            ? 'border-gold bg-gold/10 text-white'
                            : 'border-gold/20 hover:border-gold/50 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xs font-medium">{day.substring(0, 3)}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Tour Details & Highlights */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {formData.category === 'tour' && (
                  <>
                    <div>
                      <Label className="text-xl font-cormorant text-gold mb-4 block">Tour Highlights</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {TOUR_HIGHLIGHTS.map((highlight) => (
                          <motion.button
                            key={highlight}
                            type="button"
                            onClick={() => toggleHighlight(highlight)}
                            className={`p-3 rounded-lg border-2 transition-all text-sm text-left ${
                              formData.tourHighlights.includes(highlight)
                                ? 'border-gold bg-gold/10 text-white'
                                : 'border-gold/20 hover:border-gold/50 text-gray-400'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{highlight}</span>
                              {formData.tourHighlights.includes(highlight) && (
                                <CheckCircle className="h-4 w-4 text-gold flex-shrink-0" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold" />
                        Meeting Point
                      </Label>
                      <Input
                        value={formData.meetingPoint}
                        onChange={(e) => updateFormData({ meetingPoint: e.target.value })}
                        placeholder="123 Royal Street, French Quarter"
                        className="bg-black border-gold/20 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 mb-2 block flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gold" />
                        Detailed Itinerary
                      </Label>
                      <Textarea
                        value={formData.itinerary}
                        onChange={(e) => updateFormData({ itinerary: e.target.value })}
                        placeholder="Hour 1: French Quarter walking tour... Hour 2: Garden District mansions..."
                        rows={8}
                        className="bg-black border-gold/20 text-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-gray-300 mb-3 block flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    What's Included
                  </Label>
                  <div className="space-y-2 mb-3">
                    {formData.included.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-white">{item}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeIncluded(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Professional chauffeur, bottled water..."
                      className="bg-black border-gold/20 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addIncluded((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-black"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addIncluded(input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-3 block flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    What's NOT Included
                  </Label>
                  <div className="space-y-2 mb-3">
                    {formData.excluded.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-white">{item}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeExcluded(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Gratuity, meals, entry fees..."
                      className="bg-black border-gold/20 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addExcluded((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-black"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addExcluded(input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Policies & Activation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-gray-300 mb-2 block">Cancellation Policy</Label>
                  <Select value={formData.cancellationPolicy} onValueChange={(value) => updateFormData({ cancellationPolicy: value })}>
                    <SelectTrigger className="bg-black border-gold/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-gold text-white">
                      <SelectItem value="flexible">Flexible (24h notice)</SelectItem>
                      <SelectItem value="moderate">Moderate (72h notice)</SelectItem>
                      <SelectItem value="strict">Strict (7 days notice)</SelectItem>
                      <SelectItem value="non_refundable">Non-Refundable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Special Requirements or Notes</Label>
                  <Textarea
                    value={formData.specialRequirements}
                    onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
                    placeholder="Age restrictions, dress code, physical requirements..."
                    rows={4}
                    className="bg-black border-gold/20 text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-gold/10">
                    <div>
                      <Label className="text-white font-semibold">Activate Service</Label>
                      <p className="text-sm text-gray-400">Make this service available for booking</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => updateFormData({ isActive: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gold/10 border border-gold/30">
                    <div>
                      <Label className="text-white font-semibold flex items-center gap-2">
                        <Star className="h-4 w-4 text-gold" />
                        Featured Service
                      </Label>
                      <p className="text-sm text-gray-400">Display prominently on homepage</p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => updateFormData({ isFeatured: checked })}
                    />
                  </div>
                </div>

                {/* Summary Preview */}
                <div className="p-6 rounded-lg bg-gradient-to-br from-gold/10 to-yellow-500/10 border border-gold/30">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-gold" />
                    Service Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Service Name</p>
                      <p className="text-white font-semibold">{formData.name || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-white font-semibold capitalize">{selectedCategory?.label}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-gold font-semibold text-lg">${formData.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Duration</p>
                      <p className="text-white font-semibold">{formData.duration} hours</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Max Capacity</p>
                      <p className="text-white font-semibold">{formData.maxCapacity} guests</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <Badge className={formData.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
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
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gold text-black hover:bg-gold/90"
              >
                {loading ? (
                  <>
                    <motion.div
                      className="h-4 w-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Service
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}