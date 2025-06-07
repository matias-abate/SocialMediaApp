// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Friends from "./pages/Friends";
import Navbar from "./components/Navbar";
import PrivateRoute from "./utils/PrivateRoute";
import { useAuth } from "./utils/auth";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen w-screen">
      {/* Navbar fijo arriba */}
      <Navbar currentUser={user} onLogout={logout} />

      {/*
        El navbar ocupa h-16 (≈ 4rem) de alto en la pantalla.
        Agregamos pt-16 para que el contenido de abajo comience justo después.
      */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <PrivateRoute isAuthenticated={!!user}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute isAuthenticated={!!user}>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <PrivateRoute isAuthenticated={!!user}>
                <Friends />
              </PrivateRoute>
            }
          />

          {/* Cualquier otra ruta redirige a /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}
