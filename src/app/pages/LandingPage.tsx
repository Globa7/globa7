import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { StandardsSection } from '../components/StandardsSection';
import { ServicesSection } from '../components/ServicesSection';
import { FleetSection } from '../components/FleetSection';
import { PricingSection } from '../components/PricingSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { ReservationModal } from '../components/ReservationModal';
import { CustomBundleModal } from '../components/CustomBundleModal';
import { MobileBottomBar } from '../components/MobileBottomBar';
import { toast } from 'sonner';

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomBundleOpen, setIsCustomBundleOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');

  const handleReserveClick = (serviceType?: string) => {
    // If it's a custom bundle request, open the custom bundle modal
    if (serviceType === 'custom') {
      setIsCustomBundleOpen(true);
    } else {
      setSelectedServiceType(serviceType || '');
      setIsModalOpen(true);
    }
  };

  const handleCustomBundleSubmit = async (bundleData: any) => {
    console.log('Custom Bundle Submitted:', bundleData);
    
    try {
      // Format services list
      const servicesList = bundleData.selectedServices
        .map((s: any) => `${s.name}${s.vehicleType ? ` (${s.vehicleType})` : ''}${s.hours ? ` - ${s.hours} hours` : ''}`)
        .join('\n  • ');

      // Format experience details
      let experienceDetails = '';
      if (bundleData.experienceDetails) {
        experienceDetails = `\n\n--- EXPERIENCE DETAILS ---\nNumber of People: ${bundleData.experienceDetails.numberOfPeople || 'N/A'}\nDuration: ${bundleData.experienceDetails.duration || 'N/A'}\nPreferences: ${bundleData.experienceDetails.preferences || 'None'}`;
      }

      const emailBody = `
New Custom Bundle Request from Globa7.com

--- BUNDLE DETAILS ---
Event Name: ${bundleData.eventName || 'N/A'}
Event Date: ${bundleData.eventDate || 'N/A'}
Pickup Location: ${bundleData.pickupAddress || 'N/A'}
Drop-off Location: ${bundleData.dropoffAddress || 'N/A'}

--- SELECTED SERVICES ---
  • ${servicesList}${experienceDetails}

--- CONTACT INFORMATION ---
Name: ${bundleData.firstName} ${bundleData.lastName}
Email: ${bundleData.email}
Phone: ${bundleData.phone}

--- PRICING ---
Subtotal: $${bundleData.pricing?.subtotal?.toFixed(2) || '0.00'}
Discount: $${bundleData.pricing?.discount?.toFixed(2) || '0.00'}
Total: $${bundleData.pricing?.total?.toFixed(2) || '0.00'}

--- SPECIAL REQUESTS ---
${bundleData.specialRequests || 'None'}
      `.trim();

      // Send via Web3Forms API
      const formData = new FormData();
      formData.append('access_key', '48234969-164c-40a4-9f05-63ae4a207351');
      formData.append('subject', `New Custom Bundle Request – ${bundleData.firstName} ${bundleData.lastName}`);
      formData.append('from_name', `${bundleData.firstName} ${bundleData.lastName}`);
      formData.append('email', bundleData.email);
      formData.append('message', emailBody);
      formData.append('to', 'booking@globa7.com');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send custom bundle request');
      }

      toast.success('Custom Bundle Request Submitted!', {
        description: 'Your request has been sent to booking@globa7.com. Our team will review your package and contact you shortly with a custom quote.',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error submitting custom bundle:', error);
      toast.error('Submission Failed', {
        description: 'An error occurred. Please try again or contact booking@globa7.com directly.',
        duration: 5000,
      });
    }
  };

  return (
    <div className="antialiased overflow-x-hidden w-full">
      <Navigation onReserveClick={() => handleReserveClick()} />
      
      <HeroSection onReserveClick={() => handleReserveClick()} />
      
      <StandardsSection />
      
      <ServicesSection onReserveClick={handleReserveClick} />
      
      <FleetSection onReserveClick={handleReserveClick} />
      
      <PricingSection onReserveClick={handleReserveClick} />
      
      <HowItWorksSection />
      
      <TestimonialsSection />
      
      <CTASection onReserveClick={() => handleReserveClick()} />
      
      <Footer />
      
      <MobileBottomBar onReserveClick={() => handleReserveClick()} />
      
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialServiceType={selectedServiceType}
      />
      
      <CustomBundleModal 
        isOpen={isCustomBundleOpen}
        onClose={() => setIsCustomBundleOpen(false)}
        onSubmit={handleCustomBundleSubmit}
      />
    </div>
  );
}