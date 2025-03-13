
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpDown, Download, Plus, Search, Wheat } from "lucide-react";

interface Crop {
  id: number;
  name: string;
  category: string;
  farmCount: number;
  totalArea: number;
  estimatedYield: number;
  projectedRevenue: number;
  status: "active" | "planning" | "harvested";
}

const cropSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  category: z.string().min(2, { message: "Category must be at least 2 characters" }),
  estimatedYield: z.string().transform(val => parseFloat(val)),
  status: z.enum(["active", "planning", "harvested"]),
});

const AdminCrops = () => {
  const { toast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([
    {
      id: 1,
      name: "Wheat",
      category: "Cereal",
      farmCount: 45,
      totalArea: 1250,
      estimatedYield: 6250,
      projectedRevenue: 625000,
      status: "active"
    },
    {
      id: 2,
      name: "Corn",
      category: "Cereal",
      farmCount: 38,
      totalArea: 980,
      estimatedYield: 7840,
      projectedRevenue: 470400,
      status: "active"
    },
    {
      id: 3,
      name: "Soybeans",
      category: "Legume",
      farmCount: 27,
      totalArea: 750,
      estimatedYield: 2250,
      projectedRevenue: 315000,
      status: "planning"
    },
    {
      id: 4,
      name: "Rice",
      category: "Cereal",
      farmCount: 15,
      totalArea: 420,
      estimatedYield: 2100,
      projectedRevenue: 210000,
      status: "active"
    },
    {
      id: 5,
      name: "Barley",
      category: "Cereal",
      farmCount: 20,
      totalArea: 380,
      estimatedYield: 1520,
      projectedRevenue: 106400,
      status: "harvested"
    },
    {
      id: 6,
      name: "Cotton",
      category: "Fiber",
      farmCount: 12,
      totalArea: 300,
      estimatedYield: 450,
      projectedRevenue: 180000,
      status: "planning"
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Crop>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const form = useForm({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: "",
      category: "",
      estimatedYield: "",
      status: "planning",
    },
  });

  const onSubmit = (data: any) => {
    const newCrop: Crop = {
      id: crops.length + 1,
      name: data.name,
      category: data.category,
      farmCount: 1,
      totalArea: 50,
      estimatedYield: data.estimatedYield,
      projectedRevenue: data.estimatedYield * 100,
      status: data.status,
    };
    
    setCrops([...crops, newCrop]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Crop added",
      description: `${data.name} has been added to the crop database.`,
    });
  };

  const handleSort = (column: keyof Crop) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredCrops = crops
    .filter(crop => 
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "all" || crop.status === statusFilter)
    )
    .sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === "asc" 
          ? Number(valueA) - Number(valueB) 
          : Number(valueB) - Number(valueA);
      }
    });

  const totalFarms = crops.reduce((sum, crop) => sum + crop.farmCount, 0);
  const totalArea = crops.reduce((sum, crop) => sum + crop.totalArea, 0);
  const totalYield = crops.reduce((sum, crop) => sum + crop.estimatedYield, 0);
  const totalRevenue = crops.reduce((sum, crop) => sum + crop.projectedRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crop Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Crop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Crop</DialogTitle>
              <DialogDescription>
                Enter the details of the new crop to monitor
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wheat, Corn, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cereal, Legume, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedYield"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Yield (tons)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="harvested">Harvested</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Crop</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalFarms}</div>
            <p className="text-xs text-muted-foreground">Farms growing registered crops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalArea.toLocaleString()} acres</div>
            <p className="text-xs text-muted-foreground">Land dedicated to crops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Est. Yield</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalYield.toLocaleString()} tons</div>
            <p className="text-xs text-muted-foreground">Projected harvest volume</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated market value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crop Database</CardTitle>
          <CardDescription>
            Manage and analyze all registered crops in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="harvested">Harvested</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    <div className="flex items-center">
                      Crop Name
                      {sortColumn === "name" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                    <div className="flex items-center">
                      Category
                      {sortColumn === "category" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("farmCount")} className="cursor-pointer text-right">
                    <div className="flex items-center justify-end">
                      Farms
                      {sortColumn === "farmCount" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("totalArea")} className="cursor-pointer text-right">
                    <div className="flex items-center justify-end">
                      Area (acres)
                      {sortColumn === "totalArea" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("estimatedYield")} className="cursor-pointer text-right">
                    <div className="flex items-center justify-end">
                      Est. Yield (tons)
                      {sortColumn === "estimatedYield" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("projectedRevenue")} className="cursor-pointer text-right">
                    <div className="flex items-center justify-end">
                      Revenue ($)
                      {sortColumn === "projectedRevenue" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("status")} className="cursor-pointer text-right">
                    <div className="flex items-center justify-end">
                      Status
                      {sortColumn === "status" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No crops found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCrops.map((crop) => (
                    <TableRow key={crop.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Wheat className="mr-2 h-4 w-4 text-farm-forest" />
                          {crop.name}
                        </div>
                      </TableCell>
                      <TableCell>{crop.category}</TableCell>
                      <TableCell className="text-right">{crop.farmCount}</TableCell>
                      <TableCell className="text-right">{crop.totalArea.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{crop.estimatedYield.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${crop.projectedRevenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          crop.status === 'active' ? 'bg-farm-green/20 text-farm-green' :
                          crop.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCrops;
