import { Plus, Beef, RefreshCcw, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";

interface Farm {
  id: number;
  name: string;
  location: string;
  size: number;
  type: string;
}

interface Livestock {
  id: number;
  type: string;
  count: number;
  status: "healthy" | "attention" | "critical";
  description: string;
  farmId: number;
}

const livestockSchema = z.object({
  type: z.string().min(2, { message: "Type must be at least 2 characters" }),
  count: z.coerce.number().min(1, { message: "Count must be at least 1" }),
  status: z.enum(["healthy", "attention", "critical"]),
  description: z.string().optional(),
});

type LivestockFormValues = z.infer<typeof livestockSchema>;

const FarmerLivestock = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
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
  }, [navigate, toast]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
    defaultValues: {
      type: "",
      count: 0,
      status: "healthy",
      description: "",
    },
  });

  const fetchFarms = async () => {
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

      const response = await fetch("http://localhost:8080/api/farms/my-farms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch farms");
      }

      const data = await response.json();
      setFarms(data);
      
      if (data.length === 1) {
        setSelectedFarmId(data[0].id);
      }
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to fetch farms",
          variant: "destructive",
        });
      }
    }
  };

  const fetchLivestock = async () => {
    if (!selectedFarmId) {
      setLivestock([]);
      setIsLoading(false);
      return;
    }

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

      const response = await fetch(`http://localhost:8080/api/livestock/${selectedFarmId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch livestock");
      }

      const data = await response.json();
      setLivestock(data || []);
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to fetch livestock",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  useEffect(() => {
    fetchLivestock();
  }, [selectedFarmId]);

  const onSubmit = async (data: LivestockFormValues) => {
    if (!selectedFarmId) {
      toast({
        title: "Error",
        description: "Please select a farm first",
        variant: "destructive",
      });
      return;
    }

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

      const response = await fetch(`http://localhost:8080/api/livestock/create/${selectedFarmId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: data.type,
          count: data.count,
          status: data.status,
          description: data.description || "",
          farmId: selectedFarmId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add livestock");
      }

      const newLivestock = await response.json();
      setLivestock([...livestock, newLivestock]);
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Success",
        description: `${data.count} ${data.type} has been added to your livestock.`,
      });

      // Refresh the livestock list
      fetchLivestock();
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to add livestock",
          variant: "destructive",
        });
      }
    }
  };

  const deleteLivestock = async (id: number) => {
    if (!selectedFarmId) return;

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

      const response = await fetch(`http://localhost:8080/api/livestock/${selectedFarmId}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete livestock");
      }

      setLivestock(livestock.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Livestock deleted successfully",
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
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
          <Select
            value={selectedFarmId?.toString() || ""}
            onValueChange={(value) => setSelectedFarmId(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a farm" />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id.toString()}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchLivestock}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedFarmId}>
                <Plus className="mr-2 h-4 w-4" />
                Add Livestock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Livestock</DialogTitle>
                <DialogDescription>
                  Enter the details of your livestock for {farms.find(f => f.id === selectedFarmId)?.name || 'selected farm'}.
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
                          <Input placeholder="e.g., Cattle, Chickens, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Count</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
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
                        <FormLabel>Health Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthy">Healthy</SelectItem>
                            <SelectItem value="attention">Needs Attention</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional information" {...field} />
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

      {!selectedFarmId ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a farm to view and manage livestock.</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
        </div>
      ) : livestock.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No livestock found. Add your first animals to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Livestock Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Livestock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {livestock.reduce((sum, item) => sum + item.count, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Healthy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {livestock
                    .filter(item => item.status === "HEALTHY")
                    .reduce((sum, item) => sum + item.count, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Need Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {livestock
                    .filter(item => item.status === "attention" || item.status === "critical")
                    .reduce((sum, item) => sum + item.count, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {livestock.map((item) => (
              <Card key={item.id}>
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
                        onClick={() => deleteLivestock(item.id)}
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
                    <LivestockStatus 
                      type={item.type} 
                      count={item.count} 
                      healthStatus={item.status} 
                    />
                    {item.description && (
                      <div className="text-sm">
                        <p className="font-medium">Notes:</p>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerLivestock;
