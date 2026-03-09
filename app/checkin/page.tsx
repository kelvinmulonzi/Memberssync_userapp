"use client";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ||
  `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000/api/v1`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

 :root {
  --black:#f7f6f3; --surface:#ffffff; --surface2:#f7f6f3; --surface3:#f0ede8;
  --border:#e8e6e1; --text:#1a1a18; --text-muted:#7a7870; --text-faint:#b8b5ae;
  --gold:#c8a96e; --gold-light:#e0c48a; --gold-dim:rgba(200,169,110,0.09); --gold-dim2:rgba(200,169,110,0.06);
  --red:#c0392b; --red-dim:rgba(192,57,43,0.07);
  --green:#2a7d4f; --green-dim:rgba(42,125,79,0.08);
  --blue:#2563a8; --blue-dim:rgba(37,99,168,0.08);
  --orange:#c2610c; --orange-dim:rgba(194,97,12,0.08);
  --radius:14px; --radius-sm:8px;
}

  body, .page-root { font-family:'DM Sans',sans-serif; background:var(--black); color:var(--text); min-height:100vh; }
  .page-root { display:grid; grid-template-columns:260px 1fr; min-height:100vh; }

  /* SIDEBAR */
  .sidebar { background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:32px 0; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .sl { display:flex; align-items:center; gap:10px; padding:0 24px 32px; border-bottom:1px solid var(--border); margin-bottom:24px; }
  .sl-icon { width:34px; height:34px; background:var(--gold); border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .sl-icon svg { width:18px; height:18px; fill:#000; }
  .sl-name { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; letter-spacing:-.5px; }
  .sl-name span { color:var(--gold); }
  .nl { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); padding:0 24px 10px; }
  .ni { display:flex; align-items:center; gap:12px; padding:11px 24px; font-size:14px; color:var(--text-muted); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:color .15s,background .15s; position:relative; }
  .ni svg { width:17px; height:17px; flex-shrink:0; }
  .ni:hover { color:var(--text); background:var(--surface2); }
  .ni.active { color:var(--gold); background:var(--gold-dim2); }
  .ni.active::before { content:''; position:absolute; left:0; top:4px; bottom:4px; width:3px; background:var(--gold); border-radius:0 3px 3px 0; }
  .sp { flex:1; }
  .smc { margin:0 12px; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; display:flex; align-items:center; gap:10px; }
  .smc-av { width:34px; height:34px; border-radius:50%; background:var(--gold-dim); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; color:var(--gold); flex-shrink:0; }
  .smc-name { font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .smc-id { font-size:11px; color:var(--text-muted); }

  /* MAIN */
  .main { padding:48px 56px; max-width:860px; }
  .eyebrow { font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:8px; margin-bottom:10px; animation:fadeUp .35s ease both; }
  .eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); }
  .page-title { font-family:'Syne',sans-serif; font-size:34px; font-weight:800; letter-spacing:-1.5px; line-height:1; animation:fadeUp .35s .04s ease both; }
  .page-sub { font-size:14px; color:var(--text-muted); margin-top:8px; font-weight:300; margin-bottom:36px; animation:fadeUp .35s .08s ease both; }

  /* Currently inside banner */
  .inside-banner {
    background: linear-gradient(135deg, #0c1a0e 0%, #0f1f10 60%, #111113 100%);
    border: 1px solid rgba(34,197,94,.3);
    border-radius: var(--radius);
    padding: 24px 28px;
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 28px;
    position: relative; overflow: hidden;
    animation: fadeUp .4s .08s ease both;
  }
  .inside-banner::before {
    content:''; position:absolute; top:-50px; right:-50px;
    width:180px; height:180px;
    background:radial-gradient(circle,rgba(34,197,94,.08) 0%,transparent 70%);
    pointer-events:none;
  }
  .pulse-ring {
    width:50px; height:50px; border-radius:50%;
    background:var(--green-bright); border:2px solid rgba(34,197,94,.35);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; color:var(--green); position:relative;
  }
  .pulse-ring svg { width:22px; height:22px; }
  .pulse-ring::after {
    content:''; position:absolute; inset:-7px; border-radius:50%;
    border:2px solid rgba(34,197,94,.2);
    animation:ripple 2s ease-out infinite;
  }
  @keyframes ripple { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.6);opacity:0} }
  .inside-text {}
  .inside-label { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--green); margin-bottom:4px; }
  .inside-since { font-size:14px; color:var(--text-muted); }
  .inside-since strong { color:var(--text); }

  /* Stats */
  .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; animation:fadeUp .4s .12s ease both; }
  .scard { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:22px 24px; }
  .scard-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); margin-bottom:12px; display:flex; align-items:center; gap:7px; }
  .scard-label svg { width:13px; height:13px; color:var(--gold); }
  .scard-num { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; letter-spacing:-1.5px; color:var(--text); line-height:1; }
  .scard-sub { font-size:12px; color:var(--text-muted); margin-top:5px; }

  /* Filter tabs */
  .frow { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; animation:fadeUp .4s .15s ease both; }
  .ftabs { display:flex; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; }
  .ft { padding:7px 16px; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; background:none; border:none; border-radius:7px; color:var(--text-muted); cursor:pointer; transition:all .15s; white-space:nowrap; }
  .ft.active { background:var(--gold); color:var(--black); font-weight:600; }
  .ft:hover:not(.active) { color:var(--text); }
  .visit-count { font-size:12px; color:var(--text-faint); }
  .visit-count strong { color:var(--text-muted); }

  /* History list */
  .hlist { display:flex; flex-direction:column; gap:2px; animation:fadeUp .4s .18s ease both; }

  /* Date separator */
  .dsep { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); padding:20px 2px 10px; }
  .dsep:first-child { padding-top:0; }

  /* Visit row */
  .vrow {
    display:grid; grid-template-columns:48px 1fr auto auto;
    gap:16px; align-items:center;
    padding:18px 22px; border-radius:12px;
    background:var(--surface); border:1px solid var(--border);
    transition:background .12s, border-color .12s;
  }
  .vrow:hover { background:var(--surface2); border-color:rgba(200,169,110,.12); }

  /* Status icon */
  .vicon { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .vicon svg { width:20px; height:20px; }
  .vicon.checked_in  { background:var(--green-dim);  color:var(--green);  }
  .vicon.checked_out { background:var(--blue-dim);   color:var(--blue);   }
  .vicon.unknown     { background:var(--surface3);   color:var(--text-muted); }

  /* Visit info */
  .vinfo {}
  .vservice {
    font-size:15px; font-weight:500; color:var(--text); margin-bottom:5px;
  }
  .vtimes {
    display:flex; align-items:center; gap:8px; flex-wrap:wrap;
    font-size:12px; color:var(--text-muted);
  }
  .vtimes svg { width:12px; height:12px; color:var(--text-faint); }
  .vtime-in  { color:var(--text-muted); }
  .vtime-sep { color:var(--text-faint); }
  .vtime-out { color:var(--text-muted); }
  .vtime-still { font-size:11px; color:var(--green); font-weight:500; }

  /* Duration pill */
  .vdur {
    font-size:12px; color:var(--text-faint);
    background:var(--surface2); border:1px solid var(--border);
    padding:4px 10px; border-radius:20px; white-space:nowrap;
  }
  .vdur.live { color:var(--green); border-color:rgba(34,197,94,.2); background:var(--green-dim); }

  /* Status badge */
  .vstatus { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:.3px; text-transform:uppercase; white-space:nowrap; }
  .vstatus.checked_in  { background:var(--green-dim); color:var(--green); border:1px solid rgba(34,197,94,.2); }
  .vstatus.checked_out { background:var(--blue-dim);  color:var(--blue);  border:1px solid rgba(96,165,250,.2); }
  .vstatus.unknown     { background:var(--surface3);  color:var(--text-muted); border:1px solid var(--border); }

  /* Error */
  .err { background:var(--red-dim); border:1px solid rgba(239,68,68,.2); border-radius:10px; padding:14px 18px; font-size:13px; color:var(--red); display:flex; align-items:center; gap:10px; margin-bottom:24px; }
  .err svg { width:15px; height:15px; flex-shrink:0; }

  /* Empty */
  .empty { padding:60px 24px; text-align:center; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); }
  .empty-icon { width:52px; height:52px; border-radius:14px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--text-faint); }
  .empty-icon svg { width:22px; height:22px; }
  .empty-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:6px; }
  .empty-sub { font-size:13px; color:var(--text-muted); }

  /* Skeleton */
  .sk { background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%); background-size:200% 100%; border-radius:6px; animation:shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:768px){
    .page-root{grid-template-columns:1fr} .sidebar{display:none}
    .main{padding:28px 20px 60px; max-width:100%}
    .stats-row{grid-template-columns:1fr 1fr}
    .vrow{grid-template-columns:48px 1fr auto}
    .vdur{display:none}
  }
