import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { api } from "../ui/api";
import { useSession } from "../ui/session";
import { useBilling } from "../ui/billing";

interface Room { id: string; root_domain: string; display_name: string; category: string; is_private: number; last_checked_at: number | null }
interface RoomList { rooms: Room[]; usage: Record<string, number>; limits: { rooms: number; checksPerDay: number; competitors: number; chats: number; manualChecks: number; reviewsPerMonth: number } }
export default function Rooms() {
  const { user, loading } = useSession();
  const { status, loading: billingLoading } = useBilling();
  const [data, setData] = useState<RoomList | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => { if (user && !billingLoading && status?.subscription?.active) void api<RoomList>("/api/rooms").then(setData).catch(cause => setMessage(cause instanceof Error ? cause.message : "Rooms could not load.")); }, [user?.id, billingLoading, status?.subscription?.active]);
  if (loading || billingLoading) return <main className="container"><p className="loading">Loading…</p></main>;
  if (!user) return <main className="container narrow"><h1>Your rooms are waiting.</h1><p>Sign in to continue.</p><Link className="button button-primary" to="/signin">Sign in</Link></main>;
  if (!status) return <main className="container narrow"><p className="message error" role="alert">Could not load your subscription. Please refresh to try again.</p></main>;
  if (!status.subscription?.active) return <Navigate to="/pricing" replace />;
  return <main className="container"><div className="page-top"><div><span className="eyebrow">Your market rooms</span><h1>Keep an eye on what changes.</h1><p className="muted">Each room follows one website and brings sourced updates into one place.</p></div><Link className="button button-primary" to="/rooms/new"><Plus size={18} /> Add a website</Link></div>
    {message && <p className="message error">{message}</p>}
    {data && <div className="usage-strip"><span>{data.rooms.length} of {data.limits.rooms} websites</span><span>{data.limits.checksPerDay} scheduled checks per day</span><span>{data.limits.competitors} competitor spaces</span></div>}
    {data?.rooms.length ? <div className="page-grid">{data.rooms.map(room => <article className="panel room-card" key={room.id}><span className="eyebrow">{room.category}</span><h2>{room.display_name}</h2><p className="muted">{room.root_domain}</p><p className="small-note">{room.last_checked_at ? "Last checked " + new Date(room.last_checked_at).toLocaleString() : "Waiting for first scheduled check"}{room.is_private ? " · Private" : " · Public room"}</p><Link className="text-link icon-label" to={"/rooms/" + room.id}>Open room <ArrowUpRight size={15} /></Link></article>)}</div> : data ? <div className="empty"><Sparkles size={28} /><h3>Your first room starts with a website.</h3><p>Add a public website you want to understand.</p><Link className="button button-primary" to="/rooms/new">Add a website</Link></div> : !message && <p className="loading">Loading your rooms…</p>}
  </main>;
}
