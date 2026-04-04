export function HowItWorksSection() {
  const steps = [
    {
      number: '1',
      title: 'Request',
      description: 'Submit your details online, call, or text. Tell us what you need—airport, event, tour, or custom.'
    },
    {
      number: '2',
      title: 'Confirm',
      description: 'Our concierge team confirms availability, sends a detailed quote, and handles all logistics.'
    },
    {
      number: '3',
      title: 'Ride',
      description: 'Your chauffeur arrives 15 minutes early. You arrive on time, stress-free, in style.'
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>Seamless Experience</h2>
          <p className="text-gray-400">Three simple steps to luxury transportation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-20 h-20 mx-auto bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-full flex items-center justify-center mb-6 relative z-10">
                <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: 'var(--font-serif)' }}>{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-serif)' }}>{step.title}</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
