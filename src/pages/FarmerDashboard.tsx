
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import CropProgress from "@/components/farmer/CropProgress";
import LivestockStatus from "@/components/farmer/LivestockStatus";
import WeatherWidget from "@/components/farmer/WeatherWidget";
import FinancialSummary from "@/components/farmer/FinancialSummary";

const FarmerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, John! Here's what's happening on your farm today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Button className="hidden md:flex gap-1 bg-farm-forest hover:bg-farm-forest/90">
            <Plus className="h-4 w-4" /> Add Farm Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Crop Growth Card */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Crop Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CropProgress crop="Corn" progress={75} daysToHarvest={28} />
                <CropProgress crop="Soybeans" progress={45} daysToHarvest={60} />
                <CropProgress crop="Wheat" progress={90} daysToHarvest={14} />
                <CropProgress crop="Barley" progress={20} daysToHarvest={85} />
              </CardContent>
            </Card>

            {/* Livestock Card */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Livestock Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <LivestockStatus type="Cattle" count={42} healthStatus="healthy" />
                <LivestockStatus type="Pigs" count={86} healthStatus="attention" />
                <LivestockStatus type="Chickens" count={120} healthStatus="healthy" />
                <LivestockStatus type="Sheep" count={35} healthStatus="critical" />
              </CardContent>
            </Card>

            {/* Weather Card */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <WeatherWidget 
                  location="Your Farm" 
                  temperature={24} 
                  condition="Partly Cloudy" 
                  humidity={65} 
                  windSpeed={12}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  <p className="font-medium">5-Day Forecast:</p>
                  <div className="grid grid-cols-5 gap-1 mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                      <div key={day} className="text-center">
                        <p>{day}</p>
                        <p className="text-xs">{20 + i}°C</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Financial Summary Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialSummary />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crops">
          <Card>
            <CardHeader>
              <CardTitle>Crop Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed information about your crops, planting schedules, and harvest forecasts.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  <Plus className="h-4 w-4 mr-2" /> Add New Crop
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock">
          <Card>
            <CardHeader>
              <CardTitle>Livestock Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track your animals, health records, feeding schedules, and breeding information.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Livestock
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Financial Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review your farm's financial performance, revenue streams, expenses, and profit margins.
              </p>
              <div className="flex justify-end">
                <Button className="bg-farm-forest hover:bg-farm-forest/90">
                  <Plus className="h-4 w-4 mr-2" /> Add Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard;
