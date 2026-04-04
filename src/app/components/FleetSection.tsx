import { User, Briefcase, Tv } from 'lucide-react';
import { motion } from 'motion/react';

interface FleetSectionProps {
  onReserveClick: (vehicleType?: string) => void;
}

export function FleetSection({ onReserveClick }: FleetSectionProps) {
  return (
    <section id="fleet" className="py-32 bg-black relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ y: -8, borderColor: 'rgba(212, 175, 55, 0.5)' }}
          className="group luxury-card p-8 rounded-lg flex items-center gap-6"
        >
          <div>
            <span className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-3 block">The Fleet</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
              Your Ride, Perfected
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mt-4"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Fleet Item 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8 }}
            className="group relative luxury-card rounded-lg overflow-hidden border-glow"
          >
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://svwmgzzigbhtdeabplxm.supabase.co/storage/v1/object/public/make-12e765ba-Cadillac/Black Luxury SUV.png" 
                  alt="Black SUV" 
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  Black Luxury SUV
                </h3>
                <p className="text-[#D4AF37] text-sm font-semibold mb-6">Cadillac Escalade / GMC Yukon XL</p>
                
                <ul className="space-y-3 text-gray-400 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <User className="text-[#D4AF37] w-4 h-4" /> Up to 6 passengers
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="text-[#D4AF37] w-4 h-4" /> 4-6 large bags
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#D4AF37] w-4 h-4">⭐</span> Leather interior, climate control
                  </li>
                </ul>
                
                <div className="flex items-center justify-between mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReserveClick('suv')}
                    className="btn-gold px-6 py-3 rounded text-sm font-bold uppercase w-full"
                  >
                    Book SUV
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fleet Item 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative luxury-card rounded-lg overflow-hidden border-glow"
          >
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://svwmgzzigbhtdeabplxm.supabase.co/storage/v1/object/public/make-12e765ba-14-passenger-Sprinter/14- Passenger Sprinter.png" 
                  alt="Sprinter Van" 
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  14-Passenger Sprinter
                </h3>
                <p className="text-[#D4AF37] text-sm font-semibold mb-6">Mercedes-Benz Executive</p>
                
                <ul className="space-y-3 text-gray-400 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <User className="text-[#D4AF37] w-4 h-4" /> Up to 14 passengers
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="text-[#D4AF37] w-4 h-4" /> Ample storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Tv className="text-[#D4AF37] w-4 h-4" /> A/V system, tinted windows
                  </li>
                </ul>
                
                <div className="flex items-center justify-between mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReserveClick('sprinter')}
                    className="btn-gold px-6 py-3 rounded text-sm font-bold uppercase w-full"
                  >
                    Quote
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fleet Item 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="group relative luxury-card rounded-lg overflow-hidden border-glow"
          >
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://svwmgzzigbhtdeabplxm.supabase.co/storage/v1/object/public/make-12e765ba-28-passenger-minibus/28-Passenger Mini Bus.png" 
                  alt="Mini Coach" 
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  28-Passenger Mini Coach
                </h3>
                <p className="text-[#D4AF37] text-sm font-semibold mb-6">Ideal for weddings & corporate shuttles</p>
                
                <ul className="space-y-3 text-gray-400 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <User className="text-[#D4AF37] w-4 h-4" /> Up to 28 passengers
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="text-[#D4AF37] w-4 h-4" /> Luggage storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Tv className="text-[#D4AF37] w-4 h-4" /> Premium amenities
                  </li>
                </ul>
                
                <div className="flex items-center justify-between mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReserveClick('minicoach')}
                    className="btn-gold px-6 py-3 rounded text-sm font-bold uppercase w-full"
                  >
                    Book Mini Coach
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fleet Item 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8 }}
            className="group relative luxury-card rounded-lg overflow-hidden border-glow"
          >
            <div className="grid md:grid-cols-2">
              <div className="h-64 md:h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="https://svwmgzzigbhtdeabplxm.supabase.co/storage/v1/object/public/make-12e765ba-55-passenger-Coach/55- Passenger Coach.png" 
                  alt="Full Coach" 
                  className="w-full h-full object-contain bg-black"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  55-Passenger Coach
                </h3>
                <p className="text-[#D4AF37] text-sm font-semibold mb-6">Full-size luxury coach</p>
                
                <ul className="space-y-3 text-gray-400 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <User className="text-[#D4AF37] w-4 h-4" /> Up to 55 passengers
                  </li>
                  <li className="flex items-center gap-2">
                    <Briefcase className="text-[#D4AF37] w-4 h-4" /> Large luggage capacity
                  </li>
                  <li className="flex items-center gap-2">
                    <Tv className="text-[#D4AF37] w-4 h-4" /> Restroom & A/V system
                  </li>
                </ul>
                
                <div className="flex items-center justify-between mt-auto">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReserveClick('coach')}
                    className="btn-gold px-6 py-3 rounded text-sm font-bold uppercase w-full"
                  >
                    Book Coach
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}