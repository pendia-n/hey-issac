import { useState } from "react";
import { ArrowRight, Eye } from "lucide-react";
import { Link } from "react-router";
import { ModelStage, MODEL_ROLES } from "../ui/model-stage";

type Activity = "idle" | "working" | "responding";
const poses: Array<{ value: Activity; label: string }> = [
  { value: "idle", label: "Base" },
  { value: "working", label: "Working" },
  { value: "responding", label: "Responding" },
];

export function meta() {
  return [
    { title: "Explore Meida's rooms | Meida" },
    { name: "description", content: "Preview the eight Meida character rooms and switch among the actual base, working, and response GLB models." },
  ];
}

export default function Hinneh() {
  const [category, setCategory] = useState("commercial");
  const [activity, setActivity] = useState<Activity>("idle");
  const activeRole = MODEL_ROLES.find(role => role.value === category) || MODEL_ROLES[0];

  return <div className="hinneh-page">
    <section className="hinneh-intro">
      <div className="hinneh-intro-inner">
        <div>
          <span className="eyebrow">Eight rooms · real character assets</span>
          <h1>Step into the work.</h1>
          <p>Choose a room and switch the same character through its three prepared poses.</p>
        </div>
        <Link className="button button-outline" to="/pricing">See plans <ArrowRight size={17} /></Link>
      </div>
    </section>
    <section className="hinneh-controls" aria-label="Character preview controls">
      <label className="hinneh-room-select">
        <span>Room</span>
        <select className="select" value={category} onChange={event => setCategory(event.target.value)} aria-label="Choose a character room">
          {MODEL_ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
        </select>
      </label>
      <div className="hinneh-pose-select" role="group" aria-label="Choose a character pose">
        <span>Character pose</span>
        <div className="segmented-control">
          {poses.map(pose => <button key={pose.value} type="button" className={activity === pose.value ? "selected" : ""} aria-pressed={activity === pose.value} onClick={() => setActivity(pose.value)}>{pose.label}</button>)}
        </div>
      </div>
    </section>
    <section className="hinneh-stage" aria-label={activeRole.room + " character preview"}>
      <ModelStage category={category} activity={activity} preview />
    </section>
    <section className="hinneh-details">
      <div className="hinneh-details-inner">
        <div>
          <span className="icon-label"><Eye size={18} /> {activeRole.room}</span>
          <h2>One character, three real GLB states.</h2>
          <p>This is an asset preview, not fabricated market activity. Switching poses loads the room's own base, working, or response model. In a live room, findings and competitors are shown as sourced information beside the viewer; competitors do not need extra character models.</p>
        </div>
        <div className="actions hinneh-actions"><Link className="button button-primary" to="/signup">Create an account <ArrowRight size={17} /></Link><Link className="button button-outline" to="/pricing">Compare plans</Link></div>
      </div>
    </section>
  </div>;
}
