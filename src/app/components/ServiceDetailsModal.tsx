import { motion } from 'motion/react';
import {
  X, Clock, Users, MapPin, CheckCircle, Star, Calendar,
  DollarSign, Gift, Info, Sparkles, Navigation, Phone, Mail
} from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ServiceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  onBookNow?: () => void;
}

export function ServiceDetailsModal({ open, onOpenChange, service, onBookNow }: ServiceDetailsModalProps) {
  if (!service) return null;

  const discountedPrice = service.discountPercent > 0
    ? service.basePrice * (1 - service.discountPercent / 100)
    : service.basePrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-charcoal border-gold text-white max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        {service.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent"></div>
            
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <X className="h-5 w-5 text-white" />
            </button>

            {/* Price Badge */}
            <div className="absolute bottom-4 right-4">
              <motion.div
                className="px-6 py-3 rounded-lg bg-gold/90 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-baseline gap-2">
                  {service.discountPercent > 0 && (
                    <span className="text-lg text-black/60 line-through">${service.basePrice}</span>
                  )}
                  <span className="text-3xl font-cormorant font-bold text-black">
                    ${discountedPrice}
                  </span>
                </div>
                {service.discountPercent > 0 && (
                  <Badge className="bg-red-500 text-white mt-1">
                    Save {service.discountPercent}%
                  </Badge>
                )}
              </motion.div>
            </div>

            {/* Featured Badge */}
            {service.isFeatured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gold text-black">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="p-8">
          {/* Title & Quick Info */}
          <div className="mb-6">
            <h2 className="text-4xl font-cormorant text-gold mb-3 flex items-center gap-3">
              <span className="text-4xl">{service.category === 'tour' ? '🎭' : '🎉'}</span>
              {service.name}
            </h2>
            <p className="text-lg text-gray-300 mb-4">{service.shortDescription}</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="h-4 w-4 text-gold" />
                <span>{service.duration} hours</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-4 w-4 text-gold" />
                <span>Up to {service.maxCapacity} guests</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4 text-gold" />
                <span>Book {service.minBookingDays} days ahead</span>
              </div>
              {service.loyaltyPoints > 0 && (
                <div className="flex items-center gap-2 text-gold">
                  <Star className="h-4 w-4" />
                  <span>Earn {service.loyaltyPoints} points</span>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          {service.longDescription && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-gold" />
                About This Experience
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {service.longDescription}
              </p>
            </div>
          )}

          {/* Tour Highlights */}
          {service.tourHighlights && service.tourHighlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                Tour Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.tourHighlights.map((highlight: string, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-gold/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CheckCircle className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Point */}
          {service.meetingPoint && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gold" />
                Meeting Point
              </h3>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-white">{service.meetingPoint}</p>
              </div>
            </div>
          )}

          {/* Detailed Itinerary */}
          {service.itinerary && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Navigation className="h-5 w-5 text-gold" />
                Detailed Itinerary
              </h3>
              <div className="p-4 rounded-lg bg-black/30 border border-gold/10">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {service.itinerary}
                </p>
              </div>
            </div>
          )}

          {/* What's Included/Excluded */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Included */}
            {service.included && service.included.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  What's Included
                </h3>
                <div className="space-y-2">
                  {service.included.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                    >
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Excluded */}
            {service.excluded && service.excluded.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-400" />
                  What's NOT Included
                </h3>
                <div className="space-y-2">
                  {service.excluded.map((item: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Special Requirements */}
          {service.specialRequirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-orange-400" />
                Important Information
              </h3>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-gray-300 text-sm">{service.specialRequirements}</p>
              </div>
            </div>
          )}

          {/* Cancellation Policy */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cancellation Policy</h3>
            <div className="p-4 rounded-lg bg-black/30 border border-gold/10">
              <p className="text-gray-300 text-sm capitalize">
                {service.cancellationPolicy === 'flexible' && '✓ Free cancellation up to 24 hours before'}
                {service.cancellationPolicy === 'moderate' && '✓ Free cancellation up to 72 hours before'}
                {service.cancellationPolicy === 'strict' && '✓ Free cancellation up to 7 days before'}
                {service.cancellationPolicy === 'non_refundable' && '✗ Non-refundable booking'}
              </p>
            </div>
          </div>

          {/* Available Days */}
          {service.availableDays && service.availableDays.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Available Days</h3>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <Badge
                    key={day}
                    className={service.availableDays.includes(day) ? 'bg-gold text-black' : 'bg-gray-600 text-gray-400'}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Seasonal Pricing Note */}
          {service.seasonalPricing && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Seasonal Pricing</h4>
                  <p className="text-sm text-gray-300">
                    Prices may vary during peak seasons (Mardi Gras, Jazz Fest, holidays). 
                    Peak season rate: ${(service.basePrice * service.peakSeasonMultiplier).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gold/20">
            <Button
              onClick={() => {
                onOpenChange(false);
                onBookNow?.();
              }}
              className="flex-1 bg-gold text-black hover:bg-gold/90 h-14 text-lg font-semibold"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book This Experience
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
                onClick={() => window.location.href = 'tel:5046414506'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-black"
                onClick={() => window.location.href = 'mailto:booking@globa7.com'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Questions? Call us at <a href="tel:5046414506" className="text-gold hover:underline">(504) 641-4506</a></p>
            <p className="mt-1">or email <a href="mailto:booking@globa7.com" className="text-gold hover:underline">booking@globa7.com</a></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
