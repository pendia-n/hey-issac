import { useState } from "react";
import type { FormEvent } from "react";

type View = "welcome" | "office" | "updates" | "evidence" | "workshop" | "settings" | "signin" | "signup" | "recovery" | "about" | "pricing" | "announcements";
type Office = { domain: string; url: string };

const nav: { id: View; symbol: string; label: string }[] = [
  { id: "office", symbol: "⌂", label: "Office" },
  { id: "updates", symbol: "◷", label: "Updates" },
  { id: "evidence", symbol: "▤", label: "Evidence" },
  { id: "workshop", symbol: "✳", label: "Workshop" },
];

function getRootWebsite(value: string) {
  const parsed = new URL(value.trim());
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Enter a website address starting with http:// or https://.");
  if (!parsed.hostname.includes(".")) throw new Error("Enter a complete website address, such as https://example.com.");
  return { domain: parsed.hostname.replace(/^www\./, ""), url: `${parsed.protocol}//${parsed.host}` };
}

export function meta() {
  return [
    { title: "heyIssac | Your business, in motion" },
    { name: "description", content: "A living office for understanding your business and its market." },
  ];
}

export default function Home() {
  const [view, setView] = useState<View>("welcome");
  const [office, setOffice] = useState<Office | null>(null);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [time, setTime] = useState<"morning" | "evening">("morning");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [question, setQuestion] = useState("");
  const [notice, setNotice] = useState("");
  const [questionSent, setQuestionSent] = useState(false);
  const mode = time;

  function createOffice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const next = getRootWebsite(url);
      setOffice(next);
      setUrlError("");
      setView("office");
      setNotice("Website saved in this preview. Research begins when the service is connected.");
    } catch (error) {
      setUrlError(error instanceof Error ? error.message : "Check the website address and try again.");
    }
  }

  function selectView(next: View) {
    setView(next);
    setMobileMenu(false);
    setNotice("");
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim()) return;
    setQuestionSent(true);
    setQuestion("");
  }

  if (view === "welcome" || view === "about" || view === "pricing" || view === "announcements") {
    return (
      <div className={`site-shell ${mode}`}>
        <header className="site-top">
          <a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); selectView("welcome"); }}><span className="brand-seed" aria-hidden="true">✳</span> heyIssac</a>
          <nav className="site-links" aria-label="Main navigation">
            <button onClick={() => selectView("about")}>About</button>
            <button onClick={() => selectView("pricing")}>Plans</button>
            <button onClick={() => selectView("announcements")}>Updates</button>
          </nav>
          <div className="site-actions">
            <button className="quiet-link" onClick={() => selectView("signin")}>Sign in</button>
            <button className="sun-toggle" aria-label={`Switch to ${mode === "morning" ? "evening" : "morning"} colors`} onClick={() => setTime(mode === "morning" ? "evening" : "morning")}><span aria-hidden="true">{mode === "morning" ? "☼" : "☾"}</span></button>
          </div>
        </header>
        {view === "welcome" ? (
          <main id="home" className="welcome-page">
            <section className="welcome-hero">
              <div className="welcome-copy">
                <p className="kicker"><span className="live-seed" /> A little room for your business</p>
                <h1>Your business has a place to <em>come alive.</em></h1>
                <p className="welcome-lede">Bring your website into an animated office. Meet what is changing, see the evidence, and decide what to do next.</p>
                <form className="url-form" onSubmit={createOffice}>
                  <label htmlFor="website-url">Your website</label>
                  <div className="url-entry">
                    <span aria-hidden="true">↗</span>
                    <input id="website-url" type="url" placeholder="https://yourbusiness.com" value={url} onChange={(event) => { setUrl(event.target.value); setUrlError(""); }} required aria-describedby={urlError ? "url-error" : "url-hint"} />
                    <button type="submit">Make its office <span aria-hidden="true">→</span></button>
                  </div>
                  {urlError ? <p className="field-error" id="url-error" role="alert">{urlError}</p> : <p className="field-hint" id="url-hint">We look at the whole website, even when you paste a page link.</p>}
                </form>
                <p className="welcome-foot">A room that moves with real discoveries. Quiet when there is nothing new.</p>
              </div>
              <div className="hero-room" role="img" aria-label="Illustration of a sunlit creative office, with a large open floor ready for your business’s room">
                <div className="room-light" />
                <div className="room-stamp"><span>YOUR NEXT CHAPTER</span><b>starts here</b></div>
                <div className="hero-person person-one" aria-hidden="true"><i /><b /><span /></div>
                <div className="hero-person person-two" aria-hidden="true"><i /><b /><span /></div>
                <div className="room-caption"><span className="caption-dot" /> A room shaped around your website</div>
              </div>
            </section>
            <section className="welcome-lower">
              <p>WHAT HAPPENS INSIDE</p>
              <div className="lower-line"><h2>A website becomes a place you can return to.</h2><span>Find changes, understand why they matter, and keep your next move close at hand.</span></div>
              <div className="welcome-steps">
                <div><span className="step-glyph">⌂</span><h3>Your office</h3><p>A living space for each website you care for.</p></div>
                <div><span className="step-glyph">◷</span><h3>Real updates</h3><p>A character brings a note when a check finds something worth your attention.</p></div>
                <div><span className="step-glyph">✳</span><h3>Your next move</h3><p>Ask about saved evidence or shape it into a practical draft.</p></div>
              </div>
              <footer className="site-footer"><span>heyIssac</span><button onClick={() => selectView("about")}>About</button><button onClick={() => selectView("pricing")}>Plans</button><button onClick={() => selectView("announcements")}>Announcements</button><button onClick={() => selectView("signup")}>Create an account</button></footer>
            </section>
          </main>
        ) : <PublicInfo view={view} onBack={() => selectView("welcome")} onSignup={() => selectView("signup")} />}
      </div>
    );
  }

  if (view === "signin" || view === "signup" || view === "recovery") return <div className={`site-shell ${mode}`}><header className="site-top"><a className="wordmark" href="#home" onClick={(event) => { event.preventDefault(); selectView("welcome"); }}><span className="brand-seed" aria-hidden="true">✳</span> heyIssac</a><button className="quiet-link" onClick={() => selectView("welcome")}>← Back to home</button></header><AuthPage view={view} onView={selectView} /></div>;

  return (
    <div className={`app-shell ${mode}`}>
      <aside className={`app-rail ${mobileMenu ? "rail-open" : ""}`}>
        <button className="app-brand" onClick={() => selectView("office")}><span className="brand-seed">✳</span><span>heyIssac</span></button>
        <div className="rail-label">YOUR PLACES</div>
        {office ? <button className="place-row active-place" onClick={() => selectView("office")}><span className="place-mark">{office.domain.charAt(0).toUpperCase()}</span><span>{office.domain}</span><i /></button> : <p className="rail-empty">Your first website will live here.</p>}
        <button className="add-place" onClick={() => selectView("welcome")}><span>＋</span> Add a website</button>
        <div className="rail-label rail-tools-label">YOUR ROOM</div>
        <nav className="rail-nav" aria-label="Office navigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "selected" : ""} onClick={() => selectView(item.id)}><span className="nav-symbol" aria-hidden="true">{item.symbol}</span><span>{item.label}</span></button>)}</nav>
        <div className="rail-bottom"><button onClick={() => selectView("settings")} className={view === "settings" ? "selected" : ""}><span className="nav-symbol">⚙</span><span>Settings</span></button><button onClick={() => selectView("signin")}><span className="nav-symbol">◉</span><span>Sign in</span></button></div>
      </aside>
      <main className="app-main">
        <header className="app-topbar"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileMenu(!mobileMenu)}>☰</button><div className="crumb"><span>My space</span><b>/</b><strong>{office?.domain ?? "Your first office"}</strong></div><div className="topbar-actions"><span className="connection-label"><i /> Preview</span><button className="sun-toggle" aria-label={`Switch to ${mode === "morning" ? "evening" : "morning"} colors`} onClick={() => setTime(mode === "morning" ? "evening" : "morning")}>{mode === "morning" ? "☼" : "☾"}</button><button className="profile-button" aria-label="Account settings" onClick={() => selectView("settings")}>Y</button></div></header>
        {notice && <div className="preview-note" role="status">{notice}<button aria-label="Dismiss" onClick={() => setNotice("")}>×</button></div>}
        {view === "office" && <OfficeView office={office} onAdd={() => selectView("welcome")} onNavigate={selectView} />}
        {view === "updates" && <EmptySection title="A quiet room." subtitle="When a scheduled check finds a meaningful change, Issac will bring it here with its source." symbol="◷" action="Choose what to check" onAction={() => selectView("settings")} />}
        {view === "evidence" && <EmptySection title="Evidence lives here." subtitle="Website observations and market sources will be saved here so every suggestion has something real behind it." symbol="▤" action="Open your office" onAction={() => selectView("office")} />}
        {view === "workshop" && <WorkshopView onAsk={() => selectView("office")} />}
        {view === "settings" && <SettingsView office={office} onAdd={() => selectView("welcome")} />}
      </main>
      {view === "office" && office && <aside className="right-desk"><div className="desk-heading"><span>ISSAC’S DESK</span><b>○</b></div><div className="desk-character" aria-hidden="true"><span className="character-hair" /><span className="character-face" /><span className="character-body" /></div><h2>Here when you need me.</h2><p>Once your office has real research to work with, you can ask about any saved finding.</p><form className="ask-box" onSubmit={submitQuestion}><label htmlFor="ask-issac">Ask about this office</label><div><input id="ask-issac" placeholder="Available after the first check" value={question} onChange={(event) => setQuestion(event.target.value)} disabled /><button type="submit" disabled aria-label="Send question">↑</button></div></form>{questionSent && <p className="honest-state">There are no saved findings to answer from yet.</p>}<div className="desk-rule" /><p className="desk-footnote">Issac only speaks from saved evidence. A fresh search is always your choice.</p></aside>}
      <nav className="mobile-nav" aria-label="Office navigation">{nav.map((item) => <button key={item.id} className={view === item.id ? "selected" : ""} aria-label={item.label} onClick={() => selectView(item.id)}><span aria-hidden="true">{item.symbol}</span><span>{item.label}</span></button>)}<button className={view === "settings" ? "selected" : ""} aria-label="Settings" onClick={() => selectView("settings")}><span aria-hidden="true">⚙</span><span>Settings</span></button></nav>
    </div>
  );
}

