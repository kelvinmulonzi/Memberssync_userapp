"use client";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:5000/api/v1";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg:    #f7f6f3;
    --white: #ffffff;
    --border:#e8e6e1;
    --border2:#f0ede8;
    --text:  #1a1a18;
    --sub:   #7a7870;
    --faint: #b8b5ae;
    --gold:  #c8a96e;
    --gold-d:#a8894e;
    --gold-bg:rgba(200,169,110,.09);
    --gold-border:rgba(200,169,110,.22);
    --green: #2a7d4f;
    --green-bg:rgba(42,125,79,.08);
    --red:   #c0392b;
    --red-bg:rgba(192,57,43,.07);
    --blue:  #2563a8;
    --blue-bg:rgba(37,99,168,.08);
    --r: 12px;
    --r-sm: 8px;
    --shadow: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,.08);
  }

  html { scroll-behavior:smooth; }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); -webkit-font-smoothing:antialiased; }

  .layout { display:grid; grid-template-columns:240px 1fr; min-height:100vh; }

  /* ── SIDEBAR ── */
  .sidebar { background:var(--white); border-right:1px solid var(--border); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .sb-logo { display:flex; align-items:center; gap:10px; padding:26px 22px 22px; border-bottom:1px solid var(--border2); }
  .sb-mark { width:30px; height:30px; background:var(--text); border-radius:7px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sb-mark svg { width:15px; height:15px; stroke:white; fill:none; }
  .sb-logo-name { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; letter-spacing:-.4px; }
  .sb-logo-name span { color:var(--gold-d); }
  .sb-nav { padding:16px 12px; flex:1; }
  .sb-grp-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--faint); padding:12px 10px 6px; }
  .sb-item { display:flex; align-items:center; gap:9px; padding:9px 12px; border-radius:var(--r-sm); font-size:13.5px; font-weight:500; color:var(--sub); cursor:pointer; border:none; background:none; width:100%; text-align:left; transition:all .14s; position:relative; }
  .sb-item svg { width:15px; height:15px; flex-shrink:0; }
  .sb-item:hover { background:var(--bg); color:var(--text); }
  .sb-item.on { background:var(--text); color:#fff; }
  .sb-item.on svg { color:#fff; }
  .sb-badge { margin-left:auto; background:var(--gold); color:#fff; border-radius:20px; padding:1px 6px; font-size:10px; font-weight:700; }
  .sb-item.on .sb-badge { background:rgba(255,255,255,.3); }
  .sb-footer { padding:14px; border-top:1px solid var(--border2); }
  .sb-signout { display:flex; align-items:center; gap:9px; padding:8px 12px; border-radius:var(--r-sm); font-size:13px; font-weight:500; color:var(--red); cursor:pointer; border:none; background:none; width:100%; text-align:left; margin-bottom:10px; transition:background .14s; }
  .sb-signout:hover { background:var(--red-bg); }
  .sb-signout svg { width:15px; height:15px; }
  .sb-member { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:var(--r-sm); background:var(--bg); }
  .sb-av { width:32px; height:32px; border-radius:50%; background:var(--gold-bg); border:1.5px solid var(--gold-border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:12px; color:var(--gold-d); flex-shrink:0; overflow:hidden; }
  .sb-av img { width:100%; height:100%; object-fit:cover; }
  .sb-mname { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sb-mid { font-size:11px; color:var(--faint); }

  /* ── MAIN ── */
  .main { padding:40px 44px; overflow-y:auto; }

  /* ── TOPBAR ── */
  .topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; animation:up .4s ease both; flex-wrap:wrap; gap:12px; }
  .topbar-left {}
  .tb-greeting { font-size:12px; color:var(--faint); letter-spacing:.3px; margin-bottom:3px; }
  .tb-name { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; letter-spacing:-1px; line-height:1; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .chip { display:flex; align-items:center; gap:5px; padding:6px 13px; border-radius:20px; font-size:12px; font-weight:600; border:1px solid; }
  .chip.active   { background:var(--green-bg); border-color:rgba(42,125,79,.2); color:var(--green); }
  .chip.inactive { background:var(--red-bg);   border-color:rgba(192,57,43,.15); color:var(--red); }
  .chip.inside   { background:var(--blue-bg);  border-color:rgba(37,99,168,.2); color:var(--blue); }
  .sdot { width:5px; height:5px; border-radius:50%; background:currentColor; }
  .tb-av { width:40px; height:40px; border-radius:50%; background:var(--gold-bg); border:2px solid var(--gold-border); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:14px; color:var(--gold-d); overflow:hidden; flex-shrink:0; }
  .tb-av img { width:100%; height:100%; object-fit:cover; }

  /* ── CARD ── */
  .card { background:var(--white); border:1px solid var(--border); border-radius:var(--r); padding:22px 24px; box-shadow:var(--shadow); }
  .card-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--faint); margin-bottom:8px; }
  .card-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; letter-spacing:-1px; color:var(--text); line-height:1; }
  .card-sub { font-size:12px; color:var(--faint); margin-top:5px; line-height:1.4; }
  .card-link { font-size:12px; font-weight:600; color:var(--gold-d); cursor:pointer; border:none; background:none; padding:0; margin-top:12px; display:inline-flex; align-items:center; gap:3px; transition:gap .15s; }
  .card-link:hover { gap:6px; }
  .card-link svg { width:11px; height:11px; }

  /* ── QR CARD ── */
  .qr-card { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; text-align:center; padding:20px 18px; }
  .qr-frame { background:#fff; border-radius:10px; padding:10px; border:1px solid var(--border2); box-shadow:0 2px 8px rgba(0,0,0,.06); display:inline-flex; align-items:center; justify-content:center; }
  .qr-mid-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--faint); }
  .qr-mid-id { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--text); letter-spacing:.3px; }
  .qr-visits-row { display:flex; align-items:center; gap:7px; padding:7px 14px; background:var(--bg); border-radius:20px; border:1px solid var(--border2); }
  .qr-visits-row svg { width:12px; height:12px; color:var(--faint); }
  .qr-visits-num { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:var(--text); }
  .qr-visits-lbl { font-size:11px; color:var(--faint); }
  .qr-hint { font-size:10px; color:var(--faint); line-height:1.4; }

  /* Section head */
  .sh { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .sh-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:-.4px; }
  .sh-action { font-size:12px; font-weight:600; color:var(--gold-d); cursor:pointer; border:none; background:none; padding:0; transition:opacity .15s; }
  .sh-action:hover { opacity:.7; }

  /* ── BALANCE HERO CARD ── */
  .balance-hero {
    background:var(--text); border-radius:var(--r);
    padding:26px 30px; box-shadow:var(--shadow-md);
    position:relative; overflow:hidden;
    animation:up .35s ease both;
  }
  .bh-glow1 { position:absolute; top:-70px; right:-70px; width:220px; height:220px; background:radial-gradient(circle,rgba(200,169,110,.13) 0%,transparent 60%); pointer-events:none; }
  .bh-glow2 { position:absolute; bottom:-50px; left:25%; width:180px; height:180px; background:radial-gradient(circle,rgba(200,169,110,.05) 0%,transparent 65%); pointer-events:none; }
  .bh-label { font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.38); margin-bottom:10px; }
  .bh-amount { font-family:'Syne',sans-serif; font-size:40px; font-weight:800; letter-spacing:-2.5px; color:#fff; display:flex; align-items:baseline; gap:5px; flex-wrap:wrap; }
  .bh-cur { font-size:17px; font-weight:500; color:rgba(255,255,255,.45); }
  .bh-footer { display:flex; align-items:center; justify-content:space-between; margin-top:20px; flex-wrap:wrap; gap:14px; }
  .bh-stats { display:flex; gap:24px; }
  .bh-stat-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.32); margin-bottom:2px; }
  .bh-stat-val { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; }
  .bh-stat-val.g { color:#86efac; }
  .bh-stat-val.r { color:#fca5a5; }
  .btn-topup { display:flex; align-items:center; gap:7px; padding:10px 20px; border-radius:var(--r-sm); background:var(--gold); border:none; color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; box-shadow:0 2px 10px rgba(200,169,110,.3); white-space:nowrap; }
  .btn-topup:hover { background:var(--gold-d); transform:translateY(-1px); }
  .btn-topup svg { width:14px; height:14px; }

  /* ── QR CARD ── */
  .qr-card {
    background:var(--white); border:1px solid var(--border);
    border-radius:var(--r); padding:22px 24px;
    box-shadow:var(--shadow);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:14px; text-align:center;
  }
  .qr-canvas-wrap {
    width:130px; height:130px; border-radius:10px;
    background:var(--white); padding:8px;
    border:1px solid var(--border2);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .qr-canvas-wrap canvas { display:block; }
  .qr-label { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--faint); }
  .qr-id { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; letter-spacing:.5px; color:var(--text); }
  .qr-hint { font-size:11px; color:var(--faint); line-height:1.4; }

  /* ── GRID ROWS ── */
  .row1 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }
  .row2 { display:grid; grid-template-columns:1.1fr 1fr; gap:14px; margin-bottom:14px; }
  .row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  /* Stagger animations */
  .a1{animation:up .38s .05s ease both}
  .a2{animation:up .38s .09s ease both}
  .a3{animation:up .38s .13s ease both}
  .a4{animation:up .38s .17s ease both}
  .a5{animation:up .38s .21s ease both}
  .a6{animation:up .38s .25s ease both}
  .a7{animation:up .38s .29s ease both}
  .a8{animation:up .38s .33s ease both}

  /* ── RING ── */
  .ring-wrap { position:relative; width:88px; height:88px; flex-shrink:0; }
  .ring-svg { width:88px; height:88px; transform:rotate(-90deg); }
  .ring-track { fill:none; stroke:var(--bg); stroke-width:7; }
  .ring-fill { fill:none; stroke-width:7; stroke-linecap:round; transition:stroke-dashoffset .8s cubic-bezier(.34,1.2,.64,1); }
  .ring-fill.good    { stroke:var(--green); }
  .ring-fill.warning { stroke:#d97706; }
  .ring-fill.expired { stroke:var(--red); }
  .ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .ring-num { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; letter-spacing:-.5px; line-height:1; }
  .ring-unit { font-size:8px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--faint); }
  .ring-card { display:flex; align-items:center; gap:20px; }
  .ring-info {}
  .ring-type { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; letter-spacing:-.4px; margin-bottom:3px; }
  .ring-exp { font-size:12px; color:var(--faint); margin-bottom:10px; }
  .ring-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; border:1px solid; }
  .ring-badge.good    { background:var(--green-bg); border-color:rgba(42,125,79,.2); color:var(--green); }
  .ring-badge.warning { background:rgba(217,119,6,.07); border-color:rgba(217,119,6,.2); color:#b45309; }
  .ring-badge.expired { background:var(--red-bg); border-color:rgba(192,57,43,.15); color:var(--red); }

  /* ── SPENDING BARS ── */
  .chart-tabs { display:flex; gap:2px; background:var(--bg); border-radius:6px; padding:3px; }
  .ctab { font-size:11px; font-weight:600; padding:4px 10px; border-radius:4px; border:none; background:none; color:var(--faint); cursor:pointer; transition:all .14s; }
  .ctab.on { background:var(--white); color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,.08); }

  /* Chart */
  .chart-body { position:relative; margin-top:16px; }
  .chart-grid { position:absolute; inset:0 0 28px 0; display:flex; flex-direction:column; justify-content:space-between; pointer-events:none; }
  .chart-grid-line { width:100%; height:1px; background:var(--border2); }
  .chart-grid-label { position:absolute; right:0; font-size:10px; color:var(--faint); line-height:1; transform:translateY(-50%); white-space:nowrap; }
  .bars-row { display:flex; align-items:flex-end; gap:6px; height:110px; position:relative; }
  .bar-col { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; height:100%; justify-content:flex-end; position:relative; }
  .bar-col:hover .bar-tooltip { opacity:1; transform:translateY(0); pointer-events:auto; }
  .bar-pill { width:100%; border-radius:5px 5px 0 0; transition:height .55s cubic-bezier(.34,1.3,.64,1), opacity .2s; cursor:default; min-height:0; }
  .bar-pill.past  { background:var(--text); opacity:.18; }
  .bar-pill.today { background:var(--gold); opacity:1; }
  .bar-pill.future { background:var(--text); opacity:.07; }
  .bar-pill.past:hover, .bar-pill.today:hover { opacity:1; }
  .bar-day { font-size:10px; color:var(--faint); font-weight:500; text-align:center; line-height:1; margin-top:6px; width:100%; }
  .bar-day.today { color:var(--text); font-weight:700; }
  .bar-day.future { color:var(--border); }
  .bar-tooltip {
    position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%) translateY(4px);
    background:var(--text); color:#fff; border-radius:6px;
    padding:5px 9px; font-size:11px; font-weight:600; white-space:nowrap;
    opacity:0; transition:opacity .15s, transform .15s; pointer-events:none;
    z-index:10;
  }
  .bar-tooltip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:4px solid transparent; border-top-color:var(--text); }
  .chart-total-row { display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:10px; border-top:1px solid var(--border2); }
  .chart-total-label { font-size:11px; color:var(--faint); }
  .chart-total-val { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:var(--text); }

  /* ── SERVICE BARS ── */
  .svc-list { display:flex; flex-direction:column; gap:13px; }
  .svc-row { display:flex; align-items:center; gap:10px; }
  .svc-rank { font-family:'Syne',sans-serif; font-size:11px; font-weight:700; color:var(--faint); width:14px; text-align:right; flex-shrink:0; }
  .svc-body { flex:1; }
  .svc-top { display:flex; justify-content:space-between; margin-bottom:5px; }
  .svc-name { font-size:13px; font-weight:500; }
  .svc-cnt { font-size:11px; color:var(--faint); }
  .svc-track { height:3px; background:var(--bg); border-radius:4px; overflow:hidden; }
  .svc-fill { height:100%; border-radius:4px; background:var(--text); transition:width .7s cubic-bezier(.34,1.4,.64,1); }

  /* ── CHECK-INS ── */
  .ci-list { display:flex; flex-direction:column; }
  .ci-row { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--border2); }
  .ci-row:last-child { border-bottom:none; }
  .ci-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .ci-dot.in  { background:var(--green); }
  .ci-dot.out { background:var(--faint); }
  .ci-info { flex:1; min-width:0; }
  .ci-svc { font-size:13px; font-weight:500; }
  .ci-time { font-size:11px; color:var(--faint); margin-top:1px; }
  .ci-tag { font-size:10px; font-weight:700; padding:3px 8px; border-radius:10px; text-transform:uppercase; letter-spacing:.3px; white-space:nowrap; }
  .ci-tag.in  { background:var(--green-bg); color:var(--green); }
  .ci-tag.out { background:var(--bg);       color:var(--sub); }

  /* ── NOTIFS ── */
  .notif-list { display:flex; flex-direction:column; }
  .notif-row { display:flex; gap:10px; padding:11px 0; border-bottom:1px solid var(--border2); cursor:pointer; transition:opacity .14s; }
  .notif-row:last-child { border-bottom:none; }
  .notif-row:hover { opacity:.7; }
  .n-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }
  .n-dot.u { background:var(--gold); }
  .n-dot.r { background:var(--border); }
  .n-msg { font-size:13px; color:var(--text); line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; flex:1; min-width:0; }
  .notif-row.read .n-msg { color:var(--sub); }
  .n-meta { font-size:11px; color:var(--faint); margin-top:3px; }

  /* ── EMPTY ── */
  .empty { font-size:13px; color:var(--faint); padding:10px 0; }

  /* ── SKELETON ── */
  .sk { background:linear-gradient(90deg,var(--bg) 25%,var(--border2) 50%,var(--bg) 75%); background-size:200% 100%; border-radius:6px; animation:shimmer 1.4s ease-in-out infinite; display:block; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
  @keyframes up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes pop { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

  /* ── TOPUP MODAL ── */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,.3); display:flex; align-items:center; justify-content:center; z-index:100; animation:fadeIn .18s ease; backdrop-filter:blur(3px); }
  .modal { background:var(--white); border-radius:16px; padding:30px; width:340px; max-width:92vw; box-shadow:0 20px 60px rgba(0,0,0,.14); animation:pop .24s cubic-bezier(.34,1.56,.64,1) both; }
  .modal-title { font-family:'Syne',sans-serif; font-size:19px; font-weight:800; letter-spacing:-.5px; margin-bottom:3px; }
  .modal-sub { font-size:13px; color:var(--sub); margin-bottom:22px; }
  .modal-lbl { font-size:10px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:var(--faint); margin-bottom:8px; }
  .amts { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; margin-bottom:16px; }
  .amt-btn { padding:9px; border-radius:var(--r-sm); border:1.5px solid var(--border); background:none; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; color:var(--sub); cursor:pointer; transition:all .14s; }
  .amt-btn:hover, .amt-btn.sel { border-color:var(--gold); color:var(--gold-d); background:var(--gold-bg); }
  .modal-input { width:100%; border:1.5px solid var(--border); border-radius:var(--r-sm); padding:11px 14px; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:600; color:var(--text); outline:none; transition:border-color .18s; margin-bottom:18px; }
  .modal-input:focus { border-color:var(--gold); }
  .modal-acts { display:flex; gap:9px; }
  .btn-cancel { flex:1; padding:11px; border-radius:var(--r-sm); border:1.5px solid var(--border); background:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:var(--sub); cursor:pointer; transition:all .14s; }
  .btn-cancel:hover { border-color:var(--text); color:var(--text); }
  .btn-confirm { flex:2; padding:11px; border-radius:var(--r-sm); border:none; background:var(--text); color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:background .14s; }
  .btn-confirm:hover { background:#333; }

  /* ── MOBILE NAV ── */
  .mobile-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:var(--white); border-top:1px solid var(--border); z-index:50; }
  .mobile-nav-row { display:flex; justify-content:space-around; padding:8px 0 max(env(safe-area-inset-bottom),8px); }
  .mn { display:flex; flex-direction:column; align-items:center; gap:3px; padding:6px 12px; border:none; background:none; cursor:pointer; color:var(--faint); font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600; letter-spacing:.3px; transition:color .14s; }
  .mn svg { width:19px; height:19px; }
  .mn.on { color:var(--text); }

  /* ── RESPONSIVE ── */
  @media(max-width:1080px){
    .layout{ grid-template-columns:200px 1fr }
    .main{ padding:32px 28px }
    .row3{ grid-template-columns:1fr 1fr }
  }
  @media(max-width:820px){
    .layout{ grid-template-columns:1fr }
    .sidebar{ display:none }
    .mobile-nav{ display:block }
    .main{ padding:22px 18px 90px }
    .row1{ grid-template-columns:1fr 1fr }
    .row2{ grid-template-columns:1fr }
    .row3{ grid-template-columns:1fr }
    .bh-amount{ font-size:32px }
    .balance-hero{ padding:20px 22px }
    .bh-footer{ flex-direction:column; align-items:flex-start; gap:12px }
  }
  @media(max-width:480px){
    .row1{ grid-template-columns:1fr }
    .amts{ grid-template-columns:repeat(2,1fr) }
    .tb-name{ font-size:22px }
  }
