import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../ui/api";
import { useSession } from "../ui/session";
import { useBilling } from "../ui/billing";

interface Candidate { domain: string; name: string; sourceUrl: string }
export default function NewRoom() {
  const { user, loading: sessionLoading } = useSession();
  const { status, loading: billingLoading } = useBilling();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const active = !!status?.subscription?.active;
  async function create(event: React.FormEvent) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try {
      const result = await api<{ room: { id: string }; candidates: Candidate[] }>("/api/rooms", "POST", { url });
      navigate("/rooms/" + result.room.id, { state: { candidates: result.candidates } });
    }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "The room could not be created."); }
    finally { setBusy(false); }
  }
  if (sessionLoading || billingLoading) return <main className="container"><p className="loading">Loading…</p></main>;
  if (!user) return <main className="container narrow"><h1>Sign in to create a room.</h1><Link className="button button-primary" to="/signin">Sign in</Link></main>;
  return <main className="container narrow"><span className="eyebrow">New market room</span><h1>Start with one website.</h1><p className="muted">Meida checks its public presence and suggests competitors for you to review.</p>
    {!active ? <section className="panel"><h2>Choose a subscription first</h2><p>A subscription is needed before you can enter a website URL.</p><Link className="button button-primary" to="/pricing">See the plans</Link></section> : <>
      <form className="panel" onSubmit={create}><label className="label" htmlFor="url">Website URL</label><input className="input" id="url" type="url" inputMode="url" placeholder="https://yourwebsite.com/product" required value={url} onChange={event => setUrl(event.target.value)} /><p className="field-hint">A product page is fine. Meida groups pages from the same website into one room.</p>{message && <p className="message error" role="alert">{message}</p>}<button className="button button-primary" disabled={busy || !url}>{busy ? "Creating your room…" : "Create room and find competitors"}</button></form>
    </>}
    <p className="auth-switch"><Link className="text-link" to="/rooms">Back to your rooms</Link></p>
  </main>;
}