function OfficeView({ office, onAdd, onNavigate }: { office: Office | null; onAdd: () => void; onNavigate: (view: View) => void }) {
  return <section className="office-screen"><div className="office-title"><div><p className="kicker">A PLACE FOR YOUR BUSINESS</p><h1>{office?.domain ?? "Your office"}</h1><p className="office-url">{office?.url ?? "Add a website to begin"}</p></div><button className="outline-button" onClick={() => onNavigate("settings")}>Room settings <span>⌄</span></button></div><div className="room-window"><img className="room-art" src="/office-room.png" alt="" /><div className="room-topline"><span className="room-status"><i /> Waiting for its first check</span><button onClick={() => onNavigate("updates")}>Room notes <span>→</span></button></div><div className="room-welcome"><span className="welcome-mark">✳</span><h2>A room with room to grow.</h2><p>Your website is here. Once research is connected, real discoveries will give this room its rhythm.</p><button className="room-action" onClick={onAdd}>Add another website <span>＋</span></button></div><div className="office-character sprite-a" aria-hidden="true"><i /><b /><span /></div><div className="room-floor-label">A quiet beginning</div><div className="room-bottom"><span><i /> No research has run yet</span><button onClick={() => onNavigate("evidence")}>Evidence shelf <span>→</span></button></div></div><div className="office-under"><span>Nothing is being checked in the background.</span><button onClick={() => onNavigate("settings")}>Choose a check schedule <span>→</span></button></div></section>;
}

