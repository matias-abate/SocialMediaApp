// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      const token = localStorage.getItem("access_token");
      const resp = await fetch("http://127.0.0.1:8000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json();
      setPosts(data);
    }
    loadPosts();
  }, []);

  // src/pages/Home.jsx (continuación, justo arriba de la lista de posts)
return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-white">Últimos Posts</h1>
      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}
  
      {/* Formulario para crear un post */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-lg text-white mb-2">Crear Nuevo Post</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const token = localStorage.getItem("access_token");
            let username;
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              username = payload.sub;
            } catch {
              return;
            }
            const content = e.target.content.value.trim();
            if (!content) return;
  
            try {
              const resp = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  author_id: username,
                  content,
                }),
              });
              if (!resp.ok) {
                const data = await resp.json();
                throw new Error(data.detail || "Error al crear post");
              }
              e.target.reset();
              // Recargar posts
              const newResp = await fetch(`${API_URL}/posts`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const newData = await newResp.json();
              setPosts(newData);
            } catch (err) {
              setError(err.message);
            }
          }}
        >
          <textarea
            name="content"
            rows="3"
            className="w-full px-2 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            placeholder="¿Qué estás pensando?"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
          >
            Publicar
          </button>
        </form>
      </div>
  
      {/* Aquí sigue la lista de posts como antes */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-4 rounded shadow flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-white">
                Autor: {post.author_id}
              </span>
              <span className="text-sm text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-200">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );  
}
