import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, User, ShoppingBag } from "lucide-react";
import { handleTokenExpiration } from "@/utils/auth";

interface Address {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

interface Cart {
  id: number;
  livestock: {
    id: number;
    type: string;
    breed: string;
    price: number;
    imageUrls?: string;
  };
  quantity: number;
  buyer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Order {
  id: number;
  cart: Cart;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: Address;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
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

      const response = await fetch("http://localhost:8080/api/orders/farmer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, toast)) {
       console.log("Failed to fetch orders")
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "CONFIRMED":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farm-forest"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            View and manage orders for your livestock
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No orders found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't received any orders yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                      <img
                        src={order.cart.livestock.imageUrls || "/placeholder.svg"}
                        alt={order.cart.livestock.type}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{order.cart.livestock.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.cart.livestock.breed}
                      </p>
                      <p className="text-sm font-medium">
                        ${order.cart.livestock.price.toFixed(2)} × {order.cart.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.cart.buyer.firstName} {order.cart.buyer.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Ordered on {new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.deliveryAddress.village}, {order.deliveryAddress.cell}
                      </span>
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

export default FarmerOrders; 