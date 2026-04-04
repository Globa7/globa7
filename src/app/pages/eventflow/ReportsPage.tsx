import { motion } from "motion/react";
import { 
  Download,
  Calendar,
  TrendingUp,
  Users,
  Car,
  DollarSign,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const driverHoursData = [
  { name: "Mike Johnson", hours: 42 },
  { name: "Sarah Williams", hours: 38 },
  { name: "David Brown", hours: 40 },
  { name: "James Wilson", hours: 35 },
  { name: "Tom Anderson", hours: 28 },
  { name: "Lisa Martinez", hours: 36 },
];

const weeklyTransfersData = [
  { day: "Mon", arrivals: 45, departures: 38, shuttles: 12 },
  { day: "Tue", arrivals: 52, departures: 48, shuttles: 15 },
  { day: "Wed", arrivals: 68, departures: 62, shuttles: 18 },
  { day: "Thu", arrivals: 72, departures: 65, shuttles: 22 },
  { day: "Fri", arrivals: 85, departures: 78, shuttles: 28 },
  { day: "Sat", arrivals: 58, departures: 52, shuttles: 16 },
  { day: "Sun", arrivals: 42, departures: 38, shuttles: 10 },
];

const vehicleUtilizationData = [
  { name: "Black Escalade", value: 95 },
  { name: "Mercedes S-Class", value: 88 },
  { name: "BMW 7 Series", value: 82 },
  { name: "Mercedes Sprinter", value: 65 },
  { name: "Other", value: 70 },
];

const COLORS = ["#D4AF37", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"];

export function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Reports & Analytics
          </h1>
          <p className="text-gray-400">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
          <Download className="w-4 h-4 mr-2" />
          Export All Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Events</p>
                  <p className="text-3xl font-bold text-white">24</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                  <Calendar className="w-6 h-6 text-[#D4AF37]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Transfers</p>
                  <p className="text-3xl font-bold text-white">1,847</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +18% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Car className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Driver Hours</p>
                  <p className="text-3xl font-bold text-white">2,156</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +8% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Est. Revenue</p>
                  <p className="text-3xl font-bold text-white">$234K</p>
                  <p className="text-xs text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +22% vs last month
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Hours Report */}
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Driver Hours Report</CardTitle>
                <CardDescription className="text-gray-400">
                  Total hours worked this week
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#D4AF37]/30 text-[#D4AF37]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={driverHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="hours" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Utilization */}
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Vehicle Utilization</CardTitle>
                <CardDescription className="text-gray-400">
                  Utilization rate by vehicle type
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#D4AF37]/30 text-[#D4AF37]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleUtilizationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Transfers Timeline */}
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Weekly Transfer Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Arrivals, departures, and shuttles by day
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-[#D4AF37]/30 text-[#D4AF37]">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={weeklyTransfersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4AF37" opacity={0.1} />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="arrivals" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  name="Arrivals"
                />
                <Line 
                  type="monotone" 
                  dataKey="departures" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  name="Departures"
                />
                <Line 
                  type="monotone" 
                  dataKey="shuttles" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  name="Shuttles"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <BarChart3 className="w-8 h-8 text-[#D4AF37]" />
            <span className="font-semibold">Event Summary</span>
            <span className="text-xs text-gray-400">Detailed event breakdown</span>
          </div>
        </Button>
        <Button variant="outline" className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-[#D4AF37]" />
            <span className="font-semibold">Driver Performance</span>
            <span className="text-xs text-gray-400">Individual driver metrics</span>
          </div>
        </Button>
        <Button variant="outline" className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <Car className="w-8 h-8 text-[#D4AF37]" />
            <span className="font-semibold">Fleet Analysis</span>
            <span className="text-xs text-gray-400">Vehicle usage and maintenance</span>
          </div>
        </Button>
        <Button variant="outline" className="border-[#D4AF37]/30 text-white hover:bg-[#D4AF37]/10 h-auto py-4">
          <div className="flex flex-col items-center gap-2">
            <DollarSign className="w-8 h-8 text-[#D4AF37]" />
            <span className="font-semibold">Revenue Report</span>
            <span className="text-xs text-gray-400">Financial performance</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
