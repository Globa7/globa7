export function TermsConditions() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#1A1A1A] border-b border-[#D4AF37]/30 py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Terms & Conditions
          </h1>
          <p className="text-gray-400">Last Updated: February 28, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Introduction */}
        <section>
          <p className="text-gray-300 leading-relaxed">
            Welcome to Globa7 Luxury Transportation. By booking our services, you agree to the following terms and conditions. 
            Please read them carefully before making a reservation.
          </p>
        </section>

        {/* Service Agreement */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">1. Service Agreement</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Globa7 provides premium luxury transportation services throughout New Orleans and surrounding areas. 
              All bookings are subject to availability and confirmation.
            </p>
            <p>
              By submitting a booking request, you agree to provide accurate information and comply with all terms outlined in this document.
            </p>
          </div>
        </section>

        {/* Payment Terms */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">2. Payment Terms</h2>
          <div className="space-y-3 text-gray-300">
            <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
              <ul className="space-y-2 list-disc list-inside">
                <li>We accept all major credit cards (Visa, MasterCard, American Express, Discover)</li>
                <li>A 20% gratuity is automatically added to all services</li>
                <li>Payment is due in full before or at the time of service</li>
                <li>
                  <span className="font-semibold text-[#D4AF37]">Pre-Payment Requirement:</span> Services over a certain amount 
                  must be fully paid 10 days prior to the scheduled service date
                </li>
                <li>Late payment fees may apply for corporate accounts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cancellation Policy - Highlighted */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">3. Cancellation Policy</h2>
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/40 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white font-semibold text-lg">
                24-Hour Non-Refundable Cancellation Policy
              </p>
            </div>
            <div className="space-y-3 text-gray-200">
              <p>
                All cancellations must be made at least <span className="font-bold text-red-400">24 hours prior</span> to 
                the scheduled pickup time to receive a full refund.
              </p>
              <p>
                Cancellations made less than 24 hours before the scheduled service, or no-shows, 
                will result in <span className="font-bold text-red-400">100% charge</span> of the total booking amount.
              </p>
              <p className="text-sm text-gray-400 italic">
                This policy applies to all service types including airport transfers, hourly services, weddings, corporate events, 
                and special occasions.
              </p>
            </div>
          </div>
        </section>

        {/* Service Inclusions */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">4. Service Inclusions</h2>
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
            <p className="text-gray-300 mb-3">All Globa7 services include:</p>
            <ul className="space-y-2 list-disc list-inside text-gray-300">
              <li>Professional, licensed chauffeur in business attire</li>
              <li>Ice cold bottled water for all passengers</li>
              <li>Climate-controlled luxury vehicles</li>
              <li>Meet and greet service for airport pickups</li>
              <li>Flight tracking for airport transfers</li>
              <li>Complimentary Wi-Fi in select vehicles</li>
            </ul>
          </div>
        </section>

        {/* Additional Items */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">5. Additional Items & Services</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Additional beverages, specialty items, decorations, and other special requests are available upon request 
              and will appear as separate line items on your invoice.
            </p>
            <p className="text-sm text-gray-400">
              Examples include: champagne, specific beverages, red carpet service, signage, balloons, etc.
            </p>
          </div>
        </section>

        {/* Vehicle & Safety Policies */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">6. Vehicle & Safety Policies</h2>
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
            <ul className="space-y-2 list-disc list-inside text-gray-300">
              <li><span className="font-semibold text-white">All vehicles are non-smoking</span></li>
              <li>Passengers must comply with all federal, state, and local laws</li>
              <li>The chauffeur reserves the right to refuse service to intoxicated or disruptive passengers</li>
              <li>Child safety seats are available upon request (must be requested at time of booking)</li>
              <li>Maximum passenger capacity must not be exceeded</li>
              <li>Damage to vehicles caused by passengers will be charged to the booking party</li>
            </ul>
          </div>
        </section>

        {/* Hourly Service Terms */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">7. Hourly Service Terms</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Hourly services have a <span className="font-semibold text-white">4-hour minimum</span> booking requirement.
            </p>
            <p>
              Overtime is billed in 30-minute increments at the applicable hourly rate. The meter starts at the scheduled 
              pickup time and ends when the chauffeur drops off the final passenger at their destination.
            </p>
          </div>
        </section>

        {/* Wait Time & No-Shows */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">8. Wait Time & No-Shows</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              For airport pickups, we provide complimentary wait time based on flight arrival. For all other services, 
              a 15-minute grace period is provided at no charge.
            </p>
            <p>
              Wait time beyond the grace period will be charged at the applicable hourly rate in 15-minute increments.
            </p>
            <p className="font-semibold text-red-400">
              No-show passengers (failure to appear within 30 minutes of scheduled pickup time) will be charged 100% of the booking amount.
            </p>
          </div>
        </section>

        {/* Flight Delays */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">9. Flight Delays</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              For airport transfers, we monitor flight arrivals in real-time. If your flight is delayed, your chauffeur 
              will adjust pickup time automatically at no additional charge.
            </p>
          </div>
        </section>

        {/* Liability */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">10. Liability</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Globa7 maintains comprehensive commercial insurance. We are not liable for delays caused by traffic, 
              weather, accidents, or other circumstances beyond our control.
            </p>
            <p>
              Passengers are responsible for their personal belongings. Lost or forgotten items should be reported 
              within 24 hours; we will make reasonable efforts to locate items but cannot guarantee recovery.
            </p>
          </div>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">11. Booking Modifications</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Changes to bookings (date, time, location, or vehicle type) must be made at least 24 hours in advance 
              and are subject to availability.
            </p>
            <p>
              Modifications made less than 24 hours before service may incur additional charges.
            </p>
          </div>
        </section>

        {/* Special Events */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">12. Special Events & High-Demand Periods</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Services during high-demand periods (Mardi Gras, Jazz Fest, New Year's Eve, major sporting events, etc.) 
              may have special pricing and extended minimum booking requirements.
            </p>
            <p>
              Special event bookings may require full payment further in advance than standard bookings.
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">13. Privacy & Data</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              We collect and store customer information solely for the purpose of providing transportation services. 
              Your information will never be sold or shared with third parties except as required by law.
            </p>
          </div>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">14. Governing Law</h2>
          <div className="space-y-3 text-gray-300">
            <p>
              These terms and conditions are governed by the laws of the State of Louisiana. Any disputes shall be 
              resolved in the courts of Orleans Parish, Louisiana.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-4">15. Contact Information</h2>
          <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
            <p className="text-gray-300 mb-2">For questions about these terms or to discuss your booking:</p>
            <div className="space-y-1 text-white">
              <p>Email: <a href="mailto:booking@globa7.com" className="text-[#D4AF37] hover:underline">booking@globa7.com</a></p>
              <p>Phone: <span className="text-[#D4AF37]">(504) XXX-XXXX</span></p>
            </div>
          </div>
        </section>

        {/* Acceptance */}
        <section className="border-t border-[#D4AF37]/30 pt-8">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-yellow-600/10 border border-[#D4AF37]/30 rounded-lg p-6">
            <p className="text-gray-300 text-center">
              By submitting a booking request or using Globa7 services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms & Conditions.
            </p>
          </div>
        </section>

      </div>

      {/* Back to Home Link */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <a 
          href="/" 
          className="inline-block bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:from-yellow-600 hover:to-[#D4AF37] text-black font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition-all transform hover:scale-105"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