`;

/* Icons */
const Ic = ({d,...p}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {typeof d==="string"?<path d={d}/>:d}
  </svg>
);
const IHome    = () => <Ic d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>}/>;
const IUser    = () => <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IWallet  = () => <Ic d={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>}/>;
const ICheck   = () => <Ic d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>;
const IBell    = () => <Ic d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>;
const IShield  = () => <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>;
const ILogout  = () => <Ic d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IPlus    = () => <Ic d="M12 5v14M5 12h14" strokeWidth="2.2"/>;
const IRight   = () => <Ic d="M9 18l6-6-6-6" strokeWidth="2"/>;
const IClock   = () => <Ic d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>;
const ILogIn   = () => <Ic d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>;
const IHistory = () => <Ic d={<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}/>;

/* Helpers */
const fmtAmt   = n => Math.abs(n??0).toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtDate  = s => { try{ return new Date(s).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }catch{return "—";}};
const fmtDT    = s => { try{ return new Date(s).toLocaleString("en-GB",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}); }catch{return "—";}};
const initials = n => (n||"").split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");
const greet    = () => { const h=new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening"; };
const daysLeft = d => { try{ return Math.ceil((new Date(d)-new Date())/86400000); }catch{return null;} };
const expClass = d => d===null||d<=0?"expired":d<=30?"warning":"good";
const MEMBER_TYPES = ["prepaid_usage","prepaid_recharge","info","warning","success","emergency","checkin","renewal"];

const sniffCurrency = (txs=[]) => {
  for (const t of txs) { const m=(t.description||"").match(/([A-Z]{2,4})\d/); if(m) return m[1]; }
  return "XAF";
};

/* Build spend per weekday from transactions */
/* Debit types — amounts are always positive in the API */
const DEBIT_TYPES = ["prepaid_usage","deduction","usage","charge","payment"];
const isDebit = type => DEBIT_TYPES.some(d => (type||"").toLowerCase().includes(d));

const buildWeekly = (txs=[]) => {
  const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const now = new Date();
  const todayIdx = (now.getDay()+6)%7; // 0=Mon
  return labels.map((lbl,i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - todayIdx + i);
    const ds = d.toISOString().slice(0,10);
    // Match both transaction_date and created_at in case field name varies
    const dayTxs = txs.filter(t => {
      const date = (t.transaction_date || t.created_at || t.date || "").slice(0,10);
      return date === ds;
    });
    const spend = dayTxs
      .filter(t => isDebit(t.transaction_type))
      .reduce((s,t) => s + Math.abs(t.amount||0), 0);
    const load = dayTxs
      .filter(t => !isDebit(t.transaction_type))
      .reduce((s,t) => s + Math.abs(t.amount||0), 0);
    return { lbl, spend, load, isToday: i===todayIdx };
  });
};

/* Most used services */
const topServices = (checkins=[]) => {
  const map = {};
  checkins.forEach(h=>{ const s=h.service_type?.trim()||"Facility"; map[s]=(map[s]||0)+1; });
  return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,4);
};

/* Ring */
const R=38, CIRC=2*Math.PI*R;
const ringOffset = d => { if(!d||d<=0) return CIRC; return CIRC*(1-Math.min(1,d/365)); };

/* ═══════════════════════ COMPONENT ═══════════════════════ */
export default function Dashboard() {
  const stored = typeof window!=="undefined" ? JSON.parse(localStorage.getItem("ms_member")||"null") : null;
  const mid = stored?.membership_id;

  const [profile,  setProfile]  = useState(null);
  const [prepaid,  setPrepaid]  = useState(null);
  const [checkins, setCheckins] = useState(null);
  const [notifs,   setNotifs]   = useState(null);
  const [lP,setLP] = useState(true);
  const [lW,setLW] = useState(true);
  const [lC,setLC] = useState(true);
  const [lN,setLN] = useState(true);

  const [chartMode, setChartMode] = useState("week");
  const [showModal, setShowModal] = useState(false);
  const [topupAmt,  setTopupAmt]  = useState("");
  const [selAmt,    setSelAmt]    = useState(null);

  useEffect(()=>{ if(!mid) window.location.href="/"; },[]);

  useEffect(()=>{
    if(!mid) return;
    fetch(`${API_BASE}/members/${mid}/profile`).then(r=>r.json()).then(j=>{if(j.success)setProfile(j.data);}).catch(()=>{}).finally(()=>setLP(false));
    fetch(`${API_BASE}/members/${mid}/prepaid`).then(r=>r.json()).then(j=>{
      if(j.success){
        setPrepaid(j);
        // Debug: log first transaction to verify field names
        if(j.transactions?.length) console.log("[MemberSync] Sample tx:", j.transactions[0]);
      }
    }).catch(()=>{}).finally(()=>setLW(false));
    fetch(`${API_BASE}/members/${mid}/checkins`).then(r=>r.json()).then(j=>{if(j.success)setCheckins(j.history||[]);}).catch(()=>{}).finally(()=>setLC(false));
    fetch(`${API_BASE}/members/${mid}/notifications`).then(r=>r.json()).then(j=>{if(j.success)setNotifs((j.notifications||[]).filter(n=>MEMBER_TYPES.includes(n.type)));}).catch(()=>{}).finally(()=>setLN(false));
  },[mid]);

  /* Derived */
  const name     = profile?.name || stored?.name || "Member";
  const txs      = prepaid?.transactions || [];
  const balance  = prepaid?.balance?.current_balance ?? 0;
  const loaded   = prepaid?.balance?.total_recharged ?? 0;
  const spent    = prepaid?.balance?.total_spent ?? 0;
  const currency = sniffCurrency(txs);
  const weekly   = buildWeekly(txs);
  const maxBar   = Math.max(...weekly.map(w=>w.spend),1);
  const services = topServices(checkins||[]);
  const maxSvc   = services[0]?.[1]||1;
  const unread   = (notifs||[]).filter(n=>!n.is_read).length;
  const dl       = daysLeft(profile?.expiration);
  const expCls   = expClass(dl);
  const currentIn= !!(checkins||[])[0]?.status==="checked_in"&&!(checkins||[])[0]?.checkout_time;

  const nav = href => () => window.location.href = href;
  const Sk  = ({w="100%",h=14,r=6}) => <span className="sk" style={{width:w,height:h,borderRadius:r}}/>;

  /* ── QR Code — real scannable QR via qrserver.com API ── */
  const QRCanvas = ({ value, size=110 }) => {
    const [loaded, setLoaded] = useState(false);
    const [err,    setErr]    = useState(false);
    const src = value
      ? `https://api.qrserver.com/v1/create-qr-code/?size=${size*2}x${size*2}&data=${encodeURIComponent(value)}&color=1a1a18&bgcolor=ffffff&qzone=1&format=png`
      : null;
    if (!src) return <Sk w={size} h={size} r={8}/>;
    return (
      <div style={{position:"relative",width:size,height:size}}>
        {!loaded && !err && <Sk w={size} h={size} r={8} style={{position:"absolute",inset:0}}/>}
        {err && (
          <div style={{width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center",
            background:"var(--bg)",borderRadius:8,fontSize:10,color:"var(--faint)",textAlign:"center",padding:8}}>
            QR unavailable
          </div>
        )}
        <img
          src={src}
          width={size} height={size}
          alt={`QR: ${value}`}
          style={{display:loaded?"block":"none", borderRadius:4, imageRendering:"crisp-edges"}}
          onLoad={()=>setLoaded(true)}
          onError={()=>setErr(true)}
        />
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-mark">
              <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" fill="none"/>
                <circle cx="9" cy="7" r="4" stroke="white" fill="none"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" fill="none"/>
              </svg>
            </div>
            <span className="sb-logo-name">Member<span>Sync</span></span>
          </div>

          <nav className="sb-nav">
            <div className="sb-grp-label">Menu</div>
            {[
              {icon:<IHome/>,   label:"Dashboard",  href:"/dashboard", on:true},
              {icon:<IUser/>,   label:"Profile",    href:"/profile"},
              {icon:<IWallet/>, label:"Wallet",     href:"/wallet"},
              {icon:<IHistory/>,label:"Check-ins",  href:"/checkin"},
            ].map(item=>(
              <button key={item.label} className={`sb-item${item.on?" on":""}`} onClick={nav(item.href)}>
                {item.icon}{item.label}
              </button>
            ))}
            <div className="sb-grp-label" style={{marginTop:8}}>Account</div>
            {[
              {icon:<IBell/>,   label:"Notifications", href:"/notifications", badge:unread},
              {icon:<IShield/>, label:"Membership",    href:"/membership"},
            ].map(item=>(
              <button key={item.label} className="sb-item" onClick={nav(item.href)}>
                {item.icon}<span style={{flex:1}}>{item.label}</span>
                {item.badge>0&&<span className="sb-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="sb-footer">
            <button className="sb-signout" onClick={()=>{localStorage.removeItem("ms_member");window.location.href="/";}}>
              <ILogout/>Sign Out
            </button>
            <div className="sb-member">
              <div className="sb-av">
                {profile?.photo_url?<img src={profile.photo_url} alt={name}/>:initials(name)}
              </div>
              <div style={{minWidth:0}}>
                <div className="sb-mname">{lP?<Sk w={80} h={12}/>:name}</div>
                <div className="sb-mid">{mid}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">

          {/* TOP BAR */}
          <div className="topbar">
            <div className="topbar-left">
              <div className="tb-greeting">{greet()}</div>
              <div className="tb-name">{lP?<Sk w={180} h={26} r={7}/>:name}</div>
            </div>
            <div className="topbar-right">
              {!lP && profile?.status && (
                <div className={`chip ${profile.status==="active"?"active":"inactive"}`}>
                  <div className="sdot"/>
                  {profile.status==="active"?"Active":"Inactive"}
                </div>
              )}
              {currentIn && <div className="chip inside"><ILogIn style={{width:12,height:12}}/>Inside</div>}
              <div className="tb-av">
                {lP?<Sk w={40} h={40} r={20}/>:
                  profile?.photo_url?<img src={profile.photo_url} alt={name}/>:initials(name)}
              </div>
            </div>
          </div>

          {/* ── ROW 1: Balance hero + 2 stat cards ── */}
          <div className="row1" style={{marginBottom:14}}>

            {/* Balance spans 2 cols on desktop via flex trick — we use a wrapper div with special treatment */}
            <div style={{gridColumn:"span 2"}}>
              <div className="balance-hero">
                <div className="bh-glow1"/><div className="bh-glow2"/>
                <div className="bh-label">Prepaid Balance</div>
                {lW ? <Sk w={200} h={40} r={8}/> : (
                  <div className="bh-amount">
                    <span className="bh-cur">{currency}</span>
                    {fmtAmt(balance)}
                  </div>
                )}
                <div className="bh-footer">
                  <div className="bh-stats">
                    <div>
                      <div className="bh-stat-label">Total Loaded</div>
                      <div className="bh-stat-val g">+{currency} {fmtAmt(loaded)}</div>
                    </div>
                    <div>
                      <div className="bh-stat-label">Total Spent</div>
                      <div className="bh-stat-val r">−{currency} {fmtAmt(spent)}</div>
                    </div>
                  </div>
                  <button className="btn-topup" onClick={()=>setShowModal(true)}>
                    <IPlus/>Top Up
                  </button>
                </div>
              </div>
            </div>

            {/* QR Identity Card */}
            <div className="card a1 qr-card">
              {lP ? (
                <Sk w={120} h={120} r={10}/>
              ) : (
                <>
                  <div className="qr-frame">
                    <QRCanvas value={mid} size={110}/>
                  </div>
                  <div>
                    <div className="qr-mid-label">Member ID</div>
                    <div className="qr-mid-id">{mid}</div>
                  </div>
                  <div className="qr-visits-row">
                    <IHistory/>
                    {lC
                      ? <Sk w={20} h={12} r={3}/>
                      : <span className="qr-visits-num">{(checkins||[]).length}</span>
                    }
                    <span className="qr-visits-lbl">visits</span>
                  </div>
                  <div className="qr-hint">Show this to staff to check in</div>
                </>
              )}
            </div>
          </div>

          {/* ── ROW 2: Membership ring + Spending chart ── */}
          <div className="row2" style={{marginBottom:14}}>

            {/* Membership ring */}
            <div className="card a3">
              <div className="sh">
                <div className="sh-title">Membership</div>
                <button className="sh-action" onClick={nav("/membership")}>Renew →</button>
              </div>
              <div className="ring-card">
                <div className="ring-wrap">
                  <svg className="ring-svg" viewBox="0 0 100 100">
                    <circle className="ring-track" cx="50" cy="50" r={R}/>
                    <circle
                      className={`ring-fill ${lP?"good":expCls}`}
                      cx="50" cy="50" r={R}
                      strokeDasharray={CIRC}
                      strokeDashoffset={lP ? CIRC : ringOffset(dl)}
                    />
                  </svg>
                  <div className="ring-center">
                    {lP?<Sk w={28} h={18} r={4}/>:<>
                      <div className="ring-num">{!dl||dl<=0?"0":dl>365?"365+":dl}</div>
                      <div className="ring-unit">days</div>
                    </>}
                  </div>
                </div>
                <div className="ring-info">
                  {lP?<><Sk w={110} h={17} r={5}/><Sk w={80} h={12} r={4} style={{marginTop:8}}/></>:<>
                    <div className="ring-type">{profile?.type||"Standard"}</div>
                    <div className="ring-exp">Expires {fmtDate(profile?.expiration)}</div>
                    <div className={`ring-badge ${expCls}`}>
                      {expCls==="good"?"Active":expCls==="warning"?"Expiring soon":"Expired"}
                    </div>
                  </>}
                </div>
              </div>
            </div>

            {/* Spending chart */}
            <div className="card a4">
              <div className="sh">
                <div className="sh-title">Weekly Spending</div>
                <div className="chart-tabs">
                  {["week"].map(m=>(
                    <button key={m} className={`ctab${chartMode===m?" on":""}`} onClick={()=>setChartMode(m)}>This week</button>
                  ))}
                </div>
              </div>
              {lW?(
                <div className="chart-body">
                  <div className="bars-row">
                    {[55,40,75,60,85,35,70].map((h,i)=>(
                      <div key={i} className="bar-col">
                        <Sk w="100%" h={`${h}%`} r={5}/>
                      </div>
                    ))}
                  </div>
                </div>
              ):(()=>{
                const totalWeekSpend = weekly.reduce((s,d)=>s+d.spend,0);
                const now = new Date();
                const todayIdx = (now.getDay()+6)%7;
                return (
                  <div className="chart-body">
                    <div className="bars-row">
                      {weekly.map((d,i)=>{
                        const isFuture = i > todayIdx;
                        const heightPct = maxBar > 0 ? Math.max(0,(d.spend/maxBar)*100) : 0;
                        const cls = d.isToday ? "today" : isFuture ? "future" : "past";
                        return (
                          <div key={i} className="bar-col">
                            {d.spend > 0 && (
                              <div className="bar-tooltip">
                                {currency} {fmtAmt(d.spend)}
                              </div>
                            )}
                            <div
                              className={`bar-pill ${cls}`}
                              style={{height: heightPct > 0 ? `${heightPct}%` : (isFuture ? "6px" : "3px")}}
                            />
                            <div className={`bar-day${d.isToday?" today":isFuture?" future":""}`}>
                              {d.lbl}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="chart-total-row">
                      <span className="chart-total-label">Week total</span>
                      <span className="chart-total-val">
                        {totalWeekSpend > 0 ? `${currency} ${fmtAmt(totalWeekSpend)}` : "No spending this week"}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── ROW 3: Most visited + Check-ins + Notifications ── */}
          <div className="row3">

            {/* Most visited services */}
            <div className="card a5">
              <div className="sh">
                <div className="sh-title">Most Visited</div>
                <button className="sh-action" onClick={nav("/checkin")}>History →</button>
              </div>
              {lC?(
                <div className="svc-list">{[...Array(3)].map((_,i)=>(
                  <div key={i} className="svc-row">
                    <Sk w={14} h={12} r={3}/>
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}><Sk w="45%" h={13}/><Sk w="20%" h={11}/></div>
                      <Sk w="100%" h={3} r={2}/>
                    </div>
                  </div>
                ))}</div>
              ) : services.length===0 ? (
                <div className="empty">No visit data yet.</div>
              ) : (
                <div className="svc-list">
                  {services.map(([svc,cnt],i)=>(
                    <div className="svc-row" key={svc}>
                      <div className="svc-rank">{i+1}</div>
                      <div className="svc-body">
                        <div className="svc-top">
                          <span className="svc-name">{svc}</span>
                          <span className="svc-cnt">{cnt}×</span>
                        </div>
                        <div className="svc-track">
                          <div className="svc-fill" style={{width:`${(cnt/maxSvc)*100}%`}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent check-ins */}
            <div className="card a6">
              <div className="sh">
                <div className="sh-title">Recent Check-ins</div>
                <button className="sh-action" onClick={nav("/checkin")}>All →</button>
              </div>
              {lC?(
                <div className="ci-list">{[...Array(3)].map((_,i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:"1px solid var(--border2)",alignItems:"center"}}>
                    <Sk w={8} h={8} r={4}/><div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}><Sk w="45%" h={13}/><Sk w="60%" h={10}/></div><Sk w={40} h={20} r={10}/>
                  </div>
                ))}</div>
              ) : (checkins||[]).length===0 ? (
                <div className="empty">No visits yet.</div>
              ) : (
                <div className="ci-list">
                  {(checkins||[]).slice(0,4).map((h,i)=>{
                    const s = h.status==="checked_in"&&!h.checkout_time?"in":"out";
                    return (
                      <div className="ci-row" key={i}>
                        <div className={`ci-dot ${s}`}/>
                        <div className="ci-info">
                          <div className="ci-svc">{h.service_type?.trim()||"Facility"}</div>
                          <div className="ci-time">{fmtDT(h.checkin_time)}</div>
                        </div>
                        <div className={`ci-tag ${s}`}>{s==="in"?"Active":"Done"}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="card a7">
              <div className="sh">
                <div className="sh-title">
                  Alerts
                  {unread>0&&<span style={{marginLeft:7,background:"var(--gold)",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:10,fontWeight:700}}>{unread}</span>}
                </div>
                <button className="sh-action" onClick={nav("/notifications")}>All →</button>
              </div>
              {lN?(
                <div className="notif-list">{[...Array(3)].map((_,i)=>(
                  <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:"1px solid var(--border2)"}}>
                    <Sk w={6} h={6} r={3} style={{marginTop:5,flexShrink:0}}/><div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}><Sk w="92%" h={13}/><Sk w="45%" h={10}/></div>
                  </div>
                ))}</div>
              ) : (notifs||[]).length===0 ? (
                <div className="empty">No notifications yet.</div>
              ) : (
                <div className="notif-list">
                  {(notifs||[]).slice(0,4).map((n,i)=>(
                    <div key={i} className={`notif-row${n.is_read?" read":""}`} onClick={nav("/notifications")}>
                      <div className={`n-dot ${n.is_read?"r":"u"}`}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div className="n-msg">{n.message}</div>
                        <div className="n-meta">{fmtDT(n.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ── MOBILE BOTTOM NAV ── */}
        <nav className="mobile-nav">
          <div className="mobile-nav-row">
            {[
              {icon:<IHome/>,   label:"Home",    href:"/dashboard", on:true},
              {icon:<IWallet/>, label:"Wallet",  href:"/wallet"},
              {icon:<IHistory/>,label:"Visits",  href:"/checkin"},
              {icon:<IBell/>,   label:"Alerts",  href:"/notifications"},
              {icon:<IUser/>,   label:"Profile", href:"/profile"},
            ].map(item=>(
              <button key={item.label} className={`mn${item.on?" on":""}`} onClick={nav(item.href)}>
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* ── TOPUP MODAL ── */}
      {showModal&&(
        <div className="overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Top Up Wallet</div>
            <div className="modal-sub">Choose an amount or enter your own</div>
            <div className="modal-lbl">Quick select ({currency})</div>
            <div className="amts">
              {[1000,2000,5000,10000,20000,50000].map(a=>(
                <button key={a} className={`amt-btn${selAmt===a?" sel":""}`}
                  onClick={()=>{setSelAmt(a);setTopupAmt(String(a));}}>
                  {a.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="modal-lbl">Custom amount</div>
            <input className="modal-input" type="number" placeholder="0" value={topupAmt}
              onChange={e=>{setTopupAmt(e.target.value);setSelAmt(null);}}/>
            <div className="modal-acts">
              <button className="btn-cancel" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={()=>{
                alert(`Please visit the front desk or contact admin to load ${currency} ${Number(topupAmt||0).toLocaleString()} onto your account.`);
                setShowModal(false);
              }}>Request Top-up</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}