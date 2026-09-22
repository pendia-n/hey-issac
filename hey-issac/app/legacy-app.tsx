import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CreditCard,
  Home,
  Info,
  ListChecks,
  LogIn,
  PanelsTopLeft,
  Plus,
  Shield,
  UserPlus,
  UserRound,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type User = { id: string; username: string; role: string };
type Page = "today" | "offices" | "shop" | "list" | "profile" | "security";
type UsernameState = "empty" | "checking" | "available" | "taken" | "invalid";
type TotpPreview = { secret: string; otpauth: string };

const navItems: { id: Page; icon: ReactNode; label: string }[] = [
  { id: "today", icon: <Home size={18} aria-hidden="true" />, label: "Today" },
  { id: "offices", icon: <PanelsTopLeft size={18} aria-hidden="true" />, label: "Offices" },
  { id: "shop", icon: <Plus size={18} aria-hidden="true" />, label: "Shop" },
  { id: "list", icon: <ListChecks size={18} aria-hidden="true" />, label: "List" },
  { id: "profile", icon: <UserRound size={18} aria-hidden="true" />, label: "Profile" },
  { id: "security", icon: <Shield size={18} aria-hidden="true" />, label: "Security" },
];
const passwordChecks = (password: string) => ({
  length: password.length >= 7 && password.length <= 18,
  letter: /[A-Za-z]/.test(password),
  digit: /\d/.test(password),
});
const passwordOk = (password: string) => {
  const checks = passwordChecks(password);
  return checks.length && checks.letter && checks.digit;
};
const passcodeOk = (value: string) => /^[a-z0-9]{8}$/.test(value);
const modelCatalog = {
  starter: {
    default: "qwen/qwen3.8-flash",
    push: [
      "stepfun/step-3.5-flash",
      "writer/palmyra-x5",
      "arcee-ai/trinity-large-thinking",
    ],
    max: "minimax/minimax-m3:batch",
  },
  studio: {
    default: "moonshotai/kimi-k2.7-code",
    push: ["google/gemini-3.8-flash", "thinkingmachines/inkling-small"],
    max: "anthropic/claude-sonnet-5:batch",
  },
  partner: {
    default: "mistralai/mistral-medium-3-5",
    push: ["openai/gpt-6-astra"],
    max: "openai/gpt-6-astra-pro",
  },
} as const;
async function readApiJson<T>(response: Response): Promise<T | null> {
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("application/json")
  )
    return null;
  try {
    return (await (response.json() as Promise<any>)) as T;
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [timeMode, setTimeMode] = useState<"morning" | "afternoon">("morning");
  const [publicPath, setPublicPath] = useState("/");
  const [page, setPage] = useState<Page>("today");
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };
  useEffect(() => {
    const savedMode = window.localStorage.getItem("heyissac-time-mode");
    if (savedMode === "afternoon") setTimeMode("afternoon");
    setPublicPath(window.location.pathname);
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => readApiJson<{ user?: User }>(response))
      .then((body) => setUser(body?.user ?? null))
      .finally(() => setAuthReady(true));
    const onPopState = () => setPublicPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (!authReady || !user) return;
    const params = new URLSearchParams(window.location.search);
    const brief = params.get("brief");
    const subscription = params.get("subscription");
    if (subscription === "success") {
      setPage("profile");
      setToast("Your plan is active. Manage it from your profile.");
      window.history.replaceState({}, "", window.location.pathname);
      window.setTimeout(() => setToast(""), 3200);
    } else if (brief === "success") {
      setPage("today");
      setToast("Payment received. Your First Visit is being prepared.");
      window.history.replaceState({}, "", window.location.pathname);
      window.setTimeout(() => setToast(""), 3600);
    }
  }, [authReady, user]);
  useEffect(() => {
    document.documentElement.dataset.time = timeMode;
    window.localStorage.setItem("heyissac-time-mode", timeMode);
  }, [timeMode]);
  const withMode = (content: React.ReactNode) => (
    <>
      {content}
      <button
        className="time-mode-toggle"
        type="button"
        aria-label={`Switch to ${timeMode === "morning" ? "afternoon" : "morning"} mode`}
        onClick={() =>
          setTimeMode(timeMode === "morning" ? "afternoon" : "morning")
        }
      >
        <span aria-hidden="true">{timeMode === "morning" ? "☼" : "☾"}</span>
        <span className="time-mode-label">{timeMode}</span>
      </button>
    </>
  );
  const navigatePublic = (path: string) => {
    const target = new URL(path, window.location.origin);
    window.history.pushState({}, "", target.pathname + target.search);
    setPublicPath(target.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const choosePlan = (plan: string) => {
    setPendingPlan(plan);
    if (user) {
      setPage("profile");
      navigatePublic("/");
      return;
    }
    window.sessionStorage.setItem("heyissac-pending-plan", plan);
    navigatePublic("/signup");
  };
  const chooseFirstBrief = () => {
    if (user) {
      setPage("shop");
      navigatePublic("/");
      return;
    }
    window.sessionStorage.setItem("heyissac-pending-first-brief", "1");
    navigatePublic("/signup");
  };
  const signOut = () =>
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      setUser(null);
      navigatePublic("/signin");
    });
  if (!authReady) return <div className="auth-loading">Loading heyIssac…</div>;
  const publicPage =
    publicPath === "/pricing" ? (
      <Pricing
        onChoosePlan={choosePlan}
        onFirstBrief={chooseFirstBrief}
        onNavigate={navigatePublic}
      />
    ) : publicPath === "/about" ? (
      <About
        onStart={() => navigatePublic(user ? "/" : "/signup")}
        onNavigate={navigatePublic}
      />
    ) : publicPath === "/announcements" ? (
      <Announcements authenticated={!!user} onNavigate={navigatePublic} />
    ) : null;
  if (publicPage) return withMode(publicPage);
  if (!user) {
    if (publicPath === "/signup")
      return withMode(
        <SignUp
          onSuccess={(nextUser) => {
            setUser(nextUser);
            const savedPlan = window.sessionStorage.getItem(
              "heyissac-pending-plan",
            );
            if (savedPlan) {
              setPendingPlan(savedPlan);
              setPage("profile");
              window.sessionStorage.removeItem("heyissac-pending-plan");
            } else if (
              window.sessionStorage.getItem("heyissac-pending-first-brief")
            ) {
              setPage("shop");
              window.sessionStorage.removeItem("heyissac-pending-first-brief");
            }
            navigatePublic("/");
          }}
          onNavigate={navigatePublic}
        />,
      );
    if (publicPath === "/recovery")
      return withMode(<Recovery onNavigate={navigatePublic} />);
    if (publicPath === "/signin")
      return withMode(
        <SignIn
          onSuccess={(nextUser) => {
            setUser(nextUser);
            navigatePublic("/");
          }}
          onNavigate={navigatePublic}
        />,
      );
    return withMode(
      <Landing
        onStart={() => navigatePublic("/signup")}
        onNavigate={navigatePublic}
      />,
    );
  }
  const selectedPage: Page =
    publicPath === "/security"
      ? "security"
      : publicPath === "/profile"
        ? "profile"
        : page;
  return withMode(
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <img src="/hi.svg" alt="heyIssac" />
          <span>heyIssac</span>
        </div>
        <div className="shop-name">your growth shelf</div>
        <nav aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${selectedPage === item.id ? "active" : ""}`}
              title={item.label}
              aria-label={item.label}
              onClick={() => {
                if (item.id === "security") navigatePublic("/security");
                else {
                  navigatePublic("/");
                  setPage(item.id);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="help">
          <strong>Need a hand?</strong>
          <p>Support is not available in the app yet.</p>
        </div>
      </aside>
      <main>
        <div className="topbar">
          <span>
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <div className="account">
            <span>@{user.username}</span>
            <button className="avatar" aria-label="Sign out" onClick={signOut}>
              ↪
            </button>
          </div>
        </div>
        {selectedPage === "today" && <Today setPage={setPage} />}
        {selectedPage === "offices" && <Offices setPage={setPage} />}
        {selectedPage === "shop" && <Shop setPage={setPage} notify={notify} />}
        {selectedPage === "list" && <List notify={notify} />}
        {selectedPage === "profile" && (
          <Profile user={user} notify={notify} initialPlan={pendingPlan} />
        )}
        {selectedPage === "security" && <Security notify={notify} />}
      </main>
      <div className={`toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
    </div>,
  );
}

function PublicNav({
  onStart,
  onNavigate,
}: {
  onStart: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <header className="public-nav">
      <button className="public-brand" onClick={() => onNavigate("/")}>
        <img src="/hi.svg" alt="heyIssac" />
        <span>heyIssac</span>
      </button>
      <nav>
        <button
          title="Pricing"
          aria-label="Pricing"
          onClick={() => onNavigate("/pricing")}
        >
          <CreditCard className="public-nav-icon" aria-hidden="true" />
          <span className="public-nav-label">Pricing</span>
        </button>
        <button
          title="About"
          aria-label="About"
          onClick={() => onNavigate("/about")}
        >
          <Info className="public-nav-icon" aria-hidden="true" />
          <span className="public-nav-label">About</span>
        </button>
        <button
          title="Announcements"
          aria-label="Announcements"
          onClick={() => onNavigate("/announcements")}
        >
          <Bell className="public-nav-icon" aria-hidden="true" />
          <span className="public-nav-label">Announcements</span>
        </button>
      </nav>
      <button className="public-signin" onClick={() => onNavigate("/signin")}>
        Sign in <span>↗</span>
      </button>
    </header>
  );
}

