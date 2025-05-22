import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Beef,
  ArrowRight,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

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

interface Cart {
  livestock: {
    type: string;
    quantity: number;
    price: number;
  };
}

interface Order {
  id: string;
  orderDate: string;
  orderStatus: string;
  carts: Cart[];
  paymentStatus: string;
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

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
  const [orderTrends, setOrderTrends] = useState<{ date: string; count: number }[]>([]);
  const [trendView, setTrendView] = useState<"week" | "month" | "year">("month");
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [orders, setOrders] = useState<Order[]>([]);
  const [animalOrderDistribution, setAnimalOrderDistribution] = useState<
    { name: string; value: number }[]
  >([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);

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
    fetchOrders();
    extractFarmerFromToken();
  }, []);

  useEffect(() => {
    fetchOrderTrends(trendView);
  }, [trendView, orders]);

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
      if (
        !handleTokenExpiration(error, navigate, {
          toast,
          dismiss: () => {},
          toasts: [],
        })
      ) {
        console.log("Failed to fetch farmer livestock");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (livestock: Livestock[]) => {
    const stats = {
      totalLivestock: livestock.length,
      totalValue: livestock.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
      if (
        !handleTokenExpiration(error, navigate, {
          toast,
          dismiss: () => {},
          toasts: [],
        })
      ) {
        toast({
          title: "Error",
          description: "Failed to add livestock",
          variant: "destructive",
        });
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/orders/farmer", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      console.log("Fetched orders:", data);
      
      // Calculate total order amount
      const totalAmount = data.reduce((sum: number, order: Order) => {
        if (!order || !order.carts || !order.carts.length) return sum;
        
        return sum + order.carts.reduce((cartSum: number, cart: Cart) => {
          if (cart.livestock) {
            return cartSum + (cart.livestock.price * cart.livestock.quantity);
          }
          return cartSum;
        }, 0);
      }, 0);
      
      setTotalOrderAmount(totalAmount);
      
      // Calculate animal order distribution
      const distribution = data.reduce((acc: { [key: string]: number }, order: Order) => {
        if (!order || !order.carts || !order.carts.length) {
          console.warn("Invalid order data:", order);
          return acc;
        }
        
        order.carts.forEach(cart => {
          if (cart.livestock) {
            const type = cart.livestock.type || "Unknown";
            const quantity = cart.livestock.quantity || 0;
            acc[type] = (acc[type] || 0) + quantity;
          }
        });
        
        return acc;
      }, {});

      const distributionArray = Object.entries(distribution)
        .filter(([_, value]) => Number(value) > 0)
        .map(([name, value]) => ({
          name,
          value: Number(value),
        }));

      setAnimalOrderDistribution(distributionArray);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  const fetchOrderTrends = async (view: "week" | "month" | "year" = trendView) => {
    try {
      if (!orders.length) return;
      
      let trends: Record<string, number> = {};
      let trendArr: { date: string; count: number }[] = [];

      if (view === "week") {
        trends = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        orders.forEach((order) => {
          const date = new Date(order.orderDate);
          let dayIdx = date.getDay();
          dayIdx = dayIdx === 0 ? 6 : dayIdx - 1;
          const day = weekDays[dayIdx];
          trends[day] = (trends[day] || 0) + 1;
        });
        trendArr = weekDays.map((day) => ({ date: day, count: trends[day] || 0 }));
      } else if (view === "month") {
        trends = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
        orders.forEach((order) => {
          const date = new Date(order.orderDate);
          const month = months[date.getMonth()];
          trends[month] = (trends[month] || 0) + 1;
        });
        trendArr = months.map((month) => ({ date: month, count: trends[month] || 0 }));
      } else if (view === "year") {
        orders.forEach((order) => {
          const date = new Date(order.orderDate);
          const year = date.getFullYear().toString();
          trends[year] = (trends[year] || 0) + 1;
        });
        const years = Object.keys(trends).sort((a, b) => parseInt(a) - parseInt(b));
        trendArr = years.map((year) => ({ date: year, count: trends[year] }));
      }
      setOrderTrends(trendArr);
    } catch (error) {
      console.error("Error processing order trends:", error);
    }
  };

  const renderPieChart = () => {
    if (animalOrderDistribution.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2">
            <Package className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-sm text-muted-foreground">
              You haven't received any orders yet.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={animalOrderDistribution}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {animalOrderDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} orders`, "Quantity"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {farmer?.firstName || "Farmer"} {farmer?.lastName || ""}
          </h1>
          <p className="text-muted-foreground">Your farming dashboard overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchLivestock();
              fetchOrderTrends(trendView);
            }}
          >
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Dialog
            open={isLivestockDialogOpen}
            onOpenChange={setIsLivestockDialogOpen}
          >
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
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
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
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
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
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
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
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
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

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
            <Beef className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livestock.length}</div>
            <p className="text-xs text-muted-foreground">Total livestock items</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${livestock
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Orders received</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalOrderAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From completed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Animal Order Distribution Pie Chart */}
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-4">Animal Order Distribution</h3>
                {renderPieChart()}
              </div>

              {/* Order Trends Bar Chart */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Order Trends</h3>
                  <div className="flex items-center gap-2">
                    <label htmlFor="trendView" className="sr-only">
                      View By
                    </label>
                    <select
                      id="trendView"
                      className="border rounded px-2 py-1 text-sm bg-white"
                      value={trendView}
                      onChange={(e) =>
                        setTrendView(e.target.value as "week" | "month" | "year")
                      }
                    >
                      <option value="week">By Week</option>
                      <option value="month">By Month</option>
                      <option value="year">By Year</option>
                    </select>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={orderTrends}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-200"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#666" }}
                        tickFormatter={(value) => {
                          if (trendView === "month") return value;
                          if (trendView === "year") return value;
                          if (trendView === "week") return value;
                          return value;
                        }}
                      />
                      <YAxis allowDecimals={false} tick={{ fill: "#666" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [value, "Orders"]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#4ade80"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Livestock Section */}
      <Card className="bg-white shadow-sm">
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
                <h3 className="text-lg font-medium">No livestock yet</h3>
                <p className="text-sm text-muted-foreground">
                  Add your first livestock to start selling
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
                <Card
                  key={item.livestockId}
                  className="bg-gray-50 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{item.type}</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          item.status === "HEALTHY"
                            ? "bg-green-100 text-green-800"
                            : item.status === "ATTENTION"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Breed:</span>
                          <span className="font-medium">{item.breed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Count:</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">${item.price}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                      {item.imageUrls && (
                        <img
                          src={
                            item.imageUrls.startsWith("http")
                              ? item.imageUrls
                              : `http://localhost:8080${item.imageUrls}`
                          }
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