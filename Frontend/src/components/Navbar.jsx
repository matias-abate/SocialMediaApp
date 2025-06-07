// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar({ currentUser, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black h-16 flex items-center justify-between px-8 z-50">
      {/* Izquierda: enlaces */}
      <div className="flex space-x-12">
        <Link
          to="/home"
          className="text-white text-lg hover:underline transition-colors"
        >
          Home
        </Link>
        <Link
          to="/friends"
          className="text-white text-lg hover:underline transition-colors"
        >
          Friends
        </Link>
        <Link
          to="/messages"
          className="text-white text-lg hover:underline transition-colors"
        >
          Messages
        </Link>
      </div>

      {/* Derecha: botón de logout */}
      <div>
        {currentUser && (
          <button
            onClick={onLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
