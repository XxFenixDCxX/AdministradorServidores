import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthProtectedRoute() {
  const { isTokenValid } = useAuth();

  if (!isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
