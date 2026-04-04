import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Car,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plane
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";

export function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock event data
  const event = {
    id: eventId,
    name: "Tech Conference 2026",
    dates: "Feb 27-28, 2026",
    status: "Active",
    location: "Marriott Convention Center",
    address: "555 Canal Street, New Orleans, LA 70130",
    coordinator: {
      name: "Sarah Johnson",
      phone: "(504) 555-0123",
      email: "sarah.johnson@techconf.com"
    },
    stats: {
      totalGuests: 250,
      driversAssigned: 12,
      arrivals: 156,
      departures: 142,
      shuttles: 18,
      vehiclesActive: 10
    }
  };

  const arrivals = [
    { id: 1, clientName: "John Smith", flight: "BA 1234", arrivalTime: "10:30 AM", driver: "Mike Johnson", vehicle: "Black Escalade", destination: "Marriott Convention Center", status: "Completed" },
    { id: 2, clientName: "Emily Davis", flight: "AA 5678", arrivalTime: "11:45 AM", driver: "Sarah Williams", vehicle: "Mercedes S-Class", destination: "Marriott Convention Center", status: "En Route" },
    { id: 3, clientName: "Robert Chen", flight: "DL 9012", arrivalTime: "1:15 PM", driver: "David Brown", vehicle: "BMW 7 Series", destination: "Windsor Court Hotel", status: "Landed" },
    { id: 4, clientName: "Maria Garcia", flight: "UA 3456", arrivalTime: "2:30 PM", driver: "James Wilson", vehicle: "Black Escalade", destination: "Marriott Convention Center", status: "Scheduled" },
  ];

  const departures = [
    { id: 1, clientName: "Alexandra White", flight: "BA 2345", departureTime: "4:30 PM", driver: "Tom Anderson", vehicle: "Mercedes S-Class", pickup: "Marriott Convention Center", status: "Scheduled" },
    { id: 2, clientName: "Michael Brown", flight: "AA 6789", departureTime: "5:45 PM", driver: "Lisa Martinez", vehicle: "BMW 7 Series", pickup: "Windsor Court Hotel", status: "Scheduled" },
  ];

  const drivers = [
    { id: 1, name: "Mike Johnson", phone: "(504) 555-1001", vehicle: "Black Escalade #1", availability: "On Duty", role: "Lead Driver", assignedTransfers: 8 },
    { id: 2, name: "Sarah Williams", phone: "(504) 555-1002", vehicle: "Mercedes S-Class #2", availability: "On Duty", role: "Standard", assignedTransfers: 6 },
    { id: 3, name: "David Brown", phone: "(504) 555-1003", vehicle: "BMW 7 Series #3", availability: "On Duty", role: "Standard", assignedTransfers: 7 },
    { id: 4, name: "James Wilson", phone: "(504) 555-1004", vehicle: "Black Escalade #4", availability: "On Duty", role: "Standard", assignedTransfers: 5 },
  ];

  const issues = [
    { id: 1, date: "Feb 27", time: "9:45 AM", driver: "Mike Johnson", description: "Flight BA 1234 delayed by 30 minutes", status: "Resolved", severity: "low" },
    { id: 2, date: "Feb 27", time: "11:20 AM", driver: "David Brown", description: "Vehicle AC malfunction - switched to backup vehicle", status: "Resolved", severity: "medium" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'en route': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'landed': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'scheduled': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <Button
          onClick={() => navigate('/eventflow/events')}
          variant="ghost"
          className="text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 
                className="text-4xl font-bold text-white"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {event.name}
              </h1>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                {event.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {event.dates}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs text-gray-400">Total Guests</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.totalGuests}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs text-gray-400">Drivers</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.driversAssigned}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Arrivals</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.arrivals}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Departures</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.departures}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Shuttles</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.shuttles}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Active Vehicles</span>
            </div>
            <p className="text-2xl font-bold text-white">{event.stats.vehiclesActive}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="arrivals" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            Arrivals
          </TabsTrigger>
          <TabsTrigger value="departures" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            Departures
          </TabsTrigger>
          <TabsTrigger value="drivers" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            Drivers
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            Issues
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-white font-medium">{event.location}</p>
                  <p className="text-sm text-gray-500">{event.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Dates</p>
                  <p className="text-white font-medium">{event.dates}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    {event.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Primary Coordinator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="text-white font-medium">{event.coordinator.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <p className="text-white font-medium">{event.coordinator.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="text-white font-medium">{event.coordinator.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Arrivals Tab */}
        <TabsContent value="arrivals">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Arrival Manifest</CardTitle>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Export to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Client Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Flight #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Arrival Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Driver</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Destination</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {arrivals.map((arrival) => (
                      <tr key={arrival.id} className="border-b border-[#D4AF37]/10 hover:bg-black/30">
                        <td className="py-3 px-4 text-white font-medium">{arrival.clientName}</td>
                        <td className="py-3 px-4 text-gray-300">{arrival.flight}</td>
                        <td className="py-3 px-4 text-gray-300">{arrival.arrivalTime}</td>
                        <td className="py-3 px-4 text-gray-300">{arrival.driver}</td>
                        <td className="py-3 px-4 text-gray-300">{arrival.vehicle}</td>
                        <td className="py-3 px-4 text-gray-300">{arrival.destination}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getStatusColor(arrival.status)}>
                            {arrival.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departures Tab */}
        <TabsContent value="departures">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Departure Manifest</CardTitle>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Export to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#D4AF37]/20">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Client Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Flight #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Departure Time</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Driver</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pickup Location</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departures.map((departure) => (
                      <tr key={departure.id} className="border-b border-[#D4AF37]/10 hover:bg-black/30">
                        <td className="py-3 px-4 text-white font-medium">{departure.clientName}</td>
                        <td className="py-3 px-4 text-gray-300">{departure.flight}</td>
                        <td className="py-3 px-4 text-gray-300">{departure.departureTime}</td>
                        <td className="py-3 px-4 text-gray-300">{departure.driver}</td>
                        <td className="py-3 px-4 text-gray-300">{departure.vehicle}</td>
                        <td className="py-3 px-4 text-gray-300">{departure.pickup}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className={getStatusColor(departure.status)}>
                            {departure.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drivers Tab */}
        <TabsContent value="drivers">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Assigned Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center">
                        <Users className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{driver.name}</h4>
                        <p className="text-sm text-gray-400">{driver.phone}</p>
                        <p className="text-sm text-gray-500">{driver.vehicle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30 mb-2">
                        {driver.availability}
                      </Badge>
                      <p className="text-sm text-gray-400">
                        {driver.assignedTransfers} transfers assigned
                      </p>
                      <p className="text-xs text-gray-500">Role: {driver.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Issue Log</CardTitle>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  Add Issue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {issue.severity === 'medium' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        <span className="text-white font-semibold">{issue.driver}</span>
                      </div>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        {issue.status}
                      </Badge>
                    </div>
                    <p className="text-gray-300 mb-2">{issue.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{issue.date}</span>
                      <span>{issue.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
