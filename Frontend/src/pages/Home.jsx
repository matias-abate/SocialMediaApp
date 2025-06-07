// Frontend/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const API_URL = "http://127.0.0.1:8000"; // Asegúrate de que coincide exactamente

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
        // GET http://127.0.0.1:8000/posts/
        const resp = await fetch(`${API_URL}/posts/`, {
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
      // POST http://127.0.0.1:8000/posts/
      const resp = await fetch(`${API_URL}/posts/`, {
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

      // Si se creó correctamente, volvemos a traer la lista
      const newResp = await fetch(`${API_URL}/posts/`, {
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
    <div className="bg-gray-900 min-h-screen text-white pt-16 pb-10">
      <main className="flex flex-col items-center mt-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-6">Inicio</h1>

        {error && (
          <div className="bg-red-600 text-white rounded-lg p-3 mb-6 w-full max-w-2xl text-center">
            {error}
          </div>
        )}

        {/* Box de creación de post centrado */}
        <form
          onSubmit={handlePostSubmit}
          className="bg-gray-800 border border-gray-700 rounded-lg shadow-md w-full max-w-lg p-6 mb-8"
        >
          <textarea
            rows="3"
            className="w-full bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-md p-3 resize-none 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Qué estás pensando...?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
            >
              Postear
            </button>
          </div>
        </form>

        {/* Lista de posts */}
        <div className="w-full max-w-2xl space-y-6">
          {posts.length === 0 && (
            <p className="text-gray-400 text-center">
              No hay publicaciones todavía.
            </p>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PostCard({ post }) {
  const [commentsCount, setCommentsCount] = useState(0);
  const [repostsCount, setRepostsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md p-6 flex flex-col">
      <div className="border-b border-gray-600 pb-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/*
              Aquí usamos post.author.username **sin** fallback “Desconocido”.
              Si por algún motivo el backend no devuelven el username, React lanzará error,
              lo cual nos ayuda a detectar más rápido que algo está mal en la API.
            */}
            <span className="text-white font-semibold">
              {post.author.username}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-200 text-base mb-4">{post.content}</p>

      {/* Fragmento de botones con contador */}
      <div className="flex justify-between text-gray-500 text-sm px-2">
        <button
          onClick={() => setCommentsCount((c) => c + 1)}
          className="flex items-center space-x-1 hover:text-blue-400 transition"
        >
          <span>💬</span>
          <span>{commentsCount}</span>
        </button>
        <button
          onClick={() => setRepostsCount((r) => r + 1)}
          className="flex items-center space-x-1 hover:text-green-400 transition"
        >
          <span>🔁</span>
          <span>{repostsCount}</span>
        </button>
        <button
          onClick={() => setLikesCount((l) => l + 1)}
          className="flex items-center space-x-1 hover:text-red-400 transition"
        >
          <span>❤️</span>
          <span>{likesCount}</span>
        </button>
        <button className="hover:text-blue-400 transition">🔗</button>
      </div>
    </div>
  );
}
