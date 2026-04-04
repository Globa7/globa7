import { useState } from "react";
import { motion } from "motion/react";
import { 
  Search,
  Filter,
  Download,
  Plane,
  Calendar,
  Users,
  Car
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const arrivals = [
  { id: 1, clientName: "John Smith", event: "Tech Conference 2026", flight: "BA 1234", arrivalTime: "10:30 AM", driver: "Mike Johnson", vehicle: "Black Escalade #1", destination: "Marriott Convention Center", status: "Completed" },
  { id: 2, clientName: "Emily Davis", event: "Tech Conference 2026", flight: "AA 5678", arrivalTime: "11:45 AM", driver: "Sarah Williams", vehicle: "Mercedes S-Class #2", destination: "Marriott Convention Center", status: "En Route" },
  { id: 3, clientName: "Robert Chen", event: "Tech Conference 2026", flight: "DL 9012", arrivalTime: "1:15 PM", driver: "David Brown", vehicle: "BMW 7 Series #3", destination: "Windsor Court Hotel", status: "Landed" },
  { id: 4, clientName: "Maria Garcia", event: "Tech Conference 2026", flight: "UA 3456", arrivalTime: "2:30 PM", driver: "James Wilson", vehicle: "Black Escalade #4", destination: "Marriott Convention Center", status: "Scheduled" },
  { id: 5, clientName: "Christopher Lee", event: "Wedding - Smith/Johnson", flight: "SW 7890", arrivalTime: "3:00 PM", driver: "Tom Anderson", vehicle: "Mercedes S-Class #5", destination: "Oak Alley Plantation", status: "Scheduled" },
  { id: 6, clientName: "Jennifer Wilson", event: "Wedding - Smith/Johnson", flight: "BA 2468", arrivalTime: "4:15 PM", driver: "Lisa Martinez", vehicle: "BMW 7 Series #6", destination: "Windsor Court Hotel", status: "Scheduled" },
];

const departures = [
  { id: 1, clientName: "Alexandra White", event: "Tech Conference 2026", flight: "BA 2345", departureTime: "4:30 PM", driver: "Tom Anderson", vehicle: "Mercedes S-Class #5", pickup: "Marriott Convention Center", status: "Scheduled" },
  { id: 2, clientName: "Michael Brown", event: "Tech Conference 2026", flight: "AA 6789", departureTime: "5:45 PM", driver: "Lisa Martinez", vehicle: "BMW 7 Series #6", pickup: "Windsor Court Hotel", status: "Scheduled" },
  { id: 3, clientName: "David Taylor", event: "Wedding - Smith/Johnson", flight: "DL 1357", departureTime: "6:00 PM", driver: "Mike Johnson", vehicle: "Black Escalade #1", pickup: "Oak Alley Plantation", status: "Scheduled" },
  { id: 4, clientName: "Sarah Martinez", event: "Corporate Retreat", flight: "UA 9753", departureTime: "7:30 PM", driver: "James Wilson", vehicle: "Black Escalade #4", pickup: "Windsor Court Hotel", status: "Scheduled" },
];

export function ManifestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("arrivals");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'en route': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'landed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'scheduled': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const filteredArrivals = arrivals.filter(arrival =>
    arrival.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arrival.flight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    arrival.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepartures = departures.filter(departure =>
    departure.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    departure.flight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    departure.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Arrivals & Departures Manifest
          </h1>
          <p className="text-gray-400">
            Comprehensive flight tracking and transfer management
          </p>
        </div>
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Export Manifest
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Plane className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Arrivals</p>
                <p className="text-2xl font-bold text-white">{arrivals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Plane className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Departures</p>
                <p className="text-2xl font-bold text-white">{departures.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Car className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Transfers</p>
                <p className="text-2xl font-bold text-white">14</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                <Users className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Drivers Deployed</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by client name, flight number, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1A1A] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#D4AF37]/30 text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-[#D4AF37]/30 text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Tabbed Tables */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <TabsTrigger value="arrivals" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Plane className="w-4 h-4 mr-2" />
            Arrivals ({filteredArrivals.length})
          </TabsTrigger>
          <TabsTrigger value="departures" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Plane className="w-4 h-4 mr-2 rotate-45" />
            Departures ({filteredDepartures.length})
          </TabsTrigger>
        </TabsList>

        {/* Arrivals Table */}
        <TabsContent value="arrivals">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Arrival Manifest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Client Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Event</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Flight #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Arrival Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Driver</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Destination</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArrivals.map((arrival, index) => (
                      <motion.tr
                        key={arrival.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#D4AF37]/10 hover:bg-black/30 transition-colors"
                      >
                        <td className="py-4 px-4 text-white font-medium">{arrival.clientName}</td>
                        <td className="py-4 px-4 text-gray-300 text-sm">{arrival.event}</td>
                        <td className="py-4 px-4 text-gray-300">{arrival.flight}</td>
                        <td className="py-4 px-4 text-gray-300">{arrival.arrivalTime}</td>
                        <td className="py-4 px-4 text-gray-300">{arrival.driver}</td>
                        <td className="py-4 px-4 text-gray-300">{arrival.vehicle}</td>
                        <td className="py-4 px-4 text-gray-300">{arrival.destination}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className={getStatusColor(arrival.status)}>
                            {arrival.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departures Table */}
        <TabsContent value="departures">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Departure Manifest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Client Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Event</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Flight #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Departure Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Driver</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pickup Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartures.map((departure, index) => (
                      <motion.tr
                        key={departure.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-[#D4AF37]/10 hover:bg-black/30 transition-colors"
                      >
                        <td className="py-4 px-4 text-white font-medium">{departure.clientName}</td>
                        <td className="py-4 px-4 text-gray-300 text-sm">{departure.event}</td>
                        <td className="py-4 px-4 text-gray-300">{departure.flight}</td>
                        <td className="py-4 px-4 text-gray-300">{departure.departureTime}</td>
                        <td className="py-4 px-4 text-gray-300">{departure.driver}</td>
                        <td className="py-4 px-4 text-gray-300">{departure.vehicle}</td>
                        <td className="py-4 px-4 text-gray-300">{departure.pickup}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className={getStatusColor(departure.status)}>
                            {departure.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
