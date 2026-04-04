import { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2,
  Users,
  CreditCard,
  Plug2,
  Bell,
  Shield,
  Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Settings
        </h1>
        <p className="text-gray-400">
          Configure your EventFlow system and organization settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1A1A1A] border-[#D4AF37]/20">
          <TabsTrigger value="organization" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Building2 className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Users className="w-4 h-4 mr-2" />
            Users & Roles
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Plug2 className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Organization Profile */}
        <TabsContent value="organization" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Organization Profile</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your organization details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="text-gray-300">Organization Name</Label>
                  <Input
                    id="orgName"
                    defaultValue="Globa7 Transportation"
                    className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300">Industry</Label>
                  <Input
                    id="industry"
                    defaultValue="Luxury Transportation"
                    className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="contact@globa7.com"
                    className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    defaultValue="(504) 555-0100"
                    className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300">Address</Label>
                <Input
                  id="address"
                  defaultValue="123 Canal Street, New Orleans, LA 70130"
                  className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Team Members</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage user access and permissions
                  </CardDescription>
                </div>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  <Users className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Admin User", email: "admin@globa7.com", role: "Super Admin", status: "Active" },
                  { name: "Sarah Johnson", email: "sarah@globa7.com", role: "Event Dispatcher", status: "Active" },
                  { name: "Mike Johnson", email: "mike@globa7.com", role: "Driver", status: "Active" },
                  { name: "David Brown", email: "david@globa7.com", role: "Driver", status: "Active" },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black/30 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                        <span className="text-black font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{user.name}</h4>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === 'Super Admin' 
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                            : user.role === 'Event Dispatcher'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }
                      >
                        {user.role}
                      </Badge>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        {user.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-[#D4AF37]/30 text-gray-400">
                        Manage
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Role Permissions</CardTitle>
              <CardDescription className="text-gray-400">
                Configure access levels for each role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: "Super Admin", permissions: "Full system access", color: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30" },
                  { role: "Event Dispatcher", permissions: "Create/edit events, assign drivers, view reports", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
                  { role: "Driver", permissions: "View assigned events, update transfer status", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
                  { role: "Client", permissions: "View event details, track transfers", color: "bg-gray-500/10 text-gray-400 border-gray-500/30" },
                ].map((role, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className={role.color}>
                        {role.role}
                      </Badge>
                      <p className="text-sm text-gray-400 mt-2">{role.permissions}</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#D4AF37]/30 text-[#D4AF37]">
                      Edit Permissions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Subscription */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Enterprise Plan</h3>
                  <p className="text-gray-400">Unlimited events, drivers, and vehicles</p>
                </div>
                <Badge className="bg-[#D4AF37] text-black text-lg px-4 py-2">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Plan</p>
                  <p className="text-white font-semibold">Enterprise</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Billing Cycle</p>
                  <p className="text-white font-semibold">Annual</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                  <p className="text-white font-semibold">March 1, 2027</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Amount</p>
                  <p className="text-white font-semibold">$9,999/year</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="border-[#D4AF37]/30 text-[#D4AF37]">
                  Change Plan
                </Button>
                <Button variant="outline" className="border-[#D4AF37]/30 text-gray-400">
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Available Integrations</CardTitle>
              <CardDescription className="text-gray-400">
                Connect EventFlow with your existing tools and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Flight Tracking API", description: "Real-time flight status updates", status: "Coming Soon" },
                  { name: "GPS Tracking", description: "Live vehicle location tracking", status: "Coming Soon" },
                  { name: "Payment Processing", description: "Automated billing and invoicing", status: "Coming Soon" },
                  { name: "CRM Integration", description: "Sync client data with your CRM", status: "Coming Soon" },
                ].map((integration, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center">
                        <Plug2 className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{integration.name}</h4>
                        <p className="text-sm text-gray-400">{integration.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Configure how and when you receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "Event Updates", description: "Get notified when events are created or modified" },
                { title: "Driver Assignments", description: "Alerts when drivers are assigned to transfers" },
                { title: "Issue Reports", description: "Immediate notification of operational issues" },
                { title: "Flight Status Changes", description: "Real-time updates on flight delays or cancellations" },
                { title: "Daily Summary", description: "End-of-day recap of all activities" },
              ].map((notification, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-[#D4AF37]/10 last:border-0">
                  <div>
                    <h4 className="text-white font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-400">{notification.description}</p>
                  </div>
                  <Switch defaultChecked={index < 3} />
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
