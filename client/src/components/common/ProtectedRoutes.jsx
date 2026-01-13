import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../context/RoleContext";

export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated } = useAuth();
  const { userRole } = useRole();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (role && role !== userRole) return <Navigate to="/" />;

  return children;
}