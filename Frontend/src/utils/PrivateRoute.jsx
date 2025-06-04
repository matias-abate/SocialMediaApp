// src/utils/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    // Si no está autenticado, redirige a /login
    return <Navigate to="/login" />;
  }
  return children;
}
