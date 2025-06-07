// utils/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
