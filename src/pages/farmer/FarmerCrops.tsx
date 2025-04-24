import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";

interface Crop {
  id: number;
  cropName: string;
  farmDate: string;
  harvestDate: string;
  farmId: number;
}

interface CropStats {
  totalCrops: number;
  cropsReadyForHarvest: number;
  cropsInProgress: number;
}

interface Farm {
  id: number;
  name: string;
  location: string;
  size: number;
  type: string;
}

const cropSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
});

const FarmerCrops = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [cropStats, setCropStats] = useState<CropStats>({
    totalCrops: 0,
    cropsReadyForHarvest: 0,
    cropsInProgress: 0,
  });
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);

  const cropForm = useForm<z.infer<typeof cropSchema>>({
    resolver: zodResolver(cropSchema),
    defaultValues: { 
      cropName: "", 
      harvestDate: "" 
    },
  });

  const calculateDaysToHarvest = (harvestDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const harvest = new Date(harvestDate);
    harvest.setHours(0, 0, 0, 0);
    const diffTime = harvest.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateCropStats = (crops: Crop[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      totalCrops: crops.length,
      cropsReadyForHarvest: 0,
      cropsInProgress: 0,
    };

    crops.forEach(crop => {
      const harvestDate = new Date(crop.harvestDate);
      harvestDate.setHours(0, 0, 0, 0);
      
      if (harvestDate <= today) {
        stats.cropsReadyForHarvest++;
      } else {
        stats.cropsInProgress++;
      }
    });

    return stats;
  };

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

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchCrops = async () => {
    if (!selectedFarmId) {
      setCrops([]);
      setCropStats({
        totalCrops: 0,
        cropsReadyForHarvest: 0,
        cropsInProgress: 0,
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

      const response = await fetch(`http://localhost:8080/api/crops/all?farmId=${selectedFarmId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }

      const data = await response.json();
      setCrops(data);
      setCropStats(calculateCropStats(data));
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to fetch crops",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchCrops();
  }, [selectedFarmId]);

  const onCropSubmit = async (data: z.infer<typeof cropSchema>) => {
    try {
      if (!selectedFarmId) {
        toast({
          title: "Error",
          description: "Please select a farm first",
          variant: "destructive",
        });
        return;
      }

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

      const harvestDate = new Date(data.harvestDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      harvestDate.setHours(0, 0, 0, 0);

      if (harvestDate <= today) {
        toast({
          title: "Error",
          description: "Harvest date must be in the future",
          variant: "destructive",
        });
        return;
      }

      const formattedHarvestDate = data.harvestDate;
      const formattedFarmDate = new Date().toISOString().split('T')[0];

      const response = await fetch(`http://localhost:8080/api/crops/create?farmId=${selectedFarmId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName: data.cropName,
          harvestDate: formattedHarvestDate,
          farmDate: formattedFarmDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create crop");
      }

      const newCrop = await response.json();
      const cropWithFormattedDates = {
        ...newCrop,
        harvestDate: formattedHarvestDate,
        farmDate: formattedFarmDate
      };
      
      setCrops(prevCrops => [...prevCrops, cropWithFormattedDates]);
      setCropStats(prevStats => calculateCropStats([...crops, cropWithFormattedDates]));
      setIsCropDialogOpen(false);
      cropForm.reset();
      
      toast({
        title: "Success",
        description: "Crop added successfully",
      });

      fetchCrops();
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        console.error("Error creating crop:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add crop",
          variant: "destructive",
        });
      }
    }
  };

  const deleteCrop = async (cropId: number) => {
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

      const response = await fetch(`http://localhost:8080/api/crops/delete/${selectedFarmId}/${cropId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete crop");
      }

      const updatedCrops = crops.filter(crop => crop.id !== cropId);
      setCrops(updatedCrops);
      setCropStats(calculateCropStats(updatedCrops));
      toast({
        title: "Success",
        description: "Crop deleted successfully",
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to delete crop",
          variant: "destructive",
        });
      }
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Crop Management</h1>
          <p className="text-muted-foreground">
            Manage your crops and track their progress.
          </p>
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
          <Button variant="outline" size="sm" className="hidden md:flex gap-1" onClick={fetchCrops}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex gap-1 bg-farm-forest hover:bg-farm-forest/90"
                disabled={!selectedFarmId}
              >
                <Plus className="h-4 w-4" /> Add Crop
              </Button>
            </DialogTrigger>
            <DialogContent className="z-[1000]">
              <DialogHeader>
                <DialogTitle>Add New Crop</DialogTitle>
                <DialogDescription>
                  Enter the details of your new crop for {farms.find(f => f.id === selectedFarmId)?.name || 'selected farm'}.
                </DialogDescription>
              </DialogHeader>
              <Form {...cropForm}>
                <form onSubmit={cropForm.handleSubmit(onCropSubmit)} className="space-y-4">
                  <FormField
                    control={cropForm.control}
                    name="cropName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Wheat, Corn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={cropForm.control}
                    name="harvestDate"
                    render={({ field }) => {
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      const minDate = tomorrow.toISOString().split('T')[0];
                      
                      return (
                        <FormItem>
                          <FormLabel>Expected Harvest Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              min={minDate}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Crop</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!selectedFarmId ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please select a farm to view and manage crops.</p>
        </div>
      ) : (
        <>
          {/* Crop Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cropStats.totalCrops}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ready for Harvest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{cropStats.cropsReadyForHarvest}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{cropStats.cropsInProgress}</div>
              </CardContent>
            </Card>
          </div>

          {/* Crop List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((crop) => {
              const daysToHarvest = calculateDaysToHarvest(crop.harvestDate);
              const isReadyForHarvest = daysToHarvest <= 0;
              
              return (
                <Card key={crop.id}>
                  <CardHeader>
                    <CardTitle>{crop.cropName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>Planted: {new Date(crop.farmDate).toLocaleDateString()}</p>
                      <p>Harvest: {new Date(crop.harvestDate).toLocaleDateString()}</p>
                      <p className={`font-medium ${isReadyForHarvest ? 'text-green-600' : 'text-blue-600'}`}>
                        {isReadyForHarvest 
                          ? "Ready for Harvest" 
                          : `${daysToHarvest} days until harvest`}
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => deleteCrop(crop.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default FarmerCrops;