function Landing({
  onStart,
  onNavigate,
}: {
  onStart: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="public-site">
      <PublicNav onStart={onStart} onNavigate={onNavigate} />
      <main>
        <section className="landing-hero">
          <div className="landing-copy">
            <div className="eyebrow">Growth, made easier to hold</div>
            <h1>Start with a URL. Leave with a clear next move.</h1>
            <p>
              heyIssac searches public evidence, reads reachable pages, and
              turns what it finds into a short list you can actually use.
            </p>
            <button className="primary landing-cta" onClick={onStart}>
              Build my first list <span>→</span>
            </button>
            <small>Use a public website and a plain-language question.</small>
          </div>
          <div
            className="landing-preview"
            aria-label="Illustrative layout only; no live result data"
          >
            <div className="preview-top">
              <span>FIRST CHECK</span>
              <b>Your URL</b>
            </div>
            <div className="preview-line">
              <span className="preview-check">1</span>
              <span>
                <b>Evidence receipt</b>
                <small>
                  See the public pages and search results that shaped the
                  diagnosis.
                </small>
              </span>
            </div>
            <div className="preview-line">
              <span className="preview-check">2</span>
              <span>
                <b>Discovery read</b>
                <small>
                  Keep measured search positions separate from unknown
                  visibility.
                </small>
              </span>
            </div>
            <div className="preview-line">
              <span className="preview-check">3</span>
              <span>
                <b>Next action shelf</b>
                <small>
                  Take one useful action without losing the context behind it.
                </small>
              </span>
            </div>
            <div className="preview-footer">
              <span>Clear evidence</span>
              <strong>Practical next steps</strong>
            </div>
          </div>
        </section>
        <section className="landing-intro">
          <div className="section-kicker">Your first visit</div>
          <h2>One question in. One useful list out.</h2>
          <p>
            Give heyIssac a public URL, the audience or place you care about,
            and the question sitting on your mind. It does the gathering, then
            gives you the work back in ordinary language.
          </p>
        </section>
        <section className="landing-shelves journey-shelves">
          <article>
            <span className="shelf-number">01</span>
            <h3>Bring the question</h3>
            <p>
              Paste your website and name the result you want to understand. Add
              a place, search phrases, or competitors when they matter.
            </p>
          </article>
          <article>
            <span className="shelf-number">02</span>
            <h3>Get an evidence-backed read</h3>
            <p>
              Receive a summary, public evidence receipt, measured discovery
              checks, GEO limits, and a ranked action list.
            </p>
          </article>
          <article>
            <span className="shelf-number">03</span>
            <h3>Keep the useful work</h3>
            <p>
              Approve, dismiss, complete, or revisit actions. Run another
              focused check when your business changes.
            </p>
          </article>
        </section>
        <section className="landing-workbench">
          <div>
            <div className="eyebrow">After the first result</div>
            <h2>The work does not disappear when the check is done.</h2>
            <p>
              Your saved runs hold the evidence, recommendations, drafts, and
              decisions together. That means a later refresh begins with context
              instead of another blank page.
            </p>
            <button className="text-link" onClick={() => onNavigate("/about")}>
              See the full journey <span>→</span>
            </button>
          </div>
          <div className="workbench-list">
            <div>
              <strong>Review</strong>
              <span>Open the saved evidence behind a recommendation</span>
              <b>Today</b>
            </div>
            <div>
              <strong>Decide</strong>
              <span>Approve, dismiss, or complete the next action</span>
              <b>Your call</b>
            </div>
            <div>
              <strong>Refresh</strong>
              <span>Ask a new question when the market or site changes</span>
              <b>When needed</b>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}

function Pricing({
  onChoosePlan,
  onFirstBrief,
  onNavigate,
}: {
  onChoosePlan: (plan: string) => void;
  onFirstBrief: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="public-site">
      <PublicNav
        onStart={() => onNavigate("/signup")}
        onNavigate={onNavigate}
      />
      <main className="public-page">
        <div className="eyebrow">Pricing</div>
        <h1>A first visit, or a living office for your business.</h1>
        <p className="public-lede">
          Get one complete, evidence-backed report. A monthly plan adds up to
          four weekly site and market pulses and one full report per office in
          each billing period.
        </p>
        <section className="price-grid">
          <article>
            <span className="plan-label">First Visit</span>
            <h2>
              $9<span> once</span>
            </h2>
            <p>One website. One complete report. No continuing updates.</p>
            <ul>
              <li>One complete report for one website</li>
              <li>Research is normalized to the website root</li>
              <li>Saved findings and action list</li>
              <li>No subscription or future refresh</li>
            </ul>
            <button className="secondary" onClick={onFirstBrief}>
              Start a First Visit
            </button>
          </article>
          <article>
            <span className="plan-label">Starter</span>
            <h2>
              $19<span>/month</span>
            </h2>
            <p>For one business that wants a useful weekly check-in.</p>
            <ul>
              <li>1 website office</li>
              <li>1 full report per billing period</li>
              <li>Up to 4 weekly site and market pulses per period</li>
              <li>3 evidence-based questions each month</li>
            </ul>
            <button
              className="secondary"
              onClick={() => onChoosePlan("starter")}
            >
              Choose Starter
            </button>
          </article>
          <article>
            <span className="plan-label">Studio</span>
            <h2>
              $49<span>/month</span>
            </h2>
            <p>For a small portfolio across a few businesses.</p>
            <ul>
              <li>3 website offices</li>
              <li>1 full report per office each billing period</li>
              <li>Up to 4 weekly pulses per office per period</li>
              <li>12 evidence-based questions shared</li>
            </ul>
            <button
              className="secondary"
              onClick={() => onChoosePlan("studio")}
            >
              Choose Studio
            </button>
          </article>
          <article className="price-featured">
            <span className="plan-label">Partner</span>
            <span className="popular">More room</span>
            <h2>
              $99<span>/month</span>
            </h2>
            <p>For an operator keeping a wider portfolio in view.</p>
            <ul>
              <li>8 website offices</li>
              <li>1 full report per office each billing period</li>
              <li>Up to 4 weekly pulses per office per period</li>
              <li>30 evidence-based questions shared</li>
              <li>Optional 3 more offices for $8/month</li>
            </ul>
            <button className="primary" onClick={() => onChoosePlan("partner")}>
              Choose Partner <span>→</span>
            </button>
          </article>
        </section>
        <section className="billing-explainer">
          <div>
            <div className="eyebrow">What does a full report include?</div>
            <h2>One complete reveal, then smaller weekly pulses.</h2>
          </div>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Choose a website</strong>
                <p>
                  A deep link is normalized to the website root. Paths do not
                  create extra offices or change the analysis target.
                </p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Get one joined-up reveal</strong>
                <p>
                  A plain-language business summary, a few sourced alternatives,
                  search and AI-readability checks, practical next steps, and
                  social post drafts are all included.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Keep the office up to date</strong>
                <p>
                  Each office gets one full report and up to four weekly pulses
                  in each billing period. The report allowance is per office,
                  not a shared pool.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <p className="price-note">
          The $9 First Visit keeps its report but does not run future checks.
          Subscription pulses are included and can be turned off for an office.
          A pulse checks the site's public pages and one focused market search;
          the full-report allowance resets at renewal. Push and Max only change
          the report model. The included model does not use wallet balance;
          Push/Max usage is charged at 1.4× the reported OpenRouter model cost.
          Top-ups start at $3.
        </p>
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}

function About({
  onStart,
  onNavigate,
}: {
  onStart: () => void;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="public-site">
      <PublicNav onStart={onStart} onNavigate={onNavigate} />
      <main className="public-page about-page">
        <div className="eyebrow">About heyIssac</div>
        <h1>Good work deserves a clearer path to the people looking for it.</h1>
        <div className="about-columns">
          <div>
            <p className="about-lede">
              heyIssac is a small-business growth companion for the part after
              "we should probably market this" and before "why did we publish
              that?"
            </p>
            <button className="primary" onClick={onStart}>
              Build my first list <span>→</span>
            </button>
          </div>
          <div>
            <p>
              We believe marketing should feel more like tending a shop than
              shouting into a crowd. You look at what is on the shelf, notice
              what is missing, and make one thoughtful improvement.
            </p>
            <p>
              Our job is to gather public evidence, explain it in ordinary
              language, and help you decide. The software can check, compare,
              rank, and draft. You remain the person who knows what is true.
            </p>
          </div>
        </div>
        <section className="about-route">
          <div className="eyebrow">A first run, in plain language</div>
          <h2>Imagine you add Your URL.</h2>
          <div className="about-route-grid">
            <div>
              <span>Before</span>
              <strong>
                You name the public URL and the question you need answered.
              </strong>
              <p>
                Add a geography, keywords, or competitors only when they help
                the check.
              </p>
            </div>
            <div>
              <span>During</span>
              <strong>
              heyIssac searches, reads reachable public pages, and prioritizes
              practical next steps.
              </strong>
              <p>
                It keeps sources, measured positions, and unknowns distinct.
              </p>
            </div>
            <div>
              <span>After</span>
              <strong>
                You receive a saved evidence receipt and a short action shelf.
              </strong>
              <p>
                Review the reasoning, decide what moves forward, then return
                when the next question arrives.
              </p>
            </div>
          </div>
        </section>
        <section className="about-followup">
          <div>
            <div className="eyebrow">What comes after initial</div>
            <h2>A saved run is the beginning of a useful conversation.</h2>
          </div>
          <p>
            The office keeps the report and its sources together. A user can
            read a weekly note, open its source, and ask a limited question
            about saved evidence. It should not behave like an unlimited general
            chatbot or search the web again on every reply.
          </p>
        </section>
        <section className="about-values">
          <div>
            <strong>Evidence before confidence.</strong>
            <span>
              Recommendations should point to what was actually observed.
            </span>
          </div>
          <div>
            <strong>Useful before impressive.</strong>
            <span>
              A short list you finish beats an endless feed you ignore.
            </span>
          </div>
          <div>
            <strong>People before autopilot.</strong>
            <span>Your voice and approval stay part of the loop.</span>
          </div>
        </section>
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}

function PublicFooter({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="public-footer">
      <div>
        <button className="public-brand" onClick={() => onNavigate("/")}>
          <img src="/hi.svg" alt="heyIssac" />
          <span>heyIssac</span>
        </button>
        <p>A calmer way to grow a good business.</p>
      </div>
      <div className="footer-links">
        <button onClick={() => onNavigate("/pricing")}>Pricing</button>
        <button onClick={() => onNavigate("/about")}>About</button>
        <button onClick={() => onNavigate("/announcements")}>
          Announcements
        </button>
      </div>
      <small>© 2026 heyIssac</small>
    </footer>
  );
}

function Announcements({
  authenticated,
  onNavigate,
}: {
  authenticated: boolean;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="public-site">
      <PublicNav
        onStart={() => onNavigate(authenticated ? "/" : "/signin")}
        onNavigate={onNavigate}
      />
      <main className="public-page announcements-page">
        <div className="eyebrow">Announcements</div>
        <h1>Nothing new to announce yet.</h1>
        <p className="public-lede">
          Product updates will appear here when there is something real to
          share.
        </p>
        <button
          className="secondary"
          onClick={() => onNavigate(authenticated ? "/" : "/signup")}
        >
          {authenticated ? "Return to my workspace" : "Create an account"}
        </button>
      </main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}

function AuthFrame({
  title,
  intro,
  children,
  onNavigate,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <button className="back-link" onClick={() => onNavigate("/")}>
          ← Back to heyIssac
        </button>
        <img src="/hi.svg" alt="heyIssac" />
        <div className="eyebrow">Account</div>
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
        {children}
      </div>
    </div>
  );
}

function SignIn({
  onSuccess,
  onNavigate,
}: {
  onSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const body = (await (response.json() as Promise<any>)) as {
      user?: User;
      error?: string;
    };
    if (!response.ok || !body.user)
      return setMessage(body.error ?? "Please try again.");
    onSuccess(body.user);
  };
  return (
    <AuthFrame
      title="Welcome back."
      intro="Sign in with the username and password you chose."
      onNavigate={onNavigate}
    >
      <form onSubmit={submit}>
        <label htmlFor="signin-username">Username</label>
        <input
          id="signin-username"
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="primary" type="submit">
          Sign in <span>→</span>
        </button>
      </form>
      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <div className="auth-links">
        <button
          className="text-link auth-switch"
          onClick={() => onNavigate("/signup")}
        >
          <UserPlus size={16} /> Create an account
        </button>
        <button
          className="text-link auth-switch"
          onClick={() => onNavigate("/recovery")}
        >
          Forgot password?
        </button>
      </div>
    </AuthFrame>
  );
}

function SignUp({
  onSuccess,
  onNavigate,
}: {
  onSuccess: (user: User) => void;
  onNavigate: (path: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [usernameState, setUsernameState] = useState<UsernameState>("empty");
  const [password, setPassword] = useState("");
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [totp, setTotp] = useState<TotpPreview | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const normalized = username.trim().toLowerCase();
    if (!normalized) return setUsernameState("empty");
    if (!/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(normalized))
      return setUsernameState("invalid");
    setUsernameState("checking");
    const controller = new AbortController();
    const timer = window.setTimeout(
      () =>
        fetch(
          `/api/auth/username-availability?username=${encodeURIComponent(normalized)}`,
          { signal: controller.signal },
        )
          .then((response) => response.json() as Promise<any>)
          .then((body: { available?: boolean; valid?: boolean }) =>
            setUsernameState(
              body.valid && body.available ? "available" : "taken",
            ),
          )
          .catch(() => {
            if (!controller.signal.aborted) setUsernameState("invalid");
          }),
      350,
    );
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [username]);
  const checks = passwordChecks(password);
  const usernameHint =
    usernameState === "checking"
      ? "Checking availability…"
      : usernameState === "available"
        ? "Username is available."
        : usernameState === "taken"
          ? "That username is already taken."
          : usernameState === "invalid"
            ? "Use 3–40 letters, numbers, dots, dashes, or underscores."
            : "Choose a public username.";
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (usernameState !== "available")
      return setMessage("Choose an available username first.");
    if (!passwordOk(password))
      return setMessage("Use 7-18 characters with one letter and one digit.");
    if (passcodeEnabled && !passcodeOk(passcode))
      return setMessage(
        "Passcode must be exactly 8 lowercase letters or digits.",
      );
    if (totpEnabled && (!totp || !/^\d{6}$/.test(totpCode)))
      return setMessage(
        "Set up your authenticator and enter its 6-digit code.",
      );
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
        passcode: passcodeEnabled ? passcode : undefined,
        totpSecret: totpEnabled ? totp?.secret : undefined,
        totpCode: totpEnabled ? totpCode : undefined,
      }),
    });
    const body = (await response.json()) as { user?: User; error?: string };
    if (!response.ok || !body.user)
      return setMessage(body.error ?? "Unable to create your account.");
    onSuccess(body.user);
  };
  return (
    <AuthFrame
      title="Put your growth on the list."
      intro="Choose a username and password. Recovery setup is optional; without it, you cannot reset your password while signed out."
      onNavigate={onNavigate}
    >
      <form onSubmit={submit}>
        <label htmlFor="signup-username">Username</label>
        <input
          id="signup-username"
          className={`username-input ${usernameState}`}
          autoComplete="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <p className={`username-hint ${usernameState}`} aria-live="polite">
          {usernameHint}
        </p>
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          minLength={7}
          maxLength={18}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordMeter checks={checks} />
        <RecoverySetup
          passcodeEnabled={passcodeEnabled}
          setPasscodeEnabled={setPasscodeEnabled}
          totpEnabled={totpEnabled}
          setTotpEnabled={setTotpEnabled}
          passcode={passcode}
          setPasscode={setPasscode}
          totp={totp}
          setTotp={setTotp}
          totpCode={totpCode}
          setTotpCode={setTotpCode}
        />
        <button className="primary" type="submit">
          Create my account <span>→</span>
        </button>
      </form>
      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <button
        className="text-link auth-switch"
        onClick={() => onNavigate("/signin")}
      >
        <LogIn size={16} /> Already have an account? Sign in
      </button>
    </AuthFrame>
  );
}

