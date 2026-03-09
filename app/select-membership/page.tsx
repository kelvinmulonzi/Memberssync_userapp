"use client";
import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --black:#0a0a0a; --surface:#111; --surface2:#1a1a1a;
    --border:#252525; --text:#f0ece4; --text-muted:#888; --text-faint:#444;
    --gold:#c8a96e; --gold-light:#e0c48a; --gold-dim:rgba(200,169,110,.12);
    --green:#4caf82; --green-dim:rgba(76,175,130,.1);
    --red:#d94f4f; --red-dim:rgba(217,79,79,.1);
  }
  body { font-family:'DM Sans',sans-serif; background:var(--black); color:var(--text); }
  .root { min-height:100vh; display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden; padding:40px 20px; }
  .root::before { content:''; position:fixed; inset:0;
    background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
    background-size:60px 60px; opacity:.35; pointer-events:none; }
  .root::after { content:''; position:fixed; top:-200px; left:50%; transform:translateX(-50%);
    width:700px; height:500px;
    background:radial-gradient(ellipse,rgba(200,169,110,.07) 0%,transparent 65%); pointer-events:none; }

  .wrap { width:100%; max-width:560px; position:relative; z-index:1; }

  /* Header */
  .logo { display:flex; align-items:center; gap:10px; justify-content:center; margin-bottom:48px; }
  .logo-icon { width:34px; height:34px; background:var(--gold); border-radius:8px;
    display:flex; align-items:center; justify-content:center; }
  .logo-icon svg { width:18px; height:18px; fill:var(--black); }
  .logo-name { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; letter-spacing:-.4px; }
  .logo-name span { color:var(--gold); }

  .head { text-align:center; margin-bottom:36px; }
  .eyebrow { font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase;
    color:var(--gold); margin-bottom:14px; display:flex; align-items:center; justify-content:center; gap:10px; }
  .eyebrow::before, .eyebrow::after { content:''; width:20px; height:1px; background:var(--gold); }
  .title { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; letter-spacing:-1.5px;
    line-height:1.1; margin-bottom:10px; }
  .sub { font-size:14px; color:var(--text-muted); font-weight:300; }

  /* Membership cards */
  .list { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }

  .mcard {
    display:flex; align-items:center; gap:16px;
    background:var(--surface); border:1.5px solid var(--border);
    border-radius:14px; padding:18px 20px; cursor:pointer;
    transition:all .18s; position:relative; overflow:hidden;
    text-align:left; width:100%; font-family:'DM Sans',sans-serif;
  }
  .mcard::before { content:''; position:absolute; inset:0;
    background:radial-gradient(circle at 80% 50%,rgba(200,169,110,.04) 0%,transparent 60%); }
  .mcard:hover { border-color:var(--gold); background:var(--surface2);
    transform:translateY(-1px); box-shadow:0 4px 20px rgba(0,0,0,.3); }
  .mcard.sel { border-color:var(--gold); background:var(--surface2);
    box-shadow:0 0 0 3px rgba(200,169,110,.12); }

  .mcard-av { width:46px; height:46px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-weight:800; font-size:16px;
    background:var(--gold-dim); color:var(--gold); border:1.5px solid rgba(200,169,110,.2); }

  .mcard-body { flex:1; min-width:0; }
  .mcard-org { font-family:'Syne',sans-serif; font-size:16px; font-weight:700;
    letter-spacing:-.4px; margin-bottom:4px; color:var(--text); }
  .mcard-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .mcard-id { font-size:12px; color:var(--text-muted); }
  .mcard-sep { width:3px; height:3px; border-radius:50%; background:var(--text-faint); }
  .mcard-type { font-size:12px; color:var(--text-muted); }

  .mcard-right { display:flex; flex-direction:column; align-items:flex-end; gap:6px; flex-shrink:0; }
  .status-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px;
    border-radius:20px; font-size:11px; font-weight:600; border:1px solid; }
  .status-pill.active   { background:var(--green-dim); border-color:rgba(76,175,130,.25); color:var(--green); }
  .status-pill.inactive { background:var(--red-dim);   border-color:rgba(217,79,79,.25);  color:var(--red); }
  .status-pill.expired  { background:var(--red-dim);   border-color:rgba(217,79,79,.25);  color:var(--red); }
  .sdot { width:5px; height:5px; border-radius:50%; background:currentColor; }
  .exp-date { font-size:11px; color:var(--text-faint); }

  .check-circle { width:22px; height:22px; border-radius:50%; border:2px solid var(--border);
    display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s; }
  .mcard.sel .check-circle { background:var(--gold); border-color:var(--gold); }
  .mcard.sel .check-circle svg { display:block; }
  .check-circle svg { display:none; width:12px; height:12px; stroke:var(--black); stroke-width:2.5; fill:none; }

  /* CTA */
  .btn { width:100%; background:var(--gold); color:var(--black); border:none; border-radius:12px;
    padding:15px; font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:-.3px;
    cursor:pointer; transition:all .2s; }
  .btn:hover:not(:disabled) { background:var(--gold-light); box-shadow:0 4px 20px rgba(200,169,110,.25); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn-inner { display:flex; align-items:center; justify-content:center; gap:8px; }
  .spinner { width:16px; height:16px; border:2px solid rgba(0,0,0,.2); border-top-color:var(--black);
    border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  .foot { text-align:center; margin-top:20px; font-size:13px; color:var(--text-faint); }
  .lbtn { background:none; border:none; color:var(--gold); font-family:'DM Sans',sans-serif;
    font-size:13px; cursor:pointer; text-decoration:underline; text-underline-offset:3px; }

  @keyframes up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .mcard { animation:up .3s ease both; }
  ${[0,1,2,3,4].map(i=>`.mcard:nth-child(${i+1}){animation-delay:${i*0.06}s}`).join('\n')}
`;

const fmtDate = s => { try{ return new Date(s).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }catch{return s||"—"; }};
const initials = n => (n||"").split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("").slice(0,2);
const orgInitials = n => (n||"?").split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("").slice(0,2);

export default function SelectMembership() {
  const [memberships, setMemberships] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]          = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("ms_memberships") || "null")
      : null;

    if (!stored || stored.length === 0) {
      // Nothing to pick from — back to login
      window.location.href = "/";
      return;
    }

    if (stored.length === 1) {
      // Shouldn't land here with 1 — redirect
      localStorage.setItem("ms_member", JSON.stringify(stored[0]));
      window.location.href = "/dashboard";
      return;
    }

    setMemberships(stored);
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setLoading(true);
    localStorage.setItem("ms_member", JSON.stringify(selected));
    window.location.href = "/dashboard";
  };

  const handleSignOut = () => {
    localStorage.removeItem("ms_member");
    localStorage.removeItem("ms_memberships");
    window.location.href = "/";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="wrap">

          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="logo-name">Member<span>Sync</span></span>
          </div>

          <div className="head">
            <div className="eyebrow">Multiple Memberships</div>
            <h1 className="title">Which membership<br/>would you like to view?</h1>
            <p className="sub">You have {memberships.length} active memberships. Pick one to continue.</p>
          </div>

          <div className="list">
            {memberships.map((m, i) => (
              <button
                key={m.membership_id}
                className={`mcard${selected?.membership_id===m.membership_id?" sel":""}`}
                onClick={() => setSelected(m)}
              >
                <div className="mcard-av">{orgInitials(m.organization_name)}</div>

                <div className="mcard-body">
                  <div className="mcard-org">{m.organization_name || "Organization"}</div>
                  <div className="mcard-meta">
                    <span className="mcard-id">{m.membership_id}</span>
                    <span className="mcard-sep"/>
                    <span className="mcard-type">{m.type || "Standard"}</span>
                  </div>
                </div>

                <div className="mcard-right">
                  <div className={`status-pill ${m.status||"inactive"}`}>
                    <div className="sdot"/>
                    {m.status==="active"?"Active":m.status==="expired"?"Expired":"Inactive"}
                  </div>
                  {m.expiration && (
                    <div className="exp-date">Expires {fmtDate(m.expiration)}</div>
                  )}
                </div>

                <div className="check-circle">
                  <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              </button>
            ))}
          </div>

          <button className="btn" disabled={!selected || loading} onClick={handleContinue}>
            <span className="btn-inner">
              {loading
                ? <><div className="spinner"/>Loading dashboard…</>
                : selected
                  ? <>Continue as {selected.organization_name} member →</>
                  : <>Select a membership to continue</>
              }
            </span>
          </button>

          <p className="foot">
            Not you? <button className="lbtn" onClick={handleSignOut}>Sign out</button>
          </p>
        </div>
      </div>
    </>
  );
}