import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, CloudRain, Droplets, Sun, Wind, AlertTriangle, Thermometer, Umbrella, Info, Trash2, Edit2 } from "lucide-react";
import CropProgress from "@/components/farmer/CropProgress";
import LivestockStatus from "@/components/farmer/LivestockStatus";
import WeatherWidget from "@/components/farmer/WeatherWidget";
import FinancialSummary from "@/components/farmer/FinancialSummary";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const farmDataSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  size: z.number().min(0, "Size must be positive"),
  location: z.string().min(1, "location type is required"),
  type: z.string().min(1, "farm type is required"),
});

interface Crop {
  id: number;
  cropName: string;
  farmDate: string;
  harvestDate: string;
  farmId: number;
}

const cropSchema = z.object({
  cropName: z.string().min(1, "Crop name is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  farmId: z.number().min(1, "Farm ID is required"),
});

const livestockSchema = z.object({
  type: z.string().min(1, "Animal type is required"),
  count: z.number().min(1, "Count must be positive"),
  healthStatus: z.enum(["healthy", "attention", "critical"]),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
});

const transactionSchema = z.object({
  amount: z.number().min(0, "Amount must be positive"),
  type: z.enum(["income", "expense"]),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
});

type FarmDataFormValues = z.infer<typeof farmDataSchema>;
type CropFormValues = z.infer<typeof cropSchema>;
type LivestockFormValues = z.infer<typeof livestockSchema>;
type TransactionFormValues = z.infer<typeof transactionSchema>;

interface Farmer {
  id: number;
  name: string;
  email: string;
  // Add other farmer properties as needed
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherAlert {
  type: 'temperature' | 'rain' | 'wind' | 'humidity';
  severity: 'warning' | 'danger';
  message: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  threshold: number;
}

interface Farm {
  id: number;
  name: string;
  location: string;
  size: number;
  type: string;
  ownerEmail: string;
}

interface Livestock {
  id: number;
  type: string;
  count: number;
  healthStatus: "healthy" | "attention" | "critical";
  acquisitionDate: string;
  farmId: number;
}

interface Transaction {
  id: number;
  amount: number;
  type: "income" | "expense";
  description: string;
  date: string;
  farmId: number;
}

interface FarmFormData {
  name: string;
  location: string;
  size: number;
  type: string;
}

const getWeatherIcon = (condition: string) => {
  const condition_lower = condition.toLowerCase();
  if (condition_lower.includes('rain')) {
    return <CloudRain className="h-8 w-8 text-blue-500" />;
  } else if (condition_lower.includes('cloud')) {
    return <CloudRain className="h-8 w-8 text-gray-500" />;
  } else {
    return <Sun className="h-8 w-8 text-yellow-500" />;
  }
};

const FarmerDashboard = () => {
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

  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFarmDataDialogOpen, setIsFarmDataDialogOpen] = useState(false);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [isLivestockDialogOpen, setIsLivestockDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isFarmsLoading, setIsFarmsLoading] = useState(true);
  const [isFarmDialogOpen, setIsFarmDialogOpen] = useState(false);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [isCropsLoading, setIsCropsLoading] = useState(true);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [isLivestockLoading, setIsLivestockLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [overviewCrops, setOverviewCrops] = useState<Crop[]>([]);
  const [isOverviewCropsLoading, setIsOverviewCropsLoading] = useState(true);
  const [cropStats, setCropStats] = useState({
    totalCrops: 0,
    readyForHarvest: 0,
    inProgress: 0
  });

  const farmDataForm = useForm<FarmDataFormValues>({
    resolver: zodResolver(farmDataSchema),
    defaultValues: { name: "", size: 0, location: "",type:"" },
  });

  const cropForm = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: { 
      cropName: "", 
      harvestDate: "", 
      farmId: 0
    },
  });

  const livestockForm = useForm<LivestockFormValues>({
    resolver: zodResolver(livestockSchema),
    defaultValues: { type: "", count: 0, healthStatus: "healthy", acquisitionDate: "" },
  });

  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { amount: 0, type: "income", description: "", date: "" },
  });

  const farmForm = useForm({
    defaultValues: {
      name: "",
      location: "",
      size: 0,
      type: "",
    },
  });

  const calculateProgress = (farmDate: string, harvestDate: string) => {
    const start = new Date(farmDate).getTime();
    const end = new Date(harvestDate).getTime();
    const current = new Date().getTime();
    
    const totalDuration = end - start;
    const elapsed = current - start;
    
    const progress = (elapsed / totalDuration) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  };

  const fetchOverviewCrops = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/crops/all?farmId=${farmId}", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch overview crops");
      }

      const data = await response.json();
      setOverviewCrops(data);
    } catch (error) {
      console.error("Error fetching overview crops:", error);
      toast({
        title: "Error",
        description: "Failed to load crop overview data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOverviewCropsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewCrops();
  }, []);

  useEffect(() => {
    const fetchFarmerData = async () => {
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

        const response = await fetch("http://localhost:8080/api/auth/farmer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch farmer data");
        }

        const farmerData = await response.json();
        setFarmer(farmerData);
      } catch (error) {
        if (!handleTokenExpiration(error, navigate, toast)) {
          toast({
            title: "Error",
            description: "Failed to fetch farmer data",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmerData();
  }, [toast]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:8080/api/weather?location=Kigali", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const rawData = await response.text();
        const parsedData = JSON.parse(rawData);
        
        const transformedData: WeatherData = {
          temperature: parsedData.main.temp,
          condition: parsedData.weather[0].main,
          humidity: parsedData.main.humidity,
          windSpeed: parsedData.wind.speed,
        };
        
        setWeatherData(transformedData);
        
        // Generate alerts based on weather conditions
        const newAlerts: WeatherAlert[] = [];
        
        // Temperature alerts
        if (transformedData.temperature > 30) {
          newAlerts.push({
            type: 'temperature',
            severity: 'warning',
            message: 'High temperature alert: Consider additional irrigation',
            icon: <Thermometer className="h-5 w-5 text-orange-500" />,
            value: transformedData.temperature,
            unit: '°C',
            threshold: 30
          });
        } else if (transformedData.temperature < 10) {
          newAlerts.push({
            type: 'temperature',
            severity: 'warning',
            message: 'Low temperature alert: Protect sensitive crops',
            icon: <Thermometer className="h-5 w-5 text-blue-500" />,
            value: transformedData.temperature,
            unit: '°C',
            threshold: 10
          });
        }
        
        // Rain alerts
        if (transformedData.condition.toLowerCase().includes('rain')) {
          newAlerts.push({
            type: 'rain',
            severity: 'warning',
            message: 'Rain alert: Check drainage systems',
            icon: <Umbrella className="h-5 w-5 text-blue-500" />,
            value: 100,
            unit: '%',
            threshold: 0
          });
        }
        
        // Wind alerts
        if (transformedData.windSpeed > 10) {
          newAlerts.push({
            type: 'wind',
            severity: 'warning',
            message: 'High wind alert: Secure equipment and structures',
            icon: <Wind className="h-5 w-5 text-yellow-500" />,
            value: transformedData.windSpeed * 3.6,
            unit: 'km/h',
            threshold: 36
          });
        }
        
        // Humidity alerts
        if (transformedData.humidity > 80) {
          newAlerts.push({
            type: 'humidity',
            severity: 'warning',
            message: 'High humidity alert: Monitor for fungal diseases',
            icon: <Droplets className="h-5 w-5 text-blue-500" />,
            value: transformedData.humidity,
            unit: '%',
            threshold: 80
          });
        }
        
        setWeatherAlerts(newAlerts);
        
        if (newAlerts.length > 0) {
          toast({
            title: "Weather Alerts",
            description: `${newAlerts.length} weather alert${newAlerts.length > 1 ? 's' : ''} for your farm`,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        toast({
          title: "Error",
          description: "Failed to load weather data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [toast]);

  const onFarmDataSubmit = async (data: FarmDataFormValues) => {
    console.log("Farm Data Form submitted:", data);
    console.log(localStorage.getItem("token"))
    try {
      const response = await fetch("http://localhost:8080/api/farms/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        
        body: JSON.stringify(data),
      });
      console.log(Error)
      if (!response.ok) throw new Error("Failed to add farm data");

      setIsFarmDataDialogOpen(false);
      farmDataForm.reset();
      toast({
        title: "Farm Data Added",
        description: `${data.name} has been added to your farm data.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add farm data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateCropStats = (crops: Crop[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      totalCrops: crops.length,
      readyForHarvest: 0,
      inProgress: 0
    };

    crops.forEach(crop => {
      const harvestDate = new Date(crop.harvestDate);
      harvestDate.setHours(0, 0, 0, 0);
      
      if (harvestDate <= today) {
        stats.readyForHarvest++;
      } else {
        stats.inProgress++;
      }
    });

    return stats;
  };

  const fetchCrops = async () => {
    if (!selectedFarmId) {
      setCrops([]);
      setCropStats({
        totalCrops: 0,
        readyForHarvest: 0,
        inProgress: 0
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
      console.log("Fetched crops:", data);
      setCrops(data);
      const stats = calculateCropStats(data);
      console.log("Calculated stats:", stats);
      setCropStats(stats);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast({
        title: "Error",
        description: "Failed to fetch crops",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (selectedFarmId) {
      console.log("Fetching crops for farm:", selectedFarmId);
      fetchCrops();
    }
  }, [selectedFarmId]);

  useEffect(() => {
    if (farms.length === 1) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms]);

  const FarmSelector = () => (
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
  );

  const onCropSubmit = async (data: CropFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!selectedFarmId) {
        toast({
          title: "Error",
          description: "Please select a farm first",
          variant: "destructive",
        });
        return;
      }

      // Validate harvest date is in the future
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

      const response = await fetch(`http://localhost:8080/api/crops/create?farmId=${selectedFarmId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropName: data.cropName,
          harvestDate: data.harvestDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add crop");
      }

      const newCrop = await response.json();
      setCrops([...crops, newCrop]);
      setIsCropDialogOpen(false);
      cropForm.reset();
      toast({
        title: "Success",
        description: `${data.cropName} has been added to your crops.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add crop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteCrop = async (cropId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedFarmId) {
        throw new Error("No authentication token or farm selected");
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

      setCrops(crops.filter(crop => crop.id !== cropId));
      toast({
        title: "Success",
        description: "Crop deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete crop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateDaysToHarvest = (harvestDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const harvest = new Date(harvestDate);
    harvest.setHours(0, 0, 0, 0);
    
    const diffTime = harvest.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchFarms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/farms/my-farms", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch farms");
      }

      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      toast({
        title: "Error",
        description: "Failed to load farms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFarmsLoading(false);
    }
  };

  const onCreateFarm = async (data: FarmFormData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/farms/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          name: data.name,
          location: data.location,
          size: data.size,
          type: data.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create farm");
      }

      const newFarm = await response.json();
      setFarms([...farms, newFarm]);
      setIsFarmDialogOpen(false);
      farmForm.reset();
      toast({
        title: "Success",
        description: "Farm created successfully",
      });
    } catch (error) {
      console.error("Error creating farm:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create farm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onDeleteFarm = async (farmId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:8080/api/farms/delete/${farmId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to delete farm");
      }

      setFarms(farms.filter(farm => farm.id !== farmId));
      toast({
        title: "Success",
        description: "Farm deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting farm:", error);
      toast({
        title: "Error",
        description: "Failed to delete farm. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onLivestockSubmit = async (data: LivestockFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://localhost:8080/api/livestock/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add livestock");
      }

      const newLivestock = await response.json();
      setLivestock([...livestock, newLivestock]);
      setIsLivestockDialogOpen(false);
      livestockForm.reset();
      toast({
        title: "Success",
        description: `${data.count} ${data.type}(s) added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add livestock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onTransactionSubmit = async (data: TransactionFormValues) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://localhost:8080/api/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      setIsTransactionDialogOpen(false);
      transactionForm.reset();
      toast({
        title: "Success",
        description: `Transaction of ${data.amount} added as ${data.type}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchLivestock = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:8080/api/livestock/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch livestock data");
      }

      const data = await response.json();
      setLivestock(data);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      toast({
        title: "Error",
        description: "Failed to load livestock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLivestockLoading(false);
    }
  };

  const deleteLivestock = async (livestockId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`http://localhost:8080/api/livestock/delete/${livestockId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete livestock");
      }

      setLivestock(livestock.filter(animal => animal.id !== livestockId));
      toast({
        title: "Success",
        description: "Livestock deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting livestock:", error);
      toast({
        title: "Error",
        description: "Failed to delete livestock. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLivestock();
  }, []);

  useEffect(() => {
    fetchFarms();
  }, []);

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
          <h1 className="text-2xl font-bold tracking-tight">Farmer Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <FarmSelector />
          <Button variant="outline" size="sm" onClick={fetchCrops}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="farms">Farms</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-farm-forest/10 to-farm-forest/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, {farmer?.name || "Farmer"}!</h2>
                  <p className="text-muted-foreground mt-1">Here's your farm's overview for today</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={fetchOverviewCrops}>
                    <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Farms */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Farms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{farms.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Active farms in your account</p>
              </CardContent>
            </Card>

            {/* Total Crops */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cropStats.totalCrops}</div>
                <p className="text-xs text-muted-foreground mt-1">Crops in selected farm</p>
              </CardContent>
            </Card>

            {/* Ready for Harvest */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ready for Harvest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{cropStats.readyForHarvest}</div>
                <p className="text-xs text-muted-foreground mt-1">Crops ready to be harvested</p>
              </CardContent>
            </Card>

            {/* In Progress Crops */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{cropStats.inProgress}</div>
                <p className="text-xs text-muted-foreground mt-1">Crops still growing</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Weather Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isWeatherLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {getWeatherIcon(weatherData.condition)}
                      <div>
                        <p className="text-3xl font-bold">{Math.round(weatherData.temperature)}°C</p>
                        <p className="text-muted-foreground capitalize">{weatherData.condition}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Humidity</p>
                          <p className="font-medium">{weatherData.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wind className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">Wind Speed</p>
                          <p className="font-medium">{Math.round(weatherData.windSpeed * 3.6)} km/h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No weather data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Crops */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Crops</CardTitle>
                <p className="text-sm text-muted-foreground">Your most recently added crops</p>
              </CardHeader>
              <CardContent>
                {!selectedFarmId ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Please select a farm to view crops</p>
                  </div>
                ) : crops.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No crops found. Add crops to see their progress.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {crops.slice(0, 3).map((crop) => {
                      const daysToHarvest = calculateDaysToHarvest(crop.harvestDate);
                      const progress = calculateProgress(crop.farmDate, crop.harvestDate);
                      return (
                        <div key={crop.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                          <div className="space-y-1">
                            <p className="font-medium">{crop.cropName}</p>
                            <p className="text-sm text-muted-foreground">
                              Harvest in {daysToHarvest} days
                            </p>
                          </div>
                          <div className="w-24">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-farm-forest transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 text-right">
                              {Math.round(progress)}% complete
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary and Weather Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <p className="text-sm text-muted-foreground">Your farm's financial performance</p>
              </CardHeader>
              <CardContent>
                <FinancialSummary />
              </CardContent>
            </Card>

            {/* Weather Alerts */}
            {weatherAlerts.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    Weather Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weatherAlerts.map((alert, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-md bg-white">
                        <div className="mt-1">{alert.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Current: {alert.value}{alert.unit} | Threshold: {alert.threshold}{alert.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="farms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Farms</CardTitle>
              <Dialog open={isFarmDialogOpen} onOpenChange={setIsFarmDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-farm-forest hover:bg-farm-forest/90">
                    <Plus className="h-4 w-4 mr-2" /> Add New Farm
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Farm</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new farm.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...farmForm}>
                    <form onSubmit={farmForm.handleSubmit(onCreateFarm)} className="space-y-4">
                      <FormField
                        control={farmForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Farm Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter farm name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={farmForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter farm location" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={farmForm.control}
                        name="size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size (acres)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter farm size" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={farmForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Farm Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select farm type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="crop">Crop Farm</SelectItem>
                                <SelectItem value="livestock">Livestock Farm</SelectItem>
                                <SelectItem value="mixed">Mixed Farm</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Create Farm</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isFarmsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
                </div>
              ) : farms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No farms found. Create your first farm to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {farms.map((farm) => (
                    <Card key={farm.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{farm.name}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteFarm(farm.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{farm.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Size:</span>
                            <span>{farm.size} acres</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{farm.type}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crops">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crop Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your crops and track their progress.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FarmSelector />
                <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-farm-forest hover:bg-farm-forest/90"
                      disabled={!selectedFarmId}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add New Crop
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="z-[1000]">
                    <DialogHeader>
                      <DialogTitle>Add New Crop</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new crop.
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
                                    onChange={(e) => {
                                      field.onChange(e);
                                      const selectedDate = new Date(e.target.value);
                                      if (selectedDate <= today) {
                                        cropForm.setError('harvestDate', {
                                          type: 'manual',
                                          message: 'Harvest date must be in the future'
                                        });
                                      } else {
                                        cropForm.clearErrors('harvestDate');
                                      }
                                    }}
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
            </CardHeader>
            <CardContent>
              {!selectedFarmId ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Please select a farm to manage crops.</p>
                </div>
              ) : isCropsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
                </div>
              ) : crops.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No crops found. Add your first crop to get started.</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="livestock">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Livestock Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your animals, health records, feeding schedules, and breeding information.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex gap-1" onClick={fetchLivestock}>
                  <RefreshCcw className="h-4 w-4" /> Refresh
                </Button>
                <Dialog open={isLivestockDialogOpen} onOpenChange={setIsLivestockDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-farm-forest hover:bg-farm-forest/90">
                      <Plus className="h-4 w-4 mr-2" /> Add Livestock
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="z-[1000]">
                    <DialogHeader>
                      <DialogTitle>Add New Livestock</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new livestock.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...livestockForm}>
                      <form onSubmit={livestockForm.handleSubmit(onLivestockSubmit)} className="space-y-4">
                        <FormField
                          control={livestockForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Animal Type</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Cattle, Pigs" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={livestockForm.control}
                          name="count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Count</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 50" {...field} value={field.value || ""} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={livestockForm.control}
                          name="healthStatus"
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
                          control={livestockForm.control}
                          name="acquisitionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Acquisition Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
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
            </CardHeader>
            <CardContent>
              {isLivestockLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farm-forest"></div>
                </div>
              ) : livestock.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No livestock found. Add your first animals to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {livestock.map((animal) => (
                    <Card key={animal.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{animal.type}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteLivestock(animal.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <LivestockStatus
                            type={animal.type}
                            count={animal.count}
                            healthStatus={animal.healthStatus}
                          />
                          <p className="text-sm text-muted-foreground">
                            Acquired: {new Date(animal.acquisitionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-farm-forest hover:bg-farm-forest/90">
                      <Plus className="h-4 w-4 mr-2" /> Add Transaction
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="z-[1000]">
                    <DialogHeader>
                      <DialogTitle>Add New Transaction</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new financial transaction.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...transactionForm}>
                      <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="space-y-4">
                        <FormField
                          control={transactionForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" placeholder="e.g., 1000.00" {...field} value={field.value || ""} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={transactionForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select transaction type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="income">Income</SelectItem>
                                  <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={transactionForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Sold crops" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={transactionForm.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Add Transaction</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FarmerDashboard;
