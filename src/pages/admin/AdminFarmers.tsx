
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Search, UserCheck, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const farmerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  farmName: z.string().min(2, { message: "Farm name must be at least 2 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  farmType: z.string().min(2, { message: "Farm type must be at least 2 characters" }),
  approved: z.boolean().default(true),
});

type FarmerFormValues = z.infer<typeof farmerSchema>;

interface Farmer {
  id: number;
  name: string;
  email: string;
  farmName: string;
  location: string;
  farmType: string;
  registrationDate: string;
  status: "active" | "pending" | "inactive";
  productionVolume: number;
  lastLoginDate: string;
}

const AdminFarmers = () => {
  const { toast } = useToast();
  const [farmers, setFarmers] = useState<Farmer[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      farmName: "Green Valley Farm",
      location: "California",
      farmType: "Mixed (Crops & Livestock)",
      registrationDate: "2023-01-15",
      status: "active",
      productionVolume: 450,
      lastLoginDate: "2023-06-20",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      farmName: "Sunrise Acres",
      location: "Iowa",
      farmType: "Crops",
      registrationDate: "2023-02-10",
      status: "active",
      productionVolume: 320,
      lastLoginDate: "2023-06-18",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      farmName: "Johnson Family Farm",
      location: "Texas",
      farmType: "Livestock",
      registrationDate: "2023-03-05",
      status: "pending",
      productionVolume: 0,
      lastLoginDate: "",
    },
    {
      id: 4,
      name: "Sarah Williams",
      email: "sarah@example.com",
      farmName: "Williams Organic",
      location: "Oregon",
      farmType: "Organic Crops",
      registrationDate: "2023-02-28",
      status: "active",
      productionVolume: 280,
      lastLoginDate: "2023-06-15",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael@example.com",
      farmName: "Brown's Ranch",
      location: "Montana",
      farmType: "Livestock",
      registrationDate: "2023-01-20",
      status: "inactive",
      productionVolume: 180,
      lastLoginDate: "2023-05-10",
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "pending" | "inactive">("all");

  const form = useForm<FarmerFormValues>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      name: "",
      email: "",
      farmName: "",
      location: "",
      farmType: "",
      approved: true,
    },
  });

  const onSubmit = (data: FarmerFormValues) => {
    const newFarmer: Farmer = {
      id: farmers.length + 1,
      name: data.name,
      email: data.email,
      farmName: data.farmName,
      location: data.location,
      farmType: data.farmType,
      registrationDate: new Date().toISOString().split('T')[0],
      status: data.approved ? "active" : "pending",
      productionVolume: 0,
      lastLoginDate: data.approved ? new Date().toISOString().split('T')[0] : "",
    };
    
    setFarmers([...farmers, newFarmer]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Farmer added",
      description: `${data.name} has been added to the system.`,
    });
  };

  const approveFarmer = (id: number) => {
    setFarmers(
      farmers.map(farmer => 
        farmer.id === id 
          ? { ...farmer, status: "active", lastLoginDate: new Date().toISOString().split('T')[0] } 
          : farmer
      )
    );
    
    toast({
      title: "Farmer approved",
      description: "Farmer has been approved and can now access the system.",
    });
  };

  const deactivateFarmer = (id: number) => {
    setFarmers(
      farmers.map(farmer => 
        farmer.id === id 
          ? { ...farmer, status: "inactive" } 
          : farmer
      )
    );
    
    toast({
      title: "Farmer deactivated",
      description: "Farmer has been deactivated from the system.",
    });
  };

  const filteredFarmers = farmers
    .filter(farmer => 
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(farmer => filterStatus === "all" ? true : farmer.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Farmers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Farmer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Farmer</DialogTitle>
              <DialogDescription>
                Enter the details of the new farmer.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="farmer@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Green Acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Crops, Livestock, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="approved"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Approve immediately
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Farmer</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farmers</CardTitle>
          <CardDescription>View and manage all registered farmers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farmers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Farm</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No farmers found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{farmer.name}</p>
                          <p className="text-xs text-muted-foreground">{farmer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{farmer.farmName}</TableCell>
                      <TableCell>{farmer.location}</TableCell>
                      <TableCell>{farmer.farmType}</TableCell>
                      <TableCell>{new Date(farmer.registrationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          farmer.status === 'active' ? 'bg-farm-green/10 text-farm-green' : 
                          farmer.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {farmer.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => approveFarmer(farmer.id)}
                              className="h-8 text-farm-green"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {farmer.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deactivateFarmer(farmer.id)}
                              className="h-8 text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Deactivate
                            </Button>
                          )}
                          {farmer.status === 'inactive' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => approveFarmer(farmer.id)}
                              className="h-8 text-farm-green"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Reactivate
                            </Button>
                          )}
                        </div>
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

export default AdminFarmers;
