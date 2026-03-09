"use client";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ||
  `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000/api/v1`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --black:#0a0a0a; --surface:#111111; --surface2:#1a1a1a;
    --border:#252525; --border-bright:#333;
    --text:#f0ece4; --text-muted:#888; --text-faint:#444;
    --gold:#c8a96e; --gold-light:#e0c48a; --gold-dim:rgba(200,169,110,.12);
    --red:#d94f4f; --green:#4caf82;
  }
  body { font-family:'DM Sans',sans-serif; background:var(--black); color:var(--text); }
  .root { min-height:100vh; display:flex; position:relative; overflow:hidden; }
  .root::before { content:''; position:fixed; inset:0;
    background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
    background-size:60px 60px; opacity:.4; pointer-events:none; }
  .root::after { content:''; position:fixed; top:-200px; right:-200px; width:600px; height:600px;
    background:radial-gradient(circle,rgba(200,169,110,.08) 0%,transparent 70%); pointer-events:none; }

  /* LEFT */
  .left { width:45%; display:flex; flex-direction:column; justify-content:space-between; padding:52px 56px;
    border-right:1px solid var(--border); position:relative; z-index:1; }
  .logo { display:flex; align-items:center; gap:10px; }
  .logo-icon { width:36px; height:36px; background:var(--gold); border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .logo-icon svg { width:20px; height:20px; fill:var(--black); }
  .logo-name { font-family:'Syne',sans-serif; font-weight:700; font-size:20px; letter-spacing:-.5px; }
  .logo-name span { color:var(--gold); }
  .hero { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 0 40px; }
  .badge { display:inline-flex; align-items:center; gap:6px; background:var(--gold-dim);
    border:1px solid rgba(200,169,110,.2); border-radius:20px; padding:5px 12px;
    font-size:11px; color:var(--gold); font-weight:500; letter-spacing:.5px; margin-bottom:20px; }
  .badge-dot { width:6px; height:6px; background:var(--gold); border-radius:50%; animation:pulse 2s ease-in-out infinite; }
  .eyebrow { font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--gold);
    margin-bottom:24px; display:flex; align-items:center; gap:10px; }
  .eyebrow::before { content:''; width:24px; height:1px; background:var(--gold); }
  .headline { font-family:'Syne',sans-serif; font-weight:800; font-size:clamp(34px,4vw,50px);
    line-height:1.05; letter-spacing:-2px; margin-bottom:24px; }
  .headline em { font-style:normal; color:var(--gold); }
  .sub { font-size:15px; color:var(--text-muted); line-height:1.7; max-width:380px; font-weight:300; }
  .stats { display:flex; gap:40px; padding-top:48px; border-top:1px solid var(--border); }
  .stat { display:flex; flex-direction:column; gap:4px; }
  .stat-n { font-family:'Syne',sans-serif; font-size:28px; font-weight:700; letter-spacing:-1px; }
  .stat-l { font-size:12px; color:var(--text-muted); letter-spacing:.5px; }
  .left-foot { font-size:12px; color:var(--text-faint); line-height:1.6; }

  /* RIGHT */
  .right { flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;
    padding:52px 56px; position:relative; z-index:1; }
  .card { width:100%; max-width:420px; }
  .form-hd { margin-bottom:36px; }
  .form-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:700; letter-spacing:-1px; margin-bottom:8px; }
  .form-sub { font-size:14px; color:var(--text-muted); font-weight:300; }

  /* Tabs */
  .tabs { display:flex; background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:4px; margin-bottom:30px; }
  .tab { flex:1; padding:10px; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif;
    background:none; border:none; border-radius:7px; color:var(--text-muted); cursor:pointer; transition:all .2s; }
  .tab.on { background:var(--gold); color:var(--black); font-weight:600; }

  /* Fields */
  .field { margin-bottom:16px; }
  .field label { display:block; font-size:12px; font-weight:500; letter-spacing:.8px;
    text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; }
  .iw { position:relative; }
  .iw svg { position:absolute; left:14px; top:50%; transform:translateY(-50%);
    width:16px; height:16px; color:var(--text-faint); pointer-events:none; transition:color .2s; }
  .iw:focus-within svg { color:var(--gold); }
  .field input { width:100%; background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:13px 14px 13px 42px; font-family:'DM Sans',sans-serif;
    font-size:14px; color:var(--text); outline:none; transition:border-color .2s, box-shadow .2s; }
  .field input::placeholder { color:var(--text-faint); }
  .field input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(200,169,110,.1); }
  .hint { font-size:11px; color:var(--text-faint); margin-top:5px; }
  .fields-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

  /* Error / success */
  .err { background:rgba(217,79,79,.08); border:1px solid rgba(217,79,79,.25);
    border-radius:8px; padding:12px 14px; font-size:13px; color:var(--red);
    margin-bottom:18px; display:flex; align-items:flex-start; gap:8px; }
  .err svg { flex-shrink:0; margin-top:1px; }
  .suc { background:rgba(76,175,130,.08); border:1px solid rgba(76,175,130,.25);
    border-radius:10px; padding:20px; text-align:center; }
  .suc-icon { width:48px; height:48px; background:rgba(76,175,130,.15); border-radius:50%;
    display:flex; align-items:center; justify-content:center; margin:0 auto 12px; }
  .suc h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--green); margin-bottom:6px; }
  .suc p { font-size:13px; color:var(--text-muted); line-height:1.6; }

  /* Button */
  .btn { width:100%; background:var(--gold); color:var(--black); border:none; border-radius:10px;
    padding:14px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:-.3px;
    cursor:pointer; transition:background .2s, transform .1s, box-shadow .2s; margin-top:8px; }
  .btn:hover:not(:disabled) { background:var(--gold-light); box-shadow:0 4px 20px rgba(200,169,110,.25); }
  .btn:active:not(:disabled) { transform:scale(.99); }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .btn-inner { display:flex; align-items:center; justify-content:center; gap:8px; }
  .spinner { width:16px; height:16px; border:2px solid rgba(0,0,0,.2); border-top-color:var(--black);
    border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .divider { display:flex; align-items:center; gap:12px; margin:20px 0;
    color:var(--text-faint); font-size:12px; letter-spacing:1px; text-transform:uppercase; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background:var(--border); }
  .row-link { text-align:center; font-size:13px; color:var(--text-muted); margin-top:20px; }
  .lbtn { background:none; border:none; color:var(--gold); font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:500; cursor:pointer; text-decoration:underline; text-underline-offset:3px; }
  .lbtn:hover { color:var(--gold-light); }

  /* Org selector */
  .org-grid { display:flex; flex-direction:column; gap:7px; margin-bottom:4px; max-height:200px; overflow-y:auto; padding-right:2px; }
  .org-grid::-webkit-scrollbar { width:4px; }
  .org-grid::-webkit-scrollbar-track { background:transparent; }
  .org-grid::-webkit-scrollbar-thumb { background:var(--border-bright); border-radius:4px; }
  .org-opt { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px;
    border:1.5px solid var(--border); background:none; cursor:pointer; transition:all .15s;
    text-align:left; width:100%; font-family:'DM Sans',sans-serif; }
  .org-opt:hover { border-color:var(--gold); background:var(--gold-dim); }
  .org-opt.sel { border-color:var(--gold); background:var(--gold-dim); }
  .org-av { width:30px; height:30px; border-radius:7px; background:var(--gold-dim);
    border:1px solid rgba(200,169,110,.25); display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:700; font-size:11px; color:var(--gold); flex-shrink:0; }
  .org-body { flex:1; min-width:0; }
  .org-name { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap;
    overflow:hidden; text-overflow:ellipsis; }
  .org-meta { font-size:11px; color:var(--text-muted); margin-top:1px; }
  .org-check { width:16px; height:16px; border-radius:50%; border:2px solid var(--border);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
  .org-opt.sel .org-check { background:var(--gold); border-color:var(--gold); }
  .org-opt.sel .org-check svg { display:block; }
  .org-check svg { display:none; width:9px; height:9px; stroke:var(--black); stroke-width:3; fill:none; }
  .org-loading { font-size:12px; color:var(--text-faint); padding:8px 2px; }

  /* Forgot password link */
  .forgot { text-align:right; margin-top:-8px; margin-bottom:16px; }
  .forgot .lbtn { font-size:12px; }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  @media(max-width:900px){
    .root{flex-direction:column}
    .left{width:100%;border-right:none;border-bottom:1px solid var(--border);padding:32px 28px}
    .hero{padding:28px 0 20px}
    .right{padding:32px 28px 52px}
    .fields-row{grid-template-columns:1fr}
    .stats{gap:24px}
  }
`;

const IUser  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const ILock  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IMail  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>;
const IPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.61 3.3a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.13 1 .36 1.96.7 2.89a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.93.34 1.9.57 2.89.7A2 2 0 0 1 22 16.92z"/></svg>;
const IAlert = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>;
const ICheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>;
const IArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

export default function LoginPage() {
  const [mode, setMode]     = useState("login");
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");
  const [success, setSucc]  = useState(false);

  // Login
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");

  // Register
  const [rName,  setRName]  = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [rPass,  setRPass]  = useState("");
  const [rOrg,   setROrg]   = useState(null);   // selected org object
  const [orgs,   setOrgs]   = useState([]);
  const [orgsLoading, setOrgsLoading] = useState(false);

  const switchMode = m => {
    setMode(m); setError(""); setSucc(false);
    // Fetch orgs when register tab opens
    if (m === "register" && orgs.length === 0) {
      setOrgsLoading(true);
      fetch(`${API_BASE}/organizations`)
        .then(r => r.json())
        .then(d => { if (d.success) setOrgs(d.organizations || []); })
        .catch(() => {})
        .finally(() => setOrgsLoading(false));
    }
  };

  /* ── LOGIN ── */
  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    if (!email || !pass) { setError("Email and password are required."); return; }
    setLoad(true);
    try {
      const res  = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password: pass }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Login failed.");

      const memberships = data.memberships || [];

      // Always store the full list for org switching
      localStorage.setItem("ms_memberships", JSON.stringify(memberships));

      if (memberships.length === 1) {
        // Only one org — go straight to dashboard
        localStorage.setItem("ms_member", JSON.stringify(memberships[0]));
        window.location.href = "/dashboard";
      } else if (memberships.length > 1) {
        // Multiple orgs — let them pick
        window.location.href = "/select-membership";
      } else {
        throw new Error("No memberships found for this account.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  };

  /* ── REGISTER ── */
  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    if (!rName || !rEmail || !rPhone || !rPass) { setError("All fields are required."); return; }
    if (!rOrg) { setError("Please select an organization to join."); return; }
    if (rPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoad(true);
    try {
      const res  = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rName, email: rEmail, phone: rPhone, password: rPass, organization_id: rOrg.id }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Registration failed.");
      setSucc(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* ── LEFT PANEL ── */}
        <div className="left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="logo-name">Member<span>Sync</span></span>
          </div>

          <div className="hero">
            <div className="badge"><div className="badge-dot"/>Membership Portal</div>
            <div className="eyebrow">Access Control & Management</div>
            <h1 className="headline">Your membership,<br/><em>always in sync.</em></h1>
            <p className="sub">Check in to facilities, track your balance, manage renewals, and stay connected — all from one smart platform.</p>
            <div className="stats">
              <div className="stat"><span className="stat-n">24/7</span><span className="stat-l">Digital Access</span></div>
              <div className="stat"><span className="stat-n">QR</span><span className="stat-l">Instant Check-in</span></div>
              <div className="stat"><span className="stat-n">Live</span><span className="stat-l">Notifications</span></div>
            </div>
          </div>

          <p className="left-foot">© {new Date().getFullYear()} MemberSync · Secure Member Portal<br/>Protected by 256-bit encryption</p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right">
          <div className="card">
            <div className="form-hd">
              <h2 className="form-title">{mode==="login"?"Welcome back":"Create account"}</h2>
              <p className="form-sub">{mode==="login"?"Sign in with your email and password":"Join and get instant access to all facilities"}</p>
            </div>

            <div className="tabs">
              <button className={`tab${mode==="login"?" on":""}`} onClick={()=>switchMode("login")}>Sign In</button>
              <button className={`tab${mode==="register"?" on":""}`} onClick={()=>switchMode("register")}>Register</button>
            </div>

            {error && <div className="err"><IAlert/>{error}</div>}

            {/* ── LOGIN ── */}
            {mode==="login" && (
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email address</label>
                  <div className="iw">
                    <input type="email" placeholder="you@email.com" value={email}
                      onChange={e=>setEmail(e.target.value)} autoFocus autoComplete="email"/>
                    <IMail/>
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="iw">
                    <input type="password" placeholder="Your password" value={pass}
                      onChange={e=>setPass(e.target.value)} autoComplete="current-password"/>
                    <ILock/>
                  </div>
                </div>

                <button className="btn" type="submit" disabled={loading}>
                  <span className="btn-inner">
                    {loading ? <><div className="spinner"/>Signing in…</> : <>Sign In <IArrow/></>}
                  </span>
                </button>

                <div className="divider">or</div>
                <p className="row-link">New here? <button type="button" className="lbtn" onClick={()=>switchMode("register")}>Create an account</button></p>
              </form>
            )}

            {/* ── REGISTER ── */}
            {mode==="register" && !success && (
              <form onSubmit={handleRegister}>
                <div className="field">
                  <label>Full Name</label>
                  <div className="iw">
                    <input type="text" placeholder="Your full name" value={rName}
                      onChange={e=>setRName(e.target.value)} autoFocus/>
                    <IUser/>
                  </div>
                </div>
                <div className="fields-row">
                  <div className="field">
                    <label>Email</label>
                    <div className="iw">
                      <input type="email" placeholder="you@email.com" value={rEmail} onChange={e=>setREmail(e.target.value)}/>
                      <IMail/>
                    </div>
                  </div>
                  <div className="field">
                    <label>Phone</label>
                    <div className="iw">
                      <input type="tel" placeholder="+254 700 000 000" value={rPhone} onChange={e=>setRPhone(e.target.value)}/>
                      <IPhone/>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="iw">
                    <input type="password" placeholder="At least 6 characters" value={rPass} onChange={e=>setRPass(e.target.value)}/>
                    <ILock/>
                  </div>
                  <p className="hint">Min. 6 characters. You'll use this to sign in.</p>
                </div>

                <div className="field">
                  <label>Organization</label>
                  {orgsLoading ? (
                    <p className="org-loading">Loading organizations…</p>
                  ) : orgs.length === 0 ? (
                    <p className="org-loading">No organizations available. Contact your admin.</p>
                  ) : (
                    <div className="org-grid">
                      {orgs.map(org => (
                        <button
                          key={org.id}
                          type="button"
                          className={`org-opt${rOrg?.id===org.id?" sel":""}`}
                          onClick={() => setROrg(org)}
                        >
                          <div className="org-av">
                            {(org.name||"?").split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("").slice(0,2)}
                          </div>
                          <div className="org-body">
                            <div className="org-name">{org.name}</div>
                            <div className="org-meta">
                              {[org.industry, org.location].filter(Boolean).join(" · ") || "Organization"}
                            </div>
                          </div>
                          <div className="org-check">
                            <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="btn" type="submit" disabled={loading}>
                  <span className="btn-inner">
                    {loading ? <><div className="spinner"/>Creating account…</> : <>Create Account <IArrow/></>}
                  </span>
                </button>
                <p className="row-link">Already a member? <button type="button" className="lbtn" onClick={()=>switchMode("login")}>Sign in</button></p>
              </form>
            )}

            {/* ── REGISTER SUCCESS ── */}
            {mode==="register" && success && (
              <div className="suc">
                <div className="suc-icon" style={{color:"var(--green)"}}><ICheck/></div>
                <h3>You're in!</h3>
                <p>Your account has been created. Sign in to access your memberships.</p>
                <button className="btn" style={{marginTop:20}} onClick={()=>switchMode("login")}>Sign in now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}