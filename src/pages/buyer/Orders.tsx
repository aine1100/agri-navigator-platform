import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Package, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: number;
  orderDate: string;
  deliveryDate: string;
  orderStatus: string;
  paymentStatus: string;
  carts: {
    livestock: {
      type: string;
      description: string;
      price: number;
      imageUrl: string;
      breed:string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  deliveryAddress: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://hingabackend-production.up.railway.app/api/orders/buyer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filterOrders = (orders: Order[]) => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === "" || 
        order.id.toString().includes(searchQuery) ||
        order.carts.some(cart => 
          cart.livestock.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cart.livestock.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cart.livestock.breed.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesStatus = statusFilter === "all" || 
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase();

      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));

      let matchesDate = true;
      switch (dateFilter) {
        case "last30":
          matchesDate = orderDate >= thirtyDaysAgo;
          break;
        case "last90":
          matchesDate = orderDate >= ninetyDaysAgo;
          break;
        case "thisYear":
          matchesDate = orderDate.getFullYear() === new Date().getFullYear();
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const handlePayNow = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`https://hingabackend-production.up.railway.app/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const paymentUrl = await response.text();
      // Redirect to Stripe checkout
      window.location.href = paymentUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button variant="outline" onClick={() => navigate("/buyer/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg text-gray-500">No orders found</p>
            <Button
              className="mt-4"
              onClick={() => navigate("/buyer/dashboard")}
            >
              Browse Livestock
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Livestock Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Status</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterOrders(orders).map((order) => (
                order.carts.map((cart, idx) => (
                  <tr key={order.id + '-' + idx}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{cart.livestock.type}</td>
                    <td className="px-4 py-2">{cart.livestock.description}</td>
                    <td className="px-4 py-2">{cart.quantity}</td>
                    <td className="px-4 py-2">${cart.unitPrice}</td>
                    <td className="px-4 py-2">${cart.totalPrice}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{order.deliveryAddress.village}, {order.deliveryAddress.cell}, {order.deliveryAddress.sector}, {order.deliveryAddress.district}, {order.deliveryAddress.province}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          order.orderStatus === "PENDING" ? "secondary" :
                          order.orderStatus === "APPROVED" ? "outline" :
                          order.orderStatus === "CANCELLED" ? "destructive" :
                          "default"
                        }>
                          {order.orderStatus}
                        </Badge>
                        {order.orderStatus === "APPROVED" && order.paymentStatus !== "PAID" && (
                          <Button
                            onClick={() => handlePayNow(order.id)}
                            size="sm"
                            className="ml-2"
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          order.paymentStatus === "PENDING" ? "secondary" :
                          order.paymentStatus === "PAID" ? "outline" :
                          order.paymentStatus === "CANCELLED" ? "destructive" :
                          "default"
                        }>
                          {order.paymentStatus}
                        </Badge>
                        
                      </div>
                    </td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders; 