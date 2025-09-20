import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";
import PcStatusLoader from "../../components/PcStatusLoader/PcStatusLoader";
import ServiceModal from "../../components/ServiceModal/ServiceModal";

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
  status: ServiceStatus;
};

export default function Dashboard() {
  const { authFetch, logout } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Service | null>(null);
  const [showShutdownModal, setShowShutdownModal] = useState(false);

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
      alert("🖥️ El PC se apagará en breve...");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo apagar el PC");
    } finally {
      setShowShutdownModal(false);
    }
  }

  if (loading) {
    return (
      <PcStatusLoader
        message="Cargando servicios..."
        subtitle="Por favor, espere."
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Panel de Servicios</h1>
        <div className={styles.headerButtons}>
          <button
            className={styles.shutdown}
            onClick={() => setShowShutdownModal(true)}
          >
            ⏻ Apagar PC
          </button>
          <button className={styles.logout} onClick={logout}>
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
