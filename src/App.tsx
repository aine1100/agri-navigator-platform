
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import FarmerCrops from "./pages/farmer/FarmerCrops";
import FarmerLivestock from "./pages/farmer/FarmerLivestock";
import FarmerWeather from "./pages/farmer/FarmerWeather";
import FarmerFinancials from "./pages/farmer/FarmerFinancials";
import FarmerSettings from "./pages/farmer/FarmerSettings";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import Marketplace from "./pages/Marketplace";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminProduction from "./pages/admin/AdminProduction";
import AdminRevenue from "./pages/admin/AdminRevenue";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/marketplace" element={<Marketplace />} />
          
          {/* Farmer routes */}
          <Route path="/farmer" element={<Layout><FarmerDashboard /></Layout>} />
          <Route path="/farmer/crops" element={<Layout><FarmerCrops /></Layout>} />
          <Route path="/farmer/livestock" element={<Layout><FarmerLivestock /></Layout>} />
          <Route path="/farmer/weather" element={<Layout><FarmerWeather /></Layout>} />
          <Route path="/farmer/financials" element={<Layout><FarmerFinancials /></Layout>} />
          <Route path="/farmer/products" element={<Layout><FarmerProducts /></Layout>} />
          <Route path="/farmer/settings" element={<Layout><FarmerSettings /></Layout>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/farmers" element={<Layout><AdminFarmers /></Layout>} />
          <Route path="/admin/production" element={<Layout><AdminProduction /></Layout>} />
          <Route path="/admin/revenue" element={<Layout><AdminRevenue /></Layout>} />
          
          {/* Redirects for any mismatched paths */}
          <Route path="/farmer/finance" element={<Navigate to="/farmer/financials" replace />} />
          
          {/* Fallback routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
