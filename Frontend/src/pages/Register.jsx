// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construimos el body tal como lo espera /auth/register
    const body = { username, email, password };

    try {
      const resp = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (resp.ok) {
        // Registro exitoso, redirigir a login
        alert("¡Usuario registrado correctamente!");
        navigate("/login");
      } else {
        // Si el backend devolvió un 400 o similar, lo mostramos
        const errorData = await resp.json();
        alert("Error al registrar: " + (errorData.detail || JSON.stringify(errorData)));
      }
    } catch (err) {
      console.error("Error al hacer fetch:", err);
      alert("Ocurrió un error inesperado.");
    }
  };

  return (
    // ─────────────────────────────────────────────────────────────────
    // Agregamos `px-4` para que siempre haya margen mínimo en pantallas angostas
    <div className="flex min-h-screen bg-black text-white items-center justify-center px-4">
      {/* 
        ── Contenedor de ancho máximo idéntico a Landing y Login.
        ── Se añade `gap-x-8` para que formulario nunca se superponga al logo “SM”.
      */}
      <div className="flex w-full max-w-6xl gap-x-8">
        {/* Columna izquierda (logo “SM”) */}
        <div className="w-1/2 flex items-center justify-center p-4">
          <div
            className="text-[400px] font-bold select-none"
            style={{
              lineHeight: "0.8",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
              color: "transparent",
              backgroundImage: "linear-gradient(to right, #1DA1F2, #7928CA)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            SM
          </div>
        </div>

        {/* Columna derecha (formulario de registro) */}
        <div className="w-1/2 flex flex-col justify-center p-8">
          <div className="max-w-md w-full">
            {/* Título con la misma jerarquía tipográfica y margen que en Login */}
            <h1 className="text-6xl font-bold mb-16">Registro</h1>

            {/* Formulario con espaciado igual al de Login (space-y-4 mb-12) */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-12">
              <input
                className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-blue-500 text-lg"
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-blue-500 text-lg"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-full focus:outline-none focus:border-blue-500 text-lg"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors text-lg"
              >
                Registrarme
              </button>
            </form>

            {/* Sección inferior idéntica a Login (texto + botón secundario) */}
            <div className="mt-16">
              <h3 className="text-xl font-bold mb-4">¿Ya tienes cuenta?</h3>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 border border-gray-600 rounded-full font-bold text-blue-400 hover:bg-gray-900 transition-colors text-lg"
              >
                Inicia Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // ─────────────────────────────────────────────────────────────────
  );
}
