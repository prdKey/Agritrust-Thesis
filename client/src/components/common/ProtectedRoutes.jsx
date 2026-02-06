import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext.jsx"
import Loader from "./Loader";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();
  
  // 🔐 Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/", { replace: true });
      } else if (roles) {
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (!allowedRoles.includes(user.role)) {
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, loading, roles, navigate]);
  
  // ⏳ Still loading
  if (loading) return <Loader />;

  // ❌ User not ready OR redirecting
  if (user)
    { 
      console.log(roles)
    }
  
  // ✅ Authorized
  return children;
}
