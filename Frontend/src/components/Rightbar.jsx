// src/components/Rightbar.jsx
export default function Rightbar() {
    return (
      <div className="p-4 space-y-6">
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="
              w-full bg-gray-800 text-white
              rounded-full pl-4 pr-10 py-2
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        </div>
  
        {/* Suscripción Premium */}
        <div className="bg-gray-800 rounded-xl p-4 space-y-2">
          <h2 className="font-bold text-lg">Suscríbete a Premium</h2>
          <p className="text-sm text-gray-400">
            Desbloquea funciones exclusivas y apoyo a creadores.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            Suscribirse
          </button>
        </div>
  
        {/* Trending */}
        <div className="bg-gray-800 rounded-xl p-4 space-y-2">
          <h2 className="font-bold text-lg">Qué está pasando</h2>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li>#ReactJS</li>
            <li>#TailwindCSS</li>
            <li>#JavaScript</li>
          </ul>
        </div>
      </div>
    );
  }
  