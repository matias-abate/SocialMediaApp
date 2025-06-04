// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-gray-200 p-4 flex justify-between items-center">
      <div>
        <Link to="/home" className="mr-4 hover:text-white">
          Inicio
        </Link>
        <Link to="/messages" className="mr-4 hover:text-white">
          Mensajes
        </Link>
        <Link to="/friends" className="hover:text-white">
          Amigos
        </Link>
      </div>

      <div>
        {currentUser ? (
          <>
            <span className="mr-4">Bienvenido, {currentUser.username}</span>
            <button
              onClick={() => {
                onLogout();
                navigate("/login");
              }}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mr-2"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              Registro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
