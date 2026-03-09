"use client";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ||
  `http://${typeof window !== "undefined" ? window.location.hostname : "localhost"}:5000/api/v1`;


/* ─────────────────────────── STYLES ─────────────────────────── */
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
  .sidebar {
    background:var(--surface); border-right:1px solid var(--border);
    display:flex; flex-direction:column; padding:32px 0;
    position:sticky; top:0; height:100vh; overflow-y:auto;
  }
  .sidebar-logo { display:flex; align-items:center; gap:10px; padding:0 24px 32px; border-bottom:1px solid var(--border); margin-bottom:24px; }
  .sidebar-logo-icon { width:34px; height:34px; background:var(--gold); border-radius:8px; display:flex; align-items:center; justify-content:center; }
  .sidebar-logo-icon svg { width:18px; height:18px; fill:#000; }
  .sidebar-logo-name { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; letter-spacing:-0.5px; }
  .sidebar-logo-name span { color:var(--gold); }
  .nav-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); padding:0 24px 10px; }
  .nav-item {
    display:flex; align-items:center; gap:12px; padding:11px 24px;
    font-size:14px; color:var(--text-muted); cursor:pointer;
    border:none; background:none; width:100%; text-align:left;
    transition:color .15s,background .15s; position:relative;
  }
  .nav-item svg { width:17px; height:17px; flex-shrink:0; }
  .nav-item:hover { color:var(--text); background:var(--surface2); }
  .nav-item.active { color:var(--gold); background:var(--gold-dim2); }
  .nav-item.active::before { content:''; position:absolute; left:0; top:4px; bottom:4px; width:3px; background:var(--gold); border-radius:0 3px 3px 0; }
  .sidebar-spacer { flex:1; }
  .smc { margin:0 12px; background:var(--surface2); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; display:flex; align-items:center; gap:10px; }
  .smc-av { width:34px; height:34px; border-radius:50%; background:var(--gold-dim); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; color:var(--gold); flex-shrink:0; overflow:hidden; }
  .smc-av img { width:100%; height:100%; object-fit:cover; }
  .smc-name { font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .smc-id { font-size:11px; color:var(--text-muted); }

  /* MAIN */
  .main { padding:48px 56px; max-width:960px; }

  /* Page header */
  .eyebrow { font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:8px; margin-bottom:10px; animation:fadeUp .35s ease both; }
  .eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); }
  .page-title { font-family:'Syne',sans-serif; font-size:34px; font-weight:800; letter-spacing:-1.5px; color:var(--text); line-height:1; animation:fadeUp .35s .04s ease both; }
  .page-sub { font-size:14px; color:var(--text-muted); margin-top:8px; font-weight:300; animation:fadeUp .35s .08s ease both; margin-bottom:36px; }

  /* Balance cards */
  .balance-row { display:grid; grid-template-columns:1.2fr 1fr 1fr; gap:20px; margin-bottom:28px; animation:fadeUp .4s .1s ease both; }

 .bcard.primary { background:var(--text); border-color:var(--text); }
