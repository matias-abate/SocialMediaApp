// src/components/Rightbar.jsx
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Rightbar() {
  return (
    <aside
      className="
        hidden xl:flex flex-col
        w-80 shrink-0 sticky top-0 h-screen
        px-4 py-6 space-y-6
        bg-gray-900 text-white
      "
    >
      {/* 1) Buscador */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-twitterLightGray" />
        <input
          type="text"
          placeholder="Buscar"
          className="
            w-full pl-10 pr-4 py-2
            bg-gray-800 rounded-full
            text-white placeholder-twitterLightGray
            focus:outline-none focus:ring-2 focus:ring-primary
          "
        />
      </div>

      {/* 2) Qué está pasando */}
      <section className="bg-gray-800 rounded-xl overflow-hidden">
        <h2 className="px-4 py-3 text-xl font-bold">Qué está pasando</h2>
        <ul className="divide-y divide-gray-700">
          {[
            { title: "#Regatas", tweets: "1.2 K publicaciones" },
            { title: "#Oberá",  tweets: "8.1 K publicaciones" },
            { title: "#Paredes",tweets: "10.4 K publicaciones" },
          ].map((x, i) => (
            <li key={i} className="px-4 py-3 hover:bg-gray-700">
              <p className="text-sm text-gray-400">Tendencia en Argentina</p>
              <span className="font-semibold">{x.title}</span>
              <p className="text-sm text-gray-500">{x.tweets}</p>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 hover:bg-gray-700 text-primary cursor-pointer">
          Mostrar más
        </div>
      </section>

      {/* 3) A quién seguir */}
      <section className="bg-gray-800 rounded-xl overflow-hidden">
        <h2 className="px-4 py-3 text-xl font-bold">A quién seguir</h2>
        <ul className="divide-y divide-gray-700">
          {[
            { name: "Chris Paul",        handle: "@CP3" },
            { name: "Rugby Champagne",   handle: "@rugbych" },
            { name: "Cristian Román",    handle: "@Cristia03587658" },
          ].map((u, i) => (
            <li
              key={i}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-700"
            >
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-gray-500">{u.handle}</p>
              </div>
              <button className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200">
                Seguir
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 hover:bg-gray-700 text-primary cursor-pointer">
          Mostrar más
        </div>
      </section>
    </aside>
  );
}
