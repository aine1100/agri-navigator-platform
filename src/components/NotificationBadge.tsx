import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface NotificationBadgeProps {
  userRole: "FARMER" | "BUYER" | "ADMIN";
}

const NotificationBadge = ({ userRole }: NotificationBadgeProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUnreadCount();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/notifications/unread/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch unread count");
      const count = await response.json();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleClick = () => {
    switch (userRole) {
      case "FARMER":
        navigate("/farmer/notifications");
        break;
      case "BUYER":
        navigate("/buyer/notifications");
        break;
      case "ADMIN":
        navigate("/admin/notifications");
        break;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={handleClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  );
};

export default NotificationBadge; 