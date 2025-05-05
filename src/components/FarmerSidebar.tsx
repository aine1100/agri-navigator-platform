import { useNavigate, useLocation } from "react-router-dom";
import { 
  Tractor, 
  Leaf, 
  Cloud, 
  Wallet, 
  User, 
  Package,
  LogOut
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

const FarmerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const links = [
    {
      title: "Dashboard",
      icon: Tractor,
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
    <Sidebar className="bg-[#1a472a] text-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-white" />
          <span className="font-bold text-lg text-white">Agri Navigator</span>
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full ml-2">
            Farmer
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

export default FarmerSidebar;
