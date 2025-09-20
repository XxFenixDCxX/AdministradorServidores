import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Dashboard.module.css";
import PcStatusLoader from "../../components/PcStatusLoader/PcStatusLoader";

type ServiceStatus = {
  online: boolean;
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
  }, [authFetch, logout]);

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
        <button className={styles.logout} onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.cardsWrapper}>
        {services.map((service) => (
          <div
            key={service.id}
            className={`${styles.card} ${
              service.status.online ? styles.online : styles.offline
            }`}
          >
            <div className={styles.statusIcon}>
              {service.status.online ? "🟢" : "🔴"}
            </div>
            <div className={styles.cardContent}>
              <h2>{service.name}</h2>
              <p>
                Estado:{" "}
                <span
                  className={
                    service.status.online
                      ? styles.badgeOnline
                      : styles.badgeOffline
                  }
                >
                  {service.status.online ? "Online" : "Offline"}
                </span>
              </p>

              {service.status.online && (
                <>
                  <p>
                    Jugadores: {service.status.onlinePlayers} /{" "}
                    {service.status.maxPlayers}
                  </p>
                  {service.status.playerNames.length > 0 && (
                    <ul className={styles.playersList}>
                      {service.status.playerNames.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
