import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Car, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface VehicleModalProps {
  open: boolean;
  onClose: () => void;
  vehicle?: any; // Pass vehicle data for editing, null for adding
  mode: "add" | "edit";
}

export function VehicleModal({ open, onClose, vehicle, mode }: VehicleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    make: "",
    model: "",
    year: "",
    capacity: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && vehicle) {
      setFormData({
        name: vehicle.name || "",
        type: vehicle.type || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year?.toString() || "",
        capacity: vehicle.capacity?.toString() || "",
      });
    } else if (mode === "add") {
      // Reset form for adding
      setFormData({
        name: "",
        type: "",
        make: "",
        model: "",
        year: "",
        capacity: "",
      });
    }
  }, [mode, vehicle, open]);

  const vehicleTypes = [
    { value: "SUV", label: "SUV" },
    { value: "Sedan", label: "Sedan" },
    { value: "Shuttle", label: "Shuttle (14 Passenger Sprinter)" },
    { value: "28-Passenger", label: "28 Passenger Bus" },
    { value: "32-Passenger", label: "32 Passenger Bus" },
    { value: "55-Passenger", label: "55 Passenger Coach" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log(mode === "add" ? "Adding vehicle:" : "Updating vehicle:", formData);
    // Here you would make the API call to add/update the vehicle
    onClose();
  };

  const isFormValid = () => {
    return formData.name && formData.type && formData.make && formData.model && formData.year && formData.capacity;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-white max-w-2xl">
        <DialogHeader className="pb-4 border-b border-[#D4AF37]/20">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl flex items-center gap-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              <Car className="w-8 h-8 text-[#D4AF37]" />
              {mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

        <DialogDescription className="text-gray-300">
          {mode === "add" ? "Add a new vehicle to your fleet." : "Edit the details of the selected vehicle."}
        </DialogDescription>

        <div className="space-y-6 py-6">
          {/* Vehicle Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Vehicle Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Black Escalade #1"
              className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-gray-300">
              Vehicle Type *
            </Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full bg-black border border-[#D4AF37]/30 text-white rounded-md px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="">Select vehicle type...</option>
              {vehicleTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Make and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make" className="text-gray-300">
                Make *
              </Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Mercedes-Benz"
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-gray-300">
                Model *
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Sprinter"
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Year and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-gray-300">
                Year *
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="e.g., 2024"
                min="2000"
                max="2030"
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-300">
                Passenger Capacity *
              </Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                placeholder="e.g., 14"
                min="1"
                max="100"
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 rounded-lg">
            <p className="text-sm text-gray-300">
              {mode === "add" 
                ? "After adding the vehicle, you can assign drivers and events from the driver management page."
                : "Changes will be reflected across all event assignments."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#D4AF37]/30 text-gray-400 hover:bg-black"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 mr-2" />
            {mode === "add" ? "Add Vehicle" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}