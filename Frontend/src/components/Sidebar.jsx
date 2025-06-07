import {
    HomeIcon,
    EnvelopeIcon,
    UserGroupIcon,
    PlusIcon,
    EllipsisHorizontalCircleIcon,
  } from "@heroicons/react/24/outline";
  import { NavLink, useNavigate } from "react-router-dom";
  import clsx from "clsx";
  
  const links = [
    { to: "/home", label: "Inicio", icon: HomeIcon },
    { to: "/messages", label: "Mensajes", icon: EnvelopeIcon },
    { to: "/friends", label: "Amigos", icon: UserGroupIcon },
  ];
  
  export default function Sidebar() {
    const navigate = useNavigate();
  
    /* ---------- STYLES COMUNES ---------- */
    const base =
      "flex items-center gap-3 px-4 py-3 rounded-full transition-colors";
  
    return (
      <>
        {/* DESKTOP ► barra izquierda */}
        <nav className="hidden lg:flex flex-col items-start fixed top-0 left-0 h-screen w-60 p-4">
          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className="text-4xl font-black mb-8 tracking-tight select-none"
          >
            SM
          </button>
  
          {/* Enlaces */}
          <ul className="flex flex-col gap-1 w-full">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    clsx(
                      base,
                      isActive
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-white/10 text-white"
                    )
                  }
                >
                  <Icon className="h-7 w-7 shrink-0" />
                  <span className="text-lg">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
  
          {/* CTA grande */}
          <button
            onClick={() => navigate("/home?#composer")}
            className="mt-auto w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-full"
          >
            Postear
          </button>
        </nav>
  
        {/* MOBILE ► barra inferior */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-black/90 border-t border-white/20 backdrop-blur flex justify-around py-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-0.5 text-xs",
                  isActive ? "text-blue-400" : "text-gray-300"
                )
              }
            >
              <Icon className="h-6 w-6" />
            </NavLink>
          ))}
  
          {/* FAB de Posteo */}
          <button
            onClick={() => navigate("/home?#composer")}
            aria-label="Nuevo post"
            className="relative -translate-y-4 bg-blue-500 hover:bg-blue-600 p-4 rounded-full shadow-md text-white"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
  
          {/* Menú "Más" */}
          <button
            title="Más"
            className="flex flex-col items-center gap-0.5 text-gray-300"
          >
            <EllipsisHorizontalCircleIcon className="h-6 w-6" />
          </button>
        </nav>
      </>
    );
  }
  