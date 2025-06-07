// src/pages/Messages.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Messages() {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // 1) Extraer userId del token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const { sub } = JSON.parse(atob(token.split(".")[1]));
      setUserId(sub);
    } catch {
      setError("Token inválido");
    }
  }, [navigate]);

  // 2) Cargar inbox, sent y amigos por separado
  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("access_token");

    // 2.a) Amigos (siempre queremos esto)
    (async () => {
      try {
        const resp = await fetch(`${API_URL}/friends/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) throw new Error("Error al cargar lista de amigos");
        const data = await resp.json();
        setFriends(data);
      } catch (e) {
        console.error("Friends load error:", e);
        // no interrumpe las otras cargas
      }
    })();

    // 2.b) Bandeja de entrada
    (async () => {
      try {
        const resp = await fetch(
          `${API_URL}/messages/inbox/${userId}?skip=0&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resp.ok) throw new Error("Error al cargar bandeja de entrada");
        const data = await resp.json();
        setInbox(data);
      } catch (e) {
        console.error("Inbox load error:", e);
        setError(e.message);
      }
    })();

    // 2.c) Mensajes enviados
    (async () => {
      try {
        const resp = await fetch(
          `${API_URL}/messages/sent/${userId}?skip=0&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resp.ok) throw new Error("Error al cargar mensajes enviados");
        const data = await resp.json();
        setSent(data);
      } catch (e) {
        console.error("Sent load error:", e);
        // no sobreescribe el mensaje de inbox
      }
    })();
  }, [userId]);

  // Handlers
  const handleSelectChange = (e) => setSelectedFriend(e.target.value);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedFriend) {
      setError("Debes seleccionar un amigo.");
      return;
    }
    if (!newMessage.trim()) {
      setError("El mensaje no puede quedar vacío.");
      return;
    }
    setError(null);

    const token = localStorage.getItem("access_token");
    const body = {
      sender_id: userId,
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
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || "Error al enviar mensaje");
      }
      // recarga sólo los enviados
      const sentResp = await fetch(
        `${API_URL}/messages/sent/${userId}?skip=0&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sentData = await sentResp.json();
      setSent(sentData);
      setNewMessage("");
      setSelectedFriend("");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white pt-16 px-4">
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        <h1 className="text-2xl mb-4">Mensajes</h1>
        {error && (
          <div className="bg-red-600 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario de envío */}
        <form
          onSubmit={handleSendMessage}
          className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
        >
          <h2 className="text-xl font-medium">Enviar un mensaje</h2>

          <div>
            <label htmlFor="friend" className="block text-gray-300 mb-1">
              Seleccioná un amigo:
            </label>
            <select
              id="friend"
              value={selectedFriend}
              onChange={handleSelectChange}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Elige un amigo --</option>
              {friends.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-300 mb-1">
              Mensaje:
            </label>
            <textarea
              id="message"
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribí tu mensaje..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white"
            >
              Enviar Mensaje
            </button>
          </div>
        </form>

        {/* Bandeja de Entrada */}
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

        {/* Mensajes Enviados */}
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
