import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number; // Expira en segundos UNIX
  name?: string;
  role?: string | string[];
};

type AuthContextType = {
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  isTokenValid: () => boolean;
  getUserInfo: () => { username: string | null; roles: string[] };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // Recuperar token del storage al inicio
  useEffect(() => {
    const sToken = sessionStorage.getItem("token");
    if (sToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(sToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(sToken);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  async function login(username: string, password: string) {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;
      const data = await res.json();

      sessionStorage.setItem("token", data.token);
      setToken(data.token);
      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    setToken(null);
    sessionStorage.removeItem("token");
  }

  async function authFetch(input: RequestInfo, init?: RequestInit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = new Headers(init?.headers as any);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  }

  function isTokenValid() {
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  function getUserInfo() {
    if (!token) return { username: null, roles: [] };
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const username = decoded.name || null;
      const roles = Array.isArray(decoded.role)
        ? decoded.role
        : decoded.role
        ? [decoded.role]
        : [];
      return { username, roles };
    } catch {
      return { username: null, roles: [] };
    }
  }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, authFetch, isTokenValid, getUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
