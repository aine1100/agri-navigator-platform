import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Users,
  BarChart3,
  DollarSign,
  Sprout,
  Settings,
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
import NotificationBadge from "@/components/NotificationBadge";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: location.pathname === "/admin",
    },
    {
      title: "Farmers",
      icon: Users,
      href: "/admin/farmers",
      active: location.pathname === "/admin/farmers",
    },
    {
      title: "Production",
      icon: BarChart3,
      href: "/admin/production",
      active: location.pathname === "/admin/production",
    },
    {
      title: "Finance",
      icon: DollarSign,
      href: "/admin/finance",
      active: location.pathname === "/admin/finance",
    },
    {
      title: "Crops",
      icon: Sprout,
      href: "/admin/crops",
      active: location.pathname === "/admin/crops",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: location.pathname === "/admin/settings",
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
    <Sidebar className="border-r border-border">
      <SidebarHeader>
        <h2 className="text-xl font-bold">Agri Navigator</h2>
        <p className="text-sm text-muted-foreground">Admin Portal</p>
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
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === "/admin/notifications"}
                onClick={() => navigate("/admin/notifications")}
                className={cn(
                  "cursor-pointer",
                  location.pathname === "/admin/notifications" && "text-primary bg-muted hover:bg-muted"
                )}
              >
                <NotificationBadge userRole="ADMIN" />
                {state === "expanded" ? "Notifications" : ""}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          {state === "expanded" ? "Logout" : ""}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
