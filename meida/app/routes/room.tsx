import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowUpRight, Check, ExternalLink, Eye, EyeOff, MessageCircle, RefreshCw, Search, Sparkles } from "lucide-react";
import { api } from "../ui/api";
import { useSession } from "../ui/session";
import { ModelStage } from "../ui/model-stage";

type Activity = "idle" | "working" | "responding";
interface Finding { id: string; kind: string; title: string; summary: string; source_url: string; published_at: number | null; fetched_at: number; provider?: string; subject_domain?: string }
interface Competitor { root_domain: string; name: string; summary?: string; source_url?: string; confidence?: string; last_checked_at?: number }
interface Improvement { evidence: string; change: string; reason: string; wording: string }
interface Review { status: string; checked_at: number; source_url: string; title: string | null; description: string | null; canonical: string | null; h1: string | null; robots: string | null; issues_json: string; advice_json?: string; evidence_json?: string }
interface Message { role: string; content: string; citations_json?: string | null; created_at: number }
interface Room {
  id: string; rootDomain: string; displayName: string; category: string; submittedUrl: string;
  isPrivate: boolean; canHide: boolean; lastCheckedAt: number | null; searchStartedAt: number | null; searchFinishedAt: number | null; findings: Finding[];
  competitors: Competitor[]; review: Review | null; messages: Message[];
  overview?: { summary: string; audience: string; businessModel: string; sourceUrl: string; checkedAt: number } | null;
  reviewHistory?: Array<{ checked_at: number; review_json: string }>;
}
interface Candidate { domain: string; name: string; sourceUrl: string; summary?: string; confidence?: string }

