import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { BookOpen, CreditCard, Eye, Home, LockKeyhole, LogIn, LogOut, Megaphone, Moon, Plus, ScanSearch, Share2, Sun, UserRound } from "lucide-react";
import { api } from "./api";
import { useSession } from "./session";

const publicLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/hinneh", label: "Preview", icon: Eye },
  { to: "/share", label: "Share", icon: Share2 },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/about", label: "About", icon: BookOpen },
  { to: "/announcements", label: "News", icon: Megaphone },
];
const memberLinks = [
  { to: "/rooms", label: "Rooms", icon: ScanSearch },
  { to: "/rooms/new", label: "New room", icon: Plus },
  { to: "/share", label: "Share", icon: Share2 },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/security", label: "Security", icon: LockKeyhole },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, refresh } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("meida-theme");
    const useDark = saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(useDark);
    document.documentElement.dataset.theme = useDark ? "dark" : "light";
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("meida-theme", next ? "dark" : "light");
  }
  const links = user ? memberLinks : publicLinks;
  async function signOut() {
    try { await api("/api/auth/signout", "POST"); } finally { await refresh(); navigate("/"); }
  }
  return <div className="site-shell">
    <header className="site-header"><div className="header-inner">
      <Link className="brand" to={user ? "/rooms" : "/"} aria-label="Meida home"><img src="/haissac.svg" alt="" /><span>meida</span></Link>
      <nav className="main-nav" aria-label="Main navigation">{links.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className={location.pathname === to ? "nav-link active" : "nav-link"} aria-label={label} title={label}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link>)}</nav>
      <div className="account-nav"><button className="icon-command theme-toggle" type="button" aria-label={dark ? "Use light mode" : "Use dark mode"} title={dark ? "Use light mode" : "Use dark mode"} onClick={toggleTheme}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>{user ? <button className="icon-command" type="button" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}><LogOut size={19} /></button> : <Link className="sign-in" to="/signin"><LogIn size={17} /> <span>Sign in</span></Link>}</div>
    </div></header>
    <main id="main-content">{children}</main>
    <footer className="site-footer"><span>Meida</span><span>Signals have sources. Silence stays silent.</span><Link to="/hinneh">Character preview</Link><Link to="/announcements">Updates</Link></footer>
  </div>;
}
