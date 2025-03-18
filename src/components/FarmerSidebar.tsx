
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Tractor, 
  Leaf, 
  Cloud, 
  Wallet, 
  User, 
  ShoppingBag, 
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
      title: "Crops",
      icon: Leaf,
      href: "/farmer/crops",
      active: location.pathname === "/farmer/crops",
    },
    {
      title: "Livestock",
      icon: Leaf,
      href: "/farmer/livestock",
      active: location.pathname === "/farmer/livestock",
    },
    {
      title: "Weather",
      icon: Cloud,
      href: "/farmer/weather",
      active: location.pathname === "/farmer/weather",
    },
    {
      title: "Financials",
      icon: Wallet,
      href: "/farmer/financials",
      active: location.pathname === "/farmer/financials",
    },
    {
      title: "Products",
      icon: ShoppingBag,
      href: "/farmer/products",
      active: location.pathname === "/farmer/products",
    },
    {
      title: "Settings",
      icon: User,
      href: "/farmer/settings",
      active: location.pathname === "/farmer/settings",
    },
  ];

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <h2 className="text-xl font-bold">FarmFlow</h2>
        <p className="text-sm text-muted-foreground">Farmer Portal</p>
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
                    "cursor-pointer",
                    link.active && "text-primary bg-muted hover:bg-muted"
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
      <SidebarFooter>
        <SidebarMenuButton>
          <LogOut className="h-4 w-4 mr-2" />
          {state === "expanded" ? "Logout" : ""}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default FarmerSidebar;