function formatDate(value: number | null) { return value ? new Date(value).toLocaleString() : "Date not provided"; }
function citations(message: Message): Array<{ title: string; url: string }> {
  try { const parsed = JSON.parse(message.citations_json || "[]"); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

export default function RoomPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user, loading: sessionLoading } = useSession();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activity, setActivity] = useState<Activity>("idle");
  const [clientNow, setClientNow] = useState(Date.now());
  const [tab, setTab] = useState<"updates" | "website" | "chat">("updates");
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [chatText, setChatText] = useState("");
  const [investigation, setInvestigation] = useState(false);
  const reload = useCallback(async () => {
    if (!id) return;
    const result = await api<{ room: Room }>("/api/rooms/" + id);
    setRoom(result.room);
  }, [id]);
  useEffect(() => {
    const state = location.state as { candidates?: Candidate[] } | null;
    if (Array.isArray(state?.candidates)) {
      setCandidates(state.candidates);
      setSelected(state.candidates.map(item => item.domain));
    }
  }, [location.key, location.state]);
  useEffect(() => {
    if (!id || !user) return;
    void reload().catch(cause => setMessage(cause instanceof Error ? cause.message : "Room could not load.")).finally(() => setLoading(false));
    const timer = window.setInterval(() => {
      void api<{ room: Room }>("/api/rooms/" + id).then(result => {
        setRoom(current => {
          if (current && result.room.lastCheckedAt && result.room.lastCheckedAt !== current.lastCheckedAt) {
            setActivity("responding");
            window.setTimeout(() => setActivity("idle"), 4200);
          }
          return result.room;
        });
      }).catch(() => {});
      setClientNow(Date.now());
    }, 15_000);
    return () => clearInterval(timer);
  }, [id, user?.id, reload]);
  useEffect(() => {
    if (activity !== "responding") return;
    const timer = window.setTimeout(() => setActivity("idle"), 4200);
    return () => clearTimeout(timer);
  }, [activity]);
  const sortedFindings = useMemo(() => [...(room?.findings || [])].sort((a, b) => b.fetched_at - a.fetched_at), [room?.findings]);
  const latestMarketUpdate = sortedFindings[0];
  const marketUpdate = latestMarketUpdate && clientNow - latestMarketUpdate.fetched_at < 45 * 60_000
    ? { title: latestMarketUpdate.title, summary: latestMarketUpdate.summary, sourceUrl: latestMarketUpdate.source_url }
    : null;
  const searchInProgress = !!room?.searchStartedAt && room.searchStartedAt > (room.searchFinishedAt || 0) && clientNow - room.searchStartedAt < 20 * 60_000;
  const stageActivity: Activity = activity === "working" || searchInProgress ? "working" : marketUpdate ? "responding" : activity;

  async function run(action: "check" | "review" | "profile") {
    if (!id) return;
    setMessage(""); setBusy(true); setActivity("working");
    try { await api("/api/rooms/" + id + "/" + action, "POST"); await reload(); setActivity("responding"); setMessage(action === "check" ? "Search finished. Open a source to inspect each update." : action === "profile" ? "Business overview refreshed." : "Website check finished."); }
    catch (cause) { setActivity("idle"); setMessage(cause instanceof Error ? cause.message : "That check could not be completed."); }
    finally { setBusy(false); }
  }
  async function discover() {
    if (!id) return;
    setMessage(""); setBusy(true); setActivity("working");
    try { const result = await api<{ candidates: Candidate[] }>("/api/rooms/" + id + "/discover"); setCandidates(result.candidates); setSelected(result.candidates.map(item => item.domain)); setActivity("responding"); }
    catch (cause) { setActivity("idle"); setMessage(cause instanceof Error ? cause.message : "Competitors could not be found."); }
    finally { setBusy(false); }
  }
  async function saveCompetitors() {
    if (!id) return;
    setBusy(true); setMessage("");
    try {
      await api("/api/rooms/" + id + "/competitors", "POST", { domains: selected.map(domain => "https://" + domain + "/") });
      setCandidates(null); await reload(); setMessage("Competitors updated.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Competitors could not be saved."); }
    finally { setBusy(false); }
  }
  async function sendChat(event: React.FormEvent) {
    event.preventDefault();
    if (!id || !chatText.trim()) return;
    setMessage(""); setBusy(true); setActivity("working");
    try { await api("/api/rooms/" + id + "/chat", "POST", { message: chatText.trim(), research: investigation }); setChatText(""); setInvestigation(false); await reload(); setActivity("responding"); }
    catch (cause) { setActivity("idle"); setMessage(cause instanceof Error ? cause.message : "The reply could not be generated."); }
    finally { setBusy(false); }
  }
  async function changePrivacy() {
    if (!id || !room) return;
    setBusy(true); setMessage("");
    try { const result = await api<{ private: boolean }>("/api/rooms/" + id + "/privacy", "POST", { private: !room.isPrivate }); setRoom({ ...room, isPrivate: result.private }); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Visibility could not be changed."); }
    finally { setBusy(false); }
  }
  async function deleteRoom() {
    if (!id || !window.confirm("Delete this room and its saved findings?")) return;
    setBusy(true);
    try { await api("/api/rooms/" + id + "/delete", "POST"); window.location.assign("/rooms"); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Room could not be deleted."); setBusy(false); }
  }
  if (sessionLoading || loading) return <main className="container"><p className="loading">Loading room…</p></main>;
  if (!user) return <main className="container narrow"><h1>Sign in to open this room.</h1><Link className="button button-primary" to="/signin">Sign in</Link></main>;
  if (!room) return <main className="container narrow"><h1>Room not found</h1><p>{message || "This room may have been deleted."}</p><Link className="text-link" to="/rooms">Back to your rooms</Link></main>;
  const review = room.review;
  let issues: string[] = [];
  try { issues = review ? JSON.parse(review.issues_json) as string[] : []; } catch {}
  let improvements: Improvement[] = [];
  try { const items = JSON.parse(review?.advice_json || "[]"); if (Array.isArray(items)) improvements = items; } catch {}
  const conversation = room.messages || [];
  return <main className="container">
    <div className="room-head"><div><span className="eyebrow">{room.category} · {room.isPrivate ? "Private" : "Public"}</span><h1>{room.displayName}</h1><a className="room-site" href={room.submittedUrl} target="_blank" rel="noreferrer">{room.rootDomain} <ExternalLink size={14} /></a><p className="small-note">Last web check: {formatDate(room.lastCheckedAt)}</p></div>
      <div className="actions room-actions"><button className="button button-primary" onClick={() => void run("check")} disabled={busy}><RefreshCw size={16} />{busy ? "Checking…" : "Check now"}</button><button className="button button-outline" onClick={() => void run("review")} disabled={busy}>Check website</button><button className="button button-outline" onClick={() => void run("profile")} disabled={busy}>Refresh overview</button></div>
    </div>
    {message && <p className="message room-alert" role="status">{message}</p>}
    {room.overview && <section className="room-overview"><p>{room.overview.summary}</p>{room.overview.audience && <p className="small-note"><strong>Audience:</strong> {room.overview.audience}</p>}{room.overview.businessModel && <p className="small-note"><strong>Business model:</strong> {room.overview.businessModel}</p>}<a className="fine-print text-link" href={room.overview.sourceUrl} target="_blank" rel="noreferrer">Source · {formatDate(room.overview.checkedAt)}</a></section>}
    <div className="room-workspace">
      <div className="room-viewer-wrap"><ModelStage category={room.category} activity={stageActivity} update={marketUpdate} /></div>
      <aside className="panel competitor-panel">
        <div className="room-panel-heading"><h2>Competitors</h2><span className="tag">{room.competitors.length} added</span></div>
        <p className="small-note">These websites sit beside your market room. They do not appear in the 3D scene.</p>
        {room.competitors.length > 0 && <div className="evidence">{room.competitors.map(item => <div className="list-row" key={item.root_domain}><span><strong>{item.name}</strong><br /><small>{item.root_domain}</small>{item.summary && <p className="small-note">{item.summary}</p>}{item.source_url && <a className="fine-print text-link" href={item.source_url} target="_blank" rel="noreferrer">Evidence · {item.confidence || "Unverified"}</a>}</span><a href={"https://" + item.root_domain} target="_blank" rel="noreferrer" aria-label={"Open " + item.root_domain}><ArrowUpRight size={16} /></a></div>)}</div>}
        {candidates && <div className="candidate-list">{candidates.map(item => <div className="candidate-option" key={item.domain}><label className="candidate check-row"><input type="checkbox" checked={selected.includes(item.domain)} onChange={event => setSelected(current => event.target.checked ? [...current, item.domain] : current.filter(value => value !== item.domain))} /><span><strong>{item.name}</strong><br />{item.domain}{item.summary && <p className="small-note">{item.summary}</p>}{item.confidence && <small>Evidence confidence: {item.confidence}</small>}</span></label><a href={item.sourceUrl} target="_blank" rel="noreferrer">Evidence <ArrowUpRight size={14} /></a></div>)}</div>}
        {candidates ? <div className="actions"><button className="button button-primary button-compact" onClick={() => void saveCompetitors()} disabled={busy}><Check size={15} />Save</button><button className="button button-outline button-compact" onClick={() => setCandidates(null)}>Cancel</button></div> : <button className="button button-outline button-compact" onClick={() => void discover()} disabled={busy}><Search size={15} />Find competitors</button>}
        {room.canHide && <><hr className="rule" /><div className="actions"><button className="button button-outline button-compact" onClick={() => void changePrivacy()} disabled={busy}>{room.isPrivate ? <><Eye size={15} />Make public</> : <><EyeOff size={15} />Make private</>}</button></div></>}
        {room.isPrivate ? <p className="fine-print">Only Partner rooms can be private.</p> : <Link className="fine-print text-link" to={"/share/" + room.id}>Open public room</Link>}
      </aside>
    </div>
    <div className="room-tabs" role="tablist" aria-label="Room details">{(["updates", "website", "chat"] as const).map(value => <button key={value} role="tab" aria-selected={tab === value} className={"room-tab " + (tab === value ? "active" : "")} onClick={() => setTab(value)}>{value === "updates" ? "Updates" : value === "website" ? "Website check" : "Ask the room"}</button>)}</div>
    {tab === "updates" && <section className="panel"><div className="room-panel-heading"><h2>What the web is saying</h2><span className="small-note">{sortedFindings.length} saved updates</span></div>{sortedFindings.length ? <div className="evidence">{sortedFindings.map(item => <article className="evidence-item" key={item.id}><span className="tag">{item.kind === "competitor" ? "Competitor" : item.kind === "official" ? "Official update" : "Web mention"}</span><h3>{item.title}</h3><p>{item.summary}</p>{item.subject_domain && <small>{item.subject_domain}{item.provider ? " · " + item.provider : ""}<br /></small>}<small>{item.published_at ? formatDate(item.published_at) : "Publication date not shown"} · Found {formatDate(item.fetched_at)} · <a href={item.source_url} target="_blank" rel="noreferrer">Read source</a></small></article>)}</div> : <div className="empty"><Sparkles size={24} /><h3>No sourced updates yet.</h3><p>Use “Check now” or wait for the next scheduled check.</p></div>}</section>}
    {tab === "website" && <section className="panel"><div className="room-panel-heading"><h2>Website check</h2><span className="small-note">{review ? "Checked " + formatDate(review.checked_at) : "Not checked yet"}</span></div>{review?.status === "ok" ? <><div className="details-grid"><div><strong>Page title</strong><p>{review.title || "Not found"}</p></div><div><strong>Description</strong><p>{review.description || "Not found"}</p></div><div><strong>Main heading</strong><p>{review.h1 || "Not found"}</p></div><div><strong>Canonical page</strong><p>{review.canonical || "Not found"}</p></div><div><strong>Robots setting</strong><p>{review.robots || "Not provided"}</p></div></div><h3>Checks to review</h3>{issues.length ? <ul className="review-list">{issues.map(issue => <li key={issue}>{issue}</li>)}</ul> : <p className="message">The basic page signals we checked are present.</p>}{improvements.length > 0 && <><h3>Suggested improvements</h3><div className="evidence">{improvements.map((item, index) => <article className="evidence-item" key={index}><h4>{index + 1}. {item.change}</h4><p><strong>Evidence:</strong> {item.evidence}</p><p>{item.reason}</p>{item.wording && <blockquote>{item.wording}</blockquote>}</article>)}</div></>}{(room.reviewHistory?.length || 0) > 1 && <details><summary>Previous website checks</summary>{room.reviewHistory!.slice(1).map(item => { let previous: { title?: string; description?: string; issues?: string[] } = {}; try { previous = JSON.parse(item.review_json); } catch {} return <div className="evidence-item" key={item.checked_at}><strong>{formatDate(item.checked_at)}</strong><p>Page title: {previous.title || "Not observed"}</p><p>Description: {previous.description || "Not observed"}</p><p>{previous.issues?.join(" ")}</p></div>; })}</details>}</> : <div className="empty"><h3>{review ? "The page could not be read." : "No website check yet."}</h3><p>This check reads page title, description, heading, canonical URL and indexing instructions. It is not a search ranking guarantee.</p><button className="button button-outline" onClick={() => void run("review")} disabled={busy}>Check website</button></div>}</section>}
    {tab === "chat" && <section className="panel"><div className="room-panel-heading"><h2>Ask about this market</h2><MessageCircle size={18} /></div><p className="small-note">Ask a question or draft marketing wording. Replies use current web sources and never publish for you.</p><div className="chat-log" aria-live="polite">{conversation.length ? conversation.map((item, index) => <div className={"chat-message " + item.role} key={index}>{item.content}{citations(item).map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title || source.url}</a>)}</div>) : <div className="empty"><h3>Start with a question.</h3><p>For example: “What changed in the latest competitor coverage?”</p></div>}</div>{room.canHide && <label className="check-row"><input type="checkbox" checked={investigation} disabled={busy} onChange={event => setInvestigation(event.target.checked)} />Use monthly market investigation (1 per account)</label>}<form className="chat-composer" onSubmit={sendChat}><input className="input" value={chatText} onChange={event => setChatText(event.target.value)} maxLength={1200} placeholder="Ask or draft something…" aria-label="Your question" /><button className="button button-primary" disabled={busy || !chatText.trim()}><MessageCircle size={16} />Send</button></form></section>}
    <p className="room-delete"><button className="button button-link" onClick={() => void deleteRoom()} disabled={busy}>Delete this room</button></p>
  </main>;
}
