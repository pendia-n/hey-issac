import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../ui/api";
import { useSession } from "../ui/session";

function validName(value: string) { return /^[a-z][a-z0-9_]{2,19}$/.test(value); }
function validPassword(value: string) { return value.length >= 7 && value.length <= 18 && /[a-z]/i.test(value) && /\d/.test(value); }

export default function Signup() {
  const navigate = useNavigate();
  const session = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [availability, setAvailability] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!validName(username)) { setAvailability("idle"); return; }
    setAvailability("checking");
    const timer = window.setTimeout(() => {
      void api<{ available: boolean }>("/api/auth/check-username?username=" + encodeURIComponent(username.toLowerCase()))
        .then(result => setAvailability(result.available ? "available" : "taken"))
        .catch(() => setAvailability("error"));
    }, 350);
    return () => clearTimeout(timer);
  }, [username]);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("");
    if (availability === "checking") { setMessage("Wait for the username check to finish."); return; }
    if (availability === "taken") { setMessage("That username is already taken."); return; }
    if (!validPassword(password)) { setMessage("Use 7–18 characters with at least one letter and one number."); return; }
    setBusy(true);
    try { await api("/api/auth/signup", "POST", { username, password }); await session.refresh(); navigate("/rooms"); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Account could not be created."); }
    finally { setBusy(false); }
  }
  return <main className="form-panel"><span className="eyebrow">Create your account</span><h1>Make a room for your market.</h1><p className="muted">Use a username and password. If you lose either, this account cannot be recovered.</p>
    <form onSubmit={submit}>
      <div className="field"><label className="label" htmlFor="username">Username</label><input className="input" id="username" autoComplete="username" minLength={3} maxLength={20} required value={username} onChange={event => setUsername(event.target.value.toLowerCase())} aria-describedby="name-hint" />
        <div id="name-hint" className={"inline-status " + (availability === "taken" ? "invalid" : availability === "available" ? "valid" : "muted")} aria-live="polite">{!username ? "3–20 characters. Start with a letter; use letters, numbers or _." : !validName(username) ? "Use 3–20 characters and start with a letter." : availability === "checking" ? "Checking username…" : availability === "available" ? "Username is available." : availability === "taken" ? "That username is already taken." : availability === "error" ? "Could not check right now. You can still submit; the server will confirm." : "3–20 characters. Start with a letter; use letters, numbers or _."}</div>
      </div>
      <div className="field"><label className="label" htmlFor="password">Password</label><input className="input" id="password" type="password" autoComplete="new-password" minLength={7} maxLength={18} required value={password} onChange={event => setPassword(event.target.value)} aria-describedby="password-hint" />
        <div className="inline-status" id="password-hint" aria-live="polite">{password.length === 0 ? "7–18 characters, including at least one letter and one number." : validPassword(password) ? <span className="valid">Password meets the requirements.</span> : <span className="invalid">{password.length < 7 ? "Use at least 7 characters." : password.length > 18 ? "Use no more than 18 characters." : !/[a-z]/i.test(password) ? "Add at least one letter." : "Add at least one number."}</span>}</div>
      </div>
      {message && <p className="message error" role="alert">{message}</p>}
      <button className="button button-primary" type="submit" disabled={busy || availability === "checking" || availability === "taken" || !validName(username) || !validPassword(password)}>{busy ? "Creating account…" : "Create account"}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link className="text-link" to="/signin">Sign in</Link></p>
  </main>;
}
