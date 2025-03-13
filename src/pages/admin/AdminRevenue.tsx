
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueTrends from "@/components/admin/RevenueTrends";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, BarChart4, CircleDollarSign, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Revenue {
  id: number;
  farmName: string;
  region: string;
  cropRevenue: number;
  livestockRevenue: number;
  otherRevenue: number;
  totalRevenue: number;
  month: string;
  year: number;
}

const revenueData: Revenue[] = [
  {
    id: 1,
    farmName: "Green Valley Farm",
    region: "California",
    cropRevenue: 125000,
    livestockRevenue: 45000,
    otherRevenue: 15000,
    totalRevenue: 185000,
    month: "June",
    year: 2023,
  },
  {
    id: 2,
    farmName: "Sunrise Acres",
    region: "Iowa",
    cropRevenue: 95000,
    livestockRevenue: 30000,
    otherRevenue: 8000,
    totalRevenue: 133000,
    month: "June",
    year: 2023,
  },
  {
    id: 3,
    farmName: "Williams Organic",
    region: "Oregon",
    cropRevenue: 78000,
    livestockRevenue: 0,
    otherRevenue: 12000,
    totalRevenue: 90000,
    month: "June",
    year: 2023,
  },
  {
    id: 4,
    farmName: "Johnson Ranch",
    region: "Texas",
    cropRevenue: 65000,
    livestockRevenue: 120000,
    otherRevenue: 18000,
    totalRevenue: 203000,
    month: "June",
    year: 2023,
  },
  {
    id: 5,
    farmName: "Brown's Ranch",
    region: "Montana",
    cropRevenue: 55000,
    livestockRevenue: 95000,
    otherRevenue: 10000,
    totalRevenue: 160000,
    month: "June",
    year: 2023,
  },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = [2023, 2022, 2021, 2020, 2019];

const AdminRevenue = () => {
  const [revenues, setRevenues] = useState(revenueData);
  const [sortBy, setSortBy] = useState("totalRevenue");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [month, setMonth] = useState("June");
  const [year, setYear] = useState(2023);
  
  const sortRevenues = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }

    setRevenues([...revenues].sort((a: any, b: any) => {
      const aValue = a[field];
      const bValue = b[field];
      
      if (typeof aValue === "string") {
        return sortOrder === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
    }));
  };

  const totalCropRevenue = revenues.reduce((sum, r) => sum + r.cropRevenue, 0);
  const totalLivestockRevenue = revenues.reduce((sum, r) => sum + r.livestockRevenue, 0);
  const totalOtherRevenue = revenues.reduce((sum, r) => sum + r.otherRevenue, 0);
  const totalSystemRevenue = revenues.reduce((sum, r) => sum + r.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Revenue Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-farm-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSystemRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All farms - {month} {year}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Crop Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-farm-forest" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCropRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalCropRevenue / totalSystemRevenue) * 100).toFixed(1)}% of total revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livestock Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-farm-brown" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLivestockRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalLivestockRevenue / totalSystemRevenue) * 100).toFixed(1)}% of total revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Other Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOtherRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalOtherRevenue / totalSystemRevenue) * 100).toFixed(1)}% of total revenue</p>
          </CardContent>
        </Card>
      </div>

      <RevenueTrends />

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Detailed revenue by farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Month:</span>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Year:</span>
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("farmName")}>
                    Farm <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("region")}>
                    Region <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("cropRevenue")}>
                    Crop Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("livestockRevenue")}>
                    Livestock Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("otherRevenue")}>
                    Other Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => sortRevenues("totalRevenue")}>
                    Total Revenue <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenues.map((revenue) => (
                <TableRow key={revenue.id}>
                  <TableCell className="font-medium">{revenue.farmName}</TableCell>
                  <TableCell>{revenue.region}</TableCell>
                  <TableCell>${revenue.cropRevenue.toLocaleString()}</TableCell>
                  <TableCell>${revenue.livestockRevenue.toLocaleString()}</TableCell>
                  <TableCell>${revenue.otherRevenue.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${revenue.totalRevenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenue;
