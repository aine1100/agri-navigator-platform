import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ApiError extends Error {
  response?: {
    status?: number;
    data?: string;
  };
}

export const handleTokenExpiration = (error: unknown, navigate: ReturnType<typeof useNavigate>, toast: ReturnType<typeof useToast>) => {
  const apiError = error as ApiError;
  
  if (apiError instanceof Error && (apiError.message.includes("401") || apiError.response?.status === 401)) {
    localStorage.removeItem("token");
    toast({
      title: "Session Expired",
      description: "Please log in again to continue",
      variant: "destructive",
    });
    navigate("/login");
    return true;
  }
  return false;
}; 