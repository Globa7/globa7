import { useState } from "react";
import { motion } from "motion/react";
import { 
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const issues = [
  {
    id: 1,
    date: "Feb 27, 2026",
    time: "9:45 AM",
    event: "Tech Conference 2026",
    driver: "Mike Johnson",
    description: "Flight BA 1234 delayed by 30 minutes - notified client and adjusted pickup time",
    status: "Resolved",
    severity: "Low",
    resolvedBy: "Sarah Williams (Dispatcher)",
    resolvedAt: "10:15 AM"
  },
  {
    id: 2,
    date: "Feb 27, 2026",
    time: "11:20 AM",
    event: "Tech Conference 2026",
    driver: "David Brown",
    description: "Vehicle AC malfunction - switched to backup vehicle (BMW 7 Series #7)",
    status: "Resolved",
    severity: "Medium",
    resolvedBy: "Tom Anderson (Lead Driver)",
    resolvedAt: "11:45 AM"
  },
  {
    id: 3,
    date: "Feb 27, 2026",
    time: "1:30 PM",
    event: "Wedding - Smith/Johnson",
    driver: "Lisa Martinez",
    description: "Client requested route change due to traffic on I-10 - rerouted via US-90",
    status: "Resolved",
    severity: "Low",
    resolvedBy: "Lisa Martinez (Driver)",
    resolvedAt: "1:35 PM"
  },
  {
    id: 4,
    date: "Feb 27, 2026",
    time: "2:15 PM",
    event: "Corporate Retreat",
    driver: "James Wilson",
    description: "Airport security delay - passenger arrived 45 minutes late to pickup point",
    status: "Open",
    severity: "Medium",
    resolvedBy: null,
    resolvedAt: null
  },
  {
    id: 5,
    date: "Feb 26, 2026",
    time: "5:30 PM",
    event: "Festival VIP Transport",
    driver: "Tom Anderson",
    description: "Road closure on Canal Street - coordinated alternate route through CBD",
    status: "Resolved",
    severity: "Medium",
    resolvedBy: "Dispatch Team",
    resolvedAt: "5:45 PM"
  },
  {
    id: 6,
    date: "Feb 26, 2026",
    time: "3:20 PM",
    event: "Tech Conference 2026",
    driver: "Sarah Williams",
    description: "Client luggage exceeded vehicle capacity - requested backup vehicle assistance",
    status: "Resolved",
    severity: "Low",
    resolvedBy: "Mike Johnson (Lead Driver)",
    resolvedAt: "3:35 PM"
  },
];

export function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filterStatus === "all" || 
      issue.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'medium':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'open':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const openIssues = issues.filter(i => i.status === 'Open').length;
  const resolvedToday = issues.filter(i => 
    i.status === 'Resolved' && i.date === 'Feb 27, 2026'
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Issue Log
          </h1>
          <p className="text-gray-400">
            Track and resolve operational issues in real-time
          </p>
        </div>
        <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Issues</p>
                <p className="text-3xl font-bold text-white">{issues.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-[#D4AF37]/10">
                <AlertCircle className="w-6 h-6 text-[#D4AF37]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Open Issues</p>
                <p className="text-3xl font-bold text-red-400">{openIssues}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <Clock className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Resolved Today</p>
                <p className="text-3xl font-bold text-green-400">{resolvedToday}</p>
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
                <p className="text-sm text-gray-400 mb-1">Resolution Rate</p>
                <p className="text-3xl font-bold text-white">
                  {Math.round((issues.filter(i => i.status === 'Resolved').length / issues.length) * 100)}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
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
            placeholder="Search issues by description, driver, or event..."
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
            All Issues
          </Button>
          <Button
            variant={filterStatus === "open" ? "default" : "outline"}
            onClick={() => setFilterStatus("open")}
            className={filterStatus === "open" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Open
          </Button>
          <Button
            variant={filterStatus === "resolved" ? "default" : "outline"}
            onClick={() => setFilterStatus("resolved")}
            className={filterStatus === "resolved" ? "bg-[#D4AF37] text-black" : "border-[#D4AF37]/30 text-gray-400"}
          >
            Resolved
          </Button>
        </div>
      </div>

      {/* Issues List */}
      <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
        <CardHeader>
          <CardTitle className="text-white">Issue History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4AF37]/20">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Event</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Issue Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Resolved By</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#D4AF37]/10 hover:bg-black/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="text-white font-medium">{issue.date}</div>
                      <div className="text-sm text-gray-400">{issue.time}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{issue.event}</td>
                    <td className="py-4 px-4 text-white font-medium">{issue.driver}</td>
                    <td className="py-4 px-4 text-gray-300 max-w-md">{issue.description}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={getStatusColor(issue.status)}>
                        {issue.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {issue.status === 'Open' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {issue.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {issue.resolvedBy ? (
                        <div>
                          <div className="text-sm text-white">{issue.resolvedBy}</div>
                          <div className="text-xs text-gray-500">{issue.resolvedAt}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Pending</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
