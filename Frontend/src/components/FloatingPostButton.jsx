// src/components/FloatingPostButton.jsx
import { PlusIcon } from "@heroicons/react/24/solid";

export default function FloatingPostButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 bg-secondary text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-transform"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
}