import { createContext, useContext, useEffect, useState } from "react";
import { api, type SessionUser } from "./api";

interface SessionState { user: SessionUser | null; loading: boolean; refresh: () => Promise<void> }
const Context = createContext<SessionState>({ user: null, loading: true, refresh: async () => {} });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  async function refresh() {
    try { const response = await api<{ user: SessionUser }>("/api/auth/me"); setUser(response.user); }
    catch { setUser(null); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  return <Context.Provider value={{ user, loading, refresh }}>{children}</Context.Provider>;
}

export function useSession() { return useContext(Context); }
