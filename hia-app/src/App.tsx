import { type FormEvent, useEffect, useMemo, useState } from 'react';

type User = { id: string; username: string; role: string };
type Page = 'today' | 'shop' | 'list' | 'profile' | 'security';
type UsernameState = 'empty' | 'checking' | 'available' | 'taken' | 'invalid';
type SecurityQuestion = { key: string; question: string };
type TotpPreview = { secret: string; otpauth: string };

const navItems: { id: Page; icon: string; label: string }[] = [
	{ id: 'today', icon: '⌂', label: 'Today' },
	{ id: 'shop', icon: '＋', label: 'Shop' },
	{ id: 'list', icon: '☷', label: 'List' },
	{ id: 'profile', icon: '◎', label: 'Profile' },
	{ id: 'security', icon: '◇', label: 'Security' },
];
const actions = [
	{ title: 'Add a beginner class page', copy: 'People are looking for this, but your website does not have a clear place to send them.', tag: 'Worth doing', tone: 'important' },
	{ title: 'Answer one real question', copy: 'Someone asked how to keep a fern alive in a dark room. A helpful answer can bring them back.', tag: '10 minutes', tone: 'easy' },
	{ title: 'Tidy up your welcome', copy: 'Your homepage says what you make. Add who it is for, too.', tag: 'Quick win', tone: 'easy' },
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
const emailOk = (value: string) => !value || /^[^\s@]+@(gmail|hotmail)\.com$/i.test(value.trim());

export default function App() {
	const [user, setUser] = useState<User | null>(null);
	const [authReady, setAuthReady] = useState(false);
	const [showLanding, setShowLanding] = useState(true);
	const [publicPath, setPublicPath] = useState(window.location.pathname);
	const [page, setPage] = useState<Page>('today');
	const [done, setDone] = useState<number[]>([]);
	const [toast, setToast] = useState('');
	const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
	const toggleDone = (index: number) => {
		setDone((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
		notify(done.includes(index) ? 'Put back on today’s list.' : 'Added to your little wins.');
	};
	useEffect(() => {
		fetch('/api/auth/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null).then((body) => setUser(body?.user ?? null)).finally(() => setAuthReady(true));
		const onPopState = () => setPublicPath(window.location.pathname);
		window.addEventListener('popstate', onPopState);
		return () => window.removeEventListener('popstate', onPopState);
	}, []);
	const navigatePublic = (path: string) => { window.history.pushState({}, '', path); setPublicPath(path); setShowLanding(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
	const signOut = () => fetch('/api/auth/logout', { method: 'POST' }).then(() => setUser(null));
	if (!authReady) return <div className="auth-loading">Loading heyIssac…</div>;
	if (!user) {
		if (!showLanding) return <Auth onSuccess={setUser} onBack={() => { setShowLanding(true); navigatePublic('/'); }} />;
		if (publicPath === '/pricing') return <Pricing onStart={() => setShowLanding(false)} onNavigate={navigatePublic} />;
		if (publicPath === '/about') return <About onStart={() => setShowLanding(false)} onNavigate={navigatePublic} />;
		return <Landing onStart={() => setShowLanding(false)} onNavigate={navigatePublic} />;
	}
	return <div className="shell">
		<aside className="sidebar"><div className="brand"><img src="/hi.svg" alt="heyIssac" /><span>heyIssac</span></div><div className="shop-name">your growth shelf</div>
			<nav aria-label="Main navigation">{navItems.map((item) => <button key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} title={item.label} aria-label={item.label} onClick={() => setPage(item.id)}><span className="nav-icon">{item.icon}</span><span className="nav-label">{item.label}</span></button>)}</nav>
			<div className="help"><strong>Need a hand?</strong><p>Ask us about anything on your list.</p><button onClick={() => notify('We will be in touch.')}>Message the team</button></div>
		</aside>
		<main><div className="topbar"><span>Wednesday, September 2</span><div className="account"><span>@{user.username}</span><button className="avatar" aria-label="Sign out" onClick={signOut}>↪</button></div></div>
			{page === 'today' && <Today setPage={setPage} notify={notify} done={done} toggleDone={toggleDone} />}
			{page === 'shop' && <Shop setPage={setPage} notify={notify} />}
			{page === 'list' && <List notify={notify} />}
			{page === 'profile' && <Profile user={user} notify={notify} />}
			{page === 'security' && <Security notify={notify} />}
		</main><div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
	</div>;
}

function PublicNav({ onStart, onNavigate }: { onStart: () => void; onNavigate: (path: string) => void }) {
	return <header className="public-nav"><button className="public-brand" onClick={() => onNavigate('/')}><img src="/hi.svg" alt="heyIssac" /><span>heyIssac</span></button><nav><button onClick={() => onNavigate('/pricing')}>Pricing</button><button onClick={() => onNavigate('/about')}>About</button></nav><button className="public-signin" onClick={onStart}>Sign in <span>↗</span></button></header>;
}

function Landing({ onStart, onNavigate }: { onStart: () => void; onNavigate: (path: string) => void }) {
	return <div className="public-site"><PublicNav onStart={onStart} onNavigate={onNavigate} /><main><section className="landing-hero"><div className="landing-copy"><div className="eyebrow">A kinder way to grow</div><h1>Put your best work where people can find it.</h1><p>heyIssac turns the noisy work of being found online into a clear weekly rhythm: see what is missing, understand why it matters, and choose the next useful thing.</p><button className="primary landing-cta" onClick={onStart}>Start my free list <span>→</span></button><small>No credit card. No marketing jargon.</small></div><div className="landing-preview" aria-label="A preview of your weekly growth list"><div className="preview-top"><span>THIS WEEK</span><b>3 useful things</b></div><div className="preview-line"><span className="preview-check">✓</span><span><b>Make your welcome clearer</b><small>Help the right people know they belong here.</small></span></div><div className="preview-line"><span className="preview-check empty" /><span><b>Answer one real question</b><small>Be helpful where people are already looking.</small></span></div><div className="preview-line"><span className="preview-check empty" /><span><b>Name your best work</b><small>Make it easier to remember and share.</small></span></div><div className="preview-footer"><span>Small jobs</span><strong>Real progress</strong></div></div></section><section className="landing-intro"><div className="section-kicker">The week, made visible</div><h2>Marketing is a shelf, not a fire.</h2><p>Most small teams do not need more dashboards. They need to know which shelf is bare, what to put on it, and whether the people who matter can see it.</p></section><section className="landing-shelves"><article><span className="shelf-number">01</span><h3>Find the gaps</h3><p>Check your website, search presence, and public conversations for the things that quietly cost you trust.</p></article><article><span className="shelf-number">02</span><h3>Choose the useful work</h3><p>Get a ranked list that respects your time, your voice, and the difference between a quick win and a real project.</p></article><article><span className="shelf-number">03</span><h3>Keep the final say</h3><p>Review every recommendation before it becomes a public post, page, or promise.</p></article></section><section className="landing-workbench"><div><div className="eyebrow">Inside your weekly shop</div><h2>Everything you need for the next good move.</h2><p>Bring your website and your context. heyIssac gives you a practical view of what people see, what they miss, and what is worth doing next.</p><button className="text-link" onClick={() => onNavigate('/about')}>How it works <span>→</span></button></div><div className="workbench-list"><div><strong>Website</strong><span>Clearer pages and stronger first impressions</span><b>84%</b></div><div><strong>Discovery</strong><span>Show up for the words your customers use</span><b>61%</b></div><div><strong>Conversations</strong><span>Helpful answers in the places people gather</span><b>72%</b></div></div></section></main><PublicFooter onNavigate={onNavigate} /></div>;
}

function Pricing({ onStart, onNavigate }: { onStart: () => void; onNavigate: (path: string) => void }) { return <div className="public-site"><PublicNav onStart={onStart} onNavigate={onNavigate} /><main className="public-page"><div className="eyebrow">Pricing</div><h1>A plan for the size of your week.</h1><p className="public-lede">Start small, find your rhythm, and pay for more room when the work earns it.</p><section className="price-grid"><article><span className="plan-label">Starter</span><h2>$19<span>/month</span></h2><p>For a solo founder who wants a clear weekly list.</p><ul><li>1 business workspace</li><li>1 weekly site check</li><li>5 ranked recommendations</li><li>Saved history for 4 weeks</li></ul><button className="secondary" onClick={onStart}>Start Starter</button></article><article className="price-featured"><span className="plan-label">Studio</span><span className="popular">Most useful</span><h2>$49<span>/month</span></h2><p>For a small team ready to keep improving in public.</p><ul><li>3 business workspaces</li><li>Weekly website and discovery checks</li><li>15 ranked recommendations</li><li>Saved history and drafts</li></ul><button className="primary" onClick={onStart}>Start Studio <span>→</span></button></article><article><span className="plan-label">Partner</span><h2>$99<span>/month</span></h2><p>For a hands-on operator managing several brands.</p><ul><li>10 business workspaces</li><li>Priority evidence refreshes</li><li>Approval-ready content drafts</li><li>Exportable reports</li></ul><button className="secondary" onClick={onStart}>Start Partner</button></article></section><p className="price-note">All plans keep publishing in your hands. Provider usage limits and taxes are shown before any paid upgrade.</p></main><PublicFooter onNavigate={onNavigate} /></div>; }

function About({ onStart, onNavigate }: { onStart: () => void; onNavigate: (path: string) => void }) { return <div className="public-site"><PublicNav onStart={onStart} onNavigate={onNavigate} /><main className="public-page about-page"><div className="eyebrow">About heyIssac</div><h1>Good work deserves a clearer path to the people looking for it.</h1><div className="about-columns"><div><p className="about-lede">heyIssac is a small-business growth companion for the part after “we should probably market this” and before “why did we publish that?”</p><button className="primary" onClick={onStart}>Build my first list <span>→</span></button></div><div><p>We believe marketing should feel more like tending a shop than shouting into a crowd. You look at what is on the shelf, notice what is missing, and make one thoughtful improvement.</p><p>Our job is to gather public evidence, explain it in ordinary language, and help you decide. The software can check, compare, rank, and draft. You remain the person who knows what is true.</p></div></div><section className="about-values"><div><strong>Evidence before confidence.</strong><span>Recommendations should point to what was actually observed.</span></div><div><strong>Useful before impressive.</strong><span>A short list you finish beats an endless feed you ignore.</span></div><div><strong>People before autopilot.</strong><span>Your voice and approval stay part of the loop.</span></div></section></main><PublicFooter onNavigate={onNavigate} /></div>; }

function PublicFooter({ onNavigate }: { onNavigate: (path: string) => void }) { return <footer className="public-footer"><div><button className="public-brand" onClick={() => onNavigate('/')}><img src="/hi.svg" alt="heyIssac" /><span>heyIssac</span></button><p>A calmer way to grow a good business.</p></div><div className="footer-links"><button onClick={() => onNavigate('/pricing')}>Pricing</button><button onClick={() => onNavigate('/about')}>About</button></div><small>© 2026 heyIssac</small></footer>; }

function Auth({ onSuccess, onBack }: { onSuccess: (user: User) => void; onBack: () => void }) {
	const [mode, setMode] = useState<'login' | 'register' | 'recover'>('register');
	const [username, setUsername] = useState('');
	const [usernameState, setUsernameState] = useState<UsernameState>('empty');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
	const [recoveryEmail, setRecoveryEmail] = useState('');
	const [passcode, setPasscode] = useState('');
	const [securityAnswers, setSecurityAnswers] = useState([{ questionKey: '', answer: '' }, { questionKey: '', answer: '' }]);
	const [totp, setTotp] = useState<TotpPreview | null>(null);
	const [totpCode, setTotpCode] = useState('');
	const [recoverMethod, setRecoverMethod] = useState('passcode');
	const [resetToken, setResetToken] = useState('');
	useEffect(() => { fetch('/api/auth/security-questions').then((response) => response.json()).then((body) => setQuestions(body.questions ?? [])); }, []);
	useEffect(() => {
		if (mode !== 'register') { setUsernameState('empty'); return; }
		const normalized = username.trim().toLowerCase();
		if (!normalized) { setUsernameState('empty'); return; }
		if (!/^[a-z0-9][a-z0-9_.-]{2,39}$/.test(normalized)) { setUsernameState('invalid'); return; }
		setUsernameState('checking');
		const controller = new AbortController();
		const timer = window.setTimeout(() => fetch(`/api/auth/username-availability?username=${encodeURIComponent(normalized)}`, { signal: controller.signal }).then((response) => response.json()).then((body: { available?: boolean; valid?: boolean }) => setUsernameState(body.valid && body.available ? 'available' : 'taken')).catch(() => { if (!controller.signal.aborted) setUsernameState('invalid'); }), 350);
		return () => { window.clearTimeout(timer); controller.abort(); };
	}, [username, mode]);
	const checks = passwordChecks(password);
	const loadTotp = () => fetch('/api/auth/totp/setup-preview').then((response) => response.json()).then(setTotp);
	const recoveryBody = () => ({ recoveryEmail: recoveryEmail.trim(), passcode: passcode.trim(), securityAnswers: securityAnswers.filter((item) => item.questionKey || item.answer), totpSecret: totp?.secret ?? '', totpCode: totpCode.trim() });
	const submit = async (event: FormEvent) => {
		event.preventDefault();
		setMessage('');
		if (mode === 'recover') {
			if (resetToken) {
				const response = await fetch('/api/auth/password-reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resetToken, password }) });
				if (!response.ok) return setMessage((await response.json()).error ?? 'Try again.');
				setMessage('Password reset. You can sign in now.');
				setResetToken('');
				setMode('login');
				return;
			}
			const response = await fetch('/api/auth/recovery/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, method: recoverMethod, email: recoveryEmail, code: totpCode, passcode, securityAnswers }) });
			const body = await response.json() as { resetToken?: string; error?: string };
			if (!response.ok || !body.resetToken) return setMessage(body.error ?? 'Recovery could not be verified.');
			setResetToken(body.resetToken);
			setMessage('Verified. Choose a new password.');
			return;
		}
		if (mode === 'register') {
			if (usernameState !== 'available') return setMessage('Choose an available username first.');
			if (!emailOk(recoveryEmail)) return setMessage('Recovery email must be Gmail or Hotmail.');
			if (passcode && !passcodeOk(passcode)) return setMessage('Passcode must be 8 lowercase letters or digits.');
			if (totp && !totpCode) return setMessage('Enter the 6-digit authenticator code.');
		}
		if (!passwordOk(password)) return setMessage('Use 7-18 characters with one letter and one digit.');
		const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(mode === 'register' ? { username, password, ...recoveryBody() } : { username, password }) });
		const body = await response.json() as { user?: User; error?: string };
		if (!response.ok || !body.user) return setMessage(body.error ?? 'Please try again.');
		onSuccess(body.user);
	};
	const usernameHint = mode !== 'register' ? 'Use the username you signed up with.' : usernameState === 'checking' ? 'Checking availability…' : usernameState === 'available' ? 'Username is available.' : usernameState === 'taken' ? 'That username is already taken.' : usernameState === 'invalid' ? 'Use 3–40 letters, numbers, dots, dashes, or underscores.' : 'Choose a public username.';
	return <div className="auth-shell"><div className="auth-card wide"><button className="back-link" onClick={onBack}>← Back to heyIssac</button><img src="/hi.svg" alt="heyIssac" /><div className="eyebrow">Welcome to heyIssac</div><h1>{mode === 'register' ? 'Put your growth on the list.' : mode === 'recover' ? 'Recover your account.' : 'Welcome back.'}</h1><p className="lede">A calm, friendly place for the next useful step in your business.</p><form onSubmit={submit}>
		<label htmlFor="auth-username">Username</label><input id="auth-username" className={`username-input ${usernameState}`} type="text" autoComplete="username" pattern="[A-Za-z0-9][A-Za-z0-9_.-]{2,39}" required value={username} onChange={(event) => setUsername(event.target.value)} /><p className={`username-hint ${usernameState}`} aria-live="polite">{usernameHint}</p>
		{mode !== 'recover' || resetToken ? <><label htmlFor="auth-password">{mode === 'recover' ? 'New password' : 'Password'}</label><input id="auth-password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={7} maxLength={18} required value={password} onChange={(event) => setPassword(event.target.value)} /><PasswordMeter checks={checks} /></> : null}
		{mode === 'register' && <RecoveryFields questions={questions} recoveryEmail={recoveryEmail} setRecoveryEmail={setRecoveryEmail} passcode={passcode} setPasscode={setPasscode} securityAnswers={securityAnswers} setSecurityAnswers={setSecurityAnswers} totp={totp} loadTotp={loadTotp} totpCode={totpCode} setTotpCode={setTotpCode} />}
		{mode === 'recover' && !resetToken && <RecoveryVerify questions={questions} method={recoverMethod} setMethod={setRecoverMethod} recoveryEmail={recoveryEmail} setRecoveryEmail={setRecoveryEmail} passcode={passcode} setPasscode={setPasscode} securityAnswers={securityAnswers} setSecurityAnswers={setSecurityAnswers} totpCode={totpCode} setTotpCode={setTotpCode} />}
		<button className="primary" type="submit">{mode === 'register' ? 'Create my account' : mode === 'recover' && !resetToken ? 'Verify recovery' : mode === 'recover' ? 'Reset password' : 'Sign in'} <span>→</span></button></form>{message && <p className="form-error" role="alert">{message}</p>}<div className="auth-links"><button className="text-link auth-switch" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setMessage(''); }}>{mode === 'register' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button><button className="text-link auth-switch" onClick={() => { setMode('recover'); setMessage(''); }}>Forgot password?</button></div></div></div>;
}

function PasswordMeter({ checks }: { checks: { length: boolean; letter: boolean; digit: boolean } }) {
	return <div className="password-meter" aria-live="polite"><span className={checks.length ? 'ok' : ''}>7-18 characters</span><span className={checks.letter ? 'ok' : ''}>letter</span><span className={checks.digit ? 'ok' : ''}>digit</span></div>;
}

function RecoveryFields(props: { questions: SecurityQuestion[]; recoveryEmail: string; setRecoveryEmail: (v: string) => void; passcode: string; setPasscode: (v: string) => void; securityAnswers: { questionKey: string; answer: string }[]; setSecurityAnswers: (v: { questionKey: string; answer: string }[]) => void; totp: TotpPreview | null; loadTotp: () => void; totpCode: string; setTotpCode: (v: string) => void }) {
	return <section className="recovery-box"><h2>Recovery options</h2><p className="hint">Optional, but one method helps you get back in without support.</p><label htmlFor="recovery-email">Recovery email</label><input id="recovery-email" type="email" placeholder="name@gmail.com or name@hotmail.com" value={props.recoveryEmail} onChange={(event) => props.setRecoveryEmail(event.target.value)} /><p className={`hint ${emailOk(props.recoveryEmail) ? 'ok' : 'bad'}`}>Gmail or Hotmail only. It does not need to be unique.</p><label htmlFor="passcode">Recovery passcode</label><input id="passcode" maxLength={8} placeholder="8 lowercase letters or digits" value={props.passcode} onChange={(event) => props.setPasscode(event.target.value.toLowerCase())} /><p className={`hint ${!props.passcode || passcodeOk(props.passcode) ? 'ok' : 'bad'}`}>Exactly 8 lowercase letters or digits.</p><QuestionInputs questions={props.questions} answers={props.securityAnswers} setAnswers={props.setSecurityAnswers} /><div className="totp-box"><button className="secondary" type="button" onClick={props.loadTotp}>Set authenticator now</button>{props.totp && <><p className="totp-secret">{props.totp.secret}</p><label htmlFor="totp-code">Authenticator code</label><input id="totp-code" inputMode="numeric" maxLength={6} value={props.totpCode} onChange={(event) => props.setTotpCode(event.target.value)} /></>}</div></section>;
}

function RecoveryVerify(props: { questions: SecurityQuestion[]; method: string; setMethod: (v: string) => void; recoveryEmail: string; setRecoveryEmail: (v: string) => void; passcode: string; setPasscode: (v: string) => void; securityAnswers: { questionKey: string; answer: string }[]; setSecurityAnswers: (v: { questionKey: string; answer: string }[]) => void; totpCode: string; setTotpCode: (v: string) => void }) {
	return <section className="recovery-box"><label htmlFor="recover-method">Recovery method</label><select id="recover-method" value={props.method} onChange={(event) => props.setMethod(event.target.value)}><option value="passcode">Passcode</option><option value="email">Recovery email</option><option value="totp">Authenticator code</option><option value="securityQuestions">Security questions</option></select>{props.method === 'email' && <><label htmlFor="verify-email">Recovery email</label><input id="verify-email" type="email" value={props.recoveryEmail} onChange={(event) => props.setRecoveryEmail(event.target.value)} /></>}{props.method === 'passcode' && <><label htmlFor="verify-passcode">Passcode</label><input id="verify-passcode" maxLength={8} value={props.passcode} onChange={(event) => props.setPasscode(event.target.value.toLowerCase())} /></>}{props.method === 'totp' && <><label htmlFor="verify-totp">Authenticator code</label><input id="verify-totp" inputMode="numeric" maxLength={6} value={props.totpCode} onChange={(event) => props.setTotpCode(event.target.value)} /></>}{props.method === 'securityQuestions' && <QuestionInputs questions={props.questions} answers={props.securityAnswers} setAnswers={props.setSecurityAnswers} />}</section>;
}

function QuestionInputs({ questions, answers, setAnswers }: { questions: SecurityQuestion[]; answers: { questionKey: string; answer: string }[]; setAnswers: (v: { questionKey: string; answer: string }[]) => void }) {
	const update = (index: number, key: 'questionKey' | 'answer', value: string) => setAnswers(answers.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
	return <div className="question-grid">{answers.map((answer, index) => <div className="field" key={index}><label>Security question {index + 1}</label><select value={answer.questionKey} onChange={(event) => update(index, 'questionKey', event.target.value)}><option value="">Choose a question</option>{questions.map((question) => <option key={question.key} value={question.key}>{question.question}</option>)}</select><input placeholder="Your answer" value={answer.answer} onChange={(event) => update(index, 'answer', event.target.value)} /></div>)}</div>;
}

function Today({ setPage, notify, done, toggleDone }: { setPage: (page: Page) => void; notify: (message: string) => void; done: number[]; toggleDone: (index: number) => void }) {
	return <section className="page"><div className="hero"><div><div className="eyebrow">Your weekly shop</div><h1>Good morning.</h1><p className="lede">Here is the short list of things that can help more people find and trust your studio.</p></div><button className="primary" onClick={() => { notify('Checking your shelves…'); window.setTimeout(() => notify('Your list is fresh.'), 1000); }}>Refresh my list <span>↗</span></button></div><div className="status-strip"><span className="dot" /><strong>Everything is up to date</strong><span>Last checked today at 9:12 AM</span></div><div className="overview"><div className="panel score"><div className="score-ring"><strong>78</strong></div><div><small>Your shop health</small><h3>Looking good</h3><small>Two small fixes could make a big difference.</small></div></div><Metric label="People found you" value="1,248" change="↑ 18% this month" /><Metric label="Good conversations" value="36" change="↑ 7 this month" /></div><div className="section-head"><h2>Your shelves</h2><button className="text-link" onClick={() => setPage('shop')}>See all shelves →</button></div><div className="shelves"><Shelf icon="🌿" title="Your website" copy="Clear and welcoming. A few labels could be easier to read." percent="84%" note="2 notes" /><Shelf icon="🔎" title="Being discovered" copy="You show up for “plant studio” but not yet for “beginner class.”" percent="61%" note="1 note" /><Shelf icon="💬" title="Talking with people" copy="Three useful questions are waiting in places your customers visit." percent="72%" note="3 ideas" /></div><div className="lower"><div className="panel actions"><div className="section-head"><h2>Today’s list</h2><button className="text-link" onClick={() => setPage('list')}>Open full list →</button></div>{actions.map((action, index) => <Action key={action.title} {...action} complete={done.includes(index)} onToggle={() => toggleDone(index)} />)}</div><Receipt /></div></section>;
}
function Metric({ label, value, change }: { label: string; value: string; change: string }) { return <div className="panel metric"><span className="metric-label">{label}</span><strong>{value}</strong><small>{change}</small></div>; }
function Shelf({ icon, title, copy, percent, note }: { icon: string; title: string; copy: string; percent: string; note: string }) { return <article className="panel shelf"><div className="shelf-icon">{icon}</div><h3>{title}</h3><p>{copy}</p><div className="progress"><span style={{ width: percent }} /></div><div className="shelf-footer"><span>{percent} ready</span><span>{note}</span></div></article>; }
function Action({ title, copy, tag, tone, complete, onToggle }: { title: string; copy: string; tag: string; tone: string; complete: boolean; onToggle: () => void }) { return <div className={`action ${complete ? 'complete' : ''}`}><button className={`check ${complete ? 'done' : ''}`} aria-label={`Mark ${title} complete`} onClick={onToggle}>{complete ? '✓' : ''}</button><div><h3>{title}</h3><p>{copy}</p></div><span className={`tag ${tone}`}>{tag}</span></div>; }
function Receipt() { return <aside className="panel receipt"><h2>Little wins</h2><p className="date">What changed since last week</p><div className="receipt-line"><span>New people found you</span><strong>+18%</strong></div><div className="receipt-line"><span>Questions worth answering</span><strong>3</strong></div><div className="receipt-line"><span>Things to tidy</span><strong>2</strong></div><div className="receipt-total"><span>Keep going</span><span>★★★★☆</span></div></aside>; }

function Shop({ setPage, notify }: { setPage: (page: Page) => void; notify: (message: string) => void }) { const [choice, setChoice] = useState('find'); const options = [['find', 'Be easier to find', 'Show up when the right people search.'], ['story', 'Tell my story better', 'Make the value clear in a few words.'], ['meet', 'Meet more customers', 'Find good places to join the conversation.']]; return <section className="page setup"><div className="eyebrow">Shop for growth</div><h1>What are we working on?</h1><p className="lede">Tell us a little about your business. We will bring back a small, useful list that fits your week.</p><div className="panel form-panel"><div className="field"><label htmlFor="site">Your website</label><input id="site" type="url" placeholder="https://yourbusiness.com" /><p className="hint">We only look at pages anyone can visit.</p></div><div className="field"><label>What would help most right now?</label><div className="choice-row">{options.map(([id, title, copy]) => <button key={id} className={`choice ${choice === id ? 'selected' : ''}`} onClick={() => setChoice(id)}><b>{title}</b><span>{copy}</span></button>)}</div></div><button className="primary" onClick={() => { notify('Your first list is ready.'); window.setTimeout(() => setPage('list'), 500); }}>Make my list <span>→</span></button></div></section>; }
function List({ notify }: { notify: (message: string) => void }) { const list = [...actions, { title: 'Give your best work a name', copy: 'Named collections are easier for people to remember and easier to recommend to a friend.', tag: 'Worth doing', tone: 'important' }]; return <section className="page"><div className="eyebrow">Your list</div><h1>Small jobs, real progress.</h1><p className="lede">You do not need to do everything. Start with the job that feels most useful today.</p><div className="findings-grid">{list.map((item) => <article className="panel finding" key={item.title}><span className={`tag ${item.tone}`}>{item.tag}</span><h3>{item.title}</h3><p>{item.copy}</p><button className="secondary" onClick={() => notify('Suggestion opened.')}>See the suggestion →</button></article>)}</div></section>; }
function Profile({ user, notify }: { user: User; notify: (message: string) => void }) { return <section className="page setup"><div className="eyebrow">Profile</div><h1>Your account shelf.</h1><p className="lede">Keep the basics clear so the app knows whose work it is helping.</p><div className="panel form-panel"><div className="field"><label>Username</label><input value={`@${user.username}`} readOnly /></div><div className="field"><label htmlFor="business">Business name</label><input id="business" defaultValue="Fern & Form" /></div><div className="field"><label htmlFor="voice">How should suggestions sound?</label><input id="voice" defaultValue="Warm, clear, and down to earth" /></div><button className="primary" onClick={() => notify('Profile saved.')}>Save profile</button></div></section>; }
function Security({ notify }: { notify: (message: string) => void }) {
	const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
	const [recoveryEmail, setRecoveryEmail] = useState('');
	const [passcode, setPasscode] = useState('');
	const [securityAnswers, setSecurityAnswers] = useState([{ questionKey: '', answer: '' }, { questionKey: '', answer: '' }]);
	const [totp, setTotp] = useState<TotpPreview | null>(null);
	const [totpCode, setTotpCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const checks = useMemo(() => passwordChecks(newPassword), [newPassword]);
	useEffect(() => { fetch('/api/auth/security-questions').then((response) => response.json()).then((body) => setQuestions(body.questions ?? [])); }, []);
	const saveSecurity = async () => {
		const response = await fetch('/api/auth/security/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ recoveryEmail, passcode, securityAnswers: securityAnswers.filter((item) => item.questionKey || item.answer), totpSecret: totp?.secret ?? '', totpCode }) });
		notify(response.ok ? 'Security saved.' : 'Check the recovery details.');
	};
	const changePassword = async () => {
		if (!passwordOk(newPassword)) return notify('Use 7-18 characters with one letter and one digit.');
		const response = await fetch('/api/auth/password-change', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ password: newPassword }) });
		notify(response.ok ? 'Password changed.' : 'Password was not changed.');
	};
	return <section className="page setup"><div className="eyebrow">Security</div><h1>Keep a way back in.</h1><p className="lede">Set the recovery details you want. You can also change your password here while signed in.</p><div className="panel form-panel"><label htmlFor="new-password">Change password</label><input id="new-password" type="password" minLength={7} maxLength={18} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><PasswordMeter checks={checks} /><button className="secondary" onClick={changePassword}>Update password</button></div><div className="panel form-panel"><RecoveryFields questions={questions} recoveryEmail={recoveryEmail} setRecoveryEmail={setRecoveryEmail} passcode={passcode} setPasscode={setPasscode} securityAnswers={securityAnswers} setSecurityAnswers={setSecurityAnswers} totp={totp} loadTotp={() => fetch('/api/auth/totp/setup-preview').then((response) => response.json()).then(setTotp)} totpCode={totpCode} setTotpCode={setTotpCode} /><button className="primary" onClick={saveSecurity}>Save security</button></div></section>;
}
