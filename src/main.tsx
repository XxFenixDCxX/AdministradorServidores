import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { registerSW } from "virtual:pwa-register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PowerOnPage from "./pages/PowerOnPage/PowerOnPage.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthProtectedRoute from "./components/AuthProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

registerSW({
  onNeedRefresh() {
    if (confirm("Hay una nueva versión, ¿quieres recargar?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("La app ya funciona offline 🎉");
  },
});

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

const router = createBrowserRouter([
  {
    path: "/",
    element: <PowerOnPage />,
  },
  {
    element: <ProtectedRoute pingUrl={`${backendUrl}/health`} />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        element: <AuthProtectedRoute />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
