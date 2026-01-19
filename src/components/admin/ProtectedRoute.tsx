import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const ProtectedRoute = () => {
  const isAuthenticated = isAdminAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;