import { useNavigate, useLocation } from "react-router-dom";
import { 
  Tractor, 
  Leaf, 
  Cloud, 
  Wallet, 
  User, 
  Package,
  LogOut,
  Home
} from "lucide-react";

import { cn } from "@/lib/utils";
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
import NotificationBadge from "@/components/NotificationBadge";

const FarmerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const links = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/farmer",
      active: location.pathname === "/farmer",
    },
    {
      title: "Livestock",
      icon: Leaf,
      href: "/farmer/livestock",
      active: location.pathname === "/farmer/livestock",
    },
    {
      title: "Financials",
      icon: Wallet,
      href: "/farmer/financials",
      active: location.pathname === "/farmer/financials",
    },
    {
      title: "Orders",
      icon: Package,
      href: "/farmer/orders",
      active: location.pathname === "/farmer/orders",
    },
    {
      title: "Settings",
      icon: User,
      href: "/farmer/settings",
      active: location.pathname === "/farmer/settings",
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
      window.location.href = "/login";
    }
  };

  return (
    <Sidebar className="bg-gradient-to-b from-[#1a472a] to-[#2d5a3f] text-white">
      <SidebarHeader className="p-4 border-b border-green-700/50">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-white" />
          <span className="font-bold text-lg text-white">Agri Navigator</span>
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full ml-2">
            Farmer
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <nav className="grid gap-1 px-2 py-4">
          <SidebarMenu>
            {links.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  isActive={link.active}
                  onClick={() => navigate(link.href)}
                  className={cn(
                    "cursor-pointer text-white/90 hover:bg-green-700/50 transition-colors duration-200",
                    link.active && "bg-green-700 text-white shadow-md"
                  )}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === "/farmer/notifications"}
                onClick={() => navigate("/farmer/notifications")}
                className={cn(
                  "cursor-pointer text-white/90 hover:bg-green-700/50 transition-colors duration-200",
                  location.pathname === "/farmer/notifications" && "bg-green-700 text-white shadow-md"
                )}
              >
                <NotificationBadge userRole="FARMER" />
                {state === "expanded" ? "Notifications" : ""}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-green-700/50">
        <SidebarMenuButton 
          onClick={handleLogout}
          className="text-white/90 hover:bg-green-700/50 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {state === "expanded" ? "Logout" : ""}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default FarmerSidebar;
