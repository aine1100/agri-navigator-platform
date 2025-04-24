import { NavigateFunction } from "react-router-dom";

export const handleTokenExpiration = (
  error: any,
  navigate: NavigateFunction,
  toast: any
) => {
  if (
    error?.message?.toLowerCase().includes("Invalid JWT Token") || error?.message?.includes("expiredjwtexception") ||
    // any mention of “expired”
    error?.message?.includes("expired jwt") ||
    error?.message?.includes("jwt expired")||
    error?.response?.status === 401 ||
    error?.response?.status === 403 
  ) {
    localStorage.removeItem("token");
    toast({
      title: "Session Expired",
      description: "Please log in again to continue.",
      variant: "destructive",
    });
    navigate("/login");
    return true;
  }
  return false;
}; 