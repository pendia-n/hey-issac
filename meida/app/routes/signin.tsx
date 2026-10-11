import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../ui/api";
import { useSession } from "../ui/session";

export default function Signin() {
  const navigate = useNavigate();
  const session = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try { await api("/api/auth/signin", "POST", { username, password }); await session.refresh(); navigate("/rooms"); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Sign in failed."); }
    finally { setBusy(false); }
  }
  return <main className="form-panel"><span className="eyebrow">Welcome back</span><h1>Sign in to Meida.</h1><p className="muted">Enter your username and password.</p>
    <form onSubmit={submit}><div className="field"><label className="label" htmlFor="username">Username</label><input className="input" id="username" autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)} /></div>
      <div className="field"><label className="label" htmlFor="password">Password</label><input className="input" id="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></div>
      {message && <p className="message error" role="alert">{message}</p>}<button className="button button-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form><p className="auth-switch">New to Meida? <Link className="text-link" to="/signup">Create an account</Link></p>
  </main>;
}
