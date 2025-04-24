import { useState,useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialSummary from "@/components/farmer/FinancialSummary";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CircleDollarSign, FileText, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { handleTokenExpiration } from "@/utils/auth";

const transactionSchema = z.object({
  date: z.string(),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  amount: z.string().refine(val => !isNaN(parseFloat(val)), { 
    message: "Amount must be a number" 
  }),
  type: z.enum(["income", "expense"]),
  category: z.string(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      date: "2023-06-01",
      description: "Crop sale - Wheat",
      amount: 4500,
      type: "income",
      category: "Sales"
    },
    {
      id: 2,
      date: "2023-06-05",
      description: "Fertilizer purchase",
      amount: 1200,
      type: "expense",
      category: "Supplies"
    },
    {
      id: 3,
      date: "2023-06-10",
      description: "Equipment repair",
      amount: 350,
      type: "expense",
      category: "Maintenance"
    },
    {
      id: 4,
      date: "2023-06-15",
      description: "Livestock sale - Cattle",
      amount: 3800,
      type: "income",
      category: "Sales"
    },
    {
      id: 5,
      date: "2023-06-20",
      description: "Seed purchase",
      amount: 850,
      type: "expense",
      category: "Supplies"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      type: "income",
      category: "",
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
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

      // Simulated API call - replace with actual API call
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        date: data.date,
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category,
      };
      
      setTransactions([...transactions, newTransaction]);
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Transaction added",
        description: `${data.type === "income" ? "Income" : "Expense"} of $${data.amount} has been recorded.`,
      });
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
      }
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Crop sale, Equipment purchase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
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
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sales, Supplies, Maintenance" {...field} />
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

      <FinancialSummary />

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View and manage your financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-2">
                {transactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'income' ? 'bg-farm-green/10' : 'bg-destructive/10'
                        }`}>
                          {transaction.type === 'income' ? 
                            <TrendingUp className={`h-4 w-4 text-farm-green`} /> : 
                            <TrendingDown className={`h-4 w-4 text-destructive`} />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" /> {new Date(transaction.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <FileText className="h-3 w-3 mr-1" /> {transaction.category}
                          </div>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' ? 'text-farm-green' : 'text-destructive'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                }
              </div>
            </TabsContent>
            <TabsContent value="income" className="mt-4">
              <div className="space-y-2">
                {transactions
                  .filter(t => t.type === 'income')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-farm-green/10">
                          <TrendingUp className="h-4 w-4 text-farm-green" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" /> {new Date(transaction.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <FileText className="h-3 w-3 mr-1" /> {transaction.category}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-farm-green">
                        +${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                }
              </div>
            </TabsContent>
            <TabsContent value="expense" className="mt-4">
              <div className="space-y-2">
                {transactions
                  .filter(t => t.type === 'expense')
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-destructive/10">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" /> {new Date(transaction.date).toLocaleDateString()}
                            <span className="mx-2">•</span>
                            <FileText className="h-3 w-3 mr-1" /> {transaction.category}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-destructive">
                        -${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerFinancials;
