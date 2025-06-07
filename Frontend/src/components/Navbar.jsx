import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";

const links = [
  { to: "/home", label: "Home" },
  { to: "/friends", label: "Friends" },
  { to: "/messages", label: "Messages" },
];

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black text-white border-b border-white/20">
      {/* Contenedor centrado */}
      <nav className="max-w-[1100px] mx-auto flex items-center justify-between px-4 sm:px-6">
        <ul className="flex gap-6 sm:gap-10 list-none">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "py-4 text-lg font-medium transition-colors",
                    isActive
                      ? "border-b-2 border-blue-400 font-semibold"
                      : "hover:text-blue-300"
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            onLogout?.();
            navigate("/login");
          }}
          className="py-4 text-lg font-medium hover:text-red-400 transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}