function EmptySection({ title, subtitle, symbol, action, onAction }: { title: string; subtitle: string; symbol: string; action: string; onAction: () => void }) {
  return <section className="section-page"><p className="kicker">YOUR OFFICE</p><div className="section-intro"><span className="section-glyph">{symbol}</span><div><h1>{title}</h1><p>{subtitle}</p></div></div><div className="empty-rule" /><p className="quiet-explainer">This space fills from real checks and saved sources. It stays quiet until there is something useful to show.</p><button className="text-action" onClick={onAction}>{action} <span>→</span></button></section>;
}

function WorkshopView({ onAsk }: { onAsk: () => void }) {
  return <section className="section-page workshop-page"><p className="kicker">THE WORKSHOP</p><h1>Make something useful from what you learn.</h1><p className="workshop-lede">Turn a real finding into words, page ideas, or a social post you can edit. Nothing goes live without you.</p><div className="workbench"><div className="workbench-tools"><span>YOUR MATERIALS</span><strong>Evidence first</strong><p>Drafts become available after a check gives the workshop something real to work from.</p><button className="text-action" onClick={onAsk}>Visit your office →</button></div><div className="blank-paper"><span>WORKING SHEET</span><div className="paper-lines" /><p>No draft started</p></div></div><div className="workshop-options"><span>When ready, make</span><b>A clearer page</b><b>A useful answer</b><b>A social post draft</b></div></section>;
}

