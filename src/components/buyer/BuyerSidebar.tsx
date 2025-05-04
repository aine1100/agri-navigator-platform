import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  Leaf
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const BuyerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { toast } = useToast();

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/buyer/dashboard",
      active: location.pathname === "/buyer/dashboard",
    },
    {
      title: "Cart",
      icon: ShoppingCart,
      href: "/buyer/cart",
      active: location.pathname === "/buyer/cart",
    },
    {
      title: "Orders",
      icon: Package,
      href: "/buyer/orders",
      active: location.pathname === "/buyer/orders",
    },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch("http://localhost:8080/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    }
  };

  return (
    <Sidebar className="bg-[#1a472a] text-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-white" />
          <span className="font-bold text-lg text-white">Agri Navigator</span>
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full ml-2">
            Buyer
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <nav className="grid gap-1 px-2">
          <SidebarMenu>
            {links.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={link.active}
                  onClick={() => navigate(link.href)}
                  className={cn(
                    "cursor-pointer text-white hover:bg-green-700/50",
                    link.active && "bg-green-700 text-white"
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton 
          onClick={handleLogout}
          className="text-white hover:bg-green-700/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {state === "expanded" ? "Logout" : ""}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default BuyerSidebar; 