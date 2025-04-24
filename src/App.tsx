import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
import AdminCrops from "./pages/admin/AdminCrops";
import AdminSettings from "./pages/admin/AdminSettings";

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
          <Route path="/farmer" element={<ProtectedRoute><Layout><FarmerDashboard /></Layout></ProtectedRoute>} />
          <Route path="/farmer/crops" element={<ProtectedRoute><Layout><FarmerCrops /></Layout></ProtectedRoute>} />
          <Route path="/farmer/livestock" element={<ProtectedRoute><Layout><FarmerLivestock /></Layout></ProtectedRoute>} />
          <Route path="/farmer/weather" element={<ProtectedRoute><Layout><FarmerWeather /></Layout></ProtectedRoute>} />
          <Route path="/farmer/financials" element={<ProtectedRoute><Layout><FarmerFinancials /></Layout></ProtectedRoute>} />
          <Route path="/farmer/products" element={<ProtectedRoute><Layout><FarmerProducts /></Layout></ProtectedRoute>} />
          <Route path="/farmer/settings" element={<ProtectedRoute><Layout><FarmerSettings /></Layout></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/farmers" element={<ProtectedRoute><Layout><AdminFarmers /></Layout></ProtectedRoute>} />
          <Route path="/admin/production" element={<ProtectedRoute><Layout><AdminProduction /></Layout></ProtectedRoute>} />
          <Route path="/admin/finance" element={<ProtectedRoute><Layout><AdminRevenue /></Layout></ProtectedRoute>} />
          <Route path="/admin/crops" element={<ProtectedRoute><Layout><AdminCrops /></Layout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Layout><AdminSettings /></Layout></ProtectedRoute>} />

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
