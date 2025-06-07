// Frontend/src/pages/Messages.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Messages() {
  // Array de mensajes recibidos (cada m: { id, sender_username, content, created_at })
  const [inbox, setInbox] = useState([]);
  // Array de mensajes enviados (cada m: { id, receiver_username, content, created_at })
  const [sent, setSent] = useState([]);
  // Lista de amigos para el <select> (cada f: { _id, username })
  const [friends, setFriends] = useState([]);
  // Usuario (username) seleccionado en el <select>
  const [selectedFriend, setSelectedFriend] = useState("");
  // Texto del nuevo mensaje
  const [newMessage, setNewMessage] = useState("");
  // Para mostrar errores
  const [error, setError] = useState(null);
  // Propio username, extraído del token
  const [myUsername, setMyUsername] = useState(null);

  const navigate = useNavigate();

  // 1) Extraer el propio username del token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setMyUsername(payload.sub);
    } catch {
      setError("Token inválido");
    }
  }, [navigate]);

  // 2) Una vez tengamos myUsername, cargar inbox, sent y amigos
  useEffect(() => {
    if (!myUsername) return;

    async function loadData() {
      setError(null);
      const token = localStorage.getItem("access_token");

      try {
        // 2.a) Bandeja de entrada
        const inResp = await fetch(
          `${API_URL}/messages/inbox/${myUsername}?skip=0&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!inResp.ok) {
          const data = await inResp.json().catch(() => ({}));
          throw new Error(data.detail || "Error al cargar bandeja de entrada");
        }
        const inData = await inResp.json();

        // 2.b) Mensajes enviados
        const sentResp = await fetch(
          `${API_URL}/messages/sent/${myUsername}?skip=0&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!sentResp.ok) {
          const data = await sentResp.json().catch(() => ({}));
          throw new Error(data.detail || "Error al cargar mensajes enviados");
        }
        const sentData = await sentResp.json();

        // 2.c) Lista de amigos (para el <select>)
        const friendsResp = await fetch(`${API_URL}/friends/${myUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!friendsResp.ok) {
          const data = await friendsResp.json().catch(() => ({}));
          throw new Error(data.detail || "Error al cargar lista de amigos");
        }
        const friendsData = await friendsResp.json(); // [{ _id, username }, …]

        // 2.d) Guardar en estados
        setInbox(inData);
        setSent(sentData);
        setFriends(friendsData);
      } catch (err) {
        setError(err.message);
      }
    }

    loadData();
  }, [myUsername]);

  // 3) Handler para cambiar el <select> de amigos
  const handleSelectChange = (e) => {
    setSelectedFriend(e.target.value);
  };

  // 4) Handler para enviar un nuevo mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFriend) {
      setError("Debes seleccionar un amigo para enviar el mensaje.");
      return;
    }
    if (!newMessage.trim()) {
      setError("El mensaje no puede quedar vacío.");
      return;
    }
    setError(null);

    const token = localStorage.getItem("access_token");
    let senderId = "";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      senderId = payload.sub;
    } catch {
      setError("Token inválido");
      return;
    }

    // Construimos el body según el modelo Message (input):
    // { sender_id: string, receiver_id: string, content: string, created_at: string }
    const body = {
      sender_id: senderId,
      receiver_id: selectedFriend,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      const resp = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const dataErr = await resp.json().catch(() => ({}));
        throw new Error(dataErr.detail || "Error al enviar mensaje");
      }

      // 4.a) Recargar sólo la lista de “sent” para mostrar el nuevo
      const sentResp = await fetch(
        `${API_URL}/messages/sent/${myUsername}?skip=0&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!sentResp.ok) {
        throw new Error("Error al recargar mensajes enviados");
      }
      const sentData = await sentResp.json();
      setSent(sentData);

      // Limpiar campos del formulario
      setNewMessage("");
      setSelectedFriend("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    //  ¡IMPRESCINDIBLE!: pt-16 para que todo quede debajo del Navbar fijo
    <div className="bg-gray-900 min-h-screen text-white pt-16 px-4">
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        <h1 className="text-2xl mb-4">Mensajes</h1>
        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* ─── Formulario para enviar un mensaje ─── */}
        <form
          onSubmit={handleSendMessage}
          className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-xl font-medium">Enviar un mensaje</h2>

          {/* Select para escoger amigo */}
          <div>
            <label htmlFor="friend" className="block text-gray-300 mb-1">
              Seleccioná un amigo:
            </label>
            <select
              id="friend"
              value={selectedFriend}
              onChange={handleSelectChange}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Elige un amigo --</option>
              {friends.map((f) => (
                <option key={f._id} value={f.username}>
                  {f.username}
                </option>
              ))}
            </select>
          </div>

          {/* Textarea para el mensaje */}
          <div>
            <label htmlFor="message" className="block text-gray-300 mb-1">
              Mensaje:
            </label>
            <textarea
              id="message"
              rows="3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribí tu mensaje..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white font-medium transition"
            >
              Enviar Mensaje
            </button>
          </div>
        </form>

        {/* ─── Bandeja de Entrada ─── */}
        <section className="mb-8">
          <h2 className="text-xl text-gray-100 mb-2">Bandeja de Entrada</h2>
          {inbox.length === 0 ? (
            <p className="text-gray-300">No tienes mensajes nuevos.</p>
          ) : (
            <ul className="space-y-2">
              {inbox.map((m) => (
                <li
                  key={m.id}
                  className="bg-gray-800 p-4 rounded shadow text-gray-200"
                >
                  <div className="mb-1">
                    <strong>De:</strong> {m.sender_username}{" "}
                    <span className="text-sm text-gray-400">
                      ({new Date(m.created_at).toLocaleString()})
                    </span>
                  </div>
                  <div>{m.content}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ─── Mensajes Enviados ─── */}
        <section>
          <h2 className="text-xl text-gray-100 mb-2">Mensajes Enviados</h2>
          {sent.length === 0 ? (
            <p className="text-gray-300">Aún no has enviado mensajes.</p>
          ) : (
            <ul className="space-y-2">
              {sent.map((m) => (
                <li
                  key={m.id}
                  className="bg-gray-800 p-4 rounded shadow text-gray-200"
                >
                  <div className="mb-1">
                    <strong>Para:</strong> {m.receiver_username}{" "}
                    <span className="text-sm text-gray-400">
                      ({new Date(m.created_at).toLocaleString()})
                    </span>
                  </div>
                  <div>{m.content}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
