import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/Toast/Toast";

import styles from "./Login.module.css";

export default function Login() {
  const { login, isTokenValid } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isTokenValid()) {
      navigate("/dashboard");
    }
  }, [isTokenValid, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) {
      navigate("/dashboard");
    } else {
      setUsername("");
      setPassword("");
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className={styles.page}>
      {error && (
        <Toast
          message={error}
          type="error"
          duration={4000}
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>🔐 Iniciar sesión</h2>

        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
}
