import { ArrowRight, Eye, SearchCheck, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router";
import { useSession } from "../ui/session";
import { ModelStage } from "../ui/model-stage";

export function meta() { return [{ title: "Meida | See what changed around your website" }, { name: "description", content: "A living room for your website: real market signals, source-backed findings, and useful next steps." }]; }

export default function Landing() {
  const { user, loading } = useSession();
  if (!loading && user) return <Navigate to="/rooms" replace />;
  return <>
    <section className="hero"><div className="hero-stage"><ModelStage category="guide" activity="idle" /></div><div className="hero-inner"><div className="hero-copy"><span className="eyebrow">Meida · a living market room</span><h1>See what changed around your website.</h1><p>Give Meida a website. It finds public signals, shows where they came from, and keeps one clear room for what matters next.</p><div className="actions"><Link className="button button-primary" to="/pricing">See plans <ArrowRight size={17} /></Link><Link className="button button-outline" to="/hinneh"><Eye size={17} /> Meet the character</Link><Link className="button button-outline" to="/share">View public rooms</Link></div><div className="hero-meta">No made-up scores. No automatic social posts. A subscription is required before adding a website.</div></div></div></section>
    <section className="band"><div className="band-inner"><span className="eyebrow">One room, three moments</span><h2>Your site, the wider market, the next move.</h2><div className="steps"><div className="step"><SearchCheck size={23} /><strong>Find its place</strong><p>Meida identifies the site, searches for competitors, and checks what its public pages actually say.</p></div><div className="step"><Sparkles size={23} /><strong>Notice changes</strong><p>New public mentions and competitor signals appear with dates and source links. Quiet periods stay quiet.</p></div><div className="step"><ArrowRight size={23} /><strong>Make something useful</strong><p>Ask a question or turn a finding into an editable marketing draft. You decide what to publish.</p></div></div></div></section>
    <section className="band band-alt"><div className="band-inner illustration-band"><div className="illustration"><ModelStage category="painter" activity="responding" /></div><div><span className="eyebrow">A room with a character</span><h2>Visual enough to return to. Grounded enough to trust.</h2><p>Each website is matched to one of eight existing character roles. The character changes pose when there is a real new finding. The evidence remains readable beside it.</p><Link className="text-link" to="/about">How Meida works</Link></div></div></section>
  </>;
}
