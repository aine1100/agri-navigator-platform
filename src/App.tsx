import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import FarmerLivestock from "./pages/farmer/FarmerLivestock";
import FarmerWeather from "./pages/farmer/FarmerWeather";
import FarmerFinancials from "./pages/farmer/FarmerFinancials";
import FarmerSettings from "./pages/farmer/FarmerSettings";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import Marketplace from "./pages/Marketplace";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminProduction from "./pages/admin/AdminProduction";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminCrops from "./pages/admin/AdminCrops";
import AdminSettings from "./pages/admin/AdminSettings";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Cart from "./pages/buyer/Cart";
import Checkout from "./pages/buyer/Checkout";
import Orders from "./pages/buyer/Orders";
import RequestResetPassword from "./components/auth/forgotPassword";
import ConfirmResetPassword from "./components/auth/confirmResetPassword";
import Payment from "./pages/buyer/Payment";
import PaymentSuccess from "./pages/buyer/PaymentSuccess";
import PaymentCancel from "./pages/buyer/PaymentCancel";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/marketplace" element={<Marketplace />} />
        
        {/* Farmer routes */}
        <Route path="/farmer" element={<ProtectedRoute><Layout><FarmerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/farmer/livestock" element={<ProtectedRoute><Layout><FarmerLivestock /></Layout></ProtectedRoute>} />
        <Route path="/farmer/weather" element={<ProtectedRoute><Layout><FarmerWeather /></Layout></ProtectedRoute>} />
        <Route path="/farmer/financials" element={<ProtectedRoute><Layout><FarmerFinancials /></Layout></ProtectedRoute>} />
        <Route path="/farmer/orders" element={<ProtectedRoute><Layout><FarmerOrders /></Layout></ProtectedRoute>} />
        <Route path="/farmer/settings" element={<ProtectedRoute><Layout><FarmerSettings /></Layout></ProtectedRoute>} />
        
        {/* Buyer routes */}
        <Route path="/buyer" element={<ProtectedRoute><Layout><BuyerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/buyer/dashboard" element={<ProtectedRoute><Layout><BuyerDashboard /></Layout></ProtectedRoute>} />
        <Route path="/buyer/cart" element={<ProtectedRoute><Layout><Cart /></Layout></ProtectedRoute>} />
        <Route path="/buyer/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
        <Route path="/buyer/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        <Route path="/buyer/payment/:orderId" element={<ProtectedRoute><Layout><Payment /></Layout></ProtectedRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/admin/farmers" element={<ProtectedRoute><Layout><AdminFarmers /></Layout></ProtectedRoute>} />
        <Route path="/admin/production" element={<ProtectedRoute><Layout><AdminProduction /></Layout></ProtectedRoute>} />
        <Route path="/admin/finance" element={<ProtectedRoute><Layout><AdminRevenue /></Layout></ProtectedRoute>} />
        <Route path="/admin/crops" element={<ProtectedRoute><Layout><AdminCrops /></Layout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Layout><AdminSettings /></Layout></ProtectedRoute>} />

        {/* Redirects for any mismatched paths */}
        <Route path="/farmer/finance" element={<Navigate to="/farmer/financials" replace />} />
        
        {/* Reset Password routes */}
        <Route path="/reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/confirm" element={<ConfirmResetPassword />} />
        
        {/* Fallback routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
