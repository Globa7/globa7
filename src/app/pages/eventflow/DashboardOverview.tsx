import { motion } from "motion/react";
import { 
  Calendar, 
  Users, 
  Plane, 
  Car, 
  AlertCircle, 
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

const kpiCards = [
  {
    title: "Active Events",
    value: "12",
    change: "+3 this week",
    icon: Calendar,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    title: "Drivers On Duty",
    value: "47",
    change: "89% capacity",
    icon: Users,
    color: "text-[#D4AF37]",
    bgColor: "bg-[#D4AF37]/10"
  },
  {
    title: "Arrivals Today",
    value: "156",
    change: "28 completed",
    icon: Plane,
    color: "text-green-400",
    bgColor: "bg-green-500/10"
  },
  {
    title: "Departures Today",
    value: "142",
    change: "19 completed",
    icon: Plane,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    title: "Open Issues",
    value: "3",
    change: "2 resolved today",
    icon: AlertCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  },
  {
    title: "Vehicles Active",
    value: "38",
    change: "12 SUVs, 26 Sedans",
    icon: Car,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10"
  },
];

const recentActivity = [
  {
    type: "arrival",
    event: "Tech Conference 2026",
    description: "Flight BA 1234 landed - Driver John assigned",
    time: "5 min ago",
    status: "active"
  },
  {
    type: "departure",
    event: "Wedding - Smith/Johnson",
    description: "Guest shuttle departed to venue",
    time: "12 min ago",
    status: "completed"
  },
  {
    type: "issue",
    event: "Corporate Retreat",
    description: "Vehicle AC malfunction reported",
    time: "23 min ago",
    status: "warning"
  },
  {
    type: "arrival",
    event: "Festival VIP Transport",
    description: "Airport pickup completed - en route to hotel",
    time: "35 min ago",
    status: "active"
  },
  {
    type: "event",
    event: "New Event Created",
    description: "Funeral Service - Memorial Chapel",
    time: "1 hour ago",
    status: "new"
  },
];

const upcomingEvents = [
  {
    name: "Tech Conference 2026",
    date: "Feb 27-28",
    guests: 250,
    drivers: 12,
    status: "Active",
    color: "bg-green-500"
  },
  {
    name: "Wedding - Smith/Johnson",
    date: "Feb 28",
    guests: 120,
    drivers: 6,
    status: "Active",
    color: "bg-green-500"
  },
  {
    name: "Corporate Retreat",
    date: "Mar 1-3",
    guests: 80,
    drivers: 5,
    status: "Planning",
    color: "bg-yellow-500"
  },
  {
    name: "Festival VIP Transport",
    date: "Mar 5-7",
    guests: 180,
    drivers: 10,
    status: "Planning",
    color: "bg-yellow-500"
  },
];

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Command Center
        </h1>
        <p className="text-gray-400">
          Real-time operations overview for all active events
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-white">{kpi.value}</h3>
                  <p className="text-sm text-gray-400">{kpi.title}</p>
                  <p className="text-xs text-gray-500">{kpi.change}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
              <CardDescription className="text-gray-400">
                Active and scheduled events this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/50 border border-[#D4AF37]/10 rounded-lg p-4 hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                          <h4 className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors">
                            {event.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.guests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {event.drivers} drivers
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${event.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}
                        `}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
              >
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div>
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Live Activity</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Real-time</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 pb-4 border-l-2 border-[#D4AF37]/20 last:border-transparent last:pb-0"
                  >
                    <div className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full ${
                      activity.status === 'active' ? 'bg-green-500' :
                      activity.status === 'completed' ? 'bg-blue-500' :
                      activity.status === 'warning' ? 'bg-red-500' :
                      'bg-[#D4AF37]'
                    }`}></div>
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </span>
                        {activity.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {activity.status === 'warning' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-white font-medium mb-1">{activity.event}</p>
                      <p className="text-xs text-gray-400">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
