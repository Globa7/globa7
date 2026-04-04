import { useState } from "react";
import { motion } from "motion/react";
import { 
  Search,
  Plus,
  Car,
  Fuel,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { VehicleModal } from "../../components/eventflow/VehicleModal";

const vehicles = [
  {
    id: 1,
    name: "Black Escalade #1",
    type: "SUV",
    make: "Cadillac",
    model: "Escalade",
    year: 2024,
    capacity: 6,
    status: "Active",
    driver: "Mike Johnson",
    event: "Tech Conference 2026",
    mileage: 12450,
    lastMaintenance: "Jan 15, 2026",
    nextMaintenance: "Apr 15, 2026",
    fuelLevel: 85
  },
  {
    id: 2,
    name: "Mercedes S-Class #2",
    type: "Sedan",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2024,
    capacity: 4,
    status: "Active",
    driver: "Sarah Williams",
    event: "Tech Conference 2026",
    mileage: 8920,
    lastMaintenance: "Feb 1, 2026",
    nextMaintenance: "May 1, 2026",
    fuelLevel: 72
  },
  {
    id: 3,
    name: "BMW 7 Series #3",
    type: "Sedan",
    make: "BMW",
    model: "7 Series",
    year: 2024,
    capacity: 4,
    status: "Active",
    driver: "David Brown",
    event: "Wedding - Smith/Johnson",
    mileage: 10340,
    lastMaintenance: "Jan 22, 2026",
    nextMaintenance: "Apr 22, 2026",
    fuelLevel: 60
  },
  {
    id: 4,
    name: "Black Escalade #4",
    type: "SUV",
    make: "Cadillac",
    model: "Escalade",
    year: 2024,
    capacity: 6,
    status: "Active",
    driver: "James Wilson",
    event: "Corporate Retreat",
    mileage: 15680,
    lastMaintenance: "Dec 20, 2025",
    nextMaintenance: "Mar 20, 2026",
    fuelLevel: 45
  },
  {
    id: 5,
    name: "Mercedes S-Class #5",
    type: "Sedan",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2023,
    capacity: 4,
    status: "Available",
    driver: null,
    event: null,
    mileage: 18240,
    lastMaintenance: "Feb 10, 2026",
    nextMaintenance: "May 10, 2026",
    fuelLevel: 95
  },
  {
    id: 6,
    name: "BMW 7 Series #6",
    type: "Sedan",
    make: "BMW",
    model: "7 Series",
    year: 2023,
    capacity: 4,
    status: "Maintenance",
    driver: null,
    event: null,
    mileage: 22180,
    lastMaintenance: "Feb 25, 2026",
    nextMaintenance: "In Progress",
    fuelLevel: 30
  },
  {
    id: 7,
    name: "Mercedes Sprinter #1",
    type: "Shuttle",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2024,
    capacity: 14,
    status: "Active",
    driver: "Tom Anderson",
    event: "Festival VIP Transport",
    mileage: 9540,
    lastMaintenance: "Jan 30, 2026",
    nextMaintenance: "Apr 30, 2026",
    fuelLevel: 68
  },
  {
    id: 8,
    name: "Mercedes Sprinter #2",
    type: "Shuttle",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2023,
    capacity: 14,
    status: "Available",
    driver: null,
    event: null,
    mileage: 14820,
    lastMaintenance: "Feb 5, 2026",
    nextMaintenance: "May 5, 2026",
    fuelLevel: 88
  },
];

export function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || vehicle.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleAddVehicle = () => {
    setModalMode("add");
    setSelectedVehicle(null);
    setVehicleModalOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setModalMode("edit");
    setSelectedVehicle(vehicle);
    setVehicleModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'available':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'maintenance':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'suv':
        return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30';
      case 'sedan':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'shuttle':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getFuelColor = (level: number) => {
    if (level >= 70) return 'text-green-400';
    if (level >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Vehicle Fleet Management
          </h1>
          <p className="text-gray-400">
            Monitor and manage your entire vehicle fleet
          </p>
        </div>
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold" onClick={handleAddVehicle}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Fleet</p>
                <p className="text-3xl font-bold text-white">{vehicles.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                <Car className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-white">
                  {vehicles.filter(v => v.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Available</p>
                <p className="text-3xl font-bold text-white">
                  {vehicles.filter(v => v.status === 'Available').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Car className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search vehicles by name, make, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1A1A] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className={filterType === "all" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            All Types
          </Button>
          <Button
            variant={filterType === "suv" ? "default" : "outline"}
            onClick={() => setFilterType("suv")}
            className={filterType === "suv" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            SUV
          </Button>
          <Button
            variant={filterType === "sedan" ? "default" : "outline"}
            onClick={() => setFilterType("sedan")}
            className={filterType === "sedan" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Sedan
          </Button>
          <Button
            variant={filterType === "shuttle" ? "default" : "outline"}
            onClick={() => setFilterType("shuttle")}
            className={filterType === "shuttle" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Shuttle
          </Button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getTypeColor(vehicle.type)}>
                        {vehicle.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{vehicle.name}</h3>
                    <p className="text-sm text-gray-400">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-black/50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#D4AF37]/20">
                      <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white" onClick={() => handleEditVehicle(vehicle)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Vehicle
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-black focus:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Vehicle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4 pb-4 border-b border-[#D4AF37]/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white font-semibold">{vehicle.capacity} passengers</span>
                  </div>
                </div>

                {/* Assignment */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assigned Driver</p>
                    {vehicle.driver ? (
                      <p className="text-sm text-white font-medium">{vehicle.driver}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Unassigned</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Event</p>
                    {vehicle.event ? (
                      <p className="text-sm text-white font-medium">{vehicle.event}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No event</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vehicle Modal */}
      <VehicleModal
        open={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        mode={modalMode}
        vehicle={selectedVehicle}
      />
    </div>
  );
}