function RecoverySetup({
  passcodeEnabled,
  setPasscodeEnabled,
  totpEnabled,
  setTotpEnabled,
  passcode,
  setPasscode,
  totp,
  setTotp,
  totpCode,
  setTotpCode,
}: {
  passcodeEnabled: boolean;
  setPasscodeEnabled: (value: boolean) => void;
  totpEnabled: boolean;
  setTotpEnabled: (value: boolean) => void;
  passcode: string;
  setPasscode: (value: string) => void;
  totp: TotpPreview | null;
  setTotp: (value: TotpPreview | null) => void;
  totpCode: string;
  setTotpCode: (value: string) => void;
}) {
  const toggleTotp = async (enabled: boolean) => {
    setTotpEnabled(enabled);
    if (!enabled) {
      setTotp(null);
      setTotpCode("");
      return;
    }
    const response = await fetch("/api/auth/totp/setup-preview");
    if (response.ok) setTotp(await (response.json() as Promise<any>));
  };
  return (
    <section className="recovery-box">
      <h2>Optional recovery methods</h2>
      <p className="hint">
        Choose either, both, or neither. Without one, password recovery is
        unavailable while signed out.
      </p>
      <div className="recovery-choice-list">
        <label className="recovery-choice">
          <input
            type="checkbox"
            checked={passcodeEnabled}
            onChange={(event) => {
              setPasscodeEnabled(event.target.checked);
              if (!event.target.checked) setPasscode("");
            }}
          />
          <span>
            <strong>Recovery passcode</strong>
            <small>An 8-character code you keep somewhere private.</small>
          </span>
        </label>
        <label className="recovery-choice">
          <input
            type="checkbox"
            checked={totpEnabled}
            onChange={(event) => toggleTotp(event.target.checked)}
          />
          <span>
            <strong>Authenticator app</strong>
            <small>Use a six-digit code from your authenticator.</small>
          </span>
        </label>
      </div>
      {passcodeEnabled && (
        <div className="recovery-method-fields">
          <label htmlFor="passcode">Recovery passcode</label>
          <input
            id="passcode"
            maxLength={8}
            placeholder="8 lowercase letters or digits"
            value={passcode}
            onChange={(event) =>
              setPasscode(
                event.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
              )
            }
          />
          <p
            className={`hint ${!passcode || passcodeOk(passcode) ? "ok" : "bad"}`}
          >
            Exactly 8 lowercase letters or digits.
          </p>
        </div>
      )}
      {totpEnabled && (
        <div className="recovery-method-fields totp-box">
          {totp ? (
            <>
              <p className="hint">
                Scan this QR code, then enter the current six-digit code.
              </p>
              <TotpQr uri={totp.otpauth} />
              <details>
                <summary>Enter the secret manually</summary>
                <p className="totp-secret">{totp.secret}</p>
              </details>
              <label htmlFor="totp-code">6-digit authenticator code</label>
              <input
                id="totp-code"
                inputMode="numeric"
                maxLength={6}
                value={totpCode}
                onChange={(event) =>
                  setTotpCode(event.target.value.replace(/\D/g, ""))
                }
              />
            </>
          ) : (
            <p className="hint">Preparing authenticator setup…</p>
          )}
        </div>
      )}
    </section>
  );
}

