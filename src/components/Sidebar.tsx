import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  LogOut,
  Home,
  FileText,
  BarChart,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  userRole: "FARMER" | "BUYER";
}

const Sidebar = ({ userRole }: SidebarProps) => {
  const location = useLocation();

  const farmerLinks = [
    {
      title: "Dashboard",
      href: "/farmer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Products",
      href: "/farmer/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/farmer/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      href: "/farmer/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      href: "/farmer/analytics",
      icon: BarChart,
    },
    {
      title: "Reports",
      href: "/farmer/reports",
      icon: FileText,
    },
    {
      title: "Notifications",
      href: "/farmer/notifications",
      icon: Bell,
    },
  ];

  const buyerLinks = [
    {
      title: "Dashboard",
      href: "/buyer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Marketplace",
      href: "/buyer/marketplace",
      icon: Home,
    },
    {
      title: "My Orders",
      href: "/buyer/orders",
      icon: ShoppingCart,
    },
    {
      title: "Cart",
      href: "/buyer/cart",
      icon: Package,
    },
    {
      title: "Track Orders",
      href: "/buyer/track-orders",
      icon: Truck,
    },
    {
      title: "Payments",
      href: "/buyer/payments",
      icon: Wallet,
    },
    {
      title: "Notifications",
      href: "/buyer/notifications",
      icon: Bell,
    },
  ];

  const links = userRole === "FARMER" ? farmerLinks : buyerLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">
          {userRole === "FARMER" ? "Farmer Portal" : "Buyer Portal"}
        </h2>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <div className="space-y-2">
          <Link
            to={userRole === "FARMER" ? "/farmer/settings" : "/buyer/settings"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 