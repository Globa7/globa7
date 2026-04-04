import { Star } from 'lucide-react';
import { motion } from 'motion/react';

export function TestimonialsSection() {
  const testimonials = [
    {
      stars: 5,
      text: "Globa7 made our wedding day flawless. Monday and his team coordinated transportation for our entire bridal party, handled last-minute changes without hesitation, and every vehicle was immaculate.",
      initials: "SM",
      name: "Sarah M.",
      role: "Bride"
    },
    {
      stars: 5,
      text: "As a corporate travel manager, I've worked with dozens of transportation companies. Globa7 is in a league of their own. NET-30 billing, real-time updates, drivers who understand executive needs.",
      initials: "RK",
      name: "Robert K.",
      role: "Director of Operations, Fortune 500"
    },
    {
      stars: 5,
      text: "We booked the 3-hour city tour on our last day in New Orleans, and it was the highlight of our trip. Our driver was incredibly knowledgeable about the city's history.",
      initials: "JT",
      name: "Jennifer & Mark T.",
      role: "Anniversary Trip"
    }
  ];

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
    <section className="py-32 bg-[#1A1A1A] border-y border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>
            Trusted by Travelers
          </h2>
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Star className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
              </motion.div>
            ))}
          </div>
          <p className="text-gray-400 text-lg">5-Star Average Rating | 200+ Happy Clients in 2024</p>
          <div className="elegant-divider mt-6"></div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="luxury-card p-8 rounded-lg relative overflow-hidden group"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed text-sm">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold border border-[#D4AF37]/20"
                >
                  {testimonial.initials}
                </motion.div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}