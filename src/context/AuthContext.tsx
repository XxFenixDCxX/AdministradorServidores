import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";

type AuthContextType = {
  user: string | null;
  roles: string[];
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const sUser = sessionStorage.getItem("user");
    const sRoles = sessionStorage.getItem("roles");
    const sToken = sessionStorage.getItem("token");
    if (sUser) setUser(sUser);
    if (sRoles) setRoles(JSON.parse(sRoles));
    if (sToken) setToken(sToken);
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
      setUser(data.username);
      setRoles(data.roles || []);
      setToken(data.token);

      sessionStorage.setItem("user", data.username);
      sessionStorage.setItem("roles", JSON.stringify(data.roles || []));
      sessionStorage.setItem("token", data.token);

      return true;
    } catch {
      return false;
    }
  }

  function logout() {
    setUser(null);
    setRoles([]);
    setToken(null);
    sessionStorage.clear();
  }

  async function authFetch(input: RequestInfo, init?: RequestInit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = new Headers(init?.headers as any);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  }

  return (
    <AuthContext.Provider
      value={{ user, roles, token, login, logout, authFetch }}
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
