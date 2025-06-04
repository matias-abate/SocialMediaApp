// src/pages/Friends.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadFriends() {
      setError(null);
      const token = localStorage.getItem("access_token");
      // Supongamos que tu JWT lleva el username en payload.sub
      let username;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        username = payload.sub;
      } catch {
        setError("Token inválido");
        return;
      }

      try {
        const resp = await fetch(`${API_URL}/friends/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) {
          const data = await resp.json();
          throw new Error(data.detail || "Error al listar amigos");
        }
        const data = await resp.json(); // data es lista de user_id (strings)
        setFriends(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadFriends();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-white">Mis Amigos</h1>
      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}
      <ul className="list-disc list-inside text-gray-200">
        {friends.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );

  async function loadSuggestions() {
    const token = localStorage.getItem("access_token");
    let username;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.sub;
    } catch {
      return;
    }
    try {
      const resp = await fetch(
        `${API_URL}/friends/suggestions/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!resp.ok) {
        return;
      }
      const data = await resp.json(); // lista de usernames sugeridos
      setSuggestions(data);
    } catch {
      // ignore
    }
  }
  loadSuggestions();
}
