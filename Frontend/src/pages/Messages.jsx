// src/pages/Messages.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function Messages() {
  const [inbox, setInbox]     = useState([]);
  const [sent, setSent]       = useState([]);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function loadMessages() {
      setError(null);
      const token = localStorage.getItem("access_token");
      let username;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        username = payload.sub;
      } catch {
        setError("Token inválido");
        return;
      }

      try {
        const [inResp, sentResp] = await Promise.all([
          fetch(`${API_URL}/messages/inbox/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/messages/sent/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!inResp.ok) {
          throw new Error("Error al cargar bandeja de entrada");
        }
        if (!sentResp.ok) {
          throw new Error("Error al cargar mensajes enviados");
        }

        const inData = await inResp.json();
        const sentData = await sentResp.json();
        setInbox(inData);
        setSent(sentData);
      } catch (err) {
        setError(err.message);
      }
    }
    loadMessages();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl mb-4 text-white">Mensajes</h1>
      {error && (
        <div className="bg-red-600 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl text-gray-100 mb-2">Bandeja de Entrada</h2>
        {inbox.length === 0 && (
          <p className="text-gray-300">No tienes mensajes nuevos.</p>
        )}
        <ul className="space-y-2">
          {inbox.map((m) => (
            <li
              key={m.id}
              className="bg-gray-800 p-4 rounded shadow text-gray-200"
            >
              <div className="mb-1">
                <strong>De:</strong> {m.sender_id}{" "}
                <span className="text-sm text-gray-400">
                  ({new Date(m.sent_at).toLocaleString()})
                </span>
              </div>
              <div>{m.body}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl text-gray-100 mb-2">Mensajes Enviados</h2>
        {sent.length === 0 && (
          <p className="text-gray-300">Aún no has enviado mensajes.</p>
        )}
        <ul className="space-y-2">
          {sent.map((m) => (
            <li
              key={m.id}
              className="bg-gray-800 p-4 rounded shadow text-gray-200"
            >
              <div className="mb-1">
                <strong>Para:</strong> {m.receiver_id}{" "}
                <span className="text-sm text-gray-400">
                  ({new Date(m.sent_at).toLocaleString()})
                </span>
              </div>
              <div>{m.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
