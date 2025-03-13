
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import FarmerStatistics from "@/components/admin/FarmerStatistics";
import ProductionStats from "@/components/admin/ProductionStats";
import RevenueTrends from "@/components/admin/RevenueTrends";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Administrator! Here's an overview of the farm management system.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-8 w-full md:w-[200px] lg:w-[300px]" />
          </div>
          <Button className="bg-farm-forest hover:bg-farm-forest/90">
            <Plus className="h-4 w-4 mr-2" /> Add Farmer
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="farmers">Farmers</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Farmer Statistics */}
          <FarmerStatistics totalFarmers={250} activeFarmers={218} newRegistrations={12} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Production Statistics */}
            <ProductionStats />
            
            {/* Revenue Trends */}
            <RevenueTrends />
          </div>
          
          {/* Recent Activity & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New farmer registered", user: "Jane Smith", time: "10 minutes ago" },
                    { action: "Crop data updated", user: "Michael Johnson", time: "2 hours ago" },
                    { action: "Financial report exported", user: "Admin", time: "3 hours ago" },
                    { action: "System settings updated", user: "Admin", time: "5 hours ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.action}</p>
                        <p className="text-xs text-muted-foreground">By {item.user}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Support Requests</CardTitle>
                <CardDescription>Farmers needing assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { issue: "Cannot update crop data", user: "Robert Brown", status: "Urgent" },
                    { issue: "Login issues", user: "Sarah Williams", status: "Medium" },
                    { issue: "Financial report error", user: "David Miller", status: "Medium" },
                    { issue: "Weather data not loading", user: "John Peterson", status: "Low" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.issue}</p>
                        <p className="text-xs text-muted-foreground">From {item.user}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === "Urgent" ? "bg-red-100 text-red-800" :
                        item.status === "Medium" ? "bg-amber-100 text-amber-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="farmers">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Management</CardTitle>
              <CardDescription>
                View and manage all registered farmers in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This section allows you to view, add, modify, or remove farmer accounts, and monitor their activity.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  <Plus className="h-4 w-4 mr-2" /> Add New Farmer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Production Data</CardTitle>
              <CardDescription>
                Monitor crop and livestock production across all farms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review agricultural production statistics, trends, and forecasts based on farmer-submitted data.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Financial Analytics</CardTitle>
              <CardDescription>
                System-wide financial performance and metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analyze revenue streams, track subscription payments, and monitor overall financial health of the platform.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  Export Financial Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage system configurations, user permissions, notification templates, and data retention policies.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
