import { useEffect, useState } from "react";
import { api, type BillingStatus } from "./api";
import { useSession } from "./session";

export function useBilling() {
  const { user, loading: sessionLoading } = useSession();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  async function refresh() {
    if (!user) { setStatus(null); setLoading(false); return; }
    setLoading(true);
    try { setStatus(await api<BillingStatus>("/api/billing/status")); }
    catch { setStatus(null); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (!sessionLoading) void refresh(); }, [user?.id, sessionLoading]);
  return { status, loading: loading || sessionLoading, refresh };
}
