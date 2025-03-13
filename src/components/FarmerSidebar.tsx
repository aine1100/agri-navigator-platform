
import { Calendar, Home, Leaf, Smartphone, BarChart3, Settings, CloudSun } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const FarmerSidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/farmer",
    },
    {
      title: "My Crops",
      icon: Leaf,
      url: "/farmer/crops",
    },
    {
      title: "Livestock",
      icon: Smartphone,
      url: "/farmer/livestock",
    },
    {
      title: "Weather Forecast",
      icon: CloudSun,
      url: "/farmer/weather",
    },
    {
      title: "Financial Reports",
      icon: BarChart3,
      url: "/farmer/finance",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/farmer/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-sidebar-foreground" />
          <span className="font-bold text-lg text-sidebar-foreground">AgriNavigator</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Farm Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-sidebar-foreground/70">
          © 2023 AgriNavigator • v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default FarmerSidebar;
