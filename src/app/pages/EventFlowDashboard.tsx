import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Calendar, 
  Plane, 
  Users, 
  Car, 
  Radio, 
  AlertCircle, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Bell,
  User,
  Plus,
  Menu,
  X,
  Smartphone
} from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { CreateEventModal } from "../components/eventflow/CreateEventModal";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/eventflow" },
  { name: "Events", icon: Calendar, path: "/eventflow/events" },
  { name: "Arrivals / Departures", icon: Plane, path: "/eventflow/manifest" },
  { name: "Drivers", icon: Users, path: "/eventflow/drivers" },
  { name: "Vehicles", icon: Car, path: "/eventflow/vehicles" },
  { name: "Live Dispatch Board", icon: Radio, path: "/eventflow/dispatch" },
  { name: "Issue Log", icon: AlertCircle, path: "/eventflow/issues" },
  { name: "Reports", icon: BarChart3, path: "/eventflow/reports" },
  { name: "Settings", icon: Settings, path: "/eventflow/settings" },
];

export function EventFlowDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#1A1A1A] border-r border-[#D4AF37]/20 z-50 lg:hidden"
            >
              <SidebarContent onNavigate={() => setMobileSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:block bg-[#1A1A1A] border-r border-[#D4AF37]/20 relative"
      >
        <SidebarContent collapsed={!sidebarOpen} />
        
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 bg-[#D4AF37] text-black rounded-full p-1 shadow-lg hover:bg-[#D4AF37]/90 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-[#D4AF37] hover:text-[#D4AF37]/80"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3">
                <select className="bg-black border border-[#D4AF37]/30 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]">
                  <option>Today - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setCreateEventModalOpen(true)}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create Event</span>
              </Button>

              <button className="relative p-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-white">Admin User</div>
                      <div className="text-xs text-gray-400">Super Admin</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1A1A1A] border-[#D4AF37]/20">
                  <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#D4AF37]/20" />
                  <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white">
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:bg-black focus:text-white">
                    Organization
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#D4AF37]/20" />
                  <DropdownMenuItem className="text-red-400 focus:bg-black focus:text-red-400">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black">
          <Outlet />
        </main>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        open={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
      />
    </div>
  );
}

function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-black font-bold text-lg">G7</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                EventFlow
              </h1>
              <p className="text-gray-400 text-xs">by Globa7</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-[#D4AF37] text-black font-semibold' 
                    : 'text-gray-300 hover:bg-black/50 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
          
          {/* Divider */}
          <div className="my-4 border-t border-[#D4AF37]/20"></div>
          
          {/* Driver App Link */}
          <button
            onClick={() => handleNavigation('/driver')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${location.pathname === '/driver'
                ? 'bg-[#D4AF37] text-black font-semibold' 
                : 'text-gray-300 hover:bg-black/50 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? 'Driver App' : undefined}
          >
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Driver App</span>}
          </button>
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#D4AF37]/20">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent p-4 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Enterprise Edition</p>
            <p className="text-sm text-white font-semibold">Unlimited Events</p>
          </div>
        </div>
      )}
    </div>
  );
}