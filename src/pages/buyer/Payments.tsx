import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, History } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: "CARD" | "MOBILE_MONEY";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  date: string;
  description: string;
  paymentMethod: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/payments/methods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch payment methods");
      const data = await response.json();
      setPaymentMethods(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/payments/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement card addition logic
    toast({
      title: "Success",
      description: "Card added successfully",
    });
  };

  const handleAddMobileMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement mobile money addition logic
    toast({
      title: "Success",
      description: "Mobile money account added successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="methods">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-6 w-6 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {method.type === "CARD" ? "Card" : "Mobile Money"} ending in {method.last4}
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <Tabs defaultValue="card">
                  <TabsList className="mb-4">
                    <TabsTrigger value="card">Add Card</TabsTrigger>
                    <TabsTrigger value="mobile">Add Mobile Money</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card">
                    <form onSubmit={handleAddCard} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <Button type="submit">Add Card</Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="mobile">
                    <form onSubmit={handleAddMobileMoney} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" placeholder="+250 7XX XXX XXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <select
                          id="provider"
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="mtn">MTN</option>
                          <option value="airtel">Airtel</option>
                        </select>
                      </div>
                      <Button type="submit">Add Mobile Money</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View your payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;