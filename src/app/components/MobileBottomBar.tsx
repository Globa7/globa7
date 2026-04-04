import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';

interface MobileBottomBarProps {
  onReserveClick: () => void;
}

export function MobileBottomBar({ onReserveClick }: MobileBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-[#D4AF37]/30 z-50 md:hidden pb-safe">
      <div className="grid grid-cols-3 divide-x divide-white/10">
        <a 
          href="tel:5046414506" 
          className="flex flex-col items-center justify-center py-3 text-gray-300 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase">Call</span>
        </a>
        <a 
          href="sms:3103595277" 
          className="flex flex-col items-center justify-center py-3 text-gray-300 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase">Text</span>
        </a>
        <button 
          onClick={onReserveClick}
          className="flex flex-col items-center justify-center py-3 text-[#D4AF37] hover:bg-white/5 transition-colors bg-[#D4AF37]/10"
        >
          <CalendarCheck className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase">Reserve</span>
        </button>
      </div>
    </div>
  );
}
