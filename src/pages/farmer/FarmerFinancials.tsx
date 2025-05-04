import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FarmerFinancials = () => {
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

  // Sample data for the sales trend graph
  const salesData = [
    { date: '2024-01', sales: 4500 },
    { date: '2024-02', sales: 5200 },
    { date: '2024-03', sales: 4800 },
    { date: '2024-04', sales: 6100 },
    { date: '2024-05', sales: 5500 },
    { date: '2024-06', sales: 7200 },
  ];

  const totalIncome = 27300; // Sum of sales data
  const totalExpenses = 15000; // Example fixed value
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">
            Track your farm's financial performance
          </p>
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

      {/* Sales Trend Graph */}
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
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
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
