import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NotificationList from "@/components/NotificationList";

const BuyerNotifications = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" onClick={() => navigate("/buyer/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
      <NotificationList />
    </div>
  );
};

export default BuyerNotifications; 