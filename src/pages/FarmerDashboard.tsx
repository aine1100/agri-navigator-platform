import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, TrendingUp, TrendingDown, CircleDollarSign, Beef, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";

interface Livestock {
  livestockId: number;
  type: string;
  count: number;
  description: string;
  breed: string;
  birthDate: string;
  price: number;
  quantity: number;
  weight: number;
  status: "HEALTHY" | "ATTENTION" | "CRITICAL";
  imageUrls: string;
}

interface LivestockStats {
  totalLivestock: number;
  totalValue: number;
  soldItems: number;
  availableItems: number;
}

interface Farmer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: string;
}

const livestockSchema = z.object({
  type: z.string().min(1, "Type is required"),
  breeds: z.string().min(1, "Breed is required"),
  count: z.number().min(1, "Count must be positive"),
  description: z.string().min(1, "Description is required"),
  weight: z.number().min(0, "Weight must be positive"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(1, "Quantity must be positive"),
  image: z.instanceof(File).optional(),
});

type LivestockFormValues = z.infer<typeof livestockSchema>;

const FarmerDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [stats, setStats] = useState<LivestockStats>({
    totalLivestock: 0,
    totalValue: 0,
    soldItems: 0,
    availableItems: 0,
  });
  const [isLivestockDialogOpen, setIsLivestockDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      type: "",
      breeds: "",
      count: 0,
      description: "",
      weight: 0,
      price: 0,
      quantity: 0,
    },
  });

  const extractFarmerFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode<Farmer>(token);
      setFarmer(decodedToken);
    } catch (error) {
      console.error("Error decoding token:", error);
      toast({
        title: "Error",
        description: "Failed to load user information",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLivestock();
    extractFarmerFromToken();
  }, []);

  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/livestock/v2/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setLivestock([]);
          calculateStats([]);
          return;
        }
        throw new Error("Failed to fetch livestock");
      }

      const data = await response.json();
      setLivestock(data || []);
      calculateStats(data || []);
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
        toast({
          title: "Error",
          description: "Failed to fetch livestock data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (livestock: Livestock[]) => {
    const stats = {
      totalLivestock: livestock.length,
      totalValue: livestock.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      soldItems: livestock.reduce((sum, item) => sum + (item.count - item.quantity), 0),
      availableItems: livestock.reduce((sum, item) => sum + item.quantity, 0),
    };
    setStats(stats);
  };

  const onSubmit = async (data: LivestockFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("breeds", data.breeds);
      formData.append("count", data.count.toString());
      formData.append("description", data.description);
      formData.append("weight", data.weight.toString());
      formData.append("price", data.price.toString());
      formData.append("quantity", data.quantity.toString());
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch("http://localhost:8080/api/livestock/v2/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add livestock");
      }

      setIsLivestockDialogOpen(false);
      form.reset();
      fetchLivestock();
      
      toast({
        title: "Success",
        description: "Livestock added successfully",
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
        toast({
          title: "Error",
          description: "Failed to add livestock",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-forest"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {farmer?.firstName || 'Farmer'} {farmer?.lastName || ''}
          </h1>
          <p className="text-muted-foreground">
            Manage your livestock inventory and sales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLivestock}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog open={isLivestockDialogOpen} onOpenChange={setIsLivestockDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-farm-forest hover:bg-farm-forest/90">
                <Plus className="h-4 w-4 mr-2" /> Add Livestock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Livestock</DialogTitle>
                <DialogDescription>
                  Enter the details of your new livestock.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cattle, Pigs" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breeds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Angus, Yorkshire" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Count</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Describe your livestock..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Livestock</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLivestock}</div>
            <p className="text-xs text-muted-foreground">Total livestock items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soldItems}</div>
            <p className="text-xs text-muted-foreground">Total items sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableItems}</div>
            <p className="text-xs text-muted-foreground">Items in stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Livestock List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Livestock</CardTitle>
          <Button 
            variant="ghost" 
            className="text-farm-forest hover:text-farm-forest/90"
            onClick={() => navigate("/farmer/livestock")}
          >
            See All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {livestock.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <Beef className="h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">No livestock found</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't added any livestock yet. Click the "Add Livestock" button to get started.
                </p>
                <Button 
                  className="mt-4 bg-farm-forest hover:bg-farm-forest/90"
                  onClick={() => setIsLivestockDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Livestock
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {livestock.slice(0, 3).map((item) => (
                <Card key={item.livestockId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.type}</span>
                      <span className={`text-sm font-medium ${
                        item.status === "HEALTHY" ? "text-green-500" :
                        item.status === "ATTENTION" ? "text-yellow-500" :
                        "text-red-500"
                      }`}>
                        {item.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Breed:</span>
                        <span>{item.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Count:</span>
                        <span>{item.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span>{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price:</span>
                        <span>${item.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span>{item.weight} kg</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                      {item.imageUrls && (
                        <img
                          src={item.imageUrls.startsWith('http') ? item.imageUrls : `http://localhost:8080${item.imageUrls}`}
                          alt={item.type}
                          className="w-full h-48 object-cover rounded-md mt-2"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
