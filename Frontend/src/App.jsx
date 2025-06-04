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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar currentUser={user} onLogout={logout} />

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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
