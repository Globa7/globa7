import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { 
  Calendar, 
  Users, 
  Car, 
  MapPin, 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { CreateEventModal } from "../../components/eventflow/CreateEventModal";

const events = [
  {
    id: 1,
    name: "Tech Conference 2026",
    dates: "Feb 27-28, 2026",
    startDate: "2026-02-27",
    endDate: "2026-02-28",
    totalGuests: 250,
    driversAssigned: 12,
    arrivals: 156,
    departures: 142,
    shuttles: 18,
    status: "Active",
    statusColor: "bg-green-500",
    location: "Marriott Convention Center",
    coordinator: "Sarah Johnson"
  },
  {
    id: 2,
    name: "Wedding - Smith/Johnson",
    dates: "Feb 28, 2026",
    startDate: "2026-02-28",
    endDate: "2026-02-28",
    totalGuests: 120,
    driversAssigned: 6,
    arrivals: 45,
    departures: 40,
    shuttles: 8,
    status: "Active",
    statusColor: "bg-green-500",
    location: "Oak Alley Plantation",
    coordinator: "Michael Chen"
  },
  {
    id: 3,
    name: "Corporate Retreat",
    dates: "Mar 1-3, 2026",
    startDate: "2026-03-01",
    endDate: "2026-03-03",
    totalGuests: 80,
    driversAssigned: 5,
    arrivals: 32,
    departures: 30,
    shuttles: 12,
    status: "Planning",
    statusColor: "bg-yellow-500",
    location: "Windsor Court Hotel",
    coordinator: "Emily Rodriguez"
  },
  {
    id: 4,
    name: "Festival VIP Transport",
    dates: "Mar 5-7, 2026",
    startDate: "2026-03-05",
    endDate: "2026-03-07",
    totalGuests: 180,
    driversAssigned: 10,
    arrivals: 95,
    departures: 88,
    shuttles: 24,
    status: "Planning",
    statusColor: "bg-yellow-500",
    location: "French Quarter",
    coordinator: "David Thompson"
  },
  {
    id: 5,
    name: "Medical Conference",
    dates: "Mar 10-12, 2026",
    startDate: "2026-03-10",
    endDate: "2026-03-12",
    totalGuests: 320,
    driversAssigned: 15,
    arrivals: 210,
    departures: 205,
    shuttles: 30,
    status: "Planning",
    statusColor: "bg-yellow-500",
    location: "Hyatt Regency",
    coordinator: "Dr. Patricia Lee"
  },
  {
    id: 6,
    name: "Jazz Festival Executive Packages",
    dates: "Apr 24-May 3, 2026",
    startDate: "2026-04-24",
    endDate: "2026-05-03",
    totalGuests: 450,
    driversAssigned: 20,
    arrivals: 280,
    departures: 275,
    shuttles: 45,
    status: "Planning",
    statusColor: "bg-yellow-500",
    location: "Multiple Venues",
    coordinator: "Marcus Williams"
  },
  {
    id: 7,
    name: "Funeral Service - Memorial Chapel",
    dates: "Feb 29, 2026",
    startDate: "2026-02-29",
    endDate: "2026-02-29",
    totalGuests: 50,
    driversAssigned: 3,
    arrivals: 22,
    departures: 20,
    shuttles: 4,
    status: "Completed",
    statusColor: "bg-gray-500",
    location: "St. Louis Cemetery",
    coordinator: "Jennifer Martinez"
  },
  {
    id: 8,
    name: "Mardi Gras Celebrity Transport",
    dates: "Feb 12-17, 2026",
    startDate: "2026-02-12",
    endDate: "2026-02-17",
    totalGuests: 85,
    driversAssigned: 8,
    arrivals: 42,
    departures: 40,
    shuttles: 16,
    status: "Completed",
    statusColor: "bg-gray-500",
    location: "CBD District",
    coordinator: "Andre Baptiste"
  },
];

export function EventsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || event.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Multi-Event Management
          </h1>
          <p className="text-gray-400">
            Manage all events from a single command center
          </p>
        </div>
        <Button
          onClick={() => setCreateEventModalOpen(true)}
          className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search events by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1A1A1A] border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className={filterStatus === "all" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            All Events
          </Button>
          <Button
            variant={filterStatus === "active" ? "default" : "outline"}
            onClick={() => setFilterStatus("active")}
            className={filterStatus === "active" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "planning" ? "default" : "outline"}
            onClick={() => setFilterStatus("planning")}
            className={filterStatus === "planning" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Planning
          </Button>
          <Button
            variant={filterStatus === "completed" ? "default" : "outline"}
            onClick={() => setFilterStatus("completed")}
            className={filterStatus === "completed" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all group cursor-pointer">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${event.statusColor}`}></div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${event.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
                            event.status === 'Planning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                            'bg-gray-500/10 text-gray-400 border-gray-500/30'}
                        `}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                      {event.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {event.dates}
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
                        onClick={() => navigate(`/eventflow/events/${event.id}`)}
                        className="text-gray-300 focus:bg-black focus:text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Event
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:bg-black focus:text-red-400">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Location & Coordinator */}
                <div className="space-y-2 mb-4 pb-4 border-b border-[#D4AF37]/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    Coordinator: {event.coordinator}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs text-gray-400">Total Guests</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{event.totalGuests}</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs text-gray-400">Drivers</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{event.driversAssigned}</p>
                  </div>
                </div>

                {/* Transfer Counts */}
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-400">
                    <span className="text-white font-semibold">{event.arrivals}</span> Arrivals
                  </div>
                  <div className="text-gray-400">
                    <span className="text-white font-semibold">{event.departures}</span> Departures
                  </div>
                  <div className="text-gray-400">
                    <span className="text-white font-semibold">{event.shuttles}</span> Shuttles
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => navigate(`/eventflow/events/${event.id}`)}
                  variant="outline"
                  className="w-full mt-4 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  Open Event Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No events found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        open={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
      />
    </div>
  );
}