function TotpQr({ uri }: { uri: string }) {
  return (
    <QRCodeSVG
      className="totp-qr"
      value={uri}
      size={220}
      level="M"
      bgColor="#ffffff"
      fgColor="#17251c"
      aria-label="Authenticator setup QR code"
    />
  );
}

function Recovery({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [username, setUsername] = useState("");
  const [methods, setMethods] = useState<string[]>([]);
  const [method, setMethod] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const findAccount = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch(
      `/api/auth/recovery-status?username=${encodeURIComponent(username.trim())}`,
    );
    const body = (await (response.json() as Promise<any>)) as {
      methods?: string[];
      error?: string;
    };
    if (!response.ok || !body.methods?.length)
      return setMessage(
        body.error ?? "Recovery is not available for this account.",
      );
    setMethods(body.methods);
    setMethod(body.methods[0]);
  };
  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/auth/recovery/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        method,
        code: method === "totp" ? code : undefined,
        passcode: method === "passcode" ? code : undefined,
      }),
    });
    const body = (await (response.json() as Promise<any>)) as {
      resetToken?: string;
      error?: string;
    };
    if (!response.ok || !body.resetToken)
      return setMessage(body.error ?? "Recovery could not be verified.");
    setResetToken(body.resetToken);
    setMessage("Verified. Choose a new password.");
  };
  const reset = async (event: FormEvent) => {
    event.preventDefault();
    if (!passwordOk(password))
      return setMessage("Use 7-18 characters with one letter and one digit.");
    const response = await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, password }),
    });
    const body = (await (response.json() as Promise<any>)) as {
      error?: string;
    };
    if (!response.ok)
      return setMessage(body.error ?? "Password was not reset.");
    onNavigate("/signin");
  };
  return (
    <AuthFrame
      title="Recover your account."
      intro="Start with your username. We will show only the recovery methods you enabled."
      onNavigate={onNavigate}
    >
      {!methods.length ? (
        <form onSubmit={findAccount}>
          <label htmlFor="recover-username">Username</label>
          <input
            id="recover-username"
            autoComplete="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button className="primary" type="submit">
            Find my recovery options <span>→</span>
          </button>
        </form>
      ) : !resetToken ? (
        <form onSubmit={verify}>
          <label htmlFor="recover-method">Recovery method</label>
          <select
            id="recover-method"
            value={method}
            onChange={(event) => {
              setMethod(event.target.value);
              setCode("");
            }}
          >
            {methods.map((item) => (
              <option key={item} value={item}>
                {item === "totp" ? "Authenticator code" : "Recovery passcode"}
              </option>
            ))}
          </select>
          <label htmlFor="recover-code">
            {method === "totp"
              ? "6-digit authenticator code"
              : "8-character recovery passcode"}
          </label>
          <input
            id="recover-code"
            inputMode={method === "totp" ? "numeric" : "text"}
            maxLength={method === "totp" ? 6 : 8}
            required
            value={code}
            onChange={(event) =>
              setCode(
                method === "totp"
                  ? event.target.value.replace(/\D/g, "")
                  : event.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
              )
            }
          />
          <button className="primary" type="submit">
            Verify recovery <span>→</span>
          </button>
        </form>
      ) : (
        <form onSubmit={reset}>
          <label htmlFor="recovery-password">New password</label>
          <input
            id="recovery-password"
            type="password"
            autoComplete="new-password"
            minLength={7}
            maxLength={18}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordMeter checks={passwordChecks(password)} />
          <button
            className="primary"
            type="submit"
            disabled={!passwordOk(password)}
          >
            Reset password <span>→</span>
          </button>
        </form>
      )}
      {message && (
        <p className="form-error" role="status">
          {message}
        </p>
      )}
      <div className="auth-links">
        <button
          className="text-link auth-switch"
          onClick={() => onNavigate("/signin")}
        >
          Back to sign in
        </button>
        <button
          className="text-link auth-switch"
          onClick={() => onNavigate("/signup")}
        >
          Create an account
        </button>
      </div>
    </AuthFrame>
  );
}

function PasswordMeter({
  checks,
}: {
  checks: { length: boolean; letter: boolean; digit: boolean };
}) {
  return (
    <div className="password-meter" aria-live="polite">
      <span className={checks.length ? "ok" : ""}>7-18 characters</span>
      <span className={checks.letter ? "ok" : ""}>letter</span>
      <span className={checks.digit ? "ok" : ""}>digit</span>
    </div>
  );
}

