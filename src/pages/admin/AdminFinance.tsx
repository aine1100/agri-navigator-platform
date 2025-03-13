
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, Download, FileText, PieChart as PieChartIcon, BarChart as BarChartIcon, LineChart as LineChartIcon } from "lucide-react";

// Sample data for charts
const monthlyRevenueData = [
  { month: 'Jan', revenue: 450000, expenses: 320000 },
  { month: 'Feb', revenue: 520000, expenses: 380000 },
  { month: 'Mar', revenue: 400000, expenses: 290000 },
  { month: 'Apr', revenue: 580000, expenses: 420000 },
  { month: 'May', revenue: 620000, expenses: 450000 },
  { month: 'Jun', revenue: 700000, expenses: 510000 },
  { month: 'Jul', revenue: 750000, expenses: 550000 },
  { month: 'Aug', revenue: 820000, expenses: 600000 },
  { month: 'Sep', revenue: 680000, expenses: 490000 },
  { month: 'Oct', revenue: 580000, expenses: 410000 },
  { month: 'Nov', revenue: 540000, expenses: 380000 },
  { month: 'Dec', revenue: 620000, expenses: 440000 },
];

const cropRevenueData = [
  { name: 'Wheat', value: 2500000 },
  { name: 'Corn', value: 1800000 },
  { name: 'Soybeans', value: 1500000 },
  { name: 'Rice', value: 1200000 },
  { name: 'Other', value: 1000000 },
];

const regionRevenueData = [
  { name: 'North', value: 3200000 },
  { name: 'South', value: 2500000 },
  { name: 'East', value: 1800000 },
  { name: 'West', value: 1500000 },
];

const transactionData = [
  { id: 1, date: '2023-06-15', description: 'Quarterly farmer payments', amount: 450000, type: 'expense' },
  { id: 2, date: '2023-06-12', description: 'Crop sales - Q2', amount: 1250000, type: 'income' },
  { id: 3, date: '2023-06-01', description: 'Equipment purchases', amount: 320000, type: 'expense' },
  { id: 4, date: '2023-05-20', description: 'Livestock sales', amount: 850000, type: 'income' },
  { id: 5, date: '2023-05-15', description: 'Farm subsidies received', amount: 350000, type: 'income' },
  { id: 6, date: '2023-05-10', description: 'Agricultural tax payment', amount: 180000, type: 'expense' },
  { id: 7, date: '2023-05-05', description: 'Fertilizer bulk purchase', amount: 95000, type: 'expense' },
  { id: 8, date: '2023-05-01', description: 'Land lease income', amount: 120000, type: 'income' },
];

// Colors for charts
const COLORS = ['#57CC99', '#97664A', '#38A3A5', '#80ED99', '#22577A'];

const AdminFinance = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [chartType, setChartType] = useState("bar");
  
  const totalRevenue = monthlyRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = monthlyRevenueData.reduce((sum, item) => sum + item.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Analytics</h1>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">${(totalRevenue/1000000).toFixed(2)}M</div>
            <div className="flex items-center pt-1 text-farm-green">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+12.5% from previous year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">${(totalExpenses/1000000).toFixed(2)}M</div>
            <div className="flex items-center pt-1 text-destructive">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+8.3% from previous year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">${(netProfit/1000000).toFixed(2)}M</div>
            <div className="flex items-center pt-1 text-farm-green">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+15.2% from previous year</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{profitMargin}%</div>
            <div className="flex items-center pt-1 text-farm-green">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">+2.3% from previous year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Revenue & Expenses Overview</CardTitle>
              <CardDescription>
                Financial performance across time periods
              </CardDescription>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-1">
              <Button 
                variant={chartType === "bar" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("bar")}
              >
                <BarChartIcon className="h-4 w-4 mr-2" />
                Bar
              </Button>
              <Button 
                variant={chartType === "line" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="h-4 w-4 mr-2" />
                Line
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#57CC99" />
                  <Bar dataKey="expenses" name="Expenses" fill="#97664A" />
                </BarChart>
              ) : (
                <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value/1000)}k`} />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#57CC99" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#97664A" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Crop Type</CardTitle>
            <CardDescription>
              Distribution of revenue across different crop types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cropRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
            <CardDescription>
              Distribution of revenue across different regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {regionRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest financial activities in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionData.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'income' ? 'bg-farm-green/20 text-farm-green' : 'bg-destructive/20 text-destructive'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinance;
