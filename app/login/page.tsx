"use client";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --black: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #252525;
    --border-bright: #333333;
    --text: #f0ece4;
    --text-muted: #888;
    --text-faint: #444;
    --gold: #c8a96e;
    --gold-light: #e0c48a;
    --gold-dim: rgba(200, 169, 110, 0.12);
    --red: #d94f4f;
    --green: #4caf82;
  }

  .root {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    min-height: 100vh;
    display: flex;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  /* Background grid pattern */
  .root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.4;
    pointer-events: none;
  }

  /* Gold glow top-right */
  .root::after {
    content: '';
    position: fixed;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    width: 45%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 56px;
    border-right: 1px solid var(--border);
    position: relative;
    z-index: 1;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: var(--gold);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .logo-icon svg {
    width: 20px;
    height: 20px;
    fill: var(--black);
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -0.5px;
    color: var(--text);
  }

  .logo-text span { color: var(--gold); }

  .hero-copy {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 0 40px;
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .eyebrow::before {
    content: '';
    width: 24px;
    height: 1px;
    background: var(--gold);
  }

  .headline {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(36px, 4vw, 52px);
    line-height: 1.05;
    letter-spacing: -2px;
    color: var(--text);
    margin-bottom: 24px;
  }

  .headline em {
    font-style: normal;
    color: var(--gold);
  }

  .sub {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 380px;
    font-weight: 300;
  }

  .stats-row {
    display: flex;
    gap: 40px;
    padding-top: 48px;
    border-top: 1px solid var(--border);
  }

  .stat { display: flex; flex-direction: column; gap: 4px; }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -1px;
  }

  .stat-label { font-size: 12px; color: var(--text-muted); letter-spacing: 0.5px; }

  .left-footer {
    font-size: 12px;
    color: var(--text-faint);
    line-height: 1.6;
  }

  /* ── RIGHT PANEL (Form) ── */
  .right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 52px 56px;
    position: relative;
    z-index: 1;
  }

  .form-card {
    width: 100%;
    max-width: 420px;
  }

  .form-header { margin-bottom: 40px; }

  .form-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: var(--text);
    margin-bottom: 8px;
  }

  .form-sub { font-size: 14px; color: var(--text-muted); font-weight: 300; }

  /* Tab switcher */
  .tabs {
    display: flex;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 32px;
  }

  .tab {
    flex: 1;
    padding: 10px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    background: none;
    border: none;
    border-radius: 7px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .tab.active {
    background: var(--gold);
    color: var(--black);
  }

  /* Inputs */
  .field { margin-bottom: 18px; }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .input-wrap { position: relative; }

  .input-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--text-faint);
    transition: color 0.2s;
    pointer-events: none;
  }

  .field input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    -webkit-autofill: none;
  }

  .field input::placeholder { color: var(--text-faint); }

  .field input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.1);
  }

  .field input:focus + svg,
  .input-wrap:focus-within svg { color: var(--gold); }

  /* Hint text */
  .hint {
    font-size: 11px;
    color: var(--text-faint);
    margin-top: 6px;
    padding-left: 2px;
  }

  /* Error */
  .error-box {
    background: rgba(217,79,79,0.08);
    border: 1px solid rgba(217,79,79,0.25);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 13px;
    color: var(--red);
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .error-box svg { flex-shrink: 0; margin-top: 1px; }

  /* Submit button */
  .btn-primary {
    width: 100%;
    background: var(--gold);
    color: var(--black);
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.3px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    margin-top: 8px;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--gold-light);
    box-shadow: 0 4px 20px rgba(200,169,110,0.25);
  }

  .btn-primary:active:not(:disabled) { transform: scale(0.99); }

  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-primary .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: var(--black);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    color: var(--text-faint);
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Register CTA */
  .register-row {
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 24px;
  }

  .link-btn {
    background: none;
    border: none;
    color: var(--gold);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .link-btn:hover { color: var(--gold-light); }

  /* Register form extras */
  .fields-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  /* Success message */
  .success-box {
    background: rgba(76,175,130,0.08);
    border: 1px solid rgba(76,175,130,0.25);
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    margin-top: 16px;
  }

  .success-icon {
    width: 48px;
    height: 48px;
    background: rgba(76,175,130,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
  }

  .success-box h3 {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--green);
    margin-bottom: 6px;
  }

  .success-box p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  /* Decorative badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px;
    color: var(--gold);
    font-weight: 500;
    letter-spacing: 0.5px;
    margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  @media (max-width: 900px) {
    .root { flex-direction: column; }
    .left-panel { width: 100%; border-right: none; border-bottom: 1px solid var(--border); padding: 32px 28px; }
    .hero-copy { padding: 32px 0 24px; }
    .right-panel { padding: 36px 28px 52px; }
    .fields-row { grid-template-columns: 1fr; }
    .stats-row { gap: 24px; }
  }
`;

// ── Icons ──
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.61 3.3a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.13 1 .36 1.96.7 2.89a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.93.34 1.9.57 2.89.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
  </svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── API Base ──
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginId) { setError("Please enter your membership ID."); return; }
    setLoading(true);
    try {
      // Use the login endpoint with membership_id
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 
  },
        body: JSON.stringify({ 
          membership_id: loginId
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Login failed.");
      // Store member data and redirect to profile
      localStorage.setItem("ms_member", JSON.stringify(data.member));
      window.location.href = "/profile";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPhone || !regPass) { setError("All fields are required."); return; }
    if (regPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPass }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Registration failed.");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setSuccess(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        {/* ── Left Panel ── */}
        <div className="left-panel">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span className="logo-text">Member<span>Sync</span></span>
          </div>

          <div className="hero-copy">
            <div className="badge">
              <div className="badge-dot" />
              Membership Portal
            </div>
            <div className="eyebrow">Access Control & Management</div>
            <h1 className="headline">
              Your membership,<br />
              <em>always in sync.</em>
            </h1>
            <p className="sub">
              Check in to facilities, track your balance, manage renewals,
              and stay connected — all from a single smart platform.
            </p>

            <div className="stats-row">
              <div className="stat">
                <span className="stat-num">24/7</span>
                <span className="stat-label">Digital Access</span>
              </div>
              <div className="stat">
                <span className="stat-num">QR</span>
                <span className="stat-label">Instant Check-in</span>
              </div>
              <div className="stat">
                <span className="stat-num">Live</span>
                <span className="stat-label">Notifications</span>
              </div>
            </div>
          </div>

          <p className="left-footer">
            © {new Date().getFullYear()} MemberSync · Secure Member Portal<br />
            Protected by 256-bit encryption
          </p>
        </div>

        {/* ── Right Panel ── */}
        <div className="right-panel">
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">
                {mode === "login" ? "Access Profile" : "Create account"}
              </h2>
              <p className="form-sub">
                {mode === "login"
                  ? "Enter your membership ID to view your profile"
                  : "Join and get instant access to all facilities"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="tabs">
              <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>
                Sign In
              </button>
              <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => switchMode("register")}>
                Register
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <IconAlert />
                {error}
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {mode === "login" && (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Membership ID</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="e.g. MBR-000086"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      autoFocus
                    />
                    <IconUser />
                  </div>
                  <p className="hint">Enter your membership ID to access your profile</p>
                </div>

                <button className="btn-primary" type="submit" disabled={loading}>
                  <span className="btn-inner">
                    {loading ? <><div className="spinner" /> Loading profile…</> : <>Access Profile <IconArrow /></>}
                  </span>
                </button>

                <div className="divider">or</div>
                <p className="register-row">
                  First time? &nbsp;
                  <button type="button" className="link-btn" onClick={() => switchMode("register")}>
                    Create your account
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER FORM ── */}
            {mode === "register" && !success && (
              <form onSubmit={handleRegister}>
                <div className="field">
                  <label>Full Name</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      autoFocus
                    />
                    <IconUser />
                  </div>
                </div>

                <div className="fields-row">
                  <div className="field">
                    <label>Email</label>
                    <div className="input-wrap">
                      <input
                        type="email"
                        placeholder="you@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                      <IconMail />
                    </div>
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <div className="input-wrap">
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                      <IconPhone />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="input-wrap">
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                    />
                    <IconLock />
                  </div>
                  <p className="hint">Min. 6 characters. You'll use this to sign in.</p>
                </div>

                <button className="btn-primary" type="submit" disabled={loading}>
                  <span className="btn-inner">
                    {loading ? <><div className="spinner" /> Creating account…</> : <>Create Account <IconArrow /></>}
                  </span>
                </button>

                <p className="register-row" style={{ marginTop: 20 }}>
                  Already a member? &nbsp;
                  <button type="button" className="link-btn" onClick={() => switchMode("login")}>
                    Sign in instead
                  </button>
                </p>
              </form>
            )}

            {/* ── SUCCESS STATE ── */}
            {mode === "register" && success && (
              <div className="success-box">
                <div className="success-icon">
                  <IconCheck />
                </div>
                <h3>You're in!</h3>
                <p>
                  Your account has been created. Your QR code has been generated
                  and you're ready to access all facilities.
                </p>
                <button
                  className="btn-primary"
                  style={{ marginTop: 20 }}
                  onClick={() => switchMode("login")}
                >
                  Sign in now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}