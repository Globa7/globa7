import { Phone } from 'lucide-react';

interface CTASectionProps {
  onReserveClick: () => void;
}

export function CTASection({ onReserveClick }: CTASectionProps) {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 animate-fade-in-up">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
          Ready to Experience the Globa7 Standard?
        </h2>
        <p className="text-xl text-gray-300 mb-10">Call, text, or book online. Your white-glove experience starts here.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onReserveClick}
            className="btn-gold px-10 py-5 rounded-sm font-bold text-lg uppercase tracking-widest shadow-lg shadow-[#D4AF37]/20"
          >
            Reserve Now
          </button>
          <a 
            href="tel:5046414506" 
            className="btn-gold-outline px-10 py-5 rounded-sm font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" /> (504) 641-4506
          </a>
        </div>
        
        <p className="mt-6 text-gray-500 text-sm">
          Or text us at <a href="sms:3103595277" className="text-[#D4AF37] hover:underline">(310) 359-5277</a> for instant quote
        </p>
      </div>
    </section>
  );
}
