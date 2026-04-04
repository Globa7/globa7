import { useState } from 'react';
import { ArrowRight, Star, Shield, Headset, Car, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { TimeDropdown } from './TimeDropdown';

interface HeroSectionProps {
  onReserveClick: () => void;
}

export function HeroSection({ onReserveClick }: HeroSectionProps) {
  const [quickQuoteData, setQuickQuoteData] = useState({
    serviceType: '',
    date: '',
    time: '',
    pickup: '',
    phone: ''
  });

  const handleQuickQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const emailBody = `
New Quick Quote Request from Globa7.com

Service Type: ${quickQuoteData.serviceType || 'Not specified'}
Date: ${quickQuoteData.date || 'Not specified'}
Time: ${quickQuoteData.time || 'Not specified'}
Pickup Location: ${quickQuoteData.pickup || 'Not specified'}
Phone Number: ${quickQuoteData.phone || 'Not specified'}
      `.trim();

      // Send via Web3Forms API
      const formData = new FormData();
      formData.append('access_key', '48234969-164c-40a4-9f05-63ae4a207351');
      formData.append('subject', 'New Quick Quote Request – Globa7');
      formData.append('from_name', 'Globa7 Quick Quote');
      formData.append('message', emailBody);
      formData.append('to', 'booking@globa7.com');
      
      if (quickQuoteData.phone) {
        formData.append('phone', quickQuoteData.phone);
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send quote request');
      }

      alert('Quote request received! We will contact you shortly at ' + quickQuoteData.phone);
      
      setQuickQuoteData({
        serviceType: '',
        date: '',
        time: '',
        pickup: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error submitting quick quote:', error);
      alert('An error occurred while sending your quote request. Please call us at (504) 641-4506.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1566847973848-44c625db4522?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Black SUV at Airport" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div>
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 mb-6 animate-glow"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">Now booking jazz festival 2026</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-8" 
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
            >
              From MSY to the <br />
              <span className="text-gold-gradient italic">Main Event.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light"
            >
              Private luxury transportation for airport transfers, weddings, corporate travel, and curated city experiences. Licensed chauffeurs. Immaculate vehicles. Seamless coordination.
            </motion.p>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-8 mb-12 text-sm text-gray-400"
            >
              <motion.div 
                whileHover={{ scale: 1.05, color: '#D4AF37' }}
                className="flex items-center gap-2 transition-colors"
              >
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span>5-Star Rated</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, color: '#D4AF37' }}
                className="flex items-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span>Licensed & Bonded</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, color: '#D4AF37' }}
                className="flex items-center gap-2 transition-colors"
              >
                <Headset className="w-4 h-4 text-[#D4AF37]" />
                <span>24/7 Support</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, color: '#D4AF37' }}
                className="flex items-center gap-2 transition-colors"
              >
                <Car className="w-4 h-4 text-[#D4AF37]" />
                <span>Meticulous Fleet</span>
              </motion.div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReserveClick}
                className="btn-gold px-8 py-4 rounded-sm font-bold text-base uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Reserve Now <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection('pricing')}
                className="btn-gold-outline px-8 py-4 rounded-sm font-bold text-base uppercase tracking-widest"
              >
                View Pricing
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-4 text-sm"
            >
              <span className="text-gray-400">Or call/text:</span>
              <a href="tel:5046414506" className="text-[#D4AF37] hover:text-white font-semibold transition-colors">(504) 641-4506</a>
            </motion.div>
          </div>

          {/* Right Column - Quick Quote Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block luxury-card backdrop-blur-md p-8 rounded-lg shadow-2xl border-glow"
          >
            <h3 className="text-3xl font-bold text-white mb-6 relative pb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              Quick Quote
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent"></span>
            </h3>
            <form onSubmit={handleQuickQuote} className="space-y-4">
              <div>
                <select 
                  value={quickQuoteData.serviceType}
                  onChange={(e) => setQuickQuoteData({...quickQuoteData, serviceType: e.target.value})}
                  className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none appearance-none cursor-pointer transition-all hover:border-[#D4AF37]/50"
                >
                  <option value="" className="bg-black">Service Type</option>
                  <option value="airport" className="bg-black">Airport Transfer</option>
                  <option value="hourly" className="bg-black">Hourly Service</option>
                  <option value="wedding" className="bg-black">Wedding</option>
                  <option value="tour" className="bg-black">City Tour</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="date" 
                  value={quickQuoteData.date}
                  onChange={(e) => setQuickQuoteData({...quickQuoteData, date: e.target.value})}
                  className="bg-white/5 border border-white/20 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-all hover:border-[#D4AF37]/50" 
                />
                <TimeDropdown
                  value={quickQuoteData.time}
                  onChange={(value) => setQuickQuoteData({...quickQuoteData, time: value})}
                  placeholder="Select time"
                  required={false}
                  showLabel={false}
                />
              </div>
              <input 
                type="text" 
                placeholder="Pickup Location" 
                value={quickQuoteData.pickup}
                onChange={(e) => setQuickQuoteData({...quickQuoteData, pickup: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-500 transition-all hover:border-[#D4AF37]/50"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={quickQuoteData.phone}
                onChange={(e) => setQuickQuoteData({...quickQuoteData, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none placeholder-gray-500 transition-all hover:border-[#D4AF37]/50"
              />
              <button 
                type="submit" 
                className="w-full btn-gold py-3 rounded font-bold uppercase tracking-wider text-sm"
              >
                Check Availability
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { duration: 1, delay: 1 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown className="text-[#D4AF37] w-8 h-8" />
      </motion.div>
    </section>
  );
}