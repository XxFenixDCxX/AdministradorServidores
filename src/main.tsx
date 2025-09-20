import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { registerSW } from "virtual:pwa-register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Prueba from "./pages/Prueba.tsx";
import PowerOnPage from "./pages/PowerOnPage/PowerOnPage.tsx";

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
        path: "/prueba",
        element: <Prueba />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
