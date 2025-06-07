import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RequireAuth from "@/utils/RequireAuth";    // → comprueba token; redirige a /login
import AppLayout from "@/layouts/AppLayout";      // → Sidebar + Outlet + RightBar
import AuthLayout from "@/layouts/AuthLayout";    // → Contenedor sencillo para login/register

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Messages from "@/pages/Messages";
import Friends from "@/pages/Friends";

// React Query:
const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

const router = createBrowserRouter([
  // Páginas públicas
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // Páginas privadas
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "/home", element: <Home /> },
      { path: "/messages", element: <Messages /> },
      { path: "/friends", element: <Friends /> },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/" /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
