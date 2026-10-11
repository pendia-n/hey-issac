import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { api } from "../ui/api";
import { useBilling } from "../ui/billing";
import { useSession } from "../ui/session";

const plans = [
  { id: "solo", name: "Solo", price: 19, rooms: 1, checks: "Daily", competitors: 3, chats: 30, manual: 2, reviews: "Monthly" },
  { id: "studio", name: "Studio", price: 49, rooms: 3, checks: "Twice daily", competitors: 5, chats: 150, manual: 6, reviews: "Monthly" },
  { id: "partner", name: "Partner", price: 129, rooms: 8, checks: "Three times daily", competitors: 8, chats: 400, manual: 20, reviews: "Twice monthly" },
] as const;

export function meta() { return [{ title: "Pricing | Meida" }]; }

export default function Pricing() {
  const { user } = useSession();
  const { status, loading } = useBilling();
  const [working, setWorking] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  async function checkout(plan: string) {
    setWorking(plan); setProblem("");
    try { const result = await api<{ url: string }>("/api/billing/checkout", "POST", { plan }); window.location.assign(result.url); }
    catch (error) { setProblem(error instanceof Error ? error.message : "Checkout is unavailable."); setWorking(null); }
  }
  return <div className="container"><div className="page-top"><div><span className="eyebrow">Simple monthly plans</span><h1>Keep your market in view.</h1><p className="muted">Pay once a month. Every plan includes the first look, a visual room, sourced findings, and question-led drafts.</p></div></div>
    {problem && <p className="message error" role="alert">{problem}</p>}
    <div className="pricing-grid">{plans.map(plan => <section className={plan.id === "studio" ? "price-panel featured" : "price-panel"} key={plan.id}><span className="eyebrow">{plan.id === "studio" ? "For a small portfolio" : plan.id === "partner" ? "For a growing team" : "For one website"}</span><h2>{plan.name}</h2><div className="price-number">${plan.price}<small> / month</small></div><ul><li>{plan.rooms} active {plan.rooms === 1 ? "website" : "websites"}</li><li>{plan.checks} market checks per website</li><li>Up to {plan.competitors} competitors per website</li><li>{plan.reviews} site review</li><li>{plan.manual} extra checks each month</li><li>{plan.chats} source-backed replies and drafting turns</li>{plan.id === "partner" && <li>Choose whether each room is public or private</li>}</ul>
      {!user ? <Link className="button button-primary" to="/signup">Create account <ArrowRight size={16} /></Link> : <button className="button button-primary" type="button" disabled={loading || !status?.ready || !!status?.subscription?.active || working !== null} onClick={() => void checkout(plan.id)}>{status?.subscription?.active ? "Current plan must end first" : working === plan.id ? "Opening checkout…" : !status?.ready ? "Checkout not ready" : `Choose ${plan.name}`}</button>}
      <p className="fine-print">First-payment refund requests: within 47 hours, 50% of the amount paid. Statutory rights still apply. Cancel any time; no other automatic refunds.</p></section>)}</div>
    <div className="pricing-explain"><h2>What counts as a check?</h2><p>A scheduled check looks for new public signals. It is not a complete SEO review. If the same story appears again, Meida keeps one finding instead of pretending it is new.</p><p>One website means its root domain. A product page on amazon.com belongs to amazon.com, not a separate room. There are no automatic posts or unexpected usage charges.</p><p className="small-note">Changing plan requires the existing plan to end. You may cancel at the end of its term or stop it immediately from Billing.</p></div>
  </div>;
}
