
import { Users, UserPlus, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FarmerStatisticsProps {
  totalFarmers: number;
  activeFarmers: number;
  newRegistrations: number;
}

const FarmerStatistics: React.FC<FarmerStatisticsProps> = ({
  totalFarmers,
  activeFarmers,
  newRegistrations,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalFarmers}</div>
          <p className="text-xs text-muted-foreground">Farmers registered in the system</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
          <Users className="h-4 w-4 text-farm-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeFarmers}</div>
          <div className="text-xs text-muted-foreground">
            {Math.round((activeFarmers / totalFarmers) * 100)}% of total farmers
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
          <UserPlus className="h-4 w-4 text-farm-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newRegistrations}</div>
          <p className="text-xs text-muted-foreground">New farmers this month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerStatistics;
