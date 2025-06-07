import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

export default function AppLayout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      {/* Deja espacio para el navbar fijo */}
      <main className="pt-16 pb-16">
        {/* ÁREA CENTRAL – máx 640 px + centrado */}
        <div className="max-w-[640px] mx-auto w-full px-4 sm:px-6 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
