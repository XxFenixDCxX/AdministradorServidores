import { useState, useEffect, useRef } from "react";
import styles from "./ServiceModal.module.css";
import { useAuth } from "../../context/AuthContext";

type Props = {
  service: {
    id: string;
    name: string;
    status: {
      state: "offline" | "starting" | "running";
      onlinePlayers: number;
      maxPlayers: number;
      playerNames: string[];
    };
  };
  onClose: () => void;
};

export default function ServiceModal({ service, onClose }: Props) {
  const { authFetch } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [status, setStatus] = useState(service.status);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Poll de logs y estado
  useEffect(() => {
    if (status.state === "offline") return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

    const interval = setInterval(async () => {
      // Logs
      const resLogs = await authFetch(
        `${backendUrl}/services/${service.id}/logs`
      );
      if (resLogs.ok) {
        const data = await resLogs.json();
        setLogs(data);
      }

      // Estado + jugadores
      const resStatus = await authFetch(
        `${backendUrl}/services/${service.id}/status`
      );
      if (resStatus.ok) {
        const data = await resStatus.json();
        setStatus(data);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [authFetch, service.id, status.state]);

  async function handleStart() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
    await authFetch(`${backendUrl}/services/${service.id}/start`, {
      method: "POST",
    });
    setStatus({ ...status, state: "starting" });
  }

  async function handleStop() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
    await authFetch(`${backendUrl}/services/${service.id}/stop`, {
      method: "POST",
    });
    setStatus({
      ...status,
      state: "offline",
      onlinePlayers: 0,
      maxPlayers: 0,
      playerNames: [],
    });
  }

  async function handleCommand(e: React.FormEvent) {
    e.preventDefault();
    if (!command.trim()) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
    await authFetch(`${backendUrl}/services/${service.id}/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });

    setCommand("");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>
          ✖
        </button>

        <h2 className={styles.title}>{service.name}</h2>

        {status.state === "offline" ? (
          <div className={styles.centered}>
            <p className={styles.subtitle}>El servicio está apagado</p>
            <button className={styles.startButton} onClick={handleStart}>
              🚀 Encender
            </button>
          </div>
        ) : (
          <>
            <p className={styles.state}>
              Estado:{" "}
              {status.state === "starting" ? "🟡 Iniciando..." : "🟢 Online"}
            </p>
            {(status.playerNames ?? []).length > 0 && (
              <ul className={styles.playersList}>
                {(status.playerNames ?? []).map((p) => (
                  <li key={p} className={styles.playerItem}>
                    <span className={styles.avatar}>{p[0]}</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}

            <div ref={consoleRef} className={styles.console}>
              {logs.map((line, idx) => (
                <pre key={idx}>{line}</pre>
              ))}
            </div>

            {status.state === "running" && (
              <form onSubmit={handleCommand} className={styles.commandForm}>
                <input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Escribe un comando..."
                />
                <button type="submit">Enviar</button>
              </form>
            )}

            <div className={styles.centered}>
              <button className={styles.stopButton} onClick={handleStop}>
                Apagar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
