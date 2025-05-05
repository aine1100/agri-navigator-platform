import { Plus, Beef, RefreshCcw, Trash2, Edit, CircleDollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LivestockStatus from "@/components/farmer/LivestockStatus";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";

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
  totalBreeds: number;
  averageWeight: number;
  totalInvestment: number;
  healthStatus: {
    healthy: number;
    attention: number;
    critical: number;
  };
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

const FarmerLivestock = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLivestockId, setEditingLivestockId] = useState<number | null>(null);
  const [stats, setStats] = useState<LivestockStats>({
    totalBreeds: 0,
    averageWeight: 0,
    totalInvestment: 0,
    healthStatus: {
      healthy: 0,
      attention: 0,
      critical: 0,
    },
  });

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

  const calculateStats = (livestock: Livestock[]) => {
    const uniqueBreeds = new Set(livestock.map(item => item.breed));
    const totalWeight = livestock.reduce((sum, item) => sum + item.weight, 0);
    const totalInvestment = livestock.reduce((sum, item) => sum + (item.price * item.count), 0);
    
    const healthCounts = livestock.reduce((acc, item) => {
      acc[item.status.toLowerCase() as keyof typeof acc]++;
      return acc;
    }, { healthy: 0, attention: 0, critical: 0 });

    setStats({
      totalBreeds: uniqueBreeds.size,
      averageWeight: livestock.length ? totalWeight / livestock.length : 0,
      totalInvestment,
      healthStatus: healthCounts,
    });
  };

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
      // if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to fetch livestock",
      //     variant: "destructive",
      //   });
      // }
      if(!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })){
        console.log("Failed to fetch livestock")
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, []);

  const handleEdit = (livestockId: number) => {
    const livestockToEdit = livestock.find((item) => item.livestockId === livestockId);
    if (livestockToEdit) {
      form.reset({
        type: livestockToEdit.type,
        breeds: livestockToEdit.breed,
        count: livestockToEdit.count,
        description: livestockToEdit.description,
        weight: livestockToEdit.weight,
        price: livestockToEdit.price,
        quantity: livestockToEdit.quantity,
      });
      setEditingLivestockId(livestockId);
      setIsDialogOpen(true);
    }
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

      const url = editingLivestockId
        ? `http://localhost:8080/api/livestock/v2/${editingLivestockId}`
        : "http://localhost:8080/api/livestock/v2/add";
      
      const method = editingLivestockId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(editingLivestockId ? "Failed to update livestock" : "Failed to add livestock");
      }

      setIsDialogOpen(false);
      setEditingLivestockId(null);
      form.reset();
      fetchLivestock();
      
      toast({
        title: "Success",
        description: editingLivestockId ? "Livestock updated successfully" : "Livestock added successfully",
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
        toast({
          title: "Error",
          description: editingLivestockId ? "Failed to update livestock" : "Failed to add livestock",
          variant: "destructive",
        });
      }
    }
  };

  const deleteLivestock = async (id: number) => {
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

      const response = await fetch(`http://localhost:8080/api/livestock/v2/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete livestock");
      }

      setLivestock(livestock.filter(item => item.livestockId !== id));
      toast({
        title: "Success",
        description: "Livestock deleted successfully",
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
        toast({
          title: "Error",
          description: "Failed to delete livestock",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Livestock</h1>
          <p className="text-muted-foreground">Manage your farm's livestock</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchLivestock}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingLivestockId(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Livestock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLivestockId ? "Update Livestock" : "Add New Livestock"}</DialogTitle>
                <DialogDescription>
                  {editingLivestockId ? "Update the details of your livestock." : "Enter the details of your livestock."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Livestock Type</FormLabel>
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
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                      {editingLivestockId ? "Update Livestock" : "Add Livestock"}
                    </Button>
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
            <CardTitle className="text-sm font-medium">Total Breeds</CardTitle>
            <Beef className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBreeds}</div>
            <p className="text-xs text-muted-foreground">Unique breeds in your farm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">Average weight per livestock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalInvestment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total value of livestock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-500">Healthy:</span>
                <span className="font-medium">{stats.healthStatus.healthy}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-500">Attention:</span>
                <span className="font-medium">{stats.healthStatus.attention}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-500">Critical:</span>
                <span className="font-medium">{stats.healthStatus.critical}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
        </div>
      ) : livestock.length === 0 ? (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Beef className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">No livestock found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't added any livestock yet. Click the "Add Livestock" button to get started.
            </p>
            <Button 
              className="mt-4 bg-farm-forest hover:bg-farm-forest/90"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Livestock
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livestock.map((item) => (
            <Card key={item.livestockId}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.type}</CardTitle>
                    <CardDescription>Count: {item.count}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(item.livestockId)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteLivestock(item.livestockId)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <div className="bg-farm-forest/10 w-8 h-8 flex items-center justify-center rounded-full">
                      <Beef className="h-4 w-4 text-farm-forest" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breed:</span>
                    <span>{item.breed}</span>
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
    </div>
  );
};

export default FarmerLivestock;
