import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded: any = jwtDecode(token);
    const role = decoded.role || decoded.userRole || decoded.authorities || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    // Normalize role if it's an array or object
    let userRole = Array.isArray(role) ? role[0] : role;
    if (typeof userRole === 'object' && userRole !== null) {
      userRole = userRole.authority || userRole.role || Object.values(userRole)[0];
    }
    if (userRole === "FARMER") {
      if (!location.pathname.startsWith("/farmer")) {
        return <Navigate to="/farmer" replace />;
      }
    } else if (userRole === "BUYER") {
      if (!location.pathname.startsWith("/buyer")) {
        return <Navigate to="/buyer" replace />;
      }
    } else if (userRole === "ADMIN") {
      if (!location.pathname.startsWith("/admin")) {
        return <Navigate to="/admin" replace />;
      }
    } else {
      // Unknown role, redirect to login
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    // Invalid token, redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 