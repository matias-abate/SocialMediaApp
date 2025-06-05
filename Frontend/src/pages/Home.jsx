// Frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000"; // Ajusta si tu backend corre en otra URL

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState("");
  const navigate = useNavigate();

  // 1) Al montar, traemos los posts
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        // IMPORTANTE: aquí usamos `/posts` (sin slash) para que coincida con @router.get("")
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
  

  // 2) Función para abrir/cerrar modal
  const toggleModal = () => {
    setError("");
    setNewContent("");
    setShowModal(prev => !prev);
  };

  // 3) Función para enviar un nuevo post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Extraemos el username desde el payload del token
    let username;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.sub;
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
        body: JSON.stringify({ author_id: username, content }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || "Error al crear post");
      }
      // Si se creó correctamente, recargamos la lista de posts
      const newResp = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newData = await newResp.json();
      setPosts(newData);
      toggleModal(); // cerramos el modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative bg-gray-900 min-h-screen pb-16">
      {/* Contenedor principal centrado */}
      <div className="max-w-3xl mx-auto p-4">
        {/* Título de la página */}
        <h1 className="text-2xl font-bold text-white mb-6">Inicio</h1>

        {/* Mensaje de error global */}
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* ─ Header del post ─ */}
              <div className="flex items-center mb-3">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {/* 1) Ahora asumimos que `post.author` es un objeto con `username` */}
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

              {/* ─ Contenido del post ─ */}
              <p className="text-gray-200 text-base mb-4">
                {post.content}
              </p>

              {/* ─ Barra de acciones ─ */}
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

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Botón flotante para abrir el modal de “Nuevo post” */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform transform hover:scale-110"
      >
        +
      </button>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Modal para crear un nuevo post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-xl mx-4 md:mx-0 p-6 relative">
            {/* Botón cerrar */}
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">
              Crear nuevo post
            </h2>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <textarea
                name="content"
                rows="4"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="¿Qué está pasando?"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                Publicar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