.bcard.primary::before { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; background:radial-gradient(circle,rgba(200,169,110,.15) 0%,transparent 70%); pointer-events:none; }
.bcard.primary .bc-label { color:rgba(255,255,255,.45); }
.bcard.primary .bc-amount { color:#ffffff; }
.bcard.primary .bc-amount .cur { color:rgba(255,255,255,.45); }
.bcard.primary .bc-sub { color:rgba(255,255,255,.4); }

  .bc-label { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .bc-label svg { width:13px; height:13px; color:var(--gold); }
  .bc-amount { font-family:'Syne',sans-serif; font-size:38px; font-weight:800; letter-spacing:-2px; color:var(--text); line-height:1; margin-bottom:6px; }
  .bc-amount .cur { font-size:17px; font-weight:500; color:var(--text-muted); margin-right:3px; }
  .bc-sub { font-size:12px; color:var(--text-muted); }
  .bc-stat { font-family:'Syne',sans-serif; font-size:26px; font-weight:700; letter-spacing:-1px; margin-bottom:4px; }
  .bc-stat.green { color:var(--green); }
  .bc-stat.red   { color:var(--red); }

  /* Error banner */
  .err-banner { background:var(--red-dim); border:1px solid rgba(239,68,68,.2); border-radius:10px; padding:14px 18px; font-size:13px; color:var(--red); display:flex; align-items:center; gap:10px; margin-bottom:24px; animation:fadeUp .3s ease both; }
  .err-banner svg { width:15px; height:15px; flex-shrink:0; }

  /* Filter row */
  .filter-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; animation:fadeUp .4s .15s ease both; }
  .filter-tabs { display:flex; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; }
  .ftab { padding:8px 16px; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; background:none; border:none; border-radius:7px; color:var(--text-muted); cursor:pointer; transition:all .15s; white-space:nowrap; }
  .ftab.active { background:var(--gold); color:var(--black); font-weight:600; }
  .ftab:hover:not(.active) { color:var(--text); }
  .tx-count { font-size:12px; color:var(--text-faint); }
  .tx-count strong { color:var(--text-muted); }

  /* Transaction list */
  .tx-list { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; animation:fadeUp .4s .18s ease both; }
  .tx-head { display:grid; grid-template-columns:1fr 110px 120px 100px; gap:12px; align-items:center; padding:14px 24px; border-bottom:1px solid var(--border); font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--text-faint); }
  .tx-row { display:grid; grid-template-columns:1fr 110px 120px 100px; gap:12px; align-items:center; padding:16px 24px; border-bottom:1px solid var(--border); transition:background .12s; }
  .tx-row:last-child { border-bottom:none; }
  .tx-row:hover { background:var(--surface2); }
  .tx-left { display:flex; align-items:center; gap:14px; min-width:0; }
  .tx-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .tx-icon svg { width:16px; height:16px; }
  .tx-icon.recharge  { background:var(--green-dim);  color:var(--green); }
  .tx-icon.deduction { background:var(--red-dim);    color:var(--red);   }
  .tx-icon.usage     { background:var(--blue-dim);   color:var(--blue);  }
  .tx-icon.renewal   { background:var(--orange-dim); color:var(--orange);}
  .tx-icon.other     { background:var(--surface3);   color:var(--text-muted); }
  .tx-desc { font-size:14px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tx-date { font-size:11px; color:var(--text-faint); margin-top:2px; }
  .tx-badge { padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .tx-badge.recharge  { background:var(--green-dim);  color:var(--green); }
  .tx-badge.deduction { background:var(--red-dim);    color:var(--red);   }
  .tx-badge.usage     { background:var(--blue-dim);   color:var(--blue);  }
  .tx-badge.renewal   { background:var(--orange-dim); color:var(--orange);}
  .tx-badge.other     { background:var(--surface3);   color:var(--text-muted); }
  .tx-bal { font-size:13px; color:var(--text-muted); text-align:right; }
  .tx-bal small { font-size:10px; display:block; color:var(--text-faint); margin-bottom:2px; text-transform:uppercase; letter-spacing:.5px; }
  .tx-amt { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; text-align:right; letter-spacing:-.5px; }
  .tx-amt.credit { color:var(--green); }
  .tx-amt.debit  { color:var(--red); }

  /* Empty */
  .empty { padding:56px 24px; text-align:center; }
  .empty-icon { width:52px; height:52px; border-radius:14px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--text-faint); }
  .empty-icon svg { width:22px; height:22px; }
  .empty-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:var(--text); margin-bottom:5px; }
  .empty-sub { font-size:13px; color:var(--text-muted); }

  /* Skeleton */
  .sk { background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%); background-size:200% 100%; border-radius:6px; animation:shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  
  .mobile-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); z-index:50; }
.mobile-nav-row { display:flex; justify-content:space-around; padding:8px 0 max(env(safe-area-inset-bottom),8px); }
.mn { display:flex; flex-direction:column; align-items:center; gap:3px; padding:6px 12px; border:none; background:none; cursor:pointer; color:var(--text-faint); font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600; letter-spacing:.3px; transition:color .14s; }
.mn svg { width:19px; height:19px; }
.mn.on { color:var(--gold); }

  
  @media(max-width:768px){
    .page-root{grid-template-columns:1fr} .sidebar{display:none}
    .main{padding:28px 20px 80px; max-width:100%}
    .mobile-nav{ display:block }
    .balance-row{grid-template-columns:1fr}
    .tx-head{display:none}
    .tx-row{grid-template-columns:1fr auto}
    .tx-badge,.tx-bal{display:none}
  }
