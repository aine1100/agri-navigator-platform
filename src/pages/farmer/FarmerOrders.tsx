import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, MapPin, User, ShoppingBag, Download } from "lucide-react";
import { handleTokenExpiration } from "@/utils/auth";
import { Button } from "@/components/ui/button";

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
  unitPrice: number;
  totalPrice: number;
  buyer: {
    id: number;
    buyerName: string;
    phoneNumber: string;
    email: string;
  };
}

interface Order {
  id: number;
  carts: Cart[];
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: Address;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

const FarmerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
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
      console.log(data)
      console.log(data.carts)
    } catch (error) {
      if (!handleTokenExpiration(error, navigate, { toast, dismiss: () => {}, toasts: [] })) {
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

  const handleApprove = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to approve order");
      toast({ title: "Order approved", description: `Order #${orderId} has been approved.` });
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve order", variant: "destructive" });
    }
  };

  const handleReject = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to reject order");
      toast({ title: "Order rejected", description: `Order #${orderId} has been rejected.` });
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject order", variant: "destructive" });
    }
  };

  const handleDownloadReport = async () => {
    try {
      setIsDownloading(true);
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

      const response = await fetch("http://localhost:8080/api/orders/farmer/download", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "orders_report.pdf";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convert the response to blob
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Orders report downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download orders report",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
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
        <Button
          onClick={handleDownloadReport}
          disabled={isDownloading || orders.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download Report"}
        </Button>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th> */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Livestock Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                order.carts.map((cart) => (
                  <tr key={`${order.id}-${cart.id}`}>
                    <td className="px-4 py-2">{order.id}</td>
                    {/* <td className="px-4 py-2">{cart.buyer ? cart.buyer.buyerName : 'Unknown Buyer'}</td>
                    <td className="px-4 py-2">{cart.buyer ? cart.buyer.phoneNumber : 'N/A'}</td> */}
                    <td className="px-4 py-2">{cart.livestock.type}</td>
                    <td className="px-4 py-2">{cart.livestock.breed}</td>
                    <td className="px-4 py-2">{cart.quantity}</td>
                    <td className="px-4 py-2">${cart.unitPrice}</td>
                    <td className="px-4 py-2">${cart.totalPrice}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      {order.deliveryAddress.village}, {order.deliveryAddress.cell}, {order.deliveryAddress.sector}, {order.deliveryAddress.district}, {order.deliveryAddress.province}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {(order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") && (
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleApprove(order.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleReject(order.id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

export default FarmerOrders; 