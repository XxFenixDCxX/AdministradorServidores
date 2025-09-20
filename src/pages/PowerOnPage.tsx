import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePcStatus } from "../hooks/usePcStatus";
import PcStatusLoader from "../components/PcStatusLoader/PcStatusLoader";
import Toast from "../components/Toast/Toast";

export default function PowerOnPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "warning";
  } | null>(null);

  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const backendWolUrl = import.meta.env.VITE_BACKEND_WOL_URL as string;
  const online = usePcStatus(`${backendUrl}/health`, 5000);

  async function handlePowerOn() {
    setLoading(true);
    try {
      const res = await fetch(`${backendWolUrl}/wol`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY as string,
        },
        body: JSON.stringify({
          mac: import.meta.env.VITE_PC_MAC,
          broadcast: import.meta.env.VITE_PC_BROADCAST || "192.168.1.255",
          port: 9,
        }),
      });

      if (!res.ok) throw new Error("Error en el servidor WOL");

      setTimeout(() => {
        if (!online) {
          setToast({
            message: "No se pudo encender el servidor",
            type: "error",
          });
          setLoading(false);
        } else {
          navigate("/dashboard");
        }
      }, 15000);
    } catch {
      setToast({ message: "Error al encender el servidor", type: "error" });
      setLoading(false);
    }
  }

  if (online) {
    navigate("/prueba");
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
      {loading ? (
        <PcStatusLoader
          message="Encendiendo el servidor..."
          subtitle="Por favor, espere."
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <button
            onClick={handlePowerOn}
            disabled={loading}
            style={{
              fontSize: "2rem",
              padding: "1rem 2rem",
              borderRadius: "1rem",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {"Encender PC"}
          </button>
        </div>
      )}
      ;
    </>
  );
}
