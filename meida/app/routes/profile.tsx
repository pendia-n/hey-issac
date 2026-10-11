import { Link } from "react-router";
import { useSession } from "../ui/session";

export default function Profile() {
  const { user, loading } = useSession();
  if (loading) return <main className="container"><p className="loading">Loading your account…</p></main>;
  if (!user) return <main className="container narrow"><h1>Your profile</h1><p><Link className="text-link" to="/signin">Sign in to view your profile.</Link></p></main>;
  return <main className="container narrow"><span className="eyebrow">Your account</span><h1>Profile</h1><section className="panel"><div className="list-row"><div><strong>Username</strong><p className="small-note">Your sign-in name</p></div><strong>{user.username}</strong></div><div className="list-row"><div><strong>Password</strong><p className="small-note">Change it from your security page</p></div><Link className="text-link" to="/security">Manage</Link></div><div className="list-row"><div><strong>Plan</strong><p className="small-note">Subscription and payment details</p></div><Link className="text-link" to="/billing">View billing</Link></div></section></main>;
}
