import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const FarmerFinancials = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netIncome, setNetIncome] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api';

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

    const fetchData = async () => {
      try {
        // Parse token to get farmerId
        let farmerId;
        try {
          const parts = token.split('.');
          if (parts.length !== 3) {
            throw new Error("Invalid token format");
          }
          const payload = atob(parts[1]);
          const parsed = JSON.parse(payload);
          farmerId = parsed.id; // Use 'id' as per JwtService claims
          if (!farmerId) {
            throw new Error("No farmer ID found in token");
          }
        } catch (error) {
          console.error("Token parsing error:", error.message);
          toast({
            title: "Error",
            description: "Invalid authentication token",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Fetch monthly revenue
        const monthlyResponse = await axios.get(`${API_BASE_URL}/finance/farmer/${farmerId}/monthly-revenue`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monthlyData = Object.entries(monthlyResponse.data).map(([date, sales]) => ({
          date,
          sales: parseFloat(sales),
        }));
        setSalesData(monthlyData);
        console.log(monthlyData)

        // Calculate total income
        const total = monthlyData.reduce((sum, item) => sum + item.sales, 0);
        setTotalIncome(total);

        // Fetch expenses with fallback
        const expensesResponse = await axios.get(`${API_BASE_URL}/finance/farmer/${farmerId}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch((error) => {
          console.warn("Expenses endpoint failed, using fallback value:", error.message);
          return { data: { totalExpenses: 0 } };
        });
        const expenses = expensesResponse.data.totalExpenses || 0;
        setTotalExpenses(expenses);

        // Calculate net income
        setNetIncome(total - expenses);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          });
          navigate("/login");
        } else if (error.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to access this data",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: `Failed to fetch financial data: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    };

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return <div>Loading financial data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">Track your farm's financial performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-farm-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-farm-green">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total income for current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total expenses for current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-farm-forest" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-farm-green' : 'text-destructive'}`}>
              ${netIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Net income for current period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Monthly sales performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                  }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerFinancials;