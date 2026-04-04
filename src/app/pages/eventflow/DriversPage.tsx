import { useState } from "react";
import { motion } from "motion/react";
import { 
  Search,
  Plus,
  Phone,
  Mail,
  Car,
  Calendar,
  MoreVertical,
  Edit,
  Eye,
  UserX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

const drivers = [
  {
    id: 1,
    name: "Mike Johnson",
    phone: "(504) 555-1001",
    email: "mike.johnson@globa7.com",
    vehicle: "Black Escalade #1",
    availability: "On Duty",
    assignedEvent: "Tech Conference 2026",
    role: "Lead Driver",
    assignedTransfers: 8,
    completedToday: 3,
    rating: 4.9
  },
  {
    id: 2,
    name: "Sarah Williams",
    phone: "(504) 555-1002",
    email: "sarah.williams@globa7.com",
    vehicle: "Mercedes S-Class #2",
    availability: "On Duty",
    assignedEvent: "Tech Conference 2026",
    role: "Standard",
    assignedTransfers: 6,
    completedToday: 2,
    rating: 4.8
  },
  {
    id: 3,
    name: "David Brown",
    phone: "(504) 555-1003",
    email: "david.brown@globa7.com",
    vehicle: "BMW 7 Series #3",
    availability: "On Duty",
    assignedEvent: "Wedding - Smith/Johnson",
    role: "Standard",
    assignedTransfers: 7,
    completedToday: 4,
    rating: 4.9
  },
  {
    id: 4,
    name: "James Wilson",
    phone: "(504) 555-1004",
    email: "james.wilson@globa7.com",
    vehicle: "Black Escalade #4",
    availability: "On Duty",
    assignedEvent: "Corporate Retreat",
    role: "Standard",
    assignedTransfers: 5,
    completedToday: 1,
    rating: 4.7
  },
  {
    id: 5,
    name: "Tom Anderson",
    phone: "(504) 555-1005",
    email: "tom.anderson@globa7.com",
    vehicle: "Mercedes S-Class #5",
    availability: "Off Duty",
    assignedEvent: null,
    role: "Backup",
    assignedTransfers: 0,
    completedToday: 0,
    rating: 4.6
  },
  {
    id: 6,
    name: "Lisa Martinez",
    phone: "(504) 555-1006",
    email: "lisa.martinez@globa7.com",
    vehicle: "BMW 7 Series #6",
    availability: "On Break",
    assignedEvent: "Festival VIP Transport",
    role: "Standard",
    assignedTransfers: 4,
    completedToday: 2,
    rating: 4.8
  },
];

export function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<typeof drivers[0] | null>(null);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phone.includes(searchQuery) ||
    driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'On Duty': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'On Break': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Off Duty': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Lead Driver': return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30';
      case 'Standard': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Backup': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
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
            Driver Management
          </h1>
          <p className="text-gray-400">
            Manage driver assignments, availability, and performance
          </p>
        </div>
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Drivers</p>
                <p className="text-3xl font-bold text-white">{drivers.length}</p>
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
                <p className="text-sm text-gray-400 mb-1">On Duty</p>
                <p className="text-3xl font-bold text-white">
                  {drivers.filter(d => d.availability === 'On Duty').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Car className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">On Break</p>
                <p className="text-3xl font-bold text-white">
                  {drivers.filter(d => d.availability === 'On Break').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Car className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Off Duty</p>
                <p className="text-3xl font-bold text-white">
                  {drivers.filter(d => d.availability === 'Off Duty').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-500/10">
                <Car className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by driver name, phone, or vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#1A1A1A] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
        />
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                      <span className="text-black font-bold text-lg">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{driver.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getAvailabilityColor(driver.availability)}>
                          {driver.availability}
                        </Badge>
                        <Badge variant="outline" className={getRoleColor(driver.role)}>
                          {driver.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-black/50 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#D4AF37]/20">
                      <DropdownMenuItem 
                        onClick={() => setSelectedDriver(driver)}
                        className="text-gray-300 focus:bg-black focus:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-black focus:text-red-400">
                        <UserX className="w-4 h-4 mr-2" />
                        Remove Driver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-[#D4AF37]/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    {driver.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    {driver.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Car className="w-4 h-4" />
                    {driver.vehicle}
                  </div>
                </div>

                {/* Event Assignment */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Assigned Event</p>
                  {driver.assignedEvent ? (
                    <p className="text-sm text-white font-medium">{driver.assignedEvent}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No event assigned</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{driver.assignedTransfers}</p>
                    <p className="text-xs text-gray-400">Assigned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{driver.completedToday}</p>
                    <p className="text-xs text-gray-400">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#D4AF37]">{driver.rating}</p>
                    <p className="text-xs text-gray-400">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Driver Profile Modal */}
      <Dialog open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
        <DialogContent className="bg-[#1A1A1A] border-[#D4AF37]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Driver Profile
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed information and performance metrics
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-[#D4AF37]/20">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">
                    {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedDriver.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getAvailabilityColor(selectedDriver.availability)}>
                      {selectedDriver.availability}
                    </Badge>
                    <Badge variant="outline" className={getRoleColor(selectedDriver.role)}>
                      {selectedDriver.role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <p className="text-white">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-white">{selectedDriver.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Vehicle</p>
                    <p className="text-white">{selectedDriver.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Rating</p>
                    <p className="text-white font-semibold">{selectedDriver.rating} / 5.0</p>
                  </div>
                </div>
              </div>

              {/* Current Assignment */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Current Assignment</h4>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Event</p>
                  <p className="text-white font-medium mb-3">
                    {selectedDriver.assignedEvent || 'No event assigned'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Assigned Transfers</p>
                      <p className="text-2xl font-bold text-white">{selectedDriver.assignedTransfers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Completed Today</p>
                      <p className="text-2xl font-bold text-green-400">{selectedDriver.completedToday}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Edit Profile
                </Button>
                <Button variant="outline" className="flex-1 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10">
                  View Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
