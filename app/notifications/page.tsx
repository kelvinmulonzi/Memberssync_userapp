"use client";
import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:5000/api/v1";

// Only show these types to members — bulk_email/bulk_sms are admin logs
const MEMBER_TYPES = ["prepaid_usage","prepaid_recharge","info","warning","success","emergency","checkin","renewal"];

/* ─────────────────────────── STYLES ─────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --black:#09090b; --surface:#111113; --surface2:#18181b; --surface3:#1f1f23;
    --border:#27272a; --text:#f4f0e8; --text-muted:#71717a; --text-faint:#3f3f46;
    --gold:#c8a96e; --gold-light:#e0c48a; --gold-dim:rgba(200,169,110,.10); --gold-dim2:rgba(200,169,110,.06);
    --red:#ef4444; --red-dim:rgba(239,68,68,.08);
    --green:#22c55e; --green-dim:rgba(34,197,94,.08);
    --blue:#60a5fa; --blue-dim:rgba(96,165,250,.08);
    --yellow:#eab308; --yellow-dim:rgba(234,179,8,.09);
    --orange:#f97316; --orange-dim:rgba(249,115,22,.08);
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
  .upill { background:var(--gold); color:var(--black); border-radius:20px; padding:1px 7px; font-size:11px; font-weight:700; margin-left:auto; }

  /* MAIN */
  .main { padding:48px 56px; max-width:820px; }
  .eyebrow { font-size:11px; font-weight:500; letter-spacing:3px; text-transform:uppercase; color:var(--gold); display:flex; align-items:center; gap:8px; margin-bottom:10px; animation:fadeUp .35s ease both; }
  .eyebrow::before { content:''; width:18px; height:1px; background:var(--gold); }
  .hrow { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:32px; flex-wrap:wrap; gap:12px; animation:fadeUp .35s .04s ease both; }
  .page-title { font-family:'Syne',sans-serif; font-size:34px; font-weight:800; letter-spacing:-1.5px; line-height:1; }
  .page-sub { font-size:14px; color:var(--text-muted); margin-top:6px; font-weight:300; }
  .hact { display:flex; align-items:center; gap:10px; }

  .live-pill { display:inline-flex; align-items:center; gap:7px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; }
  .live-pill.on  { background:var(--green-dim); border:1px solid rgba(34,197,94,.2); color:var(--green); }
  .live-pill.off { background:var(--surface2); border:1px solid var(--border); color:var(--text-faint); }
  .ldot { width:7px; height:7px; border-radius:50%; background:currentColor; animation:pulse 2s ease-in-out infinite; }
  .live-pill.off .ldot { animation:none; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  .btn-mark { display:flex; align-items:center; gap:7px; background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:8px 16px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500; color:var(--text-muted); cursor:pointer; transition:all .15s; }
  .btn-mark:hover { border-color:var(--gold); color:var(--gold); }
  .btn-mark:disabled { opacity:.4; cursor:not-allowed; }
  .btn-mark svg { width:14px; height:14px; }

  /* Stats */
  .stats { display:flex; gap:14px; margin-bottom:28px; flex-wrap:wrap; animation:fadeUp .4s .1s ease both; }
  .sc { display:flex; align-items:center; gap:10px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 20px; }
  .sc svg { width:15px; height:15px; color:var(--gold); flex-shrink:0; }
  .sc-n { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; letter-spacing:-1px; line-height:1; }
  .sc-n.hi { color:var(--gold); }
  .sc-l { font-size:11px; color:var(--text-muted); margin-top:2px; }

  /* Filter tabs */
  .frow { margin-bottom:20px; animation:fadeUp .4s .13s ease both; }
  .ftabs { display:flex; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px; flex-wrap:wrap; }
  .ft { padding:7px 14px; font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif; background:none; border:none; border-radius:7px; color:var(--text-muted); cursor:pointer; transition:all .15s; white-space:nowrap; display:flex; align-items:center; gap:6px; }
  .ft.active { background:var(--gold); color:var(--black); font-weight:600; }
  .ft:hover:not(.active) { color:var(--text); }
  .fdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
  .ft.active .fdot { background:rgba(0,0,0,.5); }
  .fcnt { background:var(--gold-dim); color:var(--gold); border-radius:10px; padding:0 5px; font-size:10px; font-weight:700; }
  .ft.active .fcnt { background:rgba(0,0,0,.2); color:var(--black); }

  /* Error */
  .err { background:var(--red-dim); border:1px solid rgba(239,68,68,.2); border-radius:10px; padding:14px 18px; font-size:13px; color:var(--red); display:flex; align-items:center; gap:10px; margin-bottom:24px; }
  .err svg { width:15px; height:15px; flex-shrink:0; }

  /* Notification list */
  .nlist { display:flex; flex-direction:column; gap:2px; animation:fadeUp .4s .16s ease both; }
  .dsep { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--text-faint); padding:20px 2px 10px; }
  .dsep:first-child { padding-top:0; }

  /* Card */
  .ncard { display:grid; grid-template-columns:44px 1fr 10px; gap:14px; align-items:flex-start; padding:16px 18px; border-radius:12px; border:1px solid transparent; cursor:pointer; transition:background .12s,border-color .12s; }
  .ncard.unread { background:var(--surface); border-color:var(--border); }
  .ncard.read   { background:var(--surface2); border-color:var(--border); opacity:0.75; }
  .ncard.read:hover { opacity:1; }
  .ncard:hover  { background:var(--surface2) !important; border-color:rgba(200,169,110,.2) !important; }

  /* Icon */
  .nicon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .nicon svg { width:19px; height:19px; }
  .nicon.prepaid_usage    { background:var(--red-dim);    color:var(--red);    }
  .nicon.prepaid_recharge { background:var(--green-dim);  color:var(--green);  }
  .nicon.info             { background:var(--blue-dim);   color:var(--blue);   }
  .nicon.success          { background:var(--green-dim);  color:var(--green);  }
  .nicon.warning          { background:var(--yellow-dim); color:var(--yellow); }
  .nicon.emergency        { background:var(--red-dim);    color:var(--red);    }
  .nicon.checkin          { background:var(--gold-dim);   color:var(--gold);   }
  .nicon.renewal          { background:var(--orange-dim); color:var(--orange); }
  .nicon.def              { background:var(--surface3);   color:var(--text-muted); }

  /* Parsed prepaid */
  .n-amount { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; letter-spacing:-1px; line-height:1; margin-bottom:3px; }
  .n-amount.debit  { color:var(--red); }
  .n-amount.credit { color:var(--green); }
  .n-service { font-size:14px; font-weight:500; color:var(--text); margin-bottom:3px; }
  .ncard.read .n-service { color:var(--text-muted); }
  .n-balance { font-size:12px; color:var(--text-muted); margin-bottom:5px; }
  .n-balance strong { color:var(--text); font-weight:500; }

  /* Raw message */
  .n-msg { font-size:14px; color:var(--text); line-height:1.55; margin-bottom:6px; }
  .ncard.read .n-msg { color:var(--text-muted); }

  /* Meta row */
  .nmeta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:4px; }
  .ntime { font-size:11px; color:var(--text-faint); }
  .nbadge { padding:3px 8px; border-radius:10px; font-size:10px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; }
  .nbadge.prepaid_usage    { background:var(--red-dim);    color:var(--red);    }
  .nbadge.prepaid_recharge { background:var(--green-dim);  color:var(--green);  }
  .nbadge.info             { background:var(--blue-dim);   color:var(--blue);   }
  .nbadge.success          { background:var(--green-dim);  color:var(--green);  }
  .nbadge.warning          { background:var(--yellow-dim); color:var(--yellow); }
  .nbadge.emergency        { background:var(--red-dim);    color:var(--red);    }
  .nbadge.checkin          { background:var(--gold-dim);   color:var(--gold);   }
  .nbadge.renewal          { background:var(--orange-dim); color:var(--orange); }
  .nbadge.def              { background:var(--surface3);   color:var(--text-muted); }
  .nread-lbl { font-size:11px; color:var(--green); display:flex; align-items:center; gap:4px; }
  .nread-lbl svg { width:11px; height:11px; }

  /* Unread dot */
  .udot { width:8px; height:8px; border-radius:50%; background:var(--gold); margin-top:8px; flex-shrink:0; animation:pulse 2s ease-in-out infinite; }

  /* New arrival */
  @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .ncard.new-in { animation:slideIn .35s ease both; }

  /* Empty */
  .empty { padding:60px 24px; text-align:center; }
  .empty-icon { width:52px; height:52px; border-radius:14px; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; margin:0 auto 14px; color:var(--text-faint); }
  .empty-icon svg { width:22px; height:22px; }
  .empty-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; margin-bottom:6px; }
  .empty-sub { font-size:13px; color:var(--text-muted); }

  /* Skeleton */
  .sk { background:linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%); background-size:200% 100%; border-radius:6px; animation:shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

  /* Toast */
  .twrap { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:99; pointer-events:none; }
  .toast { display:flex; align-items:center; gap:10px; padding:12px 20px; border-radius:10px; font-size:13px; font-weight:500; animation:toastIn .3s ease both; pointer-events:auto; min-width:200px; }
  .toast.s { background:rgba(34,197,94,.12); border:1px solid rgba(34,197,94,.25); color:var(--green); }
  .toast.e { background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.25); color:var(--red); }
  .toast svg { width:14px; height:14px; flex-shrink:0; }
  @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  @media(max-width:768px){
    .page-root{grid-template-columns:1fr} .sidebar{display:none}
    .main{padding:28px 20px 60px; max-width:100%}
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
const ICheck2  = ()=><I d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>;
const IBell    = ()=><I d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>;
const IShield  = ()=><I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const ILogout  = ()=><I d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const ICheckV  = ()=><I d="M20 6 9 17l-5-5" strokeWidth="2.5"/>;
const IAlert   = ()=><I d={<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>}/>;
const IInfo    = ()=><I d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>}/>;
const IWarn    = ()=><I d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>;
const IEmerg   = ()=><I d={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>}/>;
const IMinus   = ()=><I d="M5 12h14" strokeWidth="2.2"/>;
const IPlus    = ()=><I d="M12 5v14M5 12h14" strokeWidth="2.2"/>;
const IRefresh = ()=><I d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>;
const IWifi    = ()=><I d={<><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></>}/>;
const IOk      = ()=><I d={<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>}/>;

