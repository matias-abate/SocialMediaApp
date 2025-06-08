// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Slidebar from "@/components/Slidebar";
import Rightbar from "@/components/Rightbar";
import FloatingPostButton from "@/components/FloatingPostButton";
import { NAV_H } from "./LayoutConsts";

export default function AppLayout() {
  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* 1) Sidebar fijo a la izquierda */}
      <Slidebar />

      {/* 2) Contenido principal centrado */}
      <main
        className="flex-1 pt-[64px] pb-16 px-4"
        style={{ paddingTop: NAV_H }}
      >
        <div className="max-w-[640px] mx-auto space-y-6">
          <Outlet />
        </div>
      </main>

      {/* 3) Rightbar a la derecha */}
      <Rightbar />

      {/* 4) Botón flotante */}
      <FloatingPostButton onClick={() => { /* abre tu modal/composer */ }} />
    </div>
  );
}