function Today({ setPage }: { setPage: (page: Page) => void }) {
  const [runs, setRuns] = useState<any[]>([]);
  const load = () =>
    fetch("/api/runs", { credentials: "include" })
      .then((response) =>
        response.ok ? (response.json() as Promise<any>) : null,
      )
      .then((body) => setRuns(body?.runs ?? []));
  useEffect(() => {
    load();
  }, []);
  const latest = runs.find((run) => run.status === "completed");
  const latestAttempt = runs[0];
  const findings = latest?.result?.findings ?? [];
  const nextActions = latest?.result?.actions ?? [];
  return (
    <section className="page">
      <div className="hero">
        <div>
          <div className="eyebrow">Your weekly shop</div>
          <h1>
            {latest ? "Your latest read." : "Start with one useful question."}
          </h1>
          <p className="lede">
            {latest
              ? (latest.result?.summary ??
                "Your latest diagnosis is ready to review.")
              : "Give heyIssac a public website and it will bring back evidence before advice."}
          </p>
        </div>
        <button className="primary" onClick={() => setPage("shop")}>
          {latest ? "Run another check" : "Start my first check"} <span>→</span>
        </button>
      </div>
      <div className="status-strip">
        <span className="dot" />
        <strong>
          {latest
            ? "Last report completed"
            : latestAttempt
              ? `Last attempt ${latestAttempt.status}`
              : "No check yet"}
        </strong>
        <span>
          {latest || latestAttempt
            ? new Date((latest ?? latestAttempt).created_at).toLocaleString()
            : "Your first result will appear here."}
        </span>
      </div>
      <div className="overview">
        <div className="panel score">
          <div className="score-ring">
            <strong aria-hidden="true">{latest ? "✓" : "·"}</strong>
          </div>
          <div>
            <small>Report status</small>
            <h3>
              {latest ? "Evidence ready to review" : "No finished report yet"}
            </h3>
            <small>
              {latest
                ? `${findings.length} findings in the latest report`
                : "Start a full analysis to create your first report."}
            </small>
          </div>
        </div>
        <Metric
          label="Saved runs"
          value={String(runs.length)}
          change="Your private history"
        />
        <Metric
          label="Next actions"
          value={String(nextActions.length)}
          change="Review before publishing"
        />
      </div>
      <div className="section-head">
        <h2>What the evidence says</h2>
        <button className="text-link" onClick={() => setPage("list")}>
          Open full list →
        </button>
      </div>
      {latest ? (
        <div className="shelves">
          {findings.slice(0, 3).map((item: any) => (
            <Shelf
              key={item.title}
              icon="◌"
              title={item.title}
              copy={item.diagnosis}
              note={item.priority ?? "review"}
            />
          ))}
        </div>
      ) : (
        <div className="panel empty-state">
          <h3>Your shelves are empty for now.</h3>
          <p>Run your first check to create an evidence-backed list.</p>
          <button className="secondary" onClick={() => setPage("shop")}>
            Check my website →
          </button>
        </div>
      )}
      <div className="lower">
        <div className="panel actions">
          <div className="section-head">
            <h2>Next actions</h2>
            <button className="text-link" onClick={() => setPage("list")}>
              Manage actions →
            </button>
          </div>
          {nextActions.slice(0, 4).map((action: any) => (
            <div className="action" key={action.title}>
              <div>
                <h3>{action.title}</h3>
                <p>{action.rationale}</p>
              </div>
              <span className="tag important">
                {action.priority ?? "review"}
              </span>
            </div>
          ))}
        </div>
        <aside className="panel receipt">
          <h2>Run history</h2>
          <p className="date">Private to this workspace</p>
          {runs.slice(0, 4).map((run) => (
            <div className="receipt-line" key={run.id}>
              <span>{new URL(run.site_url).hostname}</span>
              <strong>{run.status}</strong>
            </div>
          ))}
          {!runs.length && (
            <p className="hint">Completed checks will be listed here.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
function Offices({ setPage }: { setPage: (page: Page) => void }) {
  const [offices, setOffices] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    Promise.all([
      fetch("/api/projects", { credentials: "include" }),
      fetch("/api/runs", { credentials: "include" }),
    ]).then(async ([projectResponse, runResponse]) => {
      const projectBody = projectResponse.ok
        ? await (projectResponse.json() as Promise<any>)
        : {};
      const runBody = runResponse.ok
        ? await (runResponse.json() as Promise<any>)
        : {};
      setOffices(projectBody.projects ?? []);
      setRuns(runBody.runs ?? []);
    });
  }, []);
  useEffect(() => {
    if (!selected?.id) {
      setEvents([]);
      return;
    }
    fetch(`/api/projects/${selected.id}/events`, { credentials: "include" })
      .then((response) => readApiJson<{ events?: any[] }>(response))
      .then((body) => setEvents(body?.events ?? []));
  }, [selected?.id]);
  const setWeeklyPulse = async (enabled: boolean) => {
    setMessage("");
    const response = await fetch(`/api/projects/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ watchEnabled: enabled }),
    });
    const body = await (response.json() as Promise<any>);
    if (!response.ok) {
      setMessage(body.error ?? "Weekly updates could not be changed.");
      return;
    }
    const updated = {
      ...selected,
      watch_enabled: enabled ? 1 : 0,
      monitor_next_at: body.nextCheckAt,
      monitor_last_status: enabled ? "scheduled" : "not_enabled",
    };
    setSelected(updated);
    setOffices((current) =>
      current.map((office) => (office.id === updated.id ? updated : office)),
    );
  };
  const officeRuns = selected
    ? runs.filter((run) => {
        try {
          return new URL(run.site_url).host === new URL(selected.site_url).host;
        } catch {
          return false;
        }
      })
    : [];
  return (
    <section className="page">
      <div className="eyebrow">Your offices</div>
      <div className="hero">
        <div>
          <h1>
            {selected
              ? new URL(selected.site_url).hostname
              : "Every website, in one place."}
          </h1>
          <p className="lede">
            Each office represents a website. Submitted page paths are
            normalized to the site root for analysis.
          </p>
        </div>
        <button className="primary" onClick={() => setPage("shop")}>
          Add a website <span>→</span>
        </button>
      </div>
      {selected ? (
        <>
          <div className="status-strip">
            <span className="dot" />
            <strong>
              {officeRuns.length
                ? `${officeRuns.length} saved analysis${officeRuns.length === 1 ? "" : "es"}`
                : "No analysis yet"}
            </strong>
            <span>{selected.target_geo || "No target area saved"}</span>
          </div>
          <div className="panel history-panel">
            <div className="section-head">
              <h2>Analysis history</h2>
              <button className="text-link" onClick={() => setSelected(null)}>
                All offices
              </button>
            </div>
            {officeRuns.length ? (
              officeRuns.map((run) => (
                <div className="receipt-line" key={run.id}>
                  <span>
                    {new Date(run.created_at).toLocaleString()} · {run.site_url}
                  </span>
                  <strong>{run.status}</strong>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>This office has no saved analyses yet.</p>
                <button className="secondary" onClick={() => setPage("shop")}>
                  Start a full analysis
                </button>
              </div>
            )}
          </div>
          <div className="panel history-panel office-pulse">
            <h2>Weekly website and market pulse</h2>
            <label className="recovery-choice">
              <input
                type="checkbox"
                checked={Boolean(selected.watch_enabled)}
                onChange={(event) => void setWeeklyPulse(event.target.checked)}
              />
              <span>
                <strong>Send this office a weekly check</strong>
                <small>
                  Checks the website root and looks for a few related market
                  results. Only changes or new results are saved here.
                </small>
              </span>
            </label>
            <p className="hint">
              {!selected.watch_enabled
                ? "Off. No scheduled checks are running."
                : selected.monitor_last_status === "ready"
                  ? `Last checked ${selected.monitor_last_checked_at ? new Date(selected.monitor_last_checked_at).toLocaleString() : ""}. Next check is scheduled weekly.`
                  : selected.monitor_last_status === "unavailable"
                    ? "The last check could not complete. A retry is scheduled."
                  : selected.monitor_next_at
                    ? `On. First check scheduled for ${new Date(selected.monitor_next_at).toLocaleString()}; later checks are weekly.`
                    : "On. The first check is being scheduled; later checks are weekly."}
            </p>
            {message && (
              <p className="form-error" role="alert">
                {message}
              </p>
            )}
            <div className="office-events">
              <h3>Office notes</h3>
              {events.length ? (
                events.map((event) => (
                  <article className="office-event" key={event.id}>
                    <span className="eyebrow">
                      {event.event_type === "site_change"
                        ? "Website change"
                        : "Market result"}
                    </span>
                    <strong>{event.title}</strong>
                    <p>{event.excerpt}</p>
                    <small>{new Date(event.created_at).toLocaleString()}</small>
                    <a href={event.source_url} target="_blank" rel="noreferrer">
                      Open source
                    </a>
                  </article>
                ))
              ) : (
                <p className="hint">
                  No notes yet. The first successful weekly check establishes a
                  real baseline.
                </p>
              )}
            </div>
          </div>
          <OfficeQuestions projectId={selected.id} />
        </>
      ) : offices.length ? (
        <div className="office-grid">
          {offices.map((office) => (
            <button
              className="panel office-item"
              key={office.id}
              onClick={() => setSelected(office)}
            >
              <span className="eyebrow">Website office</span>
              <strong>{new URL(office.site_url).hostname}</strong>
              <span>{office.target_geo || "No target area"}</span>
              <span>
                {
                  runs.filter((run) => {
                    try {
                      return (
                        new URL(run.site_url).host ===
                        new URL(office.site_url).host
                      );
                    } catch {
                      return false;
                    }
                  }).length
                }{" "}
                saved analyses
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="panel empty-state">
          <h2>No offices yet</h2>
          <p>
            Add a website and run its first analysis. Every link is normalized
            to that website's root.
          </p>
          <button className="secondary" onClick={() => setPage("shop")}>
            Add my first website
          </button>
        </div>
      )}
    </section>
  );
}
function OfficeQuestions({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [used, setUsed] = useState(0);
  const [limit, setLimit] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const load = async () => {
    const response = await fetch(`/api/projects/${projectId}/questions`, {
      credentials: "include",
    });
    const body = await readApiJson<{
      questions?: any[];
      used?: number;
      limit?: number;
    }>(response);
    setItems(body?.questions ?? []);
    setUsed(body?.used ?? 0);
    setLimit(body?.limit ?? 0);
  };
  useEffect(() => {
    void load();
  }, [projectId]);
  const ask = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);
    const response = await fetch(`/api/projects/${projectId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ question }),
    });
    const body = await readApiJson<{
      question?: any;
      used?: number;
      limit?: number;
      error?: string;
    }>(response);
    setBusy(false);
    if (!response.ok || !body?.question) {
      setMessage(body?.error ?? "Issac could not answer from saved evidence.");
      await load();
      return;
    }
    setItems((current) => [body.question, ...current]);
    setUsed(body.used ?? used + 1);
    setLimit(body.limit ?? limit);
    setQuestion("");
  };
  if (!limit) return null;
  return (
    <section className="panel history-panel office-questions">
      <div className="section-head">
        <div>
          <h2>Ask Issac about this office</h2>
          <p className="hint">
            Answers use this office's saved reports and notes; they do not run a
            new web search.
          </p>
        </div>
        <span className="question-allowance">
          {Math.max(0, limit - used)} of {limit} left
        </span>
      </div>
      <form className="office-question-form" onSubmit={ask}>
        <label className="sr-only" htmlFor="office-question">
          Ask about the saved evidence
        </label>
        <textarea
          id="office-question"
          rows={2}
          maxLength={500}
          required
          minLength={3}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What is the clearest next step from this week's note?"
          disabled={busy || used >= limit}
        />
        <button
          className="secondary"
          type="submit"
          disabled={busy || used >= limit || question.trim().length < 3}
        >
          {busy ? "Reading your saved notes…" : "Ask Issac"}
        </button>
      </form>
      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <div className="office-question-list" aria-live="polite">
        {items.map((item) => (
          <article className="office-question" key={item.id}>
            <strong>{item.question}</strong>
            {item.status === "processing" ? (
              <p className="hint">This answer is still being prepared.</p>
            ) : item.status === "completed" ? (
              <>
                <p>{item.answer}</p>
                <div className="question-sources">
                  {(item.sources ?? []).map((source: any, index: number) => (
                    <a
                      key={`${item.id}-${source.url}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      [{index + 1}] {source.title || "Open source"}
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </article>
        ))}
        {!items.length && (
          <p className="hint">No questions asked about this office yet.</p>
        )}
      </div>
    </section>
  );
}
function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="panel metric">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </div>
  );
}
function Shelf({
  icon,
  title,
  copy,
  note,
}: {
  icon: string;
  title: string;
  copy: string;
  note: string;
}) {
  return (
    <article className="panel shelf">
      <div className="shelf-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{copy}</p>
      <div className="shelf-footer">
        <span>Suggested priority</span>
        <span>{note}</span>
      </div>
    </article>
  );
}
function Action({
  title,
  copy,
  tag,
  tone,
  complete,
  onToggle,
}: {
  title: string;
  copy: string;
  tag: string;
  tone: string;
  complete: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`action ${complete ? "complete" : ""}`}>
      <button
        className={`check ${complete ? "done" : ""}`}
        aria-label={`Mark ${title} complete`}
        onClick={onToggle}
      >
        {complete ? "✓" : ""}
      </button>
      <div>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
      <span className={`tag ${tone}`}>{tag}</span>
    </div>
  );
}

function Shop({
  setPage,
  notify,
}: {
  setPage: (page: Page) => void;
  notify: (message: string) => void;
}) {
  const [siteUrl, setSiteUrl] = useState("");
  const [objective, setObjective] = useState("");
  const [targetGeo, setTargetGeo] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tier, setTier] = useState<keyof typeof modelCatalog>("starter");
  const [workspacePlan, setWorkspacePlan] = useState("starter");
  const [addon, setAddon] = useState("default");
  const [pushModel, setPushModel] = useState<string>(
    modelCatalog.starter.push[0],
  );
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      fetch("/api/billing", { credentials: "include" }),
      fetch("/api/workspace", { credentials: "include" }),
    ]).then(async ([billingResponse, workspaceResponse]) => {
      const billing = billingResponse.ok
        ? await (billingResponse.json() as Promise<any>)
        : {};
      const workspace = workspaceResponse.ok
        ? (await (workspaceResponse.json() as Promise<any>)).workspace
        : null;
      const nextPlan = Object.hasOwn(modelCatalog, workspace?.plan)
        ? (workspace.plan as keyof typeof modelCatalog)
        : "starter";
      setBalance(billing.balanceCents ?? null);
      setWorkspacePlan(workspace?.plan ?? "starter");
      setTier(nextPlan);
      setPushModel(modelCatalog[nextPlan].push[0]);
    });
  }, []);
  const run = async () => {
    setMessage("");
    setResult(null);
    setRunning(true);
    const response = await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        siteUrl,
        objective: objective || "Find the most useful next growth actions.",
        targetGeo,
        keywords: keywords
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        tier,
        addon,
        model: addon === "push" ? pushModel : undefined,
        idempotencyKey: crypto.randomUUID(),
      }),
    });
    const body = await (response.json() as Promise<any>);
    if (!response.ok) {
      setRunning(false);
      return setMessage(body.error ?? "The run could not be scheduled.");
    }
    let latest = body;
    for (
      let attempt = 0;
      attempt < 180 &&
      latest.run?.status !== "completed" &&
      latest.run?.status !== "failed";
      attempt += 1
    ) {
      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      const statusResponse = await fetch(`/api/runs/${body.runId}`, {
        credentials: "include",
      });
      if (statusResponse.ok)
        latest = await (statusResponse.json() as Promise<any>);
    }
    setRunning(false);
    if (latest.run?.status !== "completed")
      return setMessage(
        latest.run?.error ??
          "Your run is still working. Open List shortly to see it.",
      );
    setResult({
      ...latest.run,
      providerCostUsd: latest.run.provider_cost_usd,
      chargedCents: latest.run.charged_cents,
      evidenceCount: latest.run.result?.evidenceCount ?? 0,
      result: latest.run.result,
    });
    notify("Your evidence-backed list is ready.");
  };
  const selectedCatalog = modelCatalog[tier];
  const buyBrief = async () => {
    setMessage("");
    if (!siteUrl.trim())
      return setMessage("Enter the website URL for your one-time First Visit.");
    setCheckoutBusy(true);
    try {
      const response = await fetch("/api/billing/first-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ siteUrl }),
      });
      const body = await (response.json() as Promise<any>);
      if (!response.ok) {
        setMessage(body.error ?? "First Visit checkout could not start.");
        return;
      }
      window.location.assign(body.checkoutUrl);
    } catch {
      setMessage("First Visit checkout could not connect. Try again.");
    } finally {
      setCheckoutBusy(false);
    }
  };
  return (
    <section className="page setup">
      <div className="eyebrow">Shop for growth</div>
      <h1>Bring back a useful list.</h1>
      <p className="lede">
        Give heyIssac a public website and one thing you want to understand. It
        will search, read, diagnose, and rank the next steps.
      </p>
      <div className="panel form-panel">
        <div className="field">
          <label htmlFor="site">Your website</label>
          <input
            id="site"
            type="url"
            placeholder="https://yourbusiness.com"
            value={siteUrl}
            onChange={(event) => setSiteUrl(event.target.value)}
          />
          <p className="hint">
            The website becomes the office. Any path you enter is normalized to
            the site's root for this check.
          </p>
        </div>
        <div className="field">
          <label htmlFor="objective">What should we look at?</label>
          <textarea
            id="objective"
            rows={3}
            placeholder="Example: why are beginner classes hard to find?"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
          />
        </div>
        {workspacePlan !== "free" && <div className="choice-row">
          <label className="field">
            <span>Target geography</span>
            <input
              placeholder="Hong Kong, London, or worldwide"
              value={targetGeo}
              onChange={(event) => setTargetGeo(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Search phrases</span>
            <input
              placeholder="beginner pottery, local classes"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
            />
            <small className="hint">Separate phrases with commas.</small>
          </label>
        </div>}
        {workspacePlan !== "free" && <>
          <p className="hint included-model">
            Included model: {selectedCatalog.default}
          </p>
          <label className="field">
            <span>Run upgrade</span>
            <select
              value={addon}
              onChange={(event) => setAddon(event.target.value)}
            >
              <option value="default">Included model</option>
              <option value="push">Push</option>
              <option value="max">Max</option>
            </select>
            <small className="hint">
              Push and Max use prepaid balance at 1.4× the reported OpenRouter
              model cost. Top-ups start at $3.
            </small>
          </label>
        </>}
        {workspacePlan !== "free" && addon === "push" && (
          <div className="field">
            <label htmlFor="push-model">Push model</label>
            <select
              id="push-model"
              value={pushModel}
              onChange={(event) => setPushModel(event.target.value)}
            >
              {selectedCatalog.push.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <small className="hint">Choose the model for this run.</small>
          </div>
        )}
        {workspacePlan !== "free" && addon === "max" && (
          <p className="hint model-note">
            Max uses {selectedCatalog.max} for this run.
          </p>
        )}
        <button
          className="primary"
          disabled={running || checkoutBusy}
          onClick={workspacePlan === "free" ? buyBrief : run}
        >
          {running
            ? "Working through the evidence…"
            : checkoutBusy
              ? "Opening secure checkout…"
            : workspacePlan === "free"
              ? "Continue to First Visit · $9"
              : "Make my list"}{" "}
          <span>→</span>
        </button>
        {workspacePlan !== "free" && (
          <button
            className="secondary one-time-report"
            disabled={running || checkoutBusy}
            onClick={buyBrief}
          >
            {checkoutBusy ? "Opening secure checkout…" : "Buy a standalone report · $9"}
          </button>
        )}
        {balance !== null && (
          <p className="hint">
            Usage balance: ${(balance / 100).toFixed(2)}. Push and Max use this
            balance.
          </p>
        )}
        {message && (
          <p className="form-error" role="alert">
            {message}
          </p>
        )}
      </div>
      {result && (
        <article className="panel finding run-result">
          <span className="tag easy">Run complete</span>
          <h2>{result.result?.summary ?? "Your findings are ready."}</h2>
          <p>
            Model: {result.model}. Model provider cost: $
            {(result.providerCostUsd ?? 0).toFixed(4)}. Usage balance charge: $
            {((result.chargedCents ?? 0) / 100).toFixed(2)}. Evidence sources:{" "}
            {result.evidenceCount ?? 0}. GEO:{" "}
            {result.result?.geo?.visibility ?? "not measured"}.
          </p>
          {result.result?.competitorDiscovery && (
            <CompetitorCandidates data={result.result.competitorDiscovery} />
          )}
          {(result.result?.actions ?? []).map((action: any) => (
            <div className="action" key={action.title}>
              <div>
                <h3>{action.title}</h3>
                <p>{action.rationale}</p>
              </div>
              <span className="tag important">{action.priority ?? "next"}</span>
            </div>
          ))}
        </article>
      )}
    </section>
  );
}
function CompetitorCandidates({ data }: { data: any }) {
  const candidates = Array.isArray(data?.candidates) ? data.candidates : [];
  return (
    <section className="competitor-candidates">
      <h3>Possible competitors</h3>
      <p>
        Found from public search results; check that each serves the same
        customer and need.
      </p>
      {candidates.length ? (
        candidates.map((item: any) => (
          <div className="receipt-line" key={item.url}>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.name}
            </a>
            <span>{item.evidence}</span>
          </div>
        ))
      ) : (
        <p>
          No candidates were returned for this search. That is not proof there
          are no competitors.
        </p>
      )}
    </section>
  );
}

function List({ notify }: { notify: (message: string) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRun, setSelectedRun] = useState<any>(null);
  const load = () =>
    Promise.all([
      fetch("/api/actions", { credentials: "include" }),
      fetch("/api/runs", { credentials: "include" }),
    ]).then(async ([actionsResponse, runsResponse]) => {
      const actionBody = actionsResponse.ok
        ? await (actionsResponse.json() as Promise<any>)
        : { actions: [] };
      const runBody = runsResponse.ok
        ? await (runsResponse.json() as Promise<any>)
        : { runs: [] };
      setItems(actionBody.actions ?? []);
      setRuns(runBody.runs ?? []);
    });
  useEffect(() => {
    load();
  }, []);
  const update = async (id: string, status: string) => {
    const response = await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      notify(
        status === "approved"
          ? "Action approved for your review."
          : "Action updated.",
      );
      load();
    }
  };
  const openRun = async (id: string) => {
    const response = await fetch(`/api/runs/${id}`, { credentials: "include" });
    if (response.ok)
      setSelectedRun((await (response.json() as Promise<any>)).run);
  };
  return (
    <section className="page">
      <div className="eyebrow">Your list</div>
      <h1>Small jobs, real progress.</h1>
      <p className="lede">
        These recommendations come from your saved runs. You choose what moves
        forward.
      </p>
      {!items.length && (
        <div className="panel empty-state">
          <h3>No recommendations yet.</h3>
          <p>
            Run your website through the Shop and your evidence-backed actions
            will live here.
          </p>
        </div>
      )}
      <div className="findings-grid">
        {items.map((item) => (
          <article className="panel finding" key={item.id}>
            <span
              className={`tag ${item.priority === "high" ? "important" : "easy"}`}
            >
              {item.status} · {item.priority}
            </span>
            <h3>{item.recommended_action}</h3>
            <p>{item.diagnosis}</p>
            {item.draft && <p className="draft">Draft: {item.draft}</p>}
            <div className="choice-row">
              <button
                className="secondary"
                onClick={() => update(item.id, "approved")}
              >
                Approve
              </button>
              <button
                className="secondary"
                onClick={() => update(item.id, "dismissed")}
              >
                Dismiss
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="panel history-panel">
        <h2>Saved checks</h2>
        {runs.map((run) => (
          <div className="receipt-line" key={run.id}>
            <span>
              {new URL(run.site_url).hostname} ·{" "}
              {new Date(run.created_at).toLocaleDateString()}
            </span>
            <button className="text-link" onClick={() => openRun(run.id)}>
              {run.status}
            </button>
          </div>
        ))}
      </div>
      {selectedRun && (
        <article className="panel finding run-result">
          <span className="tag easy">Saved run</span>
          <h2>
            {selectedRun.result?.summary ??
              selectedRun.error ??
              selectedRun.status}
          </h2>
          <p>
            {selectedRun.site_url} · model {selectedRun.model} ·{" "}
            {selectedRun.provider_cost_usd} provider cost
          </p>
          <CompetitorCandidates
            data={selectedRun.result?.competitorDiscovery}
          />
          <button className="secondary" onClick={() => setSelectedRun(null)}>
            Close
          </button>
        </article>
      )}
    </section>
  );
}
function Profile({
  user,
  notify,
  initialPlan,
}: {
  user: User;
  notify: (message: string) => void;
  initialPlan: string | null;
}) {
  const [businessName, setBusinessName] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [balance, setBalance] = useState(0);
  const [topUp, setTopUp] = useState("3");
  const [message, setMessage] = useState("");
  const [workspace, setWorkspace] = useState<any>(null);
  const [plan, setPlan] = useState("starter");
  const [extraOffices, setExtraOffices] = useState(false);
  const [subscriptionBusy, setSubscriptionBusy] = useState(false);
  useEffect(() => {
    Promise.all([
      fetch("/api/profile", { credentials: "include" }),
      fetch("/api/billing", { credentials: "include" }),
      fetch("/api/workspace", { credentials: "include" }),
    ]).then(async ([profileResponse, billingResponse, workspaceResponse]) => {
      const profile = profileResponse.ok
        ? await (profileResponse.json() as Promise<any>)
        : {};
      const billing = billingResponse.ok
        ? await (billingResponse.json() as Promise<any>)
        : {};
      setBusinessName(profile.profile?.business_name ?? "");
      setBrandVoice(profile.profile?.brand_voice ?? "");
      setBalance(billing.balanceCents ?? 0);
      if (workspaceResponse.ok) {
        const body = await (workspaceResponse.json() as Promise<any>);
        setWorkspace(body.workspace);
        setPlan(initialPlan ?? body.workspace?.plan ?? "starter");
      }
    });
  }, [initialPlan]);
  const save = async () => {
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ businessName, brandVoice }),
    });
    notify(response.ok ? "Profile saved." : "Profile was not saved.");
  };
  const addBalance = async () => {
    setMessage("");
    const amountCents = Math.round(Number(topUp) * 100);
    const response = await fetch("/api/billing/top-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amountCents }),
    });
    const body = await (response.json() as Promise<any>);
    if (!response.ok)
      return setMessage(body.error ?? "Top-up could not start.");
    window.location.assign(body.checkoutUrl);
  };
  const subscribe = async () => {
    const managing = Boolean(workspace?.stripe_subscription_id);
    const response = await fetch(
      managing ? "/api/billing/portal" : "/api/billing/subscribe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(managing ? {} : { plan, extraOffices }),
      },
    );
    const body = await (response.json() as Promise<any>);
    if (!response.ok)
      return setMessage(body.error ?? "Subscription could not start.");
    window.location.assign(body.portalUrl ?? body.checkoutUrl);
  };
  const changeSubscription = async (action: "enable" | "cancel") => {
    setMessage("");
    setSubscriptionBusy(true);
    const response = await fetch(`/api/billing/subscription/${action}`, {
      method: "POST",
      credentials: "include",
    });
    const body = await (response.json() as Promise<any>);
    setSubscriptionBusy(false);
    if (!response.ok)
      return setMessage(body.error ?? "Subscription could not be updated.");
    setWorkspace((current: any) => ({
      ...current,
      subscription_status: body.subscription_status,
      cancel_at_period_end: body.cancel_at_period_end,
      current_period_end: body.current_period_end,
    }));
    notify(
      action === "cancel"
        ? "Subscription will end at the current period."
        : "Subscription renewal is enabled.",
    );
  };
  const canceling =
    Boolean(workspace?.cancel_at_period_end) ||
    workspace?.subscription_status === "canceling";
  return (
    <section className="page setup">
      <div className="eyebrow">Profile</div>
      <h1>Your account shelf.</h1>
      <p className="lede">
        Keep the basics clear so the app knows whose work it is helping.
      </p>
      <div className="panel form-panel">
        <div className="field">
          <label>Username</label>
          <input value={`@${user.username}`} readOnly />
        </div>
        <div className="field">
          <label htmlFor="business">Business name</label>
          <input
            id="business"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Your business name"
          />
        </div>
        <div className="field">
          <label htmlFor="voice">How should suggestions sound?</label>
          <input
            id="voice"
            value={brandVoice}
            onChange={(event) => setBrandVoice(event.target.value)}
            placeholder="Warm, clear, and down to earth"
          />
        </div>
        <button className="primary" onClick={save}>
          Save profile
        </button>
      </div>
      <div className="panel form-panel">
        <h2>Plan</h2>
        <p className="lede">
          Current plan: {workspace?.plan ?? "free"} ·{" "}
          {canceling
            ? "canceling at period end"
            : (workspace?.subscription_status ?? "inactive")}
        </p>
        <div className="choice-row">
          <select
            aria-label="Subscription plan"
            value={plan}
            onChange={(event) => setPlan(event.target.value)}
          >
            <option value="starter">Starter · $19/month</option>
            <option value="studio">Studio · $49/month</option>
            <option value="partner">Partner · $99/month</option>
          </select>
          <button className="secondary" onClick={subscribe}>
            {workspace?.stripe_subscription_id ? "Manage plan" : "Choose plan"}
          </button>
        </div>
        {plan === "partner" && !workspace?.stripe_subscription_id && (
          <label className="recovery-choice office-addon">
            <input
              type="checkbox"
              checked={extraOffices}
              onChange={(event) => setExtraOffices(event.target.checked)}
            />
            <span>
              <strong>Add 3 offices · $8/month</strong>
              <small>Optional extra websites beyond Partner's eight.</small>
            </span>
          </label>
        )}
        {workspace?.current_period_end && (
          <p className="hint">
            Current access period ends{" "}
            {new Date(workspace.current_period_end).toLocaleDateString()}.
          </p>
        )}
        {workspace?.stripe_subscription_id &&
          (canceling ? (
            <button
              className="text-link subscription-link"
              disabled={subscriptionBusy}
              onClick={() => changeSubscription("enable")}
            >
              {subscriptionBusy ? "Updating…" : "Keep subscription enabled"}
            </button>
          ) : (
            <button
              className="text-link subscription-link"
              disabled={subscriptionBusy}
              onClick={() => changeSubscription("cancel")}
            >
              {subscriptionBusy ? "Updating…" : "Cancel renewal"}
            </button>
          ))}
        {message && (
          <p className="form-error" role="alert">
            {message}
          </p>
        )}
      </div>
      <div className="panel form-panel">
        <h2>Usage balance</h2>
        <p className="lede">
          ${(balance / 100).toFixed(2)} is ready for Push and Max. Those runs
          are charged at 1.4× the reported OpenRouter model cost; the included
          plan model does not use this balance.
        </p>
        <div className="choice-row">
          <input
            aria-label="Top-up amount in US dollars"
            type="number"
            min="3"
            max="1000"
            step="1"
            value={topUp}
            onChange={(event) => setTopUp(event.target.value)}
          />
          <button className="secondary" onClick={addBalance}>
            Add balance
          </button>
        </div>
      </div>
    </section>
  );
}
function Security({ notify }: { notify: (message: string) => void }) {
  const [passcode, setPasscode] = useState("");
  const [totp, setTotp] = useState<TotpPreview | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<{
    totp: boolean;
    passcode: boolean;
  }>({ totp: false, passcode: false });
  const [tokens, setTokens] = useState<any[]>([]);
  const [newToken, setNewToken] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const checks = useMemo(() => passwordChecks(newPassword), [newPassword]);
  const refreshStatus = () =>
    fetch("/api/security/status", { credentials: "include" })
      .then((response) =>
        response.ok ? (response.json() as Promise<any>) : null,
      )
      .then((body) => {
        if (body) setSecurityStatus(body);
      });
  useEffect(() => {
    Promise.all([
      fetch("/api/security/status", { credentials: "include" }),
      fetch("/api/auth/tokens", { credentials: "include" }),
    ]).then(async ([statusResponse, tokensResponse]) => {
      if (statusResponse.ok)
        setSecurityStatus(await (statusResponse.json() as Promise<any>));
      if (tokensResponse.ok)
        setTokens((await (tokensResponse.json() as Promise<any>)).tokens ?? []);
    });
  }, []);
  const savePasscode = async (disable = false) => {
    if (!disable && !passcodeOk(passcode))
      return notify("Use exactly 8 lowercase letters or digits.");
    const response = await fetch("/api/auth/security/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ passcode: disable ? "" : passcode }),
    });
    const body = await (response.json() as Promise<any>);
    notify(
      response.ok
        ? disable
          ? "Recovery passcode disabled."
          : "Recovery passcode saved."
        : (body.error ?? "Passcode was not changed."),
    );
    if (response.ok) {
      setPasscode("");
      refreshStatus();
    }
  };
  const saveTotp = async (disable = false) => {
    if (!disable && (!totp || !/^\d{6}$/.test(totpCode)))
      return notify("Set up an authenticator and enter its 6-digit code.");
    const response = await fetch("/api/auth/security/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        totpSecret: disable ? "" : totp?.secret,
        totpCode: disable ? "" : totpCode,
      }),
    });
    const body = await (response.json() as Promise<any>);
    notify(
      response.ok
        ? disable
          ? "Authenticator disabled."
          : "Authenticator saved."
        : (body.error ?? "Authenticator was not changed."),
    );
    if (response.ok) {
      setTotp(null);
      setTotpCode("");
      refreshStatus();
    }
  };
  const changePassword = async () => {
    if (!passwordOk(newPassword))
      return notify("Use 7-18 characters with one letter and one digit.");
    const response = await fetch("/api/auth/password-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password: newPassword }),
    });
    const body = await (response.json() as Promise<any>);
    notify(
      response.ok
        ? `Password changed. ${body.remaining} changes remain for the next 24 hours.`
        : (body.error ?? "Password was not changed."),
    );
    if (response.ok) setNewPassword("");
  };
  const createToken = async () => {
    const response = await fetch("/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: newToken || "Agent access" }),
    });
    const body = await (response.json() as Promise<any>);
    if (!response.ok) return notify(body.error ?? "Token was not created.");
    setCreatedToken(body.token);
    setNewToken("");
    notify("Copy this token now. It will not be shown again.");
  };
  return (
    <section className="page setup">
      <div className="eyebrow">Security</div>
      <h1>Keep a way back in.</h1>
      <p className="lede">
        Change your password or manage the recovery methods this app supports.
      </p>
      <div className="panel form-panel">
        <h2>Recovery status</h2>
        <p className="hint">
          Authenticator {securityStatus.totp ? "enabled" : "not set"} · Passcode{" "}
          {securityStatus.passcode ? "enabled" : "not set"}
        </p>
      </div>
      <div className="panel form-panel">
        <h2>Change password</h2>
        <p className="hint">
          You can change it up to four times in any 24-hour period.
        </p>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          minLength={7}
          maxLength={18}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <PasswordMeter checks={checks} />
        <button
          className="secondary"
          disabled={!passwordOk(newPassword)}
          onClick={changePassword}
        >
          Update password
        </button>
      </div>
      <div className="panel form-panel">
        <h2>Recovery passcode</h2>
        <label htmlFor="security-passcode">New 8-character passcode</label>
        <input
          id="security-passcode"
          maxLength={8}
          value={passcode}
          onChange={(event) =>
            setPasscode(
              event.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""),
            )
          }
        />
        <p
          className={`hint ${!passcode || passcodeOk(passcode) ? "ok" : "bad"}`}
        >
          Exactly 8 lowercase letters or digits.
        </p>
        <div className="choice-row">
          <button className="secondary" onClick={() => savePasscode(false)}>
            {securityStatus.passcode ? "Replace passcode" : "Enable passcode"}
          </button>
          {securityStatus.passcode && (
            <button className="text-link" onClick={() => savePasscode(true)}>
              Disable passcode
            </button>
          )}
        </div>
      </div>
      <div className="panel form-panel">
        <h2>Authenticator</h2>
        {!totp ? (
          <button
            className="secondary"
            onClick={() =>
              fetch("/api/auth/totp/setup-preview")
                .then((response) => response.json() as Promise<any>)
                .then(setTotp)
            }
          >
            {securityStatus.totp
              ? "Replace authenticator"
              : "Enable authenticator"}
          </button>
        ) : (
          <>
            <p className="hint">
              Scan this QR code, then enter the current six-digit code.
            </p>
            <TotpQr uri={totp.otpauth} />
            <details>
              <summary>Enter the secret manually</summary>
              <p className="totp-secret">{totp.secret}</p>
            </details>
            <label htmlFor="security-totp">6-digit code</label>
            <input
              id="security-totp"
              inputMode="numeric"
              maxLength={6}
              value={totpCode}
              onChange={(event) =>
                setTotpCode(event.target.value.replace(/\D/g, ""))
              }
            />
            <div className="choice-row">
              <button className="secondary" onClick={() => saveTotp(false)}>
                Verify and save
              </button>
              <button
                className="text-link"
                onClick={() => {
                  setTotp(null);
                  setTotpCode("");
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {securityStatus.totp && (
          <button
            className="text-link security-disable"
            onClick={() => saveTotp(true)}
          >
            Disable authenticator
          </button>
        )}
      </div>
      <div className="panel form-panel">
        <h2>Agent access</h2>
        <p className="hint">
          Create a scoped token for an agent or MCP client. The full token
          appears once.
        </p>
        <div className="choice-row">
          <input
            aria-label="Token name"
            placeholder="Token name"
            value={newToken}
            onChange={(event) => setNewToken(event.target.value)}
          />
          <button className="secondary" onClick={createToken}>
            Create token
          </button>
        </div>
        {createdToken && <p className="totp-secret">{createdToken}</p>}
        {tokens.map((token) => (
          <div className="receipt-line" key={token.id}>
            <span>
              {token.name} · expires{" "}
              {new Date(token.expires_at).toLocaleDateString()}
            </span>
            <button
              className="text-link"
              onClick={async () => {
                await fetch(`/api/auth/tokens/${token.id}`, {
                  method: "DELETE",
                  credentials: "include",
                });
                setTokens(tokens.filter((item) => item.id !== token.id));
              }}
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
