import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ExternalLink } from "lucide-react";
import { api } from "../ui/api";
import { ModelStage } from "../ui/model-stage";

interface Finding { id: string; kind: string; title: string; summary: string; source_url: string; published_at: number | null; fetched_at: number }
interface PublicRoom { id: string; rootDomain: string; displayName: string; category: string; findings: Finding[] }
export default function SharedRoom() {
  const { id } = useParams();
  const [room, setRoom] = useState<PublicRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => { if (id) void api<{ room: PublicRoom }>("/api/share/" + id).then(result => setRoom(result.room)).catch(() => setFailed(true)).finally(() => setLoading(false)); }, [id]);
  return <main className="container"><p><Link className="text-link" to="/share">← Public rooms</Link></p>{loading ? <p className="loading">Loading room…</p> : failed || !room ? <div className="empty"><h2>This room is not available.</h2><p>It may have been removed or made private.</p></div> : <>
    <div className="room-head"><div><span className="eyebrow">{room.category} · Public room</span><h1>{room.displayName}</h1><a className="room-site" href={"https://" + room.rootDomain} target="_blank" rel="noreferrer">{room.rootDomain} <ExternalLink size={14} /></a></div></div>
    <div className="room-workspace public-workspace"><div className="room-viewer-wrap"><ModelStage category={room.category} activity="idle" /></div><aside className="panel"><span className="eyebrow">Competitors</span><p className="small-note">Competitor details are private to the room owner.</p></aside></div>
    <section className="panel"><h2>Public updates</h2>{room.findings.length ? <div className="evidence">{room.findings.map(item => <article className="evidence-item" key={item.id}><span className="tag">{item.kind}</span><h3>{item.title}</h3><p>{item.summary}</p><small>{item.published_at ? new Date(item.published_at).toLocaleDateString() : "Found " + new Date(item.fetched_at).toLocaleString()} · <a href={item.source_url} target="_blank" rel="noreferrer">Open source</a></small></article>)}</div> : <div className="empty"><h3>No sourced updates yet.</h3><p>This room has not found an update to share.</p></div>}</section>
  </>}</main>;
}