`;

/* ── Icons ── */
const I = ({d,...p})=>(
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d==="string"?<path d={d}/>:d}
  </svg>
);
const IUser    = ()=><I d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IDash    = ()=><I d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}/>;
const IWallet  = ()=><I d={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>}/>;
const ICheckin = ()=><I d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>;
const IBell    = ()=><I d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>;
const IShield  = ()=><I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const ILogout  = ()=><I d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IAlert   = ()=><I d={<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>}/>;
const IClock   = ()=><I d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const IHistory = ()=><I d={<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>;
const ILogIn   = ()=><I d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>;
const ILogOut2 = ()=><I d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IMapPin  = ()=><I d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>;

/* ── Helpers ── */
const fmtDT  = s=>{ try{ return new Date(s).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); }catch{ return s||"—"; }};
const fmtDate= s=>{ try{ return new Date(s).toLocaleDateString("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric"}); }catch{ return s||"—"; }};
const fmtTime= s=>{ try{ return new Date(s).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}); }catch{ return ""; }};
const isToday    = s=>{ try{ return new Date(s).toDateString()===new Date().toDateString(); }catch{ return false; }};
const isYesterday= s=>{ try{ const y=new Date();y.setDate(y.getDate()-1); return new Date(s).toDateString()===y.toDateString(); }catch{ return false; }};
const dayLabel   = s=>{ if(isToday(s)) return "Today"; if(isYesterday(s)) return "Yesterday"; return fmtDate(s); };
const initials   = (n="")=>n.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");

const calcDuration = (start, end) => {
  try {
    const ms = new Date(end) - new Date(start);
    if (isNaN(ms) || ms <= 0) return null;
    const h = Math.floor(ms/3600000);
    const m = Math.floor((ms%3600000)/60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  } catch { return null; }
};

/* ── Status normaliser ── */
// API returns status: "checked_in" | "checked_out" | null/""
const normaliseStatus = (h) => {
  if (h.status === "checked_in"  || (!h.checkout_time && !h.status)) return "checked_in";
  if (h.status === "checked_out" || h.checkout_time)                  return "checked_out";
  return "unknown";
};

/* ═════════════════ COMPONENT ═════════════════ */
export default function CheckinPage() {
  const storedMember = typeof window!=="undefined"
    ? JSON.parse(localStorage.getItem("ms_member")||"null") : null;
  const mid  = storedMember?.membership_id;
  const name = storedMember?.name || "Member";

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all");

  useEffect(()=>{ if(!mid) window.location.href="/"; },[]);

  useEffect(()=>{
    if(!mid) return;
    (async()=>{
      setLoading(true); setError("");
      try {
        const res  = await fetch(`${API_BASE}/members/${mid}/checkins`);
        const json = await res.json();
        if(!json.success) throw new Error(json.error||"Failed to load history");
        setHistory(json.history||[]);
      } catch(e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  },[mid]);

  /* ── Derived ── */
  // Currently inside = most recent record has status "checked_in" and no checkout_time
  const currentSession = history[0]?.status === "checked_in" && !history[0]?.checkout_time
    ? history[0] : null;

  const checkedOut = history.filter(h=>normaliseStatus(h)==="checked_out");
  const totalVisits = history.length;
  const liveDuration = currentSession
    ? calcDuration(currentSession.checkin_time, new Date().toISOString()) || "just now"
    : null;

  // Filter
  const filtered = filter==="all" ? history
    : history.filter(h=>normaliseStatus(h)===filter);

  // Group by date
  const grouped = filtered.reduce((acc,h)=>{
    const lbl = dayLabel(h.checkin_time);
    (acc[lbl]=acc[lbl]||[]).push(h);
    return acc;
  },{});

  /* ── Skeleton ── */
  const Sk=({w="100%",h=14})=><div className="sk" style={{width:w,height:h}}/>;
  const SkelRow=()=>(
    <div style={{display:"grid",gridTemplateColumns:"48px 1fr auto auto",gap:16,padding:"18px 22px",borderRadius:12,background:"var(--surface)",border:"1px solid var(--border)"}}>
      <div className="sk" style={{width:48,height:48,borderRadius:13}}/>
      <div style={{display:"flex",flexDirection:"column",gap:8,justifyContent:"center"}}>
        <Sk w="35%" h={15}/><Sk w="55%" h={11}/>
      </div>
      <Sk w={70} h={26} style={{borderRadius:20}}/>
      <Sk w={44} h={11}/>
    </div>
  );

  /* ─────────── RENDER ─────────── */
  return (
    <>
      <style>{styles}</style>
      <div className="page-root">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sl">
            <div className="sl-icon">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="sl-name">Member<span>Sync</span></span>
          </div>
          <p className="nl">Main</p>
          {[
            {icon:<IDash/>,    label:"Dashboard", href:"/dashboard"},
            {icon:<IUser/>,    label:"Profile",   href:"/profile"},
            {icon:<IWallet/>,  label:"Wallet",    href:"/wallet"},
            {icon:<ICheckin/>, label:"Check-ins", href:"/checkin", active:true},
          ].map(n=>(
            <button key={n.label} className={`ni${n.active?" active":""}`} onClick={()=>window.location.href=n.href}>
              {n.icon}{n.label}
            </button>
          ))}
          <p className="nl" style={{marginTop:24}}>Account</p>
          {[
            {icon:<IBell/>,   label:"Notifications", href:"/notifications"},
            {icon:<IShield/>, label:"Membership",    href:"/membership"},
          ].map(n=>(
            <button key={n.label} className="ni" onClick={()=>window.location.href=n.href}>
              {n.icon}{n.label}
            </button>
          ))}
          <div className="sp"/>
          <button className="ni" style={{marginBottom:12,color:"var(--red)",opacity:.7}}
            onClick={()=>{localStorage.removeItem("ms_member");window.location.href="/";}}>
            <ILogout/>Sign Out
          </button>
          {storedMember&&(
            <div className="smc">
              <div className="smc-av">{initials(name)}</div>
              <div><div className="smc-name">{name}</div><div className="smc-id">{mid}</div></div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="eyebrow">Member Area</div>
          <h1 className="page-title">Visit History</h1>
          <p className="page-sub">A record of your facility access — checked in by staff</p>

          {error && <div className="err"><IAlert/>{error}</div>}

          {/* Currently inside banner */}
          {currentSession && (
            <div className="inside-banner">
              <div className="pulse-ring"><ILogIn/></div>
              <div className="inside-text">
                <div className="inside-label">Currently Inside</div>
                <div className="inside-since">
                  Checked in at <strong>{fmtDT(currentSession.checkin_time)}</strong>
                  {liveDuration && <> · <strong style={{color:"var(--green)"}}>{liveDuration}</strong> ago</>}
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="stats-row">
            <div className="scard">
              <div className="scard-label"><IHistory/>Total Visits</div>
              {loading ? <Sk w="40%" h={34}/> : <div className="scard-num">{totalVisits}</div>}
              <div className="scard-sub">Last 20 records</div>
            </div>
            <div className="scard">
              <div className="scard-label"><ILogOut2/>Completed</div>
              {loading ? <Sk w="40%" h={34}/> : <div className="scard-num">{checkedOut.length}</div>}
              <div className="scard-sub">Full sessions</div>
            </div>
            <div className="scard">
              <div className="scard-label"><IMapPin/>Status</div>
              {loading ? <Sk w="60%" h={24}/> : (
                <div style={{marginTop:6}}>
                  {currentSession
                    ? <span className="vstatus checked_in">Inside</span>
                    : <span className="vstatus checked_out">Not Inside</span>}
                </div>
              )}
              <div className="scard-sub" style={{marginTop:6}}>
                {currentSession ? "Currently at facility" : "No active session"}
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="frow">
            <div className="ftabs">
              {[
                {key:"all",         label:"All"},
                {key:"checked_in",  label:"Active"},
                {key:"checked_out", label:"Completed"},
              ].map(f=>(
                <button key={f.key} className={`ft${filter===f.key?" active":""}`} onClick={()=>setFilter(f.key)}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="visit-count">
              <strong>{filtered.length}</strong> visit{filtered.length!==1?"s":""}
            </div>
          </div>

          {/* History */}
          {loading ? (
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {[...Array(5)].map((_,i)=><SkelRow key={i}/>)}
            </div>
          ) : Object.keys(grouped).length===0 ? (
            <div className="empty">
              <div className="empty-icon"><IHistory/></div>
              <div className="empty-title">No visits yet</div>
              <div className="empty-sub">
                {filter==="all"
                  ? "Your check-in history will appear here once staff check you in."
                  : `No ${filter==="checked_in"?"active":"completed"} visits found.`}
              </div>
            </div>
          ) : (
            <div className="hlist">
              {Object.entries(grouped).map(([lbl, items])=>(
                <div key={lbl}>
                  <div className="dsep">{lbl}</div>
                  {items.map((h,i)=>{
                    const st  = normaliseStatus(h);
                    const dur = calcDuration(h.checkin_time, h.checkout_time || new Date().toISOString());
                    const isLive = st==="checked_in";
                    const service = h.service_type?.trim() || "Facility";

                    return (
                      <div className="vrow" key={i}>
                        {/* Icon */}
                        <div className={`vicon ${st}`}>
                          {isLive ? <ILogIn/> : <ILogOut2/>}
                        </div>

                        {/* Info */}
                        <div className="vinfo">
                          <div className="vservice">{service}</div>
                          <div className="vtimes">
                            <IClock/>
                            <span className="vtime-in">{fmtTime(h.checkin_time)}</span>
                            {h.checkout_time ? (
                              <>
                                <span className="vtime-sep">→</span>
                                <span className="vtime-out">{fmtTime(h.checkout_time)}</span>
                              </>
                            ) : (
                              <span className="vtime-still">still inside</span>
                            )}
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className={`vstatus ${st}`}>
                          {isLive ? "Active" : "Checked Out"}
                        </span>

                        {/* Duration */}
                        <div className={`vdur${isLive?" live":""}`}>
                          {isLive ? (dur||"just now") : (dur||"—")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}