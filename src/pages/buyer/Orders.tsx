import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Package, MapPin, Calendar } from "lucide-react";

interface Order {
  id: number;
  orderDate: string;
  deliveryDate: string;
  orderStatus: string;
  cart: {
    livestock: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  };
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

      const response = await fetch("http://localhost:8080/api/orders/buyer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
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
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 relative">
                        <img
                          src={order.cart.livestock.imageUrl}
                          alt={order.cart.livestock.name}
                          className="object-cover rounded-md w-full h-full"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {order.cart.livestock.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {order.cart.livestock.description}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm">
                            Quantity: {order.cart.quantity}
                          </p>
                          <p className="text-sm font-semibold">
                            Total: ${order.cart.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-sm text-gray-500">
                          {order.deliveryAddress.village},{" "}
                          {order.deliveryAddress.cell}
                          <br />
                          {order.deliveryAddress.sector},{" "}
                          {order.deliveryAddress.district}
                          <br />
                          {order.deliveryAddress.province}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Expected Delivery</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 