import { Link, useSearchParams } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { demoRooms } from "../data/demo-rooms";
import { BusinessOverview } from "../ui/business-overview";
import { ModelStage } from "../ui/model-stage";

export function meta() {
  return [{ title: "Demo rooms | Meida" }];
}

export default function ShareDemo() {
  const [params] = useSearchParams();
  const room = demoRooms.find(item => item.id === params.get("room")) ?? demoRooms[0];
  const latest = room.findings[0];
  return <main className="container">
    <Link className="text-link icon-label" to="/share"><ArrowLeft size={16} /> Public rooms</Link>
    <div className="page-top demo-heading">
      <div>
        <span className="eyebrow">Independent demos</span>
        <h1>Demo rooms</h1>
        <p className="muted">Public-source examples curated by Meida.</p>
      </div>
      <nav className="actions" aria-label="Demo rooms">
        {demoRooms.map(item => <Link key={item.id} to={"?room=" + item.id} preventScrollReset
          aria-current={item.id === room.id ? "page" : undefined}
          className={"button " + (item.id === room.id ? "button-primary" : "button-outline")}>
          {item.label}
        </Link>)}
      </nav>
    </div>

    <section className="room-overview" aria-label="Business overview">
      <h2>{room.business.name}</h2>
      <a className="text-link icon-label" href={room.business.website} target="_blank" rel="noreferrer">
        Visit website <ArrowUpRight size={15} />
      </a>
      <BusinessOverview profile={{ ...room.business.profile, checkedAt: room.checkedAt }} />
    </section>

    <div className="room-workspace public-workspace">
      <div className="room-viewer-wrap">
        <ModelStage category={room.category} activity="idle" update={latest} />
      </div>
      <aside className="panel" aria-label="Competitors">
        <div className="room-panel-heading"><h2>Competitors</h2></div>
        {room.competitors.map(item => <article className="competitor-entry" key={item.website}>
          <a className="icon-label" href={item.website} target="_blank" rel="noreferrer">
            <strong>{item.name}</strong><ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <BusinessOverview profile={{ ...item.profile, checkedAt: room.checkedAt }} competitor />
        </article>)}
      </aside>
    </div>

    <section className="demo-findings" aria-label="Public updates">
      <h2>Public updates</h2>
      <p className="small-note">Last checked <time dateTime={new Date(room.checkedAt).toISOString()}>{new Date(room.checkedAt).toISOString().slice(0, 10)}</time> UTC</p>
      <div className="evidence">
        {room.findings.map(item => <article className="evidence-item" key={item.sourceUrl}>
          <small>{item.upcoming ? "Event starts" : "Published"} <time dateTime={item.date}>{item.date}</time></small>
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          <p><strong>Why it might matter</strong> {item.implication}</p>
          <a className="text-link icon-label" href={item.sourceUrl} target="_blank" rel="noreferrer">Read source <ArrowUpRight size={15} /></a>
        </article>)}
      </div>
    </section>
  </main>;
}
