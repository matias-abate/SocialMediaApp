import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construimos form-urlencoded en lugar de JSON
    const formBody = new URLSearchParams();
    formBody.append("username", username);
    formBody.append("password", password);
    // grant_type viene implícito como "password"

    try {
      const resp = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (resp.ok) {
        const data = await resp.json();
        // Guardamos token y navegamos (ajusta según tu flujo)
        localStorage.setItem("access_token", data.access_token);
        navigate("/home");
      } else {
        const errorData = await resp.json();
        if (resp.status === 401) {
          alert("Usuario o contraseña inválidos.");
        } else if (resp.status === 422) {
          // 422: FastAPI no está recibiendo los campos como form-urlencoded
          alert(
            "Formato de envío inválido:\n" +
              JSON.stringify(errorData.detail, null, 2)
          );
        } else {
          alert("Error inesperado al iniciar sesión.");
        }
      }
    } catch (err) {
      console.error("Error de red al iniciar sesión:", err);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center px-4">
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

        {/* Columna derecha (formulario) */}
        <div className="w-1/2 flex flex-col justify-center p-8">
          <div className="max-w-md w-full">
            <h1 className="text-6xl font-bold mb-16">Iniciar Sesión</h1>

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
                Ingresar
              </button>
            </form>

            <div className="mt-16">
              <h3 className="text-xl font-bold mb-4">¿No tienes una cuenta?</h3>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-4 border border-gray-600 rounded-full font-bold text-blue-400 hover:bg-gray-900 transition-colors text-lg"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
