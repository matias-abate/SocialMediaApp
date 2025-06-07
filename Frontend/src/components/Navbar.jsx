import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { NAV_H } from "@/layouts/LayoutConsts";

const links = [
  { to: "/home",    label: "Home" },
  { to: "/friends", label: "Friends" },
  { to: "/messages",label: "Messages" },
];

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 bg-black text-white border-b border-white/20"
      style={{ height: NAV_H }}
    >
      <nav className="w-full flex items-center justify-between px-4 sm:px-8 h-full">
        <ul className="flex gap-6 sm:gap-10 list-none pl-0">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  clsx(
                    "py-4 text-lg font-medium",
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
          className="py-4 text-lg font-medium hover:text-red-400"
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}


