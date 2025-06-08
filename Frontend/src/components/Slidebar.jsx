// src/components/Slidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  HomeIcon,
  EnvelopeIcon,
  UserGroupIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

const links = [
  { to: "/home",     label: "Inicio",   icon: HomeIcon },
  { to: "/messages", label: "Mensajes", icon: EnvelopeIcon },
  { to: "/friends",  label: "Amigos",   icon: UserGroupIcon },
];

export default function Slidebar() {
  const navigate = useNavigate();
  return (
    <nav
      className="
        flex flex-col items-start
        w-64 shrink-0 sticky top-0 h-screen
        bg-gray-900 text-white
        px-4 py-6
      "
    >
      {/* Logo */}
      <button
        onClick={() => navigate("/home")}
        className="text-3xl font-extrabold mb-8"
      >
        SM
      </button>

      {/* Nav links */}
      <ul className="flex flex-col gap-4 w-full">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-full w-full transition",
                  
                )
              }
            >
              <Icon className="h-6 w-6" />
              <span className="text-lg">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* CTA Post */}
      
    </nav>
  );
}
