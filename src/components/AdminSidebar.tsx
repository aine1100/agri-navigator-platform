
import { Home, Users, FileSpreadsheet, BarChart3, Settings, Leaf } from "lucide-react";
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

const AdminSidebar = () => {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      url: "/admin",
    },
    {
      title: "Manage Farmers",
      icon: Users,
      url: "/admin/farmers",
    },
    {
      title: "Crop Data",
      icon: Leaf,
      url: "/admin/crops",
    },
    {
      title: "Financial Analytics",
      icon: BarChart3,
      url: "/admin/finance",
    },
    {
      title: "System Settings",
      icon: Settings,
      url: "/admin/settings",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-sidebar-foreground" />
          <span className="font-bold text-lg text-sidebar-foreground">Hinga</span>
          <span className="text-xs bg-farm-green text-white px-2 py-0.5 rounded-full ml-2">
            Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Controls</SidebarGroupLabel>
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
          © 2025 Hinga Admin • v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
