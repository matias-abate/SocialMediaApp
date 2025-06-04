// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-black text-white items-center justify-center">
      {/* Contenedor principal que limita el ancho máximo */}
      <div className="flex w-full max-w-6xl">
        {/* Columna izquierda con el logo "SM" - Versión minimalista */}
        <div className="w-1/2 flex items-center justify-center p-4">
          <div className="text-[400px] font-bold select-none" style={{
            lineHeight: '0.8',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
            color: 'transparent',
            backgroundImage: 'linear-gradient(to right, #1DA1F2, #7928CA)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            textFillColor: 'transparent'
          }}>
            SM
          </div>
        </div>

        {/* Columna derecha con el contenido simplificado */}
        <div className="w-1/2 flex flex-col justify-center p-8">
          <div className="max-w-md w-full">
            <h1 className="text-6xl font-bold mb-16">Bienvenido a Social Media</h1>
            
            <div className="space-y-4 mb-12">
              <button 
                onClick={() => navigate("/register")}
                className="w-full py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors text-lg"
              >
                Crear cuenta
              </button>
            </div>
            
            <div className="mt-16">
              <h3 className="text-xl font-bold mb-4">¿Ya tienes una cuenta?</h3>
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-4 border border-gray-600 rounded-full font-bold text-blue-400 hover:bg-gray-900 transition-colors text-lg"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}