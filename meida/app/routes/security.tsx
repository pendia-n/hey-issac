import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../ui/api";
import { useSession } from "../ui/session";

export default function Security() {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  if (loading) return <main className="container"><p className="loading">Loading your account…</p></main>;
  if (!user) return <main className="container narrow"><h1>Sign in to manage security.</h1><p><Link className="text-link" to="/signin">Go to sign in</Link></p></main>;
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage(""); setBusy(true);
    try { await api("/api/auth/password", "POST", { currentPassword, newPassword }); setMessage("Password changed. Sign in again with your new password."); await api("/api/auth/signout", "POST"); navigate("/signin"); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Password could not be changed."); }
    finally { setBusy(false); }
  }
  const strong = newPassword.length >= 7 && newPassword.length <= 18 && /[a-z]/i.test(newPassword) && /\d/.test(newPassword);
  return <main className="container narrow"><div className="page-top"><div><span className="eyebrow">Account security</span><h1>Change your password</h1><p className="muted">Signed in as <strong>{user.username}</strong></p></div></div>
    <section className="panel"><p className="small-note">Meida does not offer password recovery. Keep your username and password somewhere secure.</p><form onSubmit={submit}>
      <div className="field"><label className="label" htmlFor="current">Current password</label><input className="input" id="current" type="password" autoComplete="current-password" required value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} /></div>
      <div className="field"><label className="label" htmlFor="new">New password</label><input className="input" id="new" type="password" autoComplete="new-password" minLength={7} maxLength={18} required value={newPassword} onChange={event => setNewPassword(event.target.value)} /><div className="field-hint">{newPassword ? strong ? <span className="valid">Password meets the requirements.</span> : <span className="invalid">Use 7–18 characters with a letter and number.</span> : "7–18 characters, with at least one letter and one number."}</div></div>
      {message && <p className="message" role="status">{message}</p>}<button className="button button-primary" disabled={busy || !strong}>{busy ? "Updating…" : "Change password"}</button>
    </form><p className="fine-print">For your protection, changing your password signs you out of this session and all other sessions.</p></section>
  </main>;
}
