import React from "react";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FarmerSidebar from "./FarmerSidebar";
import AdminSidebar from "./AdminSidebar";
import BuyerSidebar from "./buyer/BuyerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface DecodedToken {
  role: string;
}

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  let role = "FARMER"; // Default role

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      role = decoded.role;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const renderSidebar = () => {
    switch (role) {
      case "FARMER":
        return <FarmerSidebar />;
      case "ADMIN":
        return <AdminSidebar />;
      case "BUYER":
        return <BuyerSidebar />;
      default:
        return <FarmerSidebar />;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-full relative w-full p-2">
        <div className="hidden h-full w-full p-5 md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] ">
          {renderSidebar()}
        </div>
        <main className="md:pl-72">
          {children || <Outlet />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
