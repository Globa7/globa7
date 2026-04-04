import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Instagram, Facebook } from 'lucide-react';
import logoImage from 'figma:asset/bc5f3d72095ff495d66f7beeae6ceec35d5b87b0.png';

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={logoImage} alt="Globa7 Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>GLOBA7</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">White-glove transportation in New Orleans. Licensed, bonded, and dedicated to excellence.</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a 
                href="https://instagram.com/globa7_nola" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/globa7neworleans" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@globa7nola?_r=1&_t=ZP-93hnV9jk5R0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black transition-all"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => scrollToSection('services')} className="hover:text-[#D4AF37] transition-colors">Services</button></li>
              <li><button onClick={() => scrollToSection('fleet')} className="hover:text-[#D4AF37] transition-colors">Fleet</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-[#D4AF37] transition-colors">Pricing</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-[#D4AF37] transition-colors">About Us</button></li>
              <li><a href="/eventflow" className="hover:text-[#D4AF37] transition-colors">EventFlow</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Services</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Airport Transfers</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Weddings & Events</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Corporate Travel</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Private City Tours</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Group Transportation</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-6" style={{ fontFamily: 'var(--font-serif)' }}>Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <a href="tel:5046414506" className="hover:text-white transition-colors">(504) 641-4506</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <a href="sms:3103595277" className="hover:text-white transition-colors">(310) 359-5277</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <a href="mailto:booking@globa7.com" className="hover:text-white transition-colors">booking@globa7.com</a>
              </li>
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-1" />
                <span>Serving Greater New Orleans<br />& Beyond</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-gray-500 text-sm">© 2026 Globa7 Luxury Transportation.</p>
          <p className="text-gray-500 text-sm">All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}