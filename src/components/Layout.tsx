
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocation } from 'react-router-dom';
import FarmerSidebar from './FarmerSidebar';
import AdminSidebar from './AdminSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAdmin ? <AdminSidebar /> : <FarmerSidebar />}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
