import {
    HomeIcon,
    EnvelopeIcon,
    UserGroupIcon,
    PencilSquareIcon,
    EllipsisHorizontalCircleIcon,
  } from "@heroicons/react/24/outline";
  import { NavLink, useNavigate } from "react-router-dom";
  import clsx from "clsx";
  
  const links = [
    { to: "/home",     label: "Inicio",   icon: HomeIcon },
    { to: "/messages", label: "Mensajes", icon: EnvelopeIcon },
    { to: "/friends",  label: "Amigos",   icon: UserGroupIcon },
  ];
  
  export default function Sidebar() {
    const navigate = useNavigate();
  
    return (
      <>
        {/* --- DESKTOP SIDEBAR --- */}
        <nav className="
          hidden md:flex flex-col items-start
          w-64 shrink-0 sticky top-0 h-screen
          bg-gray-900 text-white
          px-4 py-6
        ">
          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            className="text-3xl font-extrabold mb-8"
          >
            SM
          </button>
  
          {/* Nav links */}
          <ul className="flex flex-col gap-2 w-full">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-4 px-4 py-3 rounded-full w-full transition",
                      isActive
                        ? "bg-white text-black font-semibold"
                        : "hover:bg-white/10 text-gray-300"
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
          <button
            onClick={() => navigate("/home?#composer")}
            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg w-full py-3 rounded-full"
          >
            Postear
          </button>
        </nav>
  
        {/* --- MOBILE BOTTOM NAV --- */}
        <nav className="
          md:hidden fixed bottom-0 left-0 right-0
          flex justify-around bg-gray-900 border-t border-gray-700
          py-2 z-50 text-white
        ">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  "flex flex-col items-center gap-1 text-xs",
                  isActive ? "text-blue-400" : "text-gray-400"
                )
              }
            >
              <Icon className="h-6 w-6" />
              <span>{label}</span>
            </NavLink>
          ))}
  
          {/* Más opciones */}
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <EllipsisHorizontalCircleIcon className="h-6 w-6" />
            <span className="text-xs">Más</span>
          </button>
        </nav>
      </>
    );
  }
  