function SettingsView({ office, onAdd }: { office: Office | null; onAdd: () => void }) {
  return <section className="section-page settings-page"><p className="kicker">YOUR ROOM</p><h1>Make it yours.</h1><p className="workshop-lede">Choose how the office looks and when it checks in. No schedule runs until you choose one.</p><div className="settings-list"><div><span><b>Website</b><small>{office?.url ?? "No website added"}</small></span><button onClick={onAdd}>{office ? "Change" : "Add website"}</button></div><div><span><b>Check-in rhythm</b><small>No automatic checks are enabled.</small></span><button disabled>Choose schedule</button></div><div><span><b>Room light</b><small>Change the office atmosphere.</small></span><button disabled>Morning / evening toggle is above</button></div><div><span><b>Account and access</b><small>Sign-in, password, and recovery settings.</small></span><button disabled>Account service not connected</button></div></div></section>;
}

function PublicInfo({ view, onBack, onSignup }: { view: View; onBack: () => void; onSignup: () => void }) {
  const content = {
    about: ["A business deserves more than a dashboard.", "heyIssac gives each website a place to come alive: a room for real discoveries, clear evidence, and the next useful move."],
    pricing: ["Plans will be clear before you begin.", "Pricing is being shaped around the number of business offices and the research each one needs. No plan or charge is active in this preview."],
    announcements: ["The noticeboard is quiet.", "There are no announcements yet."],
  }[view as "about" | "pricing" | "announcements"];
  return <main className="public-info"><p className="kicker">HEYISSAC</p><h1>{content[0]}</h1><p>{content[1]}</p><div><button className="room-action" onClick={onSignup}>Make your first office →</button><button className="quiet-link" onClick={onBack}>Back home</button></div></main>;
}

function AuthPage({ view, onView }: { view: View; onView: (view: View) => void }) {
  return <main className="auth-page"><div className="auth-side-art"><img src="/office-room.png" alt="" /><span>A place to return to.</span></div><section className="auth-page-form"><p className="kicker">HEYISSAC ACCOUNT</p><h1>{view === "signup" ? "Make your own office." : view === "recovery" ? "Find your way back." : "Welcome back."}</h1><p>{view === "recovery" ? "Enter your username to start account recovery." : "Your business office is right where you left it."}</p><form onSubmit={(event) => event.preventDefault()}><label>Username<input autoComplete="username" required /></label>{view !== "recovery" && <label>Password<input type="password" autoComplete={view === "signup" ? "new-password" : "current-password"} required /></label>}{view === "signup" && <fieldset><legend>Keep your account recoverable</legend><label className="check-row"><input type="checkbox" /> Set up an authenticator</label><label className="check-row"><input type="checkbox" /> Set a recovery passcode</label></fieldset>}<button className="room-action" type="submit">{view === "signup" ? "Create account" : view === "recovery" ? "Continue" : "Sign in"} →</button></form><div className="auth-links">{view !== "signin" && <button onClick={() => onView("signin")}>Sign in</button>}{view !== "signup" && <button onClick={() => onView("signup")}>Create an account</button>}{view !== "recovery" && <button onClick={() => onView("recovery")}>Recover password</button>}</div><p className="auth-note">Account services are not connected in this design preview.</p></section></main>;
}
