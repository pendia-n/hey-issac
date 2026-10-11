import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { api } from "../ui/api";

interface PublicRoom { id: string; root_domain: string; display_name: string; category: string; created_at: number; last_checked_at: number | null }
export default function Share() {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void api<{ rooms: PublicRoom[] }>("/api/share").then(result => setRooms(result.rooms)).finally(() => setLoading(false)); }, []);
  return <main className="container"><div className="page-top"><div><span className="eyebrow">Public rooms</span><h1>See what other markets are watching.</h1><p className="muted">These rooms are shared publicly by their owners.</p></div></div>
    {loading ? <p className="loading">Loading shared rooms…</p> : rooms.length ? <div className="share-grid">{rooms.map(room => <Link className="share-card" to={"/share/" + room.id} key={room.id}><span className="eyebrow">{room.category}</span><h3>{room.display_name}</h3><p>{room.root_domain}</p><span className="tag">Public room</span><ArrowUpRight size={17} /></Link>)}</div> : <div className="empty"><h3>No public rooms to show yet.</h3><p>Public rooms appear here when members add a website.</p></div>}
  </main>;
}
