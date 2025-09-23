import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import PcStatusLoader from "../../components/PcStatusLoader/PcStatusLoader";
import ServiceModal from "../../components/ServiceModal/ServiceModal";
import Toast from "../../components/Toast/Toast";

type ServiceStatus = {
  state: "offline" | "starting" | "running";
  onlinePlayers: number;
  maxPlayers: number;
  playerNames: string[];
};

type Service = {
  id: string;
  name: string;
  path: string;
  host: string;
  status: ServiceStatus;
};

export default function Dashboard() {
  const { authFetch, logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const [loagingOut, setLoggingOut] = useState(false);
  const [showShutdownModal, setShowShutdownModal] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
        const res = await authFetch(`${backendUrl}/services`);
        if (!res.ok) throw new Error("Error al cargar los servicios");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadServices();
    const interval = setInterval(loadServices, 5000);
    return () => clearInterval(interval);
  }, [authFetch, logout]);

  async function handleShutdown() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
    try {
      const res = await authFetch(`${backendUrl}/system/shutdown`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al apagar el PC");

      setLoggingOut(true);

      setTimeout(() => {
        setLoggingOut(false);
        navigate("/");
      }, 20000);
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ No se pudo apagar el PC", type: "error" });
    } finally {
      setShowShutdownModal(false);
    }
  }

  if (loading || loagingOut) {
    return (
      <PcStatusLoader
        message={
          loagingOut ? "Apagando el servidor..." : "Cargando servicios..."
        }
        subtitle="Por favor, espere."
      />
    );
  }

  return (
    <div className={styles.page}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>📊 Panel de Servicios</h1>
        <div className={styles.headerButtons}>
          <button
            className={styles.shutdown}
            onClick={() => setShowShutdownModal(true)}
          >
            ⏻ Apagar PC
          </button>
          <button
            className={styles.logout}
            onClick={() => {
              logout();
              setToast({ message: "🔒 Sesión cerrada", type: "info" });
              navigate("/");
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className={styles.cardsWrapper}>
        {services.map((service) => (
          <div
            key={service.id}
            className={`${styles.card} ${
              service.status.state === "running"
                ? styles.online
                : service.status.state === "starting"
                ? styles.starting
                : styles.offline
            }`}
            onClick={() => setSelected(service)}
          >
            <div className={styles.statusIcon}>
              {service.status.state === "running"
                ? "🟢"
                : service.status.state === "starting"
                ? "🟡"
                : "🔴"}
            </div>
            <div className={styles.cardContent}>
              <h2>{service.name}</h2>
              <p>
                IP: <span className={styles.badgeIp}>{service.host}</span>
              </p>
              <p>
                Estado:{" "}
                <span
                  className={
                    service.status.state === "running"
                      ? styles.badgeOnline
                      : service.status.state === "starting"
                      ? styles.badgeStarting
                      : styles.badgeOffline
                  }
                >
                  {service.status.state}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ServiceModal service={selected} onClose={() => setSelected(null)} />
      )}

      {showShutdownModal && (
        <div className={styles.overlay}>
          <div className={styles.shutdownModal}>
            <h2>⚠️ Confirmar apagado</h2>
            <p>¿Seguro que quieres apagar el servidor?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancel}
                onClick={() => setShowShutdownModal(false)}
              >
                Cancelar
              </button>
              <button className={styles.confirm} onClick={handleShutdown}>
                ⏻ Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