`;

/* ── Icons ── */
const I = ({ d, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d === "string" ? <path d={d}/> : d}
  </svg>
);
const IUser    = ()=><I d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IDash    = ()=><I d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}/>;
const IWallet  = ()=><I d={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>}/>;
const ICheckin = ()=><I d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>;
const IBell    = ()=><I d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>;
const IShield  = ()=><I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const ILogout  = ()=><I d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IPlus    = ()=><I d="M12 5v14M5 12h14" strokeWidth="2.2"/>;
const IMinus   = ()=><I d="M5 12h14" strokeWidth="2.2"/>;
const IRefresh = ()=><I d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>;
const ITx      = ()=><I d={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/></>}/>;
const ICoins   = ()=><I d={<><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/></>}/>;
const IActivity= ()=><I d="M22 12h-4l-3 9L9 3l-3 9H2"/>;
const IAlert   = ()=><I d={<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>}/>;

/* ── Helpers ── */
const fmtAmt = n => Math.abs(n ?? 0).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDT  = s => { try { return new Date(s).toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }); } catch { return s || "—"; } };
const initials = (n="") => n.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");

const txMeta = (type="") => {
  const t = type.toLowerCase();
  if (t.includes("recharge")||t.includes("top")||t.includes("credit")||t.includes("deposit"))
    return { cls:"recharge",  label:"Recharge",  icon:<IPlus />,    credit:true  };
  if (t.includes("renew"))
    return { cls:"renewal",   label:"Renewal",   icon:<IRefresh />, credit:false };
  if (t.includes("usage")||t.includes("checkin")||t.includes("check"))
    return { cls:"usage",     label:"Usage",     icon:<ICheckin />, credit:false };
  if (t.includes("deduct")||t.includes("charge")||t.includes("payment")||t.includes("debit"))
    return { cls:"deduction", label:"Deduction", icon:<IMinus />,   credit:false };
  return   { cls:"other",     label:type||"Txn", icon:<ITx />,      credit:false };
};

/* ── Sidebar nav items ── */
const NAV = [
  { icon:<IDash />,    label:"Dashboard", href:"/dashboard" },
  { icon:<IUser />,    label:"Profile",   href:"/profile"   },
  { icon:<IWallet />,  label:"Wallet",    href:"/wallet",  active:true },
  { icon:<ICheckin />, label:"Check-in",  href:"/checkin"   },
];
const NAV2 = [
  { icon:<IBell />,   label:"Notifications", href:"/notifications" },
  { icon:<IShield />, label:"Membership",    href:"/membership"    },
];

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export default function WalletPage() {
  const storedMember = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("ms_member") || "null") : null;
  const membershipId = storedMember?.membership_id;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all");

  /* ── Redirect if not logged in ── */
  useEffect(() => {
    if (!membershipId) { window.location.href = "/"; return; }
    (async () => {
      setLoading(true); setError("");
      try {
        const res  = await fetch(`${API_BASE}/members/${membershipId}/prepaid`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load wallet");
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally { setLoading(false); }
    })();
  }, [membershipId]);

  /* ── Derived ── */
  // API returns: { balance: { current_balance, total_recharged, total_spent, total_bonus_earned }, transactions: [] }
  const allTx    = data?.transactions ?? [];
  const balObj   = data?.balance ?? {};

  const balance   = balObj.current_balance ?? 0;
  const totalIn   = balObj.total_recharged ?? 0;
  const totalOut  = balObj.total_spent     ?? 0;
  const bonusEarned = balObj.total_bonus_earned ?? 0;

  // Sniff currency symbol from transaction descriptions (e.g. "XAF10.10 has been deducted...")
  const currency = (() => {
    for (const t of allTx) {
      const m = (t.description || "").match(/([A-Z]{2,4})\d/);
      if (m) return m[1];
    }
    return "XAF";
  })();


  const filtered = filter === "all" ? allTx
    : allTx.filter(t => txMeta(t.transaction_type).cls === filter);

  /* ── Skeleton ── */
  const Sk = ({w="100%",h=18}) => <div className="sk" style={{width:w,height:h}}/>;
  const SkelRow = () => (
    <div className="tx-row">
      <div className="tx-left">
        <div className="sk" style={{width:38,height:38,borderRadius:10,flexShrink:0}}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
          <Sk w="55%" h={14}/><Sk w="30%" h={11}/>
        </div>
      </div>
      <Sk w={60} h={14}/><Sk w={70} h={14}/><Sk w={80} h={18}/>
    </div>
  );

  /* ─────────────── RENDER ─────────────── */
  return (
    <>
      <style>{styles}</style>
      <div className="page-root">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span className="sidebar-logo-name">Member<span>Sync</span></span>
          </div>

          <p className="nav-label">Main</p>
          {NAV.map(n=>(
            <button key={n.label} className={`nav-item${n.active?" active":""}`}
              onClick={()=>window.location.href=n.href}>
              {n.icon}{n.label}
            </button>
          ))}
          <p className="nav-label" style={{marginTop:24}}>Account</p>
          {NAV2.map(n=>(
            <button key={n.label} className="nav-item" onClick={()=>window.location.href=n.href}>
              {n.icon}{n.label}
            </button>
          ))}
          <div className="sidebar-spacer"/>
          <button className="nav-item" style={{marginBottom:12,color:"var(--red)",opacity:.7}}
            onClick={()=>{localStorage.removeItem("ms_member");window.location.href="/";}}>
            <ILogout/> Sign Out
          </button>
          {storedMember && (
            <div className="smc">
              <div className="smc-av">{initials(storedMember.name)}</div>
              <div><div className="smc-name">{storedMember.name}</div><div className="smc-id">{storedMember.membership_id}</div></div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          <div className="eyebrow">Member Area</div>
          <h1 className="page-title">Prepaid Wallet</h1>
          <p className="page-sub">Your balance and the last 20 transactions</p>

          {error && (
            <div className="err-banner"><IAlert/>{error}</div>
          )}

          {/* Balance cards */}
          <div className="balance-row">
            {/* Main */}
            <div className="bcard primary">
              <div className="bc-label"><ICoins/> Current Balance</div>
              {loading ? <Sk w="70%" h={44}/> : (
                <>
                  <div className="bc-amount"><span className="cur">{currency}</span>{fmtAmt(balance)}</div>
                  <div className="bc-sub">Available to spend</div>
                </>
              )}
            </div>
            {/* Total in */}
            <div className="bcard">
              <div className="bc-label"><IPlus/> Total Loaded</div>
              {loading ? <Sk w="60%" h={32}/> : (
                <>
                  <div className="bc-stat green">{currency} {fmtAmt(totalIn)}</div>
                  <div className="bc-sub">Total recharged across all time</div>
                </>
              )}
            </div>
            {/* Total out */}
            <div className="bcard">
              <div className="bc-label"><IActivity/> Total Spent</div>
              {loading ? <Sk w="60%" h={32}/> : (
                <>
                  <div className="bc-stat red">{currency} {fmtAmt(totalOut)}</div>
                  <div className="bc-sub">Total spent across all time</div>
                </>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="filter-row">
            <div className="filter-tabs">
              {["all","recharge","usage","deduction","renewal"].map(f=>(
                <button key={f} className={`ftab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </button>
              ))}
            </div>
            <div className="tx-count"><strong>{filtered.length}</strong> transaction{filtered.length!==1?"s":""}</div>
          </div>

          {/* Transaction list */}
          <div className="tx-list">
            <div className="tx-head">
              <span>Description</span>
              <span>Type</span>
              <span style={{textAlign:"right"}}>Balance After</span>
              <span style={{textAlign:"right"}}>Amount</span>
            </div>

            {loading ? [...Array(6)].map((_,i)=><SkelRow key={i}/>)
            : filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon"><ITx/></div>
                <div className="empty-title">No transactions yet</div>
                <div className="empty-sub">No {filter==="all"?"":filter+" "}transactions found.</div>
              </div>
            ) : filtered.map((tx,i) => {
              const m = txMeta(tx.transaction_type);
              return (
                <div className="tx-row" key={i}>
                  <div className="tx-left">
                    <div className={`tx-icon ${m.cls}`}>{m.icon}</div>
                    <div>
                      <div className="tx-desc">{tx.description || "Transaction"}</div>
                      <div className="tx-date">{fmtDT(tx.transaction_date)}</div>
                    </div>
                  </div>
                  <span className={`tx-badge ${m.cls}`}>{m.label}</span>
                  <div className="tx-bal">
                    <small>After</small>
                    {currency} {fmtAmt(tx.balance_after)}
                  </div>
                  <div className={`tx-amt ${m.credit?"credit":"debit"}`}>
                    {m.credit?"+":"−"}{currency} {fmtAmt(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
          <nav className="mobile-nav">
  <div className="mobile-nav-row">
    {[
      {icon:<IDash/>,    label:"Home",    href:"/dashboard"},
      {icon:<IWallet/>,  label:"Wallet",  href:"/wallet",  on:true},
      {icon:<ICheckin/>, label:"Visits",  href:"/checkin"},
      {icon:<IBell/>,    label:"Alerts",  href:"/notifications"},
      {icon:<IUser/>,    label:"Profile", href:"/profile"},
    ].map(item=>(
      <button key={item.label} className={`mn${item.on?" on":""}`}
        onClick={()=>window.location.href=item.href}>
        {item.icon}{item.label}
      </button>
    ))}
  </div>
</nav>
        
          
        </main>
      </div>
    </>
  );
}