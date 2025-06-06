// Frontend/src/pages/Friends.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Friends() {
  const [friends, setFriends] = useState([]);           // Amigos actuales (lista de usernames)
  const [allUsers, setAllUsers] = useState([]);         // Lista de todos los usuarios (objetos {id, username})
  const [selectedUser, setSelectedUser] = useState(""); // Username selecconado en el <select>
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al montar, cargamos:
    //  a) La lista de amigos de este usuario
    //  b) La lista de TODOS los usuarios (para el desplegable)
    async function loadFriendsAndUsers() {
      setError(null);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }
      let username;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        username = payload.sub; 
      } catch {
        setError("Token inválido");
        return;
      }

      // 1) Cargar amigos
      try {
        const resp = await fetch(`${API_URL}/friends/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          const data = await resp.json();
          throw new Error(data.detail || "Error al listar amigos");
        }
        const dataFriends = await resp.json(); // Array de usernames
        setFriends(dataFriends);
      } catch (err) {
        setError(err.message);
      }

      // 2) Cargar todos los usuarios para el <select>
      try {
        const resp2 = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp2.ok) {
          const data = await resp2.json();
          throw new Error(data.detail || "Error al cargar usuarios");
        }
        const dataUsers = await resp2.json(); 
        // dataUsers viene como [{ _id, username, email }, ...]
        // Ajustamos a la forma { id, username }:
        setAllUsers(dataUsers.map(u => ({ id: u._id, username: u.username })));
      } catch (err) {
        setError(err.message);
      }
    }

    loadFriendsAndUsers();
  }, [navigate]);

  // Cambia selectedUser al elegir en el <select>
  const handleSelectChange = (e) => {
    setSelectedUser(e.target.value);
  };

  // Cuando se hace clic en “Agregar”, primero validamos si ya es amigo;
  // si no, enviamos POST /friends/{mi}/{otro}.
  const handleAddFriend = async () => {
    if (!selectedUser) return;

    // 1) Si ya es amigo, mostrar pop-up y salir
    if (friends.includes(selectedUser)) {
      window.alert("Amigo ya agregado");
      return;
    }

    // 2) Si no es amigo, enviamos al backend
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    let myUsername;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      myUsername = payload.sub;
    } catch {
      setError("Token inválido");
      return;
    }

    try {
      const resp = await fetch(
        `${API_URL}/friends/${myUsername}/${selectedUser}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || "Error al enviar solicitud");
      }

      // 3) Si todo salió bien, mostramos “Solicitud enviada” y recargamos amigos
      window.alert("Solicitud enviada");

      // 3.a) Recargar la lista de amigos
      const updated = await fetch(`${API_URL}/friends/${myUsername}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (updated.ok) {
        const newFriends = await updated.json();
        setFriends(newFriends);
      }

      // Limpiar selección
      setSelectedUser("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl mb-4 text-white">Mis Amigos</h1>

      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>
      )}

      {/* ───────── DESPLEGABLE DE TODOS LOS USUARIOS ───────── */}
      <div className="mb-6">
        <label
          htmlFor="userSelect"
          className="block text-gray-300 font-medium mb-2"
        >
          Agregar nuevo amigo:
        </label>
        <div className="flex space-x-2 items-center">
          <select
            id="userSelect"
            value={selectedUser}
            onChange={handleSelectChange}
            className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Selecciona un usuario --</option>
            {allUsers
              // Filtramos para no mostrarnos a nosotros mismos ni a quienes ya son amigos
              .filter((u) => {
                let me = "";
                try {
                  me = JSON.parse(
                    atob(localStorage.getItem("access_token").split(".")[1])
                  ).sub;
                } catch {
                  me = "";
                }
                return u.username !== me && !friends.includes(u.username);
              })
              .map((u) => (
                <option key={u.id} value={u.username}>
                  {u.username}
                </option>
              ))}
          </select>
          <button
            onClick={handleAddFriend}
            disabled={!selectedUser}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition ${
              !selectedUser ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Agregar
          </button>
        </div>
      </div>

      {/* ───────── LISTA DE AMIGOS ───────── */}
      {friends.length > 0 ? (
        <ul className="list-disc list-inside text-gray-200 space-y-1">
          {friends.map((f) => (
            <li key={f} className="bg-gray-800 p-2 rounded-md">
              {f}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No tienes amigos aún.</p>
      )}
    </div>
  );
}
