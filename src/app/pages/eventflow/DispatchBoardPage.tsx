import { useState } from "react";
import { motion } from "motion/react";
import { 
  Clock,
  User,
  Car,
  MapPin,
  Plane,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const columns = [
  { id: "scheduled", title: "Scheduled", color: "gray" },
  { id: "assigned", title: "Driver Assigned", color: "blue" },
  { id: "enroute", title: "En Route", color: "purple" },
  { id: "pickup", title: "At Pickup", color: "yellow" },
  { id: "completed", title: "Completed", color: "green" },
  { id: "delayed", title: "Delayed", color: "orange" },
  { id: "issue", title: "Issue Flagged", color: "red" },
];

const transfers = [
  { id: 1, type: "arrival", client: "John Smith", flight: "BA 1234", time: "10:30 AM", driver: "Mike Johnson", vehicle: "Black Escalade #1", event: "Tech Conference", status: "completed" },
  { id: 2, type: "arrival", client: "Emily Davis", flight: "AA 5678", time: "11:45 AM", driver: "Sarah Williams", vehicle: "Mercedes S-Class #2", event: "Tech Conference", status: "enroute" },
  { id: 3, type: "arrival", client: "Robert Chen", flight: "DL 9012", time: "1:15 PM", driver: "David Brown", vehicle: "BMW 7 Series #3", event: "Tech Conference", status: "pickup" },
  { id: 4, type: "arrival", client: "Maria Garcia", flight: "UA 3456", time: "2:30 PM", driver: "James Wilson", vehicle: "Black Escalade #4", event: "Tech Conference", status: "assigned" },
  { id: 5, type: "shuttle", client: "Wedding Guest Group A", flight: null, time: "3:00 PM", driver: "Tom Anderson", vehicle: "Mercedes Sprinter #1", event: "Wedding - Smith/Johnson", status: "scheduled" },
  { id: 6, type: "departure", client: "Alexandra White", flight: "BA 2345", time: "4:30 PM", driver: "Lisa Martinez", vehicle: "BMW 7 Series #6", event: "Tech Conference", status: "scheduled" },
  { id: 7, type: "arrival", client: "Christopher Lee", flight: "SW 7890", time: "3:00 PM", driver: "Not Assigned", vehicle: "TBD", event: "Wedding - Smith/Johnson", status: "delayed" },
  { id: 8, type: "shuttle", client: "Corporate Team Shuttle", flight: null, time: "2:00 PM", driver: "Mike Johnson", vehicle: "Black Escalade #1", event: "Corporate Retreat", status: "issue" },
];

export function DispatchBoardPage() {
  const [selectedTransfer, setSelectedTransfer] = useState<typeof transfers[0] | null>(null);

  const getColumnColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: "border-gray-500/30",
      blue: "border-blue-500/30",
      purple: "border-purple-500/30",
      yellow: "border-yellow-500/30",
      green: "border-green-500/30",
      orange: "border-orange-500/30",
      red: "border-red-500/30",
    };
    return colors[color] || colors.gray;
  };

  const getColumnBg = (color: string) => {
    const colors: Record<string, string> = {
      gray: "bg-gray-500/5",
      blue: "bg-blue-500/5",
      purple: "bg-purple-500/5",
      yellow: "bg-yellow-500/5",
      green: "bg-green-500/5",
      orange: "bg-orange-500/5",
      red: "bg-red-500/5",
    };
    return colors[color] || colors.gray;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'arrival':
      case 'departure':
        return Plane;
      case 'shuttle':
        return Car;
      default:
        return Car;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'arrival':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'departure':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'shuttle':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Live Dispatch Board
        </h1>
        <p className="text-gray-400">
          Real-time visual tracking of all transfers and shuttles
        </p>
      </div>

      {/* Live Indicator */}
      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Live Updates Active</span>
              </div>
              <span className="text-gray-400">Last updated: Just now</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">{transfers.filter(t => t.status === 'completed').length} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">{transfers.filter(t => t.status === 'enroute' || t.status === 'pickup').length} In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">{transfers.filter(t => t.status === 'issue' || t.status === 'delayed').length} Issues</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {columns.map((column) => {
            const columnTransfers = transfers.filter(t => t.status === column.id);
            
            return (
              <div key={column.id} className="w-80 flex-shrink-0">
                <Card className={`bg-[#1A1A1A] border-t-4 ${getColumnColor(column.color)} h-full`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{column.title}</CardTitle>
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        {columnTransfers.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className={`space-y-3 max-h-[600px] overflow-y-auto ${getColumnBg(column.color)} rounded-b-lg`}>
                    {columnTransfers.map((transfer, index) => {
                      const TypeIcon = getTypeIcon(transfer.type);
                      
                      return (
                        <motion.div
                          key={transfer.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedTransfer(transfer)}
                          className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4 cursor-pointer hover:border-[#D4AF37]/40 transition-all group"
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="outline" className={getTypeBadgeColor(transfer.type)}>
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {transfer.type.charAt(0).toUpperCase() + transfer.type.slice(1)}
                            </Badge>
                            {(column.id === 'issue' || column.id === 'delayed') && (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>

                          {/* Client Info */}
                          <h4 className="text-white font-semibold mb-2 group-hover:text-[#D4AF37] transition-colors">
                            {transfer.client}
                          </h4>

                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            {transfer.flight && (
                              <div className="flex items-center gap-2 text-gray-400">
                                <Plane className="w-4 h-4" />
                                <span>{transfer.flight}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{transfer.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{transfer.driver}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Car className="w-4 h-4" />
                              <span>{transfer.vehicle}</span>
                            </div>
                          </div>

                          {/* Event */}
                          <div className="mt-3 pt-3 border-t border-[#D4AF37]/10">
                            <p className="text-xs text-gray-500">{transfer.event}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {columnTransfers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No transfers
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37]/20">
        <CardContent className="p-4">
          <p className="text-sm text-gray-300">
            <span className="text-[#D4AF37] font-semibold">Pro Tip:</span> Click on any transfer card to view detailed information and update status. Drag and drop functionality coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
