// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <div className="flex w-full max-w-6xl">
        {/* Logo */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <span
            className="font-bold select-none leading-none"
            style={{
              fontSize: "clamp(6rem, 30vw, 20rem)", // se adapta
              backgroundImage: "linear-gradient(to right, #1DA1F2, #7928CA)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            SM
          </span>
        </div>

        {/* CTA */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12">
            Bienvenido a Social Media
          </h1>

          <button
            onClick={() => navigate("/register")}
            aria-label="Crear cuenta"
            className="w-full py-4 rounded-full font-bold text-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            Crear cuenta
          </button>

          <div className="mt-10 text-center">
            <p className="mb-4 font-medium">¿Ya tienes una cuenta?</p>
            <button
              onClick={() => navigate("/login")}
              aria-label="Iniciar sesión"
              className="w-full py-4 rounded-full font-bold text-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
