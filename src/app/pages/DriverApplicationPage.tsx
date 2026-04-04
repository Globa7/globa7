import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-12e765ba`;

const VEHICLE_TYPES = ['sedan', 'suv', 'luxury', 'sprinter', 'executive'];
const STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export function DriverApplicationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteCode = searchParams.get('invite');

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteValid, setInviteValid] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: 'LA',
    zipCode: '',

    // License Information
    licenseNumber: '',
    licenseState: 'LA',
    licenseExpiry: '',
    cdlClass: '',

    // Company Information (Optional)
    companyName: '',
    companyEIN: '',

    // Vehicle Information
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    vehicleColor: '',
    vehicleLicensePlate: '',
    vehicleVIN: '',
    vehicleType: 'sedan',
    vehicleCapacity: 4,

    // Payment Information
    paymentMethod: 'bank_account',
    bankName: '',
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',

    // Tax Information
    taxIdType: 'ssn',
    taxIdNumber: '',
    w9Completed: false,

    // Insurance
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceExpiry: '',
    insuranceCoverageAmount: 100000,

    // Availability
    availableForWork: true,
    preferredZones: [],
    maxHoursPerWeek: 40,

    // Documents (would be file upload URLs in production)
    documents: {
      profilePhoto: '',
      vehiclePhotos: [],
      registration: '',
      insurance: '',
      driverLicense: '',
      permits: [],
      bondDocuments: [],
      w9Form: '',
    },

    // Background Check Consent
    backgroundCheckConsent: false,

    // Invite Code
    inviteCode: inviteCode || '',

    // Commission
    commissionRate: 70,
  });

  useEffect(() => {
    verifyInvite();
  }, []);

  const verifyInvite = async () => {
    if (!inviteCode) {
      toast.error('Invalid invitation link');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/affiliate/verify-invite/${inviteCode}`);
      const data = await res.json();

      if (data.valid) {
        setInviteValid(true);
        toast.success('Invitation verified! Please complete your application.');
      } else {
        toast.error(data.error || 'Invalid or expired invitation');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Error verifying invite:', error);
      toast.error('Failed to verify invitation');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required personal information');
      return;
    }

    if (!formData.licenseNumber || !formData.licenseExpiry) {
      toast.error('Please provide license information');
      return;
    }

    if (!formData.vehicleMake || !formData.vehicleModel || !formData.vehicleVIN) {
      toast.error('Please provide vehicle information');
      return;
    }

    if (!formData.insuranceProvider || !formData.insurancePolicyNumber) {
      toast.error('Please provide insurance information');
      return;
    }

    if (formData.paymentMethod === 'bank_account' && (!formData.routingNumber || !formData.accountNumber)) {
      toast.error('Please provide bank account information');
      return;
    }

    if (!formData.backgroundCheckConsent) {
      toast.error('You must consent to a background check');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/affiliate/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Application submitted successfully!');
        navigate('/application-success');
      } else {
        toast.error(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gold font-cormorant text-xl">Verifying Invitation...</p>
        </div>
      </div>
    );
  }

  if (!inviteValid) {
    return null;
  }

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-charcoal bg-charcoal/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-cormorant text-gold mb-2">Globa7 Driver Application</h1>
            <p className="text-gray-400">Join our luxury transportation team</p>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-0 z-50 bg-charcoal border-b border-gold/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {step} of {totalSteps}</span>
            <span className="text-sm text-gold">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-black rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-charcoal border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold font-cormorant text-3xl">Personal Information</CardTitle>
                <CardDescription className="text-gray-400">Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300">First Name *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Last Name *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Phone Number *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="(504) 555-0123"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Date of Birth *</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateField('dateOfBirth', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Street Address *</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="mt-2 bg-black border-gold/20 text-white"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-gray-300">City *</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="New Orleans"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => updateField('state', value)}>
                      <SelectTrigger className="mt-2 bg-black border-gold/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-charcoal border-gold text-white max-h-60">
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-300">ZIP Code *</Label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="70112"
                    />
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Company Information (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Company Name</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="Your Transportation LLC"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">EIN (Tax ID)</Label>
                      <Input
                        value={formData.companyEIN}
                        onChange={(e) => updateField('companyEIN', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="12-3456789"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: License & Vehicle */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-charcoal border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold font-cormorant text-3xl">License & Vehicle Information</CardTitle>
                <CardDescription className="text-gray-400">Provide your driving credentials and vehicle details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Driver's License</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label className="text-gray-300">License Number *</Label>
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => updateField('licenseNumber', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">License State *</Label>
                      <Select value={formData.licenseState} onValueChange={(value) => updateField('licenseState', value)}>
                        <SelectTrigger className="mt-2 bg-black border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold text-white max-h-60">
                          {STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Expiration Date *</Label>
                      <Input
                        type="date"
                        value={formData.licenseExpiry}
                        onChange={(e) => updateField('licenseExpiry', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label className="text-gray-300">CDL Class (if applicable)</Label>
                    <Input
                      value={formData.cdlClass}
                      onChange={(e) => updateField('cdlClass', e.target.value)}
                      className="mt-2 bg-black border-gold/20 text-white"
                      placeholder="A, B, or C"
                    />
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Make *</Label>
                      <Input
                        value={formData.vehicleMake}
                        onChange={(e) => updateField('vehicleMake', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="Mercedes-Benz"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Model *</Label>
                      <Input
                        value={formData.vehicleModel}
                        onChange={(e) => updateField('vehicleModel', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="S-Class"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Year *</Label>
                      <Input
                        type="number"
                        value={formData.vehicleYear}
                        onChange={(e) => updateField('vehicleYear', parseInt(e.target.value))}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Color *</Label>
                      <Input
                        value={formData.vehicleColor}
                        onChange={(e) => updateField('vehicleColor', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="Black"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">License Plate *</Label>
                      <Input
                        value={formData.vehicleLicensePlate}
                        onChange={(e) => updateField('vehicleLicensePlate', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">VIN *</Label>
                      <Input
                        value={formData.vehicleVIN}
                        onChange={(e) => updateField('vehicleVIN', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="17-digit VIN"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Vehicle Type *</Label>
                      <Select value={formData.vehicleType} onValueChange={(value) => updateField('vehicleType', value)}>
                        <SelectTrigger className="mt-2 bg-black border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold text-white">
                          {VEHICLE_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Passenger Capacity *</Label>
                      <Input
                        type="number"
                        value={formData.vehicleCapacity}
                        onChange={(e) => updateField('vehicleCapacity', parseInt(e.target.value))}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Insurance & Documents */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-charcoal border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold font-cormorant text-3xl">Insurance & Documents</CardTitle>
                <CardDescription className="text-gray-400">Upload required documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Insurance Provider *</Label>
                      <Input
                        value={formData.insuranceProvider}
                        onChange={(e) => updateField('insuranceProvider', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="State Farm"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Policy Number *</Label>
                      <Input
                        value={formData.insurancePolicyNumber}
                        onChange={(e) => updateField('insurancePolicyNumber', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Expiration Date *</Label>
                      <Input
                        type="date"
                        value={formData.insuranceExpiry}
                        onChange={(e) => updateField('insuranceExpiry', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Coverage Amount *</Label>
                      <Input
                        type="number"
                        value={formData.insuranceCoverageAmount}
                        onChange={(e) => updateField('insuranceCoverageAmount', parseInt(e.target.value))}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Document Uploads</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Note: In production, these would be file upload fields. For now, please have these documents ready:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/20 rounded">
                      <FileText className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-white font-medium">Vehicle Registration *</p>
                        <p className="text-xs text-gray-400">Current registration document</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/20 rounded">
                      <FileText className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-white font-medium">Insurance Certificate *</p>
                        <p className="text-xs text-gray-400">Proof of insurance coverage</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/20 rounded">
                      <FileText className="h-5 w-5 text-gold" />
                      <div>
                        <p className="text-white font-medium">Driver's License *</p>
                        <p className="text-xs text-gray-400">Copy of valid driver's license</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/10 rounded">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Vehicle Photos (Optional)</p>
                        <p className="text-xs text-gray-400">Exterior and interior photos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/10 rounded">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Profile Photo (Optional)</p>
                        <p className="text-xs text-gray-400">Professional headshot</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black border border-gold/10 rounded">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Additional Permits (Optional)</p>
                        <p className="text-xs text-gray-400">For hire permits, bond documents, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Payment & Tax Information */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-charcoal border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold font-cormorant text-3xl">Payment & Tax Information</CardTitle>
                <CardDescription className="text-gray-400">How you'll receive payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                  <Select value={formData.paymentMethod} onValueChange={(value) => updateField('paymentMethod', value)}>
                    <SelectTrigger className="bg-black border-gold/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-charcoal border-gold text-white">
                      <SelectItem value="bank_account">Bank Account (ACH)</SelectItem>
                      <SelectItem value="debit_card">Debit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod === 'bank_account' && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Bank Name *</Label>
                      <Input
                        value={formData.bankName}
                        onChange={(e) => updateField('bankName', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder="Chase Bank"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Account Holder Name *</Label>
                      <Input
                        value={formData.accountHolderName}
                        onChange={(e) => updateField('accountHolderName', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Routing Number *</Label>
                        <Input
                          value={formData.routingNumber}
                          onChange={(e) => updateField('routingNumber', e.target.value)}
                          className="mt-2 bg-black border-gold/20 text-white"
                          placeholder="9-digit routing number"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Account Number *</Label>
                        <Input
                          value={formData.accountNumber}
                          onChange={(e) => updateField('accountNumber', e.target.value)}
                          className="mt-2 bg-black border-gold/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Tax Information (for 1099)</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Tax ID Type *</Label>
                      <Select value={formData.taxIdType} onValueChange={(value) => updateField('taxIdType', value)}>
                        <SelectTrigger className="bg-black border-gold/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-charcoal border-gold text-white">
                          <SelectItem value="ssn">SSN (Individual)</SelectItem>
                          <SelectItem value="ein">EIN (Business)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">{formData.taxIdType === 'ssn' ? 'Social Security Number' : 'EIN'} *</Label>
                      <Input
                        type="password"
                        value={formData.taxIdNumber}
                        onChange={(e) => updateField('taxIdNumber', e.target.value)}
                        className="mt-2 bg-black border-gold/20 text-white"
                        placeholder={formData.taxIdType === 'ssn' ? 'XXX-XX-XXXX' : 'XX-XXXXXXX'}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="w9"
                        checked={formData.w9Completed}
                        onCheckedChange={(checked) => updateField('w9Completed', checked)}
                        className="border-gold data-[state=checked]:bg-gold data-[state=checked]:text-black"
                      />
                      <label htmlFor="w9" className="text-sm text-gray-300 cursor-pointer">
                        I have completed or will complete a W-9 form
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Availability</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300">Max Hours Per Week</Label>
                      <Input
                        type="number"
                        value={formData.maxHoursPerWeek}
                        onChange={(e) => updateField('maxHoursPerWeek', parseInt(e.target.value))}
                        className="mt-2 bg-black border-gold/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Commission Rate</Label>
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          value={formData.commissionRate}
                          disabled
                          className="bg-black border-gold/20 text-white"
                        />
                        <span className="text-gray-400">%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">You keep {formData.commissionRate}% of each fare</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="bg-charcoal border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold font-cormorant text-3xl">Review & Submit</CardTitle>
                <CardDescription className="text-gray-400">Confirm your information and submit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                    <div className="bg-black border border-gold/10 rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-gray-400">Name: <span className="text-white">{formData.firstName} {formData.lastName}</span></p>
                      <p className="text-gray-400">Email: <span className="text-white">{formData.email}</span></p>
                      <p className="text-gray-400">Phone: <span className="text-white">{formData.phone}</span></p>
                      <p className="text-gray-400">Address: <span className="text-white">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Vehicle Information</h3>
                    <div className="bg-black border border-gold/10 rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-gray-400">Vehicle: <span className="text-white">{formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleYear})</span></p>
                      <p className="text-gray-400">Type: <span className="text-white capitalize">{formData.vehicleType}</span></p>
                      <p className="text-gray-400">License Plate: <span className="text-white">{formData.vehicleLicensePlate}</span></p>
                      <p className="text-gray-400">VIN: <span className="text-white">{formData.vehicleVIN}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Insurance</h3>
                    <div className="bg-black border border-gold/10 rounded-lg p-4 space-y-2 text-sm">
                      <p className="text-gray-400">Provider: <span className="text-white">{formData.insuranceProvider}</span></p>
                      <p className="text-gray-400">Policy: <span className="text-white">{formData.insurancePolicyNumber}</span></p>
                      <p className="text-gray-400">Coverage: <span className="text-white">${formData.insuranceCoverageAmount.toLocaleString()}</span></p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gold/20 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Consent & Agreement</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="background"
                        checked={formData.backgroundCheckConsent}
                        onCheckedChange={(checked) => updateField('backgroundCheckConsent', checked)}
                        className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-black"
                      />
                      <label htmlFor="background" className="text-sm text-gray-300 cursor-pointer">
                        I consent to a background check and understand that my application may be denied based on the results. *
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        className="mt-1 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-black"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300 cursor-pointer">
                        I agree to Globa7's affiliate driver terms and conditions, including the {formData.commissionRate}% commission structure.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-gold mx-auto mb-3" />
                  <h4 className="text-xl font-cormorant text-gold mb-2">Ready to Submit</h4>
                  <p className="text-sm text-gray-300">
                    Once submitted, your application will be reviewed by our team. We'll contact you within 2-3 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            variant="outline"
            className="border-gold text-gold hover:bg-gold hover:text-black disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              className="bg-gold text-black hover:bg-gold/90"
            >
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formData.backgroundCheckConsent}
              className="bg-gold text-black hover:bg-gold/90 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
