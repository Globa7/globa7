import { useState, useEffect } from 'react';
import { Menu, Phone, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import logoImage from 'figma:asset/bc5f3d72095ff495d66f7beeae6ceec35d5b87b0.png';

interface NavigationProps {
  onReserveClick: () => void;
}

export function Navigation({ onReserveClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-xl shadow-[#D4AF37]/5' 
          : 'bg-black/80 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-14 h-14 flex items-center justify-center">
              <img src={logoImage} alt="Globa7 Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-wider" style={{ fontFamily: 'var(--font-serif)' }}>GLOBA7</span>
              <span className="text-[10px] text-[#D4AF37] tracking-[0.2em] uppercase">Luxury Transportation</span>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['services', 'fleet', 'pricing', 'about'].map((item) => (
              <motion.button 
                key={item}
                whileHover={{ y: -2, color: '#D4AF37' }}
                onClick={() => scrollToSection(item)} 
                className="text-sm text-gray-300 transition-colors uppercase tracking-wider"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </motion.button>
            ))}
            <motion.button 
              whileHover={{ y: -2, color: '#D4AF37' }}
              onClick={() => navigate('/eventflow/login')} 
              className="text-sm text-gray-300 transition-colors uppercase tracking-wider"
            >
              EventFlow
            </motion.button>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              href="tel:5046414506" 
              className="text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2"
            >
              <Phone className="w-3 h-3" />
              <span className="text-sm font-semibold">(504) 641-4506</span>
            </motion.a>
            
            {user ? (
              <>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAuthClick}
                  className="btn-gold-outline px-5 py-3 rounded-sm font-semibold text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.role === 'admin' ? 'Admin' : 'Portal'}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAuthClick}
                className="btn-gold-outline px-5 py-3 rounded-sm font-semibold text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReserveClick}
              className="btn-gold px-6 py-3 rounded-sm font-semibold text-sm uppercase tracking-wider"
            >
              Reserve Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#D4AF37] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {['services', 'fleet', 'pricing', 'about'].map((item) => (
                <motion.button 
                  key={item}
                  whileHover={{ x: 5, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  onClick={() => scrollToSection(item)} 
                  className="block w-full text-left px-3 py-3 text-base font-medium text-gray-300 hover:text-[#D4AF37] rounded-md"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </motion.button>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <a href="tel:5046414506" className="btn-gold-outline px-6 py-3 rounded-sm font-semibold text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                
                {user ? (
                  <>
                    <button 
                      onClick={() => { handleAuthClick(); setMobileMenuOpen(false); }}
                      className="btn-gold-outline px-6 py-3 rounded-sm font-semibold text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {user.role === 'admin' ? 'Admin Dashboard' : 'My Portal'}
                    </button>
                    <button 
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="btn-gold-outline px-6 py-3 rounded-sm font-semibold text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { handleAuthClick(); setMobileMenuOpen(false); }}
                    className="btn-gold-outline px-6 py-3 rounded-sm font-semibold text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
                
                <button 
                  onClick={() => { onReserveClick(); setMobileMenuOpen(false); }}
                  className="btn-gold px-6 py-3 rounded-sm font-semibold text-center uppercase tracking-wider text-sm"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}