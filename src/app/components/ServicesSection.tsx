import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Sparkles, Eye } from 'lucide-react';
import { ServiceDetailsModal } from './ServiceDetailsModal';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import airportImage from 'figma:asset/f38ca17fd01859fc3cfec1fcbce82de7fb78a313.png';
import cityTourImage from 'figma:asset/9a4405f60d7cf0231bdfefcf08f2f0badb3f18e9.png';
import groupTransportImage from 'figma:asset/8ce1e3644ba54433015ef0b1f7c575cdaff71711.png';
import festivalImage from 'figma:asset/985fc17e16a1ca564e11689af4f54ce690c8fea4.png';
import weddingImage from 'figma:asset/375c8aac26de62c7679e0626c77f100ca0b054f9.png';
import corporateImage from 'figma:asset/82ec626c1fe8a1686a100853305bc8254c4c3922.png';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

interface ServicesSectionProps {
  onReserveClick: (serviceType?: string) => void;
}

export function ServicesSection({ onReserveClick }: ServicesSectionProps) {
  const [customServices, setCustomServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default services (always shown)
  const defaultServices = [
    {
      image: airportImage,
      title: 'Airport Transfers',
      price: '$140',
      description: 'MSY and Lakefront Airport pickups and drop-offs with flight tracking and meet-and-greet service. Starting at $140 one-way for Black SUV.',
      type: 'airport',
      badge: null,
      isDefault: true,
    },
    {
      image: cityTourImage,
      title: 'Private City Tours',
      price: '$425',
      description: '3-hour curated journeys through the soul of New Orleans. History, culture, cuisine—your pace.',
      type: 'tour',
      badge: 'POPULAR',
      isDefault: true,
    },
    {
      image: weddingImage,
      title: 'Weddings & Events',
      price: '$145/hr',
      description: 'Seamless transportation for your most important moments. Multi-vehicle coordination available. 4-hour minimum, 6+ hours at $145/hr.',
      type: 'wedding',
      badge: null,
      isDefault: true,
    },
    {
      image: corporateImage,
      title: 'Corporate Travel',
      price: 'NET-30',
      description: 'Dedicated account management, billing terms, and Travel Manager Portal access.',
      type: 'corporate',
      badge: null,
      isDefault: true,
    },
    {
      image: festivalImage,
      title: 'Festivals & Game Day',
      price: '$145/hr',
      description: 'LSU games, Mardi Gras, Jazz Fest—we handle the logistics so you enjoy the experience. 4-hour minimum.',
      type: 'gameday',
      badge: null,
      isDefault: true,
    },
    {
      image: groupTransportImage,
      title: 'Group Transportation',
      price: '$160+/hr',
      description: 'Sprinters, mini coaches, and full-size coaches for groups up to 55 passengers. Pricing varies by vehicle size.',
      type: 'group',
      badge: null,
      isDefault: true,
    }
  ];

  useEffect(() => {
    fetchCustomServices();
  }, []);

  const fetchCustomServices = async () => {
    try {
      if (!projectId || !publicAnonKey) {
        // Silently use default services in demo mode
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE}/services`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        console.warn(`Services API returned ${response.status}, using default services only`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.services) {
        setCustomServices(data.services);
      }
    } catch (error) {
      console.warn('Error fetching custom services (using defaults only):', error);
      // Don't throw error, just use default services
    } finally {
      setLoading(false);
    }
  };

  // Combine default and custom services
  const allServices = [...defaultServices, ...customServices.map(service => ({
    ...service,
    image: service.imageUrl,
    title: service.name,
    price: `$${service.basePrice}`,
    description: service.shortDescription,
    type: service.category,
    badge: service.isFeatured ? 'FEATURED' : (service.discountPercent > 0 ? `${service.discountPercent}% OFF` : null),
    isDefault: false,
  }))];

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="services" className="py-32 bg-[#1A1A1A] relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-3 block">Our Services</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
            Tailored Transportation
          </h2>
          <div className="elegant-divider mt-6"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {allServices.map((service, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="group relative bg-black rounded-lg overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-500 card-hover luxury-card"
            >
              {/* Badge */}
              {service.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider ${
                    service.badge === 'FEATURED' 
                      ? 'bg-gold text-black premium-badge' 
                      : service.badge.includes('OFF')
                      ? 'bg-red-500 text-white'
                      : 'bg-[#D4AF37] text-black'
                  }`}>
                    {service.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-56 overflow-hidden image-glow">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/10">
                  <div className="flex gap-2">
                    {/* Details Button for custom services */}
                    {!service.isDefault && (
                      <motion.button
                        onClick={() => handleViewDetails(service)}
                        className="px-4 py-2 rounded-md border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 text-sm font-medium flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </motion.button>
                    )}
                    {/* Book Now Button */}
                    <motion.button
                      onClick={() => onReserveClick(service.type)}
                      className="px-4 py-2 rounded-md bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-300 text-sm font-medium flex items-center gap-2 group/btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Now
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && customServices.length === 0 && (
          <div className="flex items-center justify-center gap-2 mt-8 text-gold">
            <motion.div
              className="h-8 w-8 border-2 border-gold border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-sm">Loading custom services...</span>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">Need something custom? We'll create the perfect transportation solution for you.</p>
          <motion.button
            onClick={() => onReserveClick()}
            className="btn-gold px-8 py-4 rounded-lg font-semibold text-base inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-5 w-5" />
            Request Custom Quote
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        service={selectedService}
        onBookNow={() => {
          setShowDetailsModal(false);
          onReserveClick(selectedService?.type);
        }}
      />
    </section>
  );
}