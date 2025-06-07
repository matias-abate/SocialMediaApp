// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FloatingPostButton from "@/components/FloatingPostButton";

export default function AppLayout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* 1. Navbar full-width */}
      <Navbar />

      {/* 2. Contenedor centrado */}
      <div className="pt-[64px] flex justify-center"> 
        <main className="w-full max-w-3xl px-4 sm:px-6 space-y-8 pb-16">
          <Outlet />
        </main>
      </div>

      {/* 3. Botón flotante fijo */}
      <FloatingPostButton
        onClick={() => {
          /* aquí abrirías tu composer o modal */
        }}
      />
    </div>
  );
}
