import { IdCard, Clock, Gem, Satellite, MapPin, Bell } from 'lucide-react';
import { motion } from 'motion/react';

export function StandardsSection() {
  const standards = [
    {
      icon: IdCard,
      title: 'Licensed & Bonded',
      description: 'Every chauffeur is professionally licensed, bonded, and trained in discretion and route optimization.'
    },
    {
      icon: Clock,
      title: '15-Min Early Arrival',
      description: "We arrive 15 minutes early, guaranteed. Punctuality isn't just a promise—it's our protocol."
    },
    {
      icon: Gem,
      title: 'Meticulous Fleet',
      description: 'Each vehicle is detailed within 24 hours of your service. White-glove inspection, every time.'
    },
    {
      icon: Satellite,
      title: 'Real-Time Coordination',
      description: "Flight delays? Route changes? We adapt in real-time so you don't have to worry."
    },
    {
      icon: MapPin,
      title: 'NOLA Expertise',
      description: 'From festival logistics to French Quarter shortcuts, we know this city like no one else.'
    },
    {
      icon: Bell,
      title: '24/7 White-Glove Support',
      description: 'Need something at 3 AM? Our concierge team is always available for changes or emergencies.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
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
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative inline-block" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
            The Globa7 Standard™
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mt-8 leading-relaxed">Why discerning travelers choose us for their most important journeys.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {standards.map((standard, index) => {
            const Icon = standard.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group p-8 luxury-card rounded-lg relative overflow-hidden"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-6 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all duration-300"
                >
                  <Icon className="w-7 h-7 text-[#D4AF37]" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors duration-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  {standard.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{standard.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}