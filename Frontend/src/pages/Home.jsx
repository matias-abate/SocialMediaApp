// Frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

// IMPORT CORRECTO PARA HEROICONS v2 (24/outline)
import {
  HomeIcon,
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [newContent, setNewContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const resp = await fetch(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Error al cargar posts");
        const data = await resp.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    let userId;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.sub;
    } catch {
      return;
    }

    const content = newContent.trim();
    if (!content) return;

    try {
      const resp = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ author_id: userId, content }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || "Error al crear post");
      }
      const newResp = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newData = await newResp.json();
      setPosts(newData);
      setNewContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen text-white">
      {/* Contenedor principal centrado */}
      <div className="flex w-full max-w-7xl">
        
        {/* Columna Izquierda - Menú */}
        <nav className="hidden md:flex flex-col w-64 p-4 space-y-4 border-r border-gray-700">
          <div className="mb-6">
            <span className="text-3xl font-bold">X</span>
          </div>
          <MenuItem
            icon={<HomeIcon className="w-6 h-6" />}
            label="Inicio"
            onClick={() => navigate("/")}
          />
          <MenuItem icon={<HashtagIcon className="w-6 h-6" />} label="Explorar" />
          <MenuItem icon={<BellIcon className="w-6 h-6" />} label="Notificaciones" />
          <MenuItem icon={<InboxIcon className="w-6 h-6" />} label="Mensajes" />
          <MenuItem icon={<BookmarkIcon className="w-6 h-6" />} label="Guardados" />
          <MenuItem
            icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
            label="Listas"
          />
          <MenuItem icon={<UserIcon className="w-6 h-6" />} label="Perfil" />
          <MenuItem
            icon={<EllipsisHorizontalCircleIcon className="w-6 h-6" />}
            label="Más opciones"
          />

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition"
            onClick={handlePostSubmit}
          >
            Postear
          </button>
        </nav>

        {/* Columna Central - Contenido principal CENTRADO */}
        <main className="flex-1 border-x border-gray-700 min-w-0 max-w-2xl mx-auto">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Inicio</h1>

            {error && (
              <div className="bg-red-600 text-white p-3 rounded mb-6 text-center">{error}</div>
            )}

            {/* Caja de creación de post */}
            <div className="bg-gray-800 p-4 rounded-xl mb-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4" />
                <textarea
                  rows="3"
                  className="flex-grow bg-gray-700 text-white p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="¿Qué está pasando?"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handlePostSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full font-semibold transition"
                >
                  Postear
                </button>
              </div>
            </div>

            {/* Lista de posts - CENTRADA */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full mr-4" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-lg">
                          {post.author.username}
                        </span>
                        <span className="text-gray-500 text-sm">
                          @{post.author.username}
                        </span>
                        <span className="text-gray-500 text-sm">·</span>
                        <span className="text-gray-500 text-sm">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-200 text-base mb-4">{post.content}</p>

                  <div className="flex justify-between text-gray-500 text-sm px-2">
                    <button className="flex items-center space-x-1 hover:text-blue-400 transition">
                      <span>💬</span>
                      <span>0</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-400 transition">
                      <span>🔁</span>
                      <span>0</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-red-400 transition">
                      <span>❤️</span>
                      <span>0</span>
                    </button>
                    <button className="hover:text-blue-400 transition">🔗</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Columna Derecha - Barra lateral */}
        <aside className="hidden lg:flex flex-col w-80 p-4 space-y-6 border-l border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-2 text-gray-500">🔍</span>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-3 text-center">Qué está pasando</h2>
            <ul className="space-y-3">
              <TrendItem category="Deportes" tag="#Argentina" />
              <TrendItem category="Música" tag="#Lollapalooza" />
              <TrendItem category="Política" tag="#Elecciones2025" />
              <TrendItem category="Tendencia" tag="#OpenAI" />
            </ul>
            <button className="mt-3 text-blue-400 hover:underline text-sm w-full text-center">
              Mostrar más
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-3 text-center">A quién seguir</h2>
            <FollowItem name="Matías Abate" handle="@matiasabate" />
            <FollowItem name="Juan Pérez" handle="@juanperez" />
            <FollowItem name="María Gómez" handle="@mariagomez" />
            <button className="mt-3 text-blue-400 hover:underline text-sm w-full text-center">
              Mostrar más
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 py-2 px-4 rounded-full hover:bg-gray-700 transition w-full text-left"
    >
      {icon}
      <span className="text-white text-lg">{label}</span>
    </button>
  );
}

function TrendItem({ category, tag }) {
  return (
    <li className="text-center">
      <span className="text-gray-500 text-xs">{category}</span>
      <p className="text-white font-semibold">{tag}</p>
    </li>
  );
}

function FollowItem({ name, handle }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-600 rounded-full" />
        <div>
          <p className="text-white font-semibold">{name}</p>
          <p className="text-gray-500 text-sm">{handle}</p>
        </div>
      </div>
      <button className="bg-white text-black text-sm font-semibold py-1 px-3 rounded-full hover:bg-gray-200 transition">
        Seguir
      </button>
    </div>
  );
}