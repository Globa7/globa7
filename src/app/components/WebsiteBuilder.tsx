import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { PageEditor } from './PageEditor';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

interface CarouselImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  order: number;
}

interface Carousel {
  id: string;
  name: string;
  location: string; // 'hero', 'fleet', 'testimonials', etc.
  images: CarouselImage[];
  settings: {
    autoplay: boolean;
    interval: number;
    showDots: boolean;
    showArrows: boolean;
    transition: 'fade' | 'slide';
  };
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
  size: number;
}

export function WebsiteBuilder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [selectedCarousel, setSelectedCarousel] = useState<Carousel | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCarouselBuilder, setShowCarouselBuilder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadUploadedImages(),
        loadCarousels()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load website builder data');
    } finally {
      setLoading(false);
    }
  };

  const loadUploadedImages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to access website builder');
        return;
      }

      const response = await fetch(`${API_BASE}/admin/images`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to load images');
      
      const data = await response.json();
      setUploadedImages(data.images || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const loadCarousels = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/carousels`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to load carousels');
      
      const data = await response.json();
      setCarousels(data.carousels || []);
    } catch (error) {
      console.error('Error loading carousels:', error);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to upload images');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('make-12e765ba-website-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('make-12e765ba-website-images')
          .getPublicUrl(fileName);

        // Save to database
        const response = await fetch(`${API_BASE}/admin/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: urlData.publicUrl,
            name: file.name,
            size: file.size
          })
        });

        if (!response.ok) throw new Error('Failed to save image');

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      toast.success(`Successfully uploaded ${files.length} image(s)`);
      await loadUploadedImages();
      setShowImageUploader(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted successfully');
      await loadUploadedImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const createCarousel = async (carousel: Partial<Carousel>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/carousels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(carousel)
      });

      if (!response.ok) throw new Error('Failed to create carousel');

      toast.success('Carousel created successfully');
      await loadCarousels();
      setShowCarouselBuilder(false);
    } catch (error) {
      console.error('Error creating carousel:', error);
      toast.error('Failed to create carousel');
    }
  };

  const updateCarousel = async (carouselId: string, updates: Partial<Carousel>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/carousels/${carouselId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update carousel');

      toast.success('Carousel updated successfully');
      await loadCarousels();
    } catch (error) {
      console.error('Error updating carousel:', error);
      toast.error('Failed to update carousel');
    }
  };

  const deleteCarousel = async (carouselId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${API_BASE}/admin/carousels/${carouselId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete carousel');

      toast.success('Carousel deleted successfully');
      await loadCarousels();
    } catch (error) {
      console.error('Error deleting carousel:', error);
      toast.error('Failed to delete carousel');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                Website Builder
              </h1>
              <p className="text-gray-400">Manage your website content like Elementor</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className={previewMode === 'desktop' ? 'bg-[#D4AF37] text-black' : ''}
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={previewMode === 'tablet' ? 'bg-[#D4AF37] text-black' : ''}
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={previewMode === 'mobile' ? 'bg-[#D4AF37] text-black' : ''}
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="images" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="images">
              <ImageIcon className="w-4 h-4 mr-2" />
              Image Library
            </TabsTrigger>
            <TabsTrigger value="carousels">
              <Layers className="w-4 h-4 mr-2" />
              Carousels
            </TabsTrigger>
            <TabsTrigger value="sections">
              <Layout className="w-4 h-4 mr-2" />
              Page Sections
            </TabsTrigger>
          </TabsList>

          {/* Image Library Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                      Image Library
                    </CardTitle>
                    <CardDescription>Upload and manage your website images</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowImageUploader(true)}
                    className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-[#D4AF37]" />
                  </div>
                ) : uploadedImages.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No images uploaded yet</p>
                    <p className="text-sm">Click "Upload Images" to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group rounded-lg overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(image.url);
                              toast.success('Image URL copied to clipboard');
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="p-2 bg-[#1A1A1A]">
                          <p className="text-xs text-gray-400 truncate">{image.name}</p>
                          <p className="text-xs text-gray-500">{(image.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Carousels Tab */}
          <TabsContent value="carousels" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                      Carousels
                    </CardTitle>
                    <CardDescription>Create and manage image carousels</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowCarouselBuilder(true)}
                    className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Carousel
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-[#D4AF37]" />
                  </div>
                ) : carousels.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No carousels created yet</p>
                    <p className="text-sm">Click "New Carousel" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {carousels.map((carousel) => (
                      <motion.div
                        key={carousel.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-[#D4AF37]/20 rounded-lg p-4 hover:border-[#D4AF37] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{carousel.name}</h3>
                            <p className="text-sm text-gray-400">Location: {carousel.location}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {carousel.images.length} image(s)
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedCarousel(carousel)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteCarousel(carousel.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {carousel.images.length > 0 && (
                          <div className="mt-4 flex gap-2 overflow-x-auto">
                            {carousel.images.slice(0, 5).map((img) => (
                              <img
                                key={img.id}
                                src={img.url}
                                alt={img.alt}
                                className="w-20 h-20 object-cover rounded border border-[#D4AF37]/20"
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Sections Tab */}
          <TabsContent value="sections" className="space-y-6">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-2xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  Page Sections
                </CardTitle>
                <CardDescription>Edit and customize website sections</CardDescription>
              </CardHeader>
              <CardContent>
                <PageEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Upload Dialog */}
      <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
        <DialogContent className="bg-[#1A1A1A] text-white border-[#D4AF37]/20">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-serif)' }}>Upload Images</DialogTitle>
            <DialogDescription>
              Upload images to your website library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-12 h-12 text-[#D4AF37]" />
                <p className="text-sm">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-center text-gray-400">Uploading... {uploadProgress.toFixed(0)}%</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Carousel Builder Dialog */}
      <CarouselBuilderDialog
        open={showCarouselBuilder}
        onOpenChange={setShowCarouselBuilder}
        uploadedImages={uploadedImages}
        onSave={createCarousel}
      />

      {/* Carousel Editor Dialog */}
      {selectedCarousel && (
        <CarouselEditorDialog
          carousel={selectedCarousel}
          onClose={() => setSelectedCarousel(null)}
          uploadedImages={uploadedImages}
          onSave={(updates) => {
            updateCarousel(selectedCarousel.id, updates);
            setSelectedCarousel(null);
          }}
        />
      )}
    </div>
  );
}

// Carousel Builder Dialog Component
function CarouselBuilderDialog({
  open,
  onOpenChange,
  uploadedImages,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadedImages: UploadedImage[];
  onSave: (carousel: Partial<Carousel>) => void;
}) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('hero');
  const [selectedImages, setSelectedImages] = useState<CarouselImage[]>([]);
  const [settings, setSettings] = useState({
    autoplay: true,
    interval: 5000,
    showDots: true,
    showArrows: true,
    transition: 'slide' as 'fade' | 'slide'
  });

  const handleSave = () => {
    if (!name) {
      toast.error('Please enter a carousel name');
      return;
    }
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    onSave({
      name,
      location,
      images: selectedImages,
      settings
    });

    // Reset form
    setName('');
    setLocation('hero');
    setSelectedImages([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] text-white border-[#D4AF37]/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-serif)' }}>Create New Carousel</DialogTitle>
          <DialogDescription>
            Build a custom image carousel for your website
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Carousel Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Hero Carousel, Fleet Gallery"
              className="bg-black border-[#D4AF37]/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-black border-[#D4AF37]/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Section</SelectItem>
                <SelectItem value="fleet">Fleet Section</SelectItem>
                <SelectItem value="testimonials">Testimonials</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="custom">Custom Section</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Images</Label>
            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-[#D4AF37]/20 rounded">
              {uploadedImages.map((image) => {
                const isSelected = selectedImages.some(img => img.url === image.url);
                return (
                  <div
                    key={image.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedImages(selectedImages.filter(img => img.url !== image.url));
                      } else {
                        setSelectedImages([...selectedImages, {
                          id: image.id,
                          url: image.url,
                          alt: image.name,
                          order: selectedImages.length
                        }]);
                      }
                    }}
                    className={`relative cursor-pointer rounded overflow-hidden border-2 ${
                      isSelected ? 'border-[#D4AF37]' : 'border-transparent'
                    } hover:border-[#D4AF37]/50 transition-all`}
                  >
                    <img src={image.url} alt={image.name} className="w-full h-24 object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#D4AF37] rounded-full p-1">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-[#D4AF37]/20 pt-4">
            <h4 className="font-semibold">Carousel Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Autoplay</Label>
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Dots</Label>
                <input
                  type="checkbox"
                  checked={settings.showDots}
                  onChange={(e) => setSettings({ ...settings, showDots: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Arrows</Label>
                <input
                  type="checkbox"
                  checked={settings.showArrows}
                  onChange={(e) => setSettings({ ...settings, showArrows: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="space-y-2">
                <Label>Interval (ms)</Label>
                <Input
                  type="number"
                  value={settings.interval}
                  onChange={(e) => setSettings({ ...settings, interval: parseInt(e.target.value) })}
                  className="bg-black border-[#D4AF37]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Create Carousel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Carousel Editor Dialog Component
function CarouselEditorDialog({
  carousel,
  onClose,
  uploadedImages,
  onSave
}: {
  carousel: Carousel;
  onClose: () => void;
  uploadedImages: UploadedImage[];
  onSave: (updates: Partial<Carousel>) => void;
}) {
  const [name, setName] = useState(carousel.name);
  const [location, setLocation] = useState(carousel.location);
  const [selectedImages, setSelectedImages] = useState<CarouselImage[]>(carousel.images);
  const [settings, setSettings] = useState(carousel.settings);

  const handleSave = () => {
    onSave({
      name,
      location,
      images: selectedImages,
      settings
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] text-white border-[#D4AF37]/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-serif)' }}>Edit Carousel</DialogTitle>
          <DialogDescription>
            Update your carousel settings and images
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Carousel Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border-[#D4AF37]/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-black border-[#D4AF37]/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Section</SelectItem>
                <SelectItem value="fleet">Fleet Section</SelectItem>
                <SelectItem value="testimonials">Testimonials</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="custom">Custom Section</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Selected Images</Label>
            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-[#D4AF37]/20 rounded">
              {uploadedImages.map((image) => {
                const isSelected = selectedImages.some(img => img.url === image.url);
                return (
                  <div
                    key={image.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedImages(selectedImages.filter(img => img.url !== image.url));
                      } else {
                        setSelectedImages([...selectedImages, {
                          id: image.id,
                          url: image.url,
                          alt: image.name,
                          order: selectedImages.length
                        }]);
                      }
                    }}
                    className={`relative cursor-pointer rounded overflow-hidden border-2 ${
                      isSelected ? 'border-[#D4AF37]' : 'border-transparent'
                    } hover:border-[#D4AF37]/50 transition-all`}
                  >
                    <img src={image.url} alt={image.name} className="w-full h-24 object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#D4AF37] rounded-full p-1">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 border-t border-[#D4AF37]/20 pt-4">
            <h4 className="font-semibold">Carousel Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Autoplay</Label>
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Dots</Label>
                <input
                  type="checkbox"
                  checked={settings.showDots}
                  onChange={(e) => setSettings({ ...settings, showDots: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Arrows</Label>
                <input
                  type="checkbox"
                  checked={settings.showArrows}
                  onChange={(e) => setSettings({ ...settings, showArrows: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="space-y-2">
                <Label>Interval (ms)</Label>
                <Input
                  type="number"
                  value={settings.interval}
                  onChange={(e) => setSettings({ ...settings, interval: parseInt(e.target.value) })}
                  className="bg-black border-[#D4AF37]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}