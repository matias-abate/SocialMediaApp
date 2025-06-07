// src/pages/Friends.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Friends() {
  const [friends, setFriends] = useState([]);         // array de usernames
  const [allUsers, setAllUsers] = useState([]);       // [{ id, username }]
  const [suggestions, setSuggestions] = useState([]); // array de usernames
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const reloadAll = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login"); return; }
    let me;
    try {
      me = JSON.parse(atob(token.split(".")[1])).sub;
    } catch {
      setError("Token inválido");
      return;
    }
    // Amigos
    const fResp = await fetch(`${API_URL}/friends/${me}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (fResp.ok) {
      const data = await fResp.json();
      const names = Array.isArray(data)
        ? data.map(item => item.username || item.id)
        : [];
      setFriends(Array.from(new Set(names)));
    }
    // Sugerencias
    const sResp = await fetch(`${API_URL}/friends/suggestions/${me}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (sResp.ok) {
      const data = await sResp.json();
      setSuggestions(Array.from(new Set(data)));
    }
  };

  useEffect(() => {
    (async () => {
      setError(null);
      await reloadAll();
      // Todos los usuarios
      const token = localStorage.getItem("access_token");
      if (!token) { return; }
      try {
        const resp = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error("Error al cargar usuarios");
        const data = await resp.json();
        const users = data.map(u => ({
          id: u._id,
          username: u.username
        }));
        setAllUsers(users);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [navigate]);

  // Agrega un amigo desde el <select>
  const handleAddFriend = async () => {
    if (!selectedUser) return;
    if (friends.includes(selectedUser)) {
      alert("Ya es tu amigo");
      return;
    }
    const token = localStorage.getItem("access_token");
    let me;
    try {
      me = JSON.parse(atob(token.split(".")[1])).sub;
    } catch {
      setError("Token inválido"); return;
    }
    try {
      const resp = await fetch(
        `${API_URL}/friends/${me}/${selectedUser}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!resp.ok) {
        const { detail } = await resp.json().catch(() => ({}));
        throw new Error(detail || "Error al agregar amigo");
      }
      alert("Solicitud enviada");
      setSelectedUser("");
      await reloadAll();
    } catch (e) {
      setError(e.message);
    }
  };

  // Agrega un amigo desde la lista de sugerencias
  const handleAddSuggested = async username => {
    const token = localStorage.getItem("access_token");
    let me;
    try {
      me = JSON.parse(atob(token.split(".")[1])).sub;
    } catch {
      setError("Token inválido"); return;
    }
    try {
      const resp = await fetch(
        `${API_URL}/friends/${me}/${username}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!resp.ok) {
        const { detail } = await resp.json().catch(() => ({}));
        throw new Error(detail || "Error al agregar sugerido");
      }
      alert(`Agregaste a ${username}`);
      await reloadAll();
    } catch (e) {
      setError(e.message);
    }
  };

  // Lista sin duplicados, excluyendo ya-amigos
  const available = allUsers
    .map(u => u.username)
    .filter(u => u && !friends.includes(u) && u !== "");

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6 mt-8">
        <h1 className="text-2xl">Mis Amigos</h1>
        {error && (
          <div className="bg-red-600 p-2 rounded">{error}</div>
        )}

        {/* Form: Agregar amigo */}
        <div>
          <label className="block mb-2">Agregar nuevo amigo:</label>
          <div className="flex space-x-2">
            <select
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
              className="flex-1 bg-gray-700 p-2 rounded"
            >
              <option value="">-- selecciona --</option>
              {available.map((username, i) => (
                <option key={`${username}-${i}`} value={username}>
                  {username}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddFriend}
              disabled={!selectedUser}
              className="bg-blue-500 px-4 rounded disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Amigos actuales */}
        <div>
          <h2 className="text-xl mb-2">Amigos actuales</h2>
          {friends.length > 0 ? (
            <ul className="space-y-1">
              {friends.map((username, i) => (
                <li
                  key={`${username}-${i}`}
                  className="bg-gray-800 p-2 rounded"
                >
                  {username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No tienes amigos aún.</p>
          )}
        </div>

        {/* Sugerencias */}
        <div>
          <h2 className="text-xl mb-2">Sugerencias</h2>
          {suggestions.length > 0 ? (
            <ul className="space-y-1">
              {suggestions.map((username, i) => (
                <li
                  key={`${username}-${i}`}
                  className="bg-gray-800 p-2 rounded flex justify-between"
                >
                  <span>{username}</span>
                  <button
                    onClick={() => handleAddSuggested(username)}
                    className="bg-green-500 px-3 rounded text-sm"
                  >
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              No hay sugerencias por el momento.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
