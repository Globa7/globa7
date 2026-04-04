import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from '../../../utils/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

interface PageSection {
  id: string;
  name: string;
  type: 'hero' | 'services' | 'fleet' | 'testimonials' | 'cta' | 'custom';
  visible: boolean;
  content: {
    heading?: string;
    subheading?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    images?: string[];
    backgroundColor?: string;
    textColor?: string;
  };
  order: number;
}

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'color';
  label: string;
  section: string;
}

export function PageEditor() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    loadPageContent();
    loadUploadedImages();
  }, []);

  const loadPageContent = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to access page editor');
        return;
      }

      const response = await fetch(`${API_BASE}/admin/page-content`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to load page content');
      
      const data = await response.json();
      setSections(data.sections || getDefaultSections());
    } catch (error) {
      console.error('Error loading page content:', error);
      setSections(getDefaultSections());
    } finally {
      setLoading(false);
    }
  };

  const loadUploadedImages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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

  const getDefaultSections = (): PageSection[] => [
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      visible: true,
      order: 1,
      content: {
        heading: 'Luxury Transportation in New Orleans',
        subheading: 'Experience World-Class Service',
        description: 'Premium black car service, airport transfers, and special events',
        buttonText: 'Book Your Ride',
        buttonLink: '/reservation',
        images: [],
        backgroundColor: '#000000',
        textColor: '#FFFFFF'
      }
    },
    {
      id: 'services',
      name: 'Services Section',
      type: 'services',
      visible: true,
      order: 2,
      content: {
        heading: 'Our Premium Services',
        description: 'Tailored transportation solutions for every occasion',
        backgroundColor: '#1A1A1A',
        textColor: '#FFFFFF'
      }
    },
    {
      id: 'fleet',
      name: 'Fleet Section',
      type: 'fleet',
      visible: true,
      order: 3,
      content: {
        heading: 'Our Luxury Fleet',
        description: 'Immaculate vehicles, professional chauffeurs',
        backgroundColor: '#000000',
        textColor: '#FFFFFF'
      }
    },
    {
      id: 'cta',
      name: 'Call to Action',
      type: 'cta',
      visible: true,
      order: 4,
      content: {
        heading: 'Ready to Experience Luxury?',
        description: 'Book your premium transportation today',
        buttonText: 'Get Started',
        buttonLink: '/reservation',
        backgroundColor: '#D4AF37',
        textColor: '#000000'
      }
    }
  ];

  const savePageContent = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to save changes');
        return;
      }

      const response = await fetch(`${API_BASE}/admin/page-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sections })
      });

      if (!response.ok) throw new Error('Failed to save page content');

      toast.success('Page content saved successfully');
    } catch (error) {
      console.error('Error saving page content:', error);
      toast.error('Failed to save page content');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    ));
  };

  const updateSectionContent = (sectionId: string, contentUpdates: any) => {
    setSections(sections.map(s => 
      s.id === sectionId 
        ? { ...s, content: { ...s.content, ...contentUpdates } }
        : s
    ));
  };

  const addImageToSection = (sectionId: string, imageUrl: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const images = s.content.images || [];
        return {
          ...s,
          content: {
            ...s.content,
            images: [...images, imageUrl]
          }
        };
      }
      return s;
    }));
    setShowImagePicker(false);
    toast.success('Image added to section');
  };

  const removeImageFromSection = (sectionId: string, imageUrl: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        const images = s.content.images || [];
        return {
          ...s,
          content: {
            ...s.content,
            images: images.filter(img => img !== imageUrl)
          }
        };
      }
      return s;
    }));
    toast.success('Image removed from section');
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setSections(sections.map(s => 
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    ));
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleImageUpload = async (files: FileList, sectionId: string) => {
    if (!files || files.length === 0) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in to upload images');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('make-12e765ba-website-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

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

        // Add to section
        addImageToSection(sectionId, urlData.publicUrl);
      }

      toast.success(`Successfully uploaded ${files.length} image(s)`);
      await loadUploadedImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-serif)' }}>
            Page Editor
          </h2>
          <p className="text-gray-400 mt-1">Edit your website content and images</p>
        </div>
        <Button
          onClick={savePageContent}
          disabled={saving}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Sections List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-[#D4AF37]" />
        </div>
      ) : (
        <div className="space-y-4">
          {sections.sort((a, b) => a.order - b.order).map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            
            return (
              <Card key={section.id} className="bg-[#1A1A1A] border-[#D4AF37]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSectionExpanded(section.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
                        )}
                      </Button>
                      <div>
                        <CardTitle className="text-xl">{section.name}</CardTitle>
                        <CardDescription className="text-sm capitalize">
                          {section.type} • {section.visible ? 'Visible' : 'Hidden'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSectionVisibility(section.id)}
                        className={section.visible ? 'border-green-500/30' : 'border-red-500/30'}
                      >
                        {section.visible ? (
                          <>
                            <Eye className="w-4 h-4 mr-2 text-green-500" />
                            Visible
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 mr-2 text-red-500" />
                            Hidden
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-6">
                    {/* Text Content Editor */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Text Content
                      </h4>
                      
                      {section.content.heading !== undefined && (
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={section.content.heading}
                            onChange={(e) => updateSectionContent(section.id, { heading: e.target.value })}
                            className="bg-black border-[#D4AF37]/20 text-lg font-semibold"
                            placeholder="Enter heading..."
                          />
                        </div>
                      )}

                      {section.content.subheading !== undefined && (
                        <div className="space-y-2">
                          <Label>Subheading</Label>
                          <Input
                            value={section.content.subheading}
                            onChange={(e) => updateSectionContent(section.id, { subheading: e.target.value })}
                            className="bg-black border-[#D4AF37]/20"
                            placeholder="Enter subheading..."
                          />
                        </div>
                      )}

                      {section.content.description !== undefined && (
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={section.content.description}
                            onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                            className="bg-black border-[#D4AF37]/20 min-h-[100px]"
                            placeholder="Enter description..."
                          />
                        </div>
                      )}

                      {section.content.buttonText !== undefined && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                              value={section.content.buttonText}
                              onChange={(e) => updateSectionContent(section.id, { buttonText: e.target.value })}
                              className="bg-black border-[#D4AF37]/20"
                              placeholder="Button text..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Button Link</Label>
                            <Input
                              value={section.content.buttonLink}
                              onChange={(e) => updateSectionContent(section.id, { buttonLink: e.target.value })}
                              className="bg-black border-[#D4AF37]/20"
                              placeholder="/link"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={section.content.backgroundColor}
                              onChange={(e) => updateSectionContent(section.id, { backgroundColor: e.target.value })}
                              className="w-16 h-10 p-1 bg-black border-[#D4AF37]/20"
                            />
                            <Input
                              value={section.content.backgroundColor}
                              onChange={(e) => updateSectionContent(section.id, { backgroundColor: e.target.value })}
                              className="flex-1 bg-black border-[#D4AF37]/20"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={section.content.textColor}
                              onChange={(e) => updateSectionContent(section.id, { textColor: e.target.value })}
                              className="w-16 h-10 p-1 bg-black border-[#D4AF37]/20"
                            />
                            <Input
                              value={section.content.textColor}
                              onChange={(e) => updateSectionContent(section.id, { textColor: e.target.value })}
                              className="flex-1 bg-black border-[#D4AF37]/20"
                              placeholder="#FFFFFF"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Images Section */}
                    <div className="space-y-4 border-t border-[#D4AF37]/20 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#D4AF37] flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Section Images
                        </h4>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => e.target.files && handleImageUpload(e.target.files, section.id)}
                            className="hidden"
                            id={`upload-${section.id}`}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => document.getElementById(`upload-${section.id}`)?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingSection(section);
                              setShowImagePicker(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Existing
                          </Button>
                        </div>
                      </div>

                      {section.content.images && section.content.images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {section.content.images.map((imageUrl, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-lg overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all"
                            >
                              <img
                                src={imageUrl}
                                alt={`Section image ${idx + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeImageFromSection(section.id, imageUrl)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-[#D4AF37]/20 rounded-lg">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                          <p className="text-gray-400 text-sm">No images in this section</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Image Picker Dialog */}
      <Dialog open={showImagePicker} onOpenChange={setShowImagePicker}>
        <DialogContent className="bg-[#1A1A1A] text-white border-[#D4AF37]/20 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-serif)' }}>
              Select Image
            </DialogTitle>
            <DialogDescription>
              Choose an image from your library
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 p-2">
            {uploadedImages.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No images available</p>
              </div>
            ) : (
              uploadedImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => {
                    if (editingSection) {
                      addImageToSection(editingSection.id, image.url);
                    }
                  }}
                  className="relative cursor-pointer rounded overflow-hidden border-2 border-transparent hover:border-[#D4AF37] transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1">
                    <p className="text-xs text-gray-300 truncate">{image.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImagePicker(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}