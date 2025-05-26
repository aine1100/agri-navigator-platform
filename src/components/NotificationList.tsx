import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bell, CheckCircle, AlertCircle, Package, Truck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  order?: {
    id: number;
    orderStatus: string;
    paymentStatus: string;
  };
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log("Fetching notifications...");
      const response = await fetch("http://localhost:8080/api/notifications/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET"
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch notifications:", response.status, errorText);
        throw new Error(`Failed to fetch notifications: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("Received notifications:", data);
      
      if (!Array.isArray(data)) {
        console.error("Received non-array data:", data);
        throw new Error("Invalid response format: expected an array");
      }

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark notification as read: ${response.status} ${errorText}`);
      }
      
      // Update local state
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/notifications/read-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to mark all notifications as read: ${response.status} ${errorText}`);
      }
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));

      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ORDER_CREATED":
        return <Package className="w-5 h-5" />;
      case "ORDER_APPROVED":
        return <CheckCircle className="w-5 h-5" />;
      case "ORDER_CANCELLED":
        return <XCircle className="w-5 h-5" />;
      case "ORDER_SHIPPED":
        return <Truck className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ORDER_CREATED":
        return "bg-blue-100 text-blue-800";
      case "ORDER_APPROVED":
        return "bg-green-100 text-green-800";
      case "ORDER_CANCELLED":
        return "bg-red-100 text-red-800";
      case "ORDER_SHIPPED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center">Loading notifications...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {notifications.length} total notifications
          </CardDescription>
        </div>
        {notifications.some(n => !n.read) && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {notification.order && (
                        <div className="flex space-x-2 mt-2">
                          <Badge variant="outline">
                            Order #{notification.order.id}
                          </Badge>
                          <Badge variant="outline">
                            {notification.order.orderStatus}
                          </Badge>
                          <Badge variant="outline">
                            {notification.order.paymentStatus}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationList; 