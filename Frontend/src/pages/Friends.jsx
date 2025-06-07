// src/pages/Friends.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* ---------------- helpers ---------------- */
  const getMyId = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).sub;
    } catch {
      return null;
    }
  };

  const reloadAll = async () => {
    const token = localStorage.getItem("access_token");
    const me = getMyId();
    if (!token || !me) {
      navigate("/login");
      return;
    }

    try {
      const [fRes, sRes] = await Promise.all([
        fetch(`${API_URL}/friends/${me}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/friends/suggestions/${me}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (fRes.ok) {
        const data = await fRes.json();
        setFriends([...new Set(data.map((u) => u.username || u.id))]);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setSuggestions([...new Set(data)]);
      }
    } catch (e) {
      setError("No se pudieron cargar amigos/sugerencias");
    }
  };

  /* ---------------- initial load ---------------- */
  useEffect(() => {
    (async () => {
      setError(null);
      await reloadAll();

      // todos los usuarios (para el <select>)
      const token = localStorage.getItem("access_token");
      const me = getMyId();
      if (!token || !me) return;

      try {
        const resp = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Error al cargar usuarios");
        const users = (await resp.json()).map((u) => ({
          id: u._id,
          username: u.username,
        }));
        setAllUsers(users);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [navigate]);

  /* ---------------- actions ---------------- */
  const addFriend = async (username) => {
    const token = localStorage.getItem("access_token");
    const me = getMyId();
    if (!token || !me) return;

    try {
      const resp = await fetch(`${API_URL}/friends/${me}/${username}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        const { detail } = await resp.json().catch(() => ({}));
        throw new Error(detail || "Error al agregar amigo");
      }
      await reloadAll();
      setSelectedUser("");
    } catch (e) {
      setError(e.message);
    }
  };

  const available = allUsers
    .map((u) => u.username)
    .filter((u) => u && !friends.includes(u));

  /* ---------------- UI ---------------- */
  return (
    /* ❶  solo espacio vertical entre secciones; AppLayout maneja centrado y padding */
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Mis Amigos</h1>

      {error && <div className="bg-red-600 p-2 rounded">{error}</div>}

      {/* --- formulario --- */}
      <section className="space-y-2">
        <label className="block font-medium">Agregar nuevo amigo:</label>
        <div className="flex gap-2">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="flex-1 bg-gray-800 p-2 rounded"
          >
            <option value="">-- selecciona --</option>
            {available.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <button
            onClick={() => addFriend(selectedUser)}
            disabled={!selectedUser}
            className="bg-blue-600 px-4 rounded disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </section>

      {/* --- amigos actuales --- */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Amigos actuales</h2>
        {friends.length ? (
          <ul className="list-disc list-inside space-y-1">
            {friends.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No tienes amigos aún.</p>
        )}
      </section>

      {/* --- sugerencias --- */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Sugerencias</h2>
        {suggestions.length ? (
          <ul className="space-y-2">
            {suggestions.map((u) => (
              <li key={u} className="flex justify-between">
                <span>{u}</span>
                <button
                  onClick={() => addFriend(u)}
                  className="bg-green-600 px-3 rounded text-sm"
                >
                  Agregar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay sugerencias por ahora.</p>
        )}
      </section>
    </div>
  );
}