/* ── Helpers ── */
const fmtDT = s=>{ try{ return new Date(s).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}); }catch{ return s||""; }};
const dayLabel = s=>{
  try{
    const d=new Date(s); const n=new Date(); const y=new Date(); y.setDate(y.getDate()-1);
    if(d.toDateString()===n.toDateString()) return "Today";
    if(d.toDateString()===y.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-GB",{weekday:"long",day:"2-digit",month:"long",year:"numeric"});
  }catch{ return s; }
};
const initials = (n="")=>n.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");

/* ── Parse prepaid messages into structured data ── */
const parseMsg = (msg="", type="")=>{
  // Deduction: "Hello kelvin, XAF10.10 has been deducted ... for Gym Monthly Pass (includes XAF0.10 service fee). Remaining balance: XAF87.66."
  const usage = msg.match(/([A-Z]{2,4}[\d.,]+)\s+has been deducted.*?for\s+(.+?)\s+\(includes.*?Remaining balance:\s*([A-Z]{2,4}[\d.,]+)/i);
  if (usage) return { kind:"debit",  amount:usage[1], service:usage[2].trim(), balance:usage[3] };

  // Recharge: "your prepaid card has been recharged with XAF122.00. New balance: XAF122.00."
  const rech = msg.match(/recharged with\s+([A-Z]{2,4}[\d.,]+).*?New balance:\s*([A-Z]{2,4}[\d.,]+)/i);
  if (rech)  return { kind:"credit", amount:rech[1],  service:"Wallet Recharge", balance:rech[2] };

  return null;
};

/* ── Type metadata ── */
const TC = {
  prepaid_usage:    { label:"Deduction",  icon:<IMinus />,   },
  prepaid_recharge: { label:"Recharge",   icon:<IPlus />,    },
  info:             { label:"Info",       icon:<IInfo />,    },
  success:          { label:"Success",    icon:<IOk />,      },
  warning:          { label:"Warning",    icon:<IWarn />,    },
  emergency:        { label:"Alert",      icon:<IEmerg />,   },
  checkin:          { label:"Check-in",   icon:<ICheck2 />,  },
  renewal:          { label:"Renewal",    icon:<IRefresh />, },
};

const FILTERS = [
  { key:"all",              label:"All",        dot:"var(--gold)"   },
  { key:"prepaid_usage",    label:"Deductions", dot:"var(--red)"    },
  { key:"prepaid_recharge", label:"Recharges",  dot:"var(--green)"  },
  { key:"warning",          label:"Warnings",   dot:"var(--yellow)" },
  { key:"emergency",        label:"Alerts",     dot:"var(--red)"    },
  { key:"info",             label:"Info",       dot:"var(--blue)"   },
];

/* ═════════════════ COMPONENT ═════════════════ */
export default function NotificationsPage() {
  const storedMember = typeof window!=="undefined"
    ? JSON.parse(localStorage.getItem("ms_member")||"null") : null;
  const mid = storedMember?.membership_id;

  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("all");
  const [liveOn,  setLiveOn]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [marking, setMarking] = useState(false);
  const [newIds,  setNewIds]  = useState(new Set());
  const sseRef = useRef(null);

  const showToast = (msg,type="s")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  useEffect(()=>{ if(!mid) window.location.href="/"; },[]);

  /* Fetch */
  useEffect(()=>{
    if(!mid) return;
    (async()=>{
      setLoading(true); setError("");
      try{
        const res  = await fetch(`${API_BASE}/members/${mid}/notifications`);
        const json = await res.json();
        if(!json.success) throw new Error(json.error||"Failed to load");
        // ── KEY FIX: filter out admin types (bulk_email, bulk_sms, etc.)
        const clean = (json.notifications||[]).filter(n=>MEMBER_TYPES.includes(n.type));
        setNotifs(clean);
      }catch(e){ setError(e.message); }
      finally{ setLoading(false); }
    })();
  },[mid]);

  /* SSE */
  useEffect(()=>{
    if(!mid) return;
    const es = new EventSource(`${API_BASE}/members/${mid}/notifications/stream`);
    sseRef.current=es; setLiveOn(true);
    es.onmessage=e=>{
      try{
        const d=JSON.parse(e.data);
        // Skip admin/bulk types in real-time too
        if(d.error||!MEMBER_TYPES.includes(d.type)) return;
        setNotifs(prev=>{
          if(prev.some(n=>n.id===d.id)) return prev;
          const n={...d,is_read:false,created_at:d.created_at||new Date().toISOString()};
          setNewIds(s=>new Set([...s,d.id]));
          setTimeout(()=>setNewIds(s=>{const ns=new Set(s);ns.delete(d.id);return ns;}),2000);
          showToast(TC[d.type]?.label||"New notification");
          return [n,...prev];
        });
      }catch{}
    };
    es.onerror=()=>{ es.close(); sseRef.current=null; setLiveOn(false); };
    return ()=>{ es.close(); sseRef.current=null; setLiveOn(false); };
  },[mid]);

  /* Mark single */
  const markRead = async id=>{
    setNotifs(p=>p.map(n=>n.id===id?{...n,is_read:true}:n));
    try{ await fetch(`${API_BASE}/members/${mid}/notifications/${id}/read`,{method:"POST"}); }
    catch{ setNotifs(p=>p.map(n=>n.id===id?{...n,is_read:false}:n)); }
  };

  /* Mark all */
  const markAll = async()=>{
    const ids=notifs.filter(n=>!n.is_read).map(n=>n.id);
    if(!ids.length) return;
    setMarking(true);
    setNotifs(p=>p.map(n=>({...n,is_read:true})));
    try{
      await Promise.all(ids.map(id=>fetch(`${API_BASE}/members/${mid}/notifications/${id}/read`,{method:"POST"})));
      showToast("All caught up!");
    }catch{ showToast("Some updates failed","e"); }
    finally{ setMarking(false); }
  };

  /* Derived */
  const unread   = notifs.filter(n=>!n.is_read).length;
  const filtered = filter==="all"?notifs:notifs.filter(n=>n.type===filter);
  const grouped  = filtered.reduce((acc,n)=>{ const l=dayLabel(n.created_at); (acc[l]=acc[l]||[]).push(n); return acc; },{});

  /* Skeleton */
  const Sk=({w="100%",h=14})=><div className="sk" style={{width:w,height:h}}/>;
  const SkelCard=()=>(
    <div style={{display:"grid",gridTemplateColumns:"44px 1fr",gap:14,padding:"16px 18px",borderRadius:12,background:"var(--surface)",border:"1px solid var(--border)",marginBottom:2}}>
      <div className="sk" style={{width:44,height:44,borderRadius:12}}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <Sk w="25%" h={20}/><Sk w="50%" h={13}/><Sk w="35%" h={13}/><Sk w="20%" h={10}/>
      </div>
    </div>
  );

  /* Render one card */
  const Card=({n})=>{
    const parsed  = parseMsg(n.message, n.type);
    const cfg     = TC[n.type]||{label:n.type||"?",icon:<IBell/>};
    const isNew   = newIds.has(n.id);
    const typeKey = TC[n.type] ? n.type : "def";
    return (
      <div className={`ncard ${n.is_read?"read":"unread"} ${isNew?"new-in":""}`}
        onClick={()=>!n.is_read&&markRead(n.id)}
        title={!n.is_read?"Click to mark as read":""}>

        <div className={`nicon ${typeKey}`}>{cfg.icon}</div>

        <div>
          {parsed ? (
            <>
              <div className={`n-amount ${parsed.kind}`}>
                {parsed.kind==="debit"?"−":"+"}
                {parsed.amount}
              </div>
              <div className="n-service">{parsed.service}</div>
              <div className="n-balance">
                Balance after: <strong>{parsed.balance}</strong>
              </div>
            </>
          ) : (
            <div className="n-msg">{n.message}</div>
          )}
          <div className="nmeta">
            <span className="ntime">{fmtDT(n.created_at)}</span>
            <span className={`nbadge ${typeKey}`}>{cfg.label}</span>
            {n.is_read && <span className="nread-lbl"><ICheckV/>Read</span>}
          </div>
        </div>

        {!n.is_read ? <div className="udot"/> : <div/>}
      </div>
    );
  };

  /* ── RENDER ── */
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
          {[{icon:<IDash/>,label:"Dashboard",href:"/dashboard"},{icon:<IUser/>,label:"Profile",href:"/profile"},{icon:<IWallet/>,label:"Wallet",href:"/wallet"},{icon:<ICheck2/>,label:"Check-in",href:"/checkin"}].map(n=>(
            <button key={n.label} className="ni" onClick={()=>window.location.href=n.href}>{n.icon}{n.label}</button>
          ))}
          <p className="nl" style={{marginTop:24}}>Account</p>
          {[{icon:<IBell/>,label:"Notifications",href:"/notifications",active:true},{icon:<IShield/>,label:"Membership",href:"/membership"}].map(n=>(
            <button key={n.label} className={`ni${n.active?" active":""}`} onClick={()=>window.location.href=n.href}>
              {n.icon}<span style={{flex:1}}>{n.label}</span>
              {n.active&&unread>0&&<span className="upill">{unread}</span>}
            </button>
          ))}
          <div className="sp"/>
          <button className="ni" style={{marginBottom:12,color:"var(--red)",opacity:.7}}
            onClick={()=>{sseRef.current?.close();localStorage.removeItem("ms_member");window.location.href="/";}}>
            <ILogout/>Sign Out
          </button>
          {storedMember&&(
            <div className="smc">
              <div className="smc-av">{initials(storedMember.name)}</div>
              <div><div className="smc-name">{storedMember.name}</div><div className="smc-id">{storedMember.membership_id}</div></div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="eyebrow">Member Area</div>
          <div className="hrow">
            <div>
              <h1 className="page-title">Notifications</h1>
              <p className="page-sub">Your activity, alerts and account updates</p>
            </div>
            <div className="hact">
              <div className={`live-pill ${liveOn?"on":"off"}`}>
                <div className="ldot"/>{liveOn?"Live":"Offline"}
              </div>
              <button className="btn-mark" onClick={markAll} disabled={marking||unread===0}
                title={unread===0?"No unread notifications":""}>
                <ICheckV/>Mark all read {unread>0&&`(${unread})`}
              </button>
            </div>
          </div>

          {error&&<div className="err"><IAlert/>{error}</div>}

          {!loading&&(
            <div className="stats">
              <div className="sc"><IBell/><div><div className={`sc-n${unread>0?" hi":""}`}>{unread}</div><div className="sc-l">Unread</div></div></div>
              <div className="sc"><ICheckV/><div><div className="sc-n">{notifs.filter(n=>n.is_read).length}</div><div className="sc-l">Read</div></div></div>
              <div className="sc"><IWifi/><div><div className="sc-n">{notifs.length}</div><div className="sc-l">Total</div></div></div>
            </div>
          )}

          {/* Filter tabs — only show tabs that actually have data */}
          <div className="frow">
            <div className="ftabs">
              {FILTERS.filter(f=>f.key==="all"||notifs.some(n=>n.type===f.key)).map(f=>{
                const cnt = f.key==="all" ? 0 : notifs.filter(n=>n.type===f.key&&!n.is_read).length;
                return (
                  <button key={f.key} className={`ft${filter===f.key?" active":""}`} onClick={()=>setFilter(f.key)}>
                    <span className="fdot" style={{background:filter===f.key?"rgba(0,0,0,.5)":f.dot}}/>
                    {f.label}
                    {cnt>0&&<span className="fcnt">{cnt}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          {loading ? (
            [...Array(5)].map((_,i)=><SkelCard key={i}/>)
          ) : Object.keys(grouped).length===0 ? (
            <div className="empty">
              <div className="empty-icon"><IBell/></div>
              <div className="empty-title">No notifications</div>
              <div className="empty-sub">{filter==="all"?"You're all caught up.":`No ${FILTERS.find(f=>f.key===filter)?.label||filter} notifications.`}</div>
            </div>
          ) : (
            <div className="nlist">
              {Object.entries(grouped).map(([lbl,items])=>(
                <div key={lbl}>
                  <div className="dsep">{lbl}</div>
                  {items.map(n=><Card key={n.id} n={n}/>)}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {toast&&(
        <div className="twrap">
          <div className={`toast ${toast.type}`}>
            {toast.type==="s"?<ICheckV/>:<IAlert/>}{toast.msg}
          </div>
        </div>
      )}
    </>
  );
}