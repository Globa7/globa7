import { PlusCircle } from 'lucide-react';

interface PricingSectionProps {
  onReserveClick: (packageType?: string) => void;
}

export function PricingSection({ onReserveClick }: PricingSectionProps) {
  /*
   * GLOBA7 PRICING STRUCTURE (March 2026)
   * 
   * All pricing reflects current market rates for premium transportation in New Orleans.
   * Airport transfers are from MSY/Lakefront to Greater New Orleans Area (Orleans/Jefferson Parish).
   * Pricing may vary for destinations outside these parishes.
   */
  const pricingRows = [
    { service: 'MSY/Lakefront Airport ↔ Downtown', vehicle: 'Black SUV', rate: '$140', unit: 'one-way' },
    { service: 'Hourly Service (Standard)', vehicle: 'Black SUV', rate: '$140', unit: '/hr' },
    { service: 'Festival/Game Day', vehicle: 'Black SUV', rate: '$145', unit: '/hr (4hr min)' },
    { service: 'LSU Games', vehicle: 'Black SUV', rate: '$145', unit: '/hr (4hr min)' },
    { service: 'Baton Rouge Transfer', vehicle: 'Black SUV', rate: '$360', unit: 'one-way' },
    { service: 'Garden District ↔ Downtown', vehicle: 'Black SUV', rate: '$120', unit: 'one-way' },
    { service: 'Private 3-Hour City Tour', vehicle: 'Black SUV', rate: '$425', unit: '' },
    { service: 'Wedding Service (6+ hrs)', vehicle: 'Black SUV', rate: '$145', unit: '/hr (4hr min)' },
    { service: 'MSY/Lakefront Airport ↔ Downtown', vehicle: '14 Passenger Sprinter', rate: '$240', unit: 'one-way' },
    { service: 'Hourly Service', vehicle: '14 Passenger Sprinter', rate: '$160', unit: '/hr' },
    { service: 'MSY/Lakefront Airport ↔ Downtown', vehicle: '25 Passenger Bus', rate: '$395', unit: 'one-way' },
    { service: 'Hourly Service', vehicle: '25 Passenger Bus', rate: '$210', unit: '/hr' },
    { service: 'MSY/Lakefront Airport ↔ Downtown', vehicle: '28 Passenger Bus', rate: '$425', unit: 'one-way' },
    { service: 'Hourly Service', vehicle: '28 Passenger Bus', rate: '$240', unit: '/hr' },
    { service: 'MSY/Lakefront Airport ↔ Downtown', vehicle: '55 Passenger Bus', rate: '$600', unit: 'one-way' },
    { service: 'Hourly Service', vehicle: '55 Passenger Bus', rate: '$255', unit: '/hr' }
  ];

  const packages = [
    {
      name: 'Weekend Getaway',
      badge: 'SAVE $99',
      items: [
        'Airport arrival pickup',
        '3-hour city tour',
        'Dinner transportation (2 hrs)',
        'Airport departure'
      ],
      originalPrice: '$985',
      price: '$886.50'
    },
    {
      name: 'Wedding Essentials',
      badge: 'SAVE $145',
      items: [
        'Rehearsal dinner (3 hrs)',
        'Wedding day (6 hrs)',
        'Airport send-off',
        '10% off total'
      ],
      originalPrice: '$1,445',
      price: '$1,300.50'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Transparent Pricing</h2>
          <p className="text-gray-400">No hidden fees. No surprises. Just white-glove service.</p>
        </div>

        <div className="bg-black border border-white/10 rounded-lg overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[#D4AF37] text-sm md:text-lg" style={{ fontFamily: 'var(--font-serif)' }}>Service</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[#D4AF37] text-sm md:text-lg hidden sm:table-cell" style={{ fontFamily: 'var(--font-serif)' }}>Vehicle</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-[#D4AF37] text-sm md:text-lg text-right" style={{ fontFamily: 'var(--font-serif)' }}>Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pricingRows.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-white text-xs md:text-base">
                      <div>{row.service}</div>
                      <div className="text-gray-400 text-xs mt-1 sm:hidden">{row.vehicle}</div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-400 text-xs md:text-base hidden sm:table-cell">{row.vehicle}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                      <div className="flex flex-col sm:flex-row sm:justify-end items-end">
                        <span className="text-[#D4AF37] font-bold text-sm md:text-base">{row.rate}</span>
                        {row.unit && <span className="text-gray-500 text-[10px] md:text-xs font-normal sm:ml-1">{row.unit}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Package Bundle */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 p-6 rounded-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>{pkg.name}</h4>
                <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded">{pkg.badge}</span>
              </div>
              <ul className="text-gray-400 text-sm space-y-2 mb-4">
                {pkg.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 line-through text-sm">{pkg.originalPrice}</span>
                <span className="text-[#D4AF37] font-bold text-2xl">{pkg.price}</span>
              </div>
              <p className="text-gray-500 text-xs text-right">Doesn't Include 20% Gratuity</p>
            </div>
          ))}

          <div 
            onClick={() => onReserveClick('custom')}
            className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 p-6 rounded-lg flex flex-col justify-center items-center text-center animate-fade-in-up cursor-pointer hover:border-[#D4AF37]/60 hover:from-[#D4AF37]/30 transition-all transform hover:scale-105" 
            style={{ animationDelay: '0.2s' }}
          >
            <PlusCircle className="w-12 h-12 text-[#D4AF37] mb-3" />
            <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Custom Bundle</h4>
            <p className="text-gray-400 text-sm mb-4">Build your perfect package and save 10%</p>
            <button 
              className="btn-gold-outline px-6 py-2 rounded text-sm pointer-events-none"
            >
              Build Package
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}