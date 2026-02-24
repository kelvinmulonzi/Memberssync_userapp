"use client";
import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:5000/api/v1";

/* ─────────────────────────────── STYLES ─────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --black:        #09090b;
    --surface:      #111113;
    --surface2:     #18181b;
    --surface3:     #1f1f23;
    --border:       #27272a;
    --border-glow:  rgba(200,169,110,0.25);
    --text:         #f4f0e8;
    --text-muted:   #71717a;
    --text-faint:   #3f3f46;
    --gold:         #c8a96e;
    --gold-light:   #e0c48a;
    --gold-dim:     rgba(200,169,110,0.10);
    --gold-dim2:    rgba(200,169,110,0.06);
    --red:          #ef4444;
    --red-dim:      rgba(239,68,68,0.08);
    --green:        #22c55e;
    --green-dim:    rgba(34,197,94,0.08);
    --blue:         #60a5fa;
    --radius:       14px;
    --radius-sm:    8px;
  }

  body, .page-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--black);
    color: var(--text);
    min-height: 100vh;
  }

  .page-root {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
  }

  /* ── SIDEBAR NAV ── */
  .sidebar {
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 24px 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }

  .sidebar-logo-icon {
    width: 34px; height: 34px;
    background: var(--gold);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sidebar-logo-icon svg { width: 18px; height: 18px; fill: #000; }
  .sidebar-logo-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 18px; letter-spacing: -0.5px;
  }
  .sidebar-logo-name span { color: var(--gold); }

  .nav-section-label {
    font-size: 10px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-faint);
    padding: 0 24px 10px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 24px;
    font-size: 14px; font-weight: 400; color: var(--text-muted);
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: left;
    transition: color 0.15s, background 0.15s;
    position: relative; border-radius: 0;
    text-decoration: none;
  }
  .nav-item svg { width: 17px; height: 17px; flex-shrink: 0; }
  .nav-item:hover { color: var(--text); background: var(--surface2); }
  .nav-item.active {
    color: var(--gold);
    background: var(--gold-dim2);
  }
  .nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 4px; bottom: 4px;
    width: 3px; background: var(--gold);
    border-radius: 0 3px 3px 0;
  }

  .sidebar-spacer { flex: 1; }

  .sidebar-member-card {
    margin: 0 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px;
    display: flex; align-items: center; gap: 10px;
  }
  .smc-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--gold-dim);
    border: 1.5px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 14px; color: var(--gold); flex-shrink: 0;
    overflow: hidden;
  }
  .smc-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .smc-info { flex: 1; min-width: 0; }
  .smc-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .smc-id { font-size: 11px; color: var(--text-muted); }

  /* ── MAIN CONTENT ── */
  .main {
    padding: 48px 56px;
    max-width: 900px;
  }

  /* Page header */
  .page-header {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;
    animation: fadeUp 0.4s ease both;
  }

  .page-title-group {}
  .page-eyebrow {
    font-size: 11px; font-weight: 500; letter-spacing: 3px;
    text-transform: uppercase; color: var(--gold);
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 10px;
  }
  .page-eyebrow::before {
    content: ''; width: 18px; height: 1px; background: var(--gold);
  }
  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 34px; font-weight: 800;
    letter-spacing: -1.5px; color: var(--text);
    line-height: 1;
  }
  .page-sub { font-size: 14px; color: var(--text-muted); margin-top: 8px; font-weight: 300; }

  /* Status badge */
  .status-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .status-badge.active {
    background: var(--green-dim);
    border: 1px solid rgba(34,197,94,0.25);
    color: var(--green);
  }
  .status-badge.inactive {
    background: var(--red-dim);
    border: 1px solid rgba(239,68,68,0.2);
    color: var(--red);
  }
  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: currentColor;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }

  /* ── PROFILE HERO CARD ── */
  .profile-hero {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    display: flex; align-items: center; gap: 28px;
    margin-bottom: 28px;
    position: relative; overflow: hidden;
    animation: fadeUp 0.4s 0.05s ease both;
  }

  .profile-hero::after {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .avatar-wrap { position: relative; flex-shrink: 0; }

  .avatar-ring {
    width: 88px; height: 88px; border-radius: 50%;
    background: var(--gold-dim);
    border: 2px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: 32px; color: var(--gold);
    overflow: hidden; position: relative;
  }
  .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }

  .avatar-status-dot {
    position: absolute; bottom: 3px; right: 3px;
    width: 14px; height: 14px; border-radius: 50%;
    background: var(--green);
    border: 2.5px solid var(--surface);
  }

  .hero-info { flex: 1; }
  .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: 26px; font-weight: 700; letter-spacing: -1px;
    margin-bottom: 4px;
  }
  .hero-org { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }
  .hero-meta {
    display: flex; flex-wrap: wrap; gap: 20px;
  }
  .hero-meta-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--text-muted);
  }
  .hero-meta-item svg { width: 13px; height: 13px; color: var(--gold); }
  .hero-meta-item strong { color: var(--text); font-weight: 500; }

  .hero-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
  }

  .membership-chip {
    background: var(--gold-dim);
    border: 1px solid rgba(200,169,110,0.2);
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.8px; text-transform: uppercase;
    color: var(--gold);
  }

  .expiry-info { text-align: right; }
  .expiry-label { font-size: 10px; color: var(--text-faint); letter-spacing: 1px; text-transform: uppercase; }
  .expiry-date { font-size: 15px; font-weight: 500; color: var(--text); margin-top: 2px; }

  /* ── SECTION CARDS ── */
  .section-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 24px;
  }

  .section-card:nth-child(3) { animation: fadeUp 0.4s 0.1s ease both; }
  .section-card:nth-child(4) { animation: fadeUp 0.4s 0.15s ease both; }

  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 28px;
    border-bottom: 1px solid var(--border);
  }
  .card-title-group { display: flex; align-items: center; gap: 10px; }
  .card-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--gold-dim);
    display: flex; align-items: center; justify-content: center;
  }
  .card-icon svg { width: 16px; height: 16px; color: var(--gold); }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
  }
  .card-sub { font-size: 12px; color: var(--text-muted); }

  /* Edit / Save button */
  .btn-edit {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--text-muted);
    cursor: pointer; transition: all 0.15s;
  }
  .btn-edit:hover { border-color: var(--gold); color: var(--gold); }
  .btn-edit svg { width: 14px; height: 14px; }
  .btn-edit.editing {
    background: var(--gold); color: var(--black);
    border-color: var(--gold); font-weight: 600;
  }
  .btn-edit.editing:hover { background: var(--gold-light); }

  .btn-cancel {
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text-faint);
    cursor: pointer; padding: 8px;
    transition: color 0.15s;
  }
  .btn-cancel:hover { color: var(--text-muted); }

  /* Card body */
  .card-body { padding: 28px; }

  /* Read-only field rows */
  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .info-field {}
  .info-label {
    font-size: 10px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--text-faint);
    margin-bottom: 6px;
  }
  .info-value {
    font-size: 15px; font-weight: 400; color: var(--text);
    line-height: 1.4;
  }
  .info-value.placeholder { color: var(--text-faint); font-style: italic; }

  /* Divider in card */
  .card-divider {
    height: 1px; background: var(--border);
    margin: 24px 0;
  }

  /* Edit mode inputs */
  .edit-field { display: flex; flex-direction: column; gap: 6px; }
  .edit-label {
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text-muted);
  }
  .input-wrap { position: relative; }
  .input-wrap svg {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    width: 15px; height: 15px; color: var(--text-faint);
    pointer-events: none; transition: color 0.15s;
  }
  .edit-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 14px 12px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .edit-input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200,169,110,0.08);
  }
  .edit-input:focus + svg { color: var(--gold); }
  .edit-input:disabled {
    opacity: 0.4; cursor: not-allowed;
  }
  .edit-input.error-state { border-color: var(--red); }

  /* Field-level error */
  .field-error {
    font-size: 12px; color: var(--red);
    display: flex; align-items: center; gap: 5px;
  }
  .field-error svg { width: 12px; height: 12px; }

  /* Save / Cancel row */
  .edit-actions {
    display: flex; align-items: center; gap: 12px;
    margin-top: 28px; padding-top: 24px;
    border-top: 1px solid var(--border);
  }

  .btn-save {
    display: flex; align-items: center; gap: 8px;
    background: var(--gold); color: var(--black);
    border: none; border-radius: 10px;
    padding: 12px 24px;
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; letter-spacing: -0.2px;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.2s, transform 0.1s;
  }
  .btn-save:hover:not(:disabled) {
    background: var(--gold-light);
    box-shadow: 0 4px 16px rgba(200,169,110,0.2);
  }
  .btn-save:active:not(:disabled) { transform: scale(0.99); }
  .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-save svg { width: 15px; height: 15px; }

  .btn-discard {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text-muted);
    cursor: pointer; transition: all 0.15s;
  }
  .btn-discard:hover { border-color: var(--border-glow); color: var(--text); }

  /* Feedback toasts */
  .toast-wrap {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    z-index: 99;
    display: flex; flex-direction: column; gap: 10px;
    align-items: center;
    pointer-events: none;
  }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 20px; border-radius: 10px;
    font-size: 13px; font-weight: 500;
    backdrop-filter: blur(12px);
    animation: toastIn 0.3s ease both;
    pointer-events: auto; min-width: 260px;
  }
  .toast.success {
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    color: var(--green);
  }
  .toast.error {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    color: var(--red);
  }
  .toast svg { width: 16px; height: 16px; flex-shrink: 0; }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Spinner */
  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(0,0,0,0.15);
    border-top-color: var(--black);
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Skeleton loading */
  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    border-radius: 6px;
    animation: shimmer 1.4s ease-in-out infinite;
  }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  /* Membership ID card */
  .membership-id-block {
    display: flex; align-items: center; gap: 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 20px;
  }
  .mid-icon {
    width: 38px; height: 38px; border-radius: 8px;
    background: var(--gold-dim);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mid-icon svg { width: 18px; height: 18px; color: var(--gold); }
  .mid-text { flex: 1; }
  .mid-label { font-size: 11px; color: var(--text-faint); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 2px; }
  .mid-value {
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: var(--text);
  }
  .mid-note { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

  .copy-btn {
    background: none; border: none; cursor: pointer;
    color: var(--text-faint); padding: 6px;
    border-radius: 6px; transition: all 0.15s;
  }
  .copy-btn:hover { color: var(--gold); background: var(--gold-dim); }
  .copy-btn svg { width: 15px; height: 15px; display: block; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .page-root { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .main { padding: 28px 20px 60px; max-width: 100%; }
    .profile-hero { flex-direction: column; align-items: flex-start; gap: 18px; }
    .hero-right { align-items: flex-start; }
    .field-grid { grid-template-columns: 1fr; }
    .hero-meta { gap: 12px; }
  }
`;

/* ─────────────────────────────── ICONS ─────────────────────────────── */
const Ico = ({ d, fill, ...props }) => (
  <svg viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const IcoUser     = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IcoMail     = () => <Ico d={<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></>} />;
const IcoPhone    = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.8 19.8 0 0 1 1.61 3.3a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.13 1 .36 1.96.7 2.89a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.93.34 1.9.57 2.89.7A2 2 0 0 1 22 16.92z" />;
const IcoEdit     = () => <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IcoSave     = () => <Ico d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />;
const IcoBadge    = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoBuilding = () => <Ico d={<><path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></>} />;
const IcoCalendar = () => <Ico d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>} />;
const IcoShield   = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoCopy     = () => <Ico d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>} />;
const IcoCheck    = () => <Ico d="M20 6 9 17l-5-5" strokeWidth="2.5" />;
const IcoAlert    = () => <Ico d={<><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>} />;
const IcoDash     = () => <Ico d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />;
const IcoWallet   = () => <Ico d={<><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>} />;
const IcoCheckin  = () => <Ico d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />;
const IcoBell     = () => <Ico d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>} />;
const IcoLogout   = () => <Ico d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;

/* ─────────────────────────────── HELPERS ─────────────────────────────── */
const formatDate = (str: string | number | Date) => {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return str; }
};

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/* ─────────────────────────────── COMPONENT ─────────────────────────────── */
export default function ProfilePage() {
  // Get member from storage (set by login page)
  const storedMember = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("ms_member") || "null") : null;
  const membershipId = storedMember?.membership_id || "MBR-0001"; // fallback for demo

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});

  // Toast
  const [toasts, setToasts] = useState([]);
  const toastTimer = useRef(null);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };

  /* ── Fetch Profile ── */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/members/${membershipId}/profile`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProfile(data.data);
      setForm({ name: data.data.name, email: data.data.email, phone: data.data.phone });
    } catch (err) {
      addToast(err.message || "Failed to load profile", "error");
      // Use demo data so UI renders
      const demo = {
        membership_id: membershipId,
        name: storedMember?.name || "Jane Mwangi",
        email: storedMember?.email || "jane@email.com",
        phone: "+254 712 345 678",
        type: "Premium",
        expiration: "2025-12-31",
        status: "active",
        organization: storedMember?.organization || "Nairobi Sports Club",
        photo_url: storedMember?.photo_url || null,
      };
      setProfile(demo);
      setForm({ name: demo.name, email: demo.email, phone: demo.phone });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  /* ── Validate ── */
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Save Profile ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/members/${membershipId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setProfile((p) => ({ ...p, ...form }));
      setEditing(false);
      addToast("Profile updated successfully!", "success");
      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("ms_member") || "{}");
      localStorage.setItem("ms_member", JSON.stringify({ ...stored, name: form.name, email: form.email }));
    } catch (err) {
      addToast(err.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Discard ── */
  const handleDiscard = () => {
    setForm({ name: profile.name, email: profile.email, phone: profile.phone });
    setFormErrors({});
    setEditing(false);
  };

  /* ── Copy membership ID ── */
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(membershipId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setFormErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* ── Skeleton ── */
  const Skel = ({ w = "100%", h = 18 }) => (
    <div className="skeleton" style={{ width: w, height: h }} />
  );

  /* ─────────── RENDER ─────────── */
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

          <p className="nav-section-label">Main</p>
          {[
            { icon: <IcoDash />,    label: "Dashboard",      href: "/dashboard" },
            { icon: <IcoUser />,    label: "Profile",        href: "/profile", active: true },
            { icon: <IcoWallet />,  label: "Wallet",         href: "/wallet" },
            { icon: <IcoCheckin />, label: "Check-in",       href: "/checkin" },
          ].map((n) => (
            <button key={n.label} className={`nav-item ${n.active ? "active" : ""}`}
              onClick={() => window.location.href = n.href}>
              {n.icon}{n.label}
            </button>
          ))}

          <p className="nav-section-label" style={{ marginTop: 24 }}>Account</p>
          {[
            { icon: <IcoBell />,   label: "Notifications", href: "/notifications" },
            { icon: <IcoShield />, label: "Membership",    href: "/membership" },
          ].map((n) => (
            <button key={n.label} className="nav-item"
              onClick={() => window.location.href = n.href}>
              {n.icon}{n.label}
            </button>
          ))}

          <div className="sidebar-spacer" />

          <button className="nav-item" style={{ marginBottom: 12, color: "var(--red)", opacity: 0.7 }}
            onClick={() => { localStorage.removeItem("ms_member"); window.location.href = "/"; }}>
            <IcoLogout /> Sign Out
          </button>

          {/* Member mini-card */}
          {profile && (
            <div className="sidebar-member-card">
              <div className="smc-avatar">
                {profile.photo_url
                  ? <img src={profile.photo_url} alt={profile.name} />
                  : initials(profile.name)}
              </div>
              <div className="smc-info">
                <div className="smc-name">{profile.name}</div>
                <div className="smc-id">{profile.membership_id}</div>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN ── */}
        <main className="main">

          {/* Page Header */}
          <div className="page-header">
            <div className="page-title-group">
              <div className="page-eyebrow">Member Area</div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-sub">View and manage your personal information</p>
            </div>
            {profile && (
              <div className={`status-badge ${profile.status === "active" ? "active" : "inactive"}`}>
                <div className="status-dot" />
                {profile.status === "active" ? "Active Member" : profile.status}
              </div>
            )}
          </div>

          {/* ── HERO CARD ── */}
          <div className="profile-hero">
            {loading ? (
              <>
                <Skel w={88} h={88} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skel w="40%" h={24} />
                  <Skel w="25%" h={14} />
                  <Skel w="60%" h={14} />
                </div>
              </>
            ) : profile && (
              <>
                <div className="avatar-wrap">
                  <div className="avatar-ring">
                    {profile.photo_url
                      ? <img src={profile.photo_url} alt={profile.name} />
                      : initials(profile.name)}
                  </div>
                  <div className="avatar-status-dot" />
                </div>

                <div className="hero-info">
                  <div className="hero-name">{profile.name}</div>
                  <div className="hero-org">{profile.organization}</div>
                  <div className="hero-meta">
                    <div className="hero-meta-item">
                      <IcoMail />
                      <strong>{profile.email}</strong>
                    </div>
                    <div className="hero-meta-item">
                      <IcoPhone />
                      <strong>{profile.phone}</strong>
                    </div>
                    <div className="hero-meta-item">
                      <IcoCalendar />
                      Expires <strong>{formatDate(profile.expiration)}</strong>
                    </div>
                  </div>
                </div>

                <div className="hero-right">
                  <div className="membership-chip">{profile.type}</div>
                  <div className="expiry-info">
                    <div className="expiry-label">Member Since</div>
                    <div className="expiry-date">
                      {profile.joined ? formatDate(profile.joined) : "2023"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── MEMBERSHIP ID CARD ── */}
          <div className="section-card">
            <div className="card-body">
              <div className="membership-id-block">
                <div className="mid-icon"><IcoBadge /></div>
                <div className="mid-text">
                  <div className="mid-label">Membership ID</div>
                  {loading
                    ? <Skel w={140} h={22} />
                    : <div className="mid-value">{membershipId}</div>}
                  <div className="mid-note">Scan your QR code or quote this ID at any facility</div>
                </div>
                <button className="copy-btn" onClick={handleCopy} title="Copy ID">
                  {copied ? <IcoCheck /> : <IcoCopy />}
                </button>
              </div>
            </div>
          </div>

          {/* ── PERSONAL INFO CARD ── */}
          <div className="section-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><IcoUser /></div>
                <div>
                  <div className="card-title">Personal Information</div>
                  <div className="card-sub">Your contact details and display name</div>
                </div>
              </div>
              {!editing ? (
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  <IcoEdit /> Edit
                </button>
              ) : (
                <button className="btn-cancel" onClick={handleDiscard}>Cancel</button>
              )}
            </div>

            <div className="card-body">
              {loading ? (
                <div className="field-grid">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Skel w="40%" h={12} />
                      <Skel w="80%" h={18} />
                    </div>
                  ))}
                </div>
              ) : !editing ? (
                /* ── READ MODE ── */
                <div className="field-grid">
                  {[
                    { label: "Full Name",     value: profile?.name },
                    { label: "Email Address", value: profile?.email },
                    { label: "Phone Number",  value: profile?.phone },
                    { label: "Organisation",  value: profile?.organization },
                  ].map((f) => (
                    <div key={f.label} className="info-field">
                      <div className="info-label">{f.label}</div>
                      <div className={`info-value ${!f.value ? "placeholder" : ""}`}>
                        {f.value || "Not provided"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ── EDIT MODE ── */
                <>
                  <div className="field-grid">
                    {/* Name */}
                    <div className="edit-field" style={{ gridColumn: "1 / -1" }}>
                      <label className="edit-label">Full Name</label>
                      <div className="input-wrap">
                        <input
                          className={`edit-input ${formErrors.name ? "error-state" : ""}`}
                          type="text"
                          value={form.name}
                          onChange={(e) => setField("name", e.target.value)}
                          placeholder="Your full name"
                        />
                        <IcoUser />
                      </div>
                      {formErrors.name && (
                        <div className="field-error"><IcoAlert />{formErrors.name}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="edit-field">
                      <label className="edit-label">Email Address</label>
                      <div className="input-wrap">
                        <input
                          className={`edit-input ${formErrors.email ? "error-state" : ""}`}
                          type="email"
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          placeholder="you@email.com"
                        />
                        <IcoMail />
                      </div>
                      {formErrors.email && (
                        <div className="field-error"><IcoAlert />{formErrors.email}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="edit-field">
                      <label className="edit-label">Phone Number</label>
                      <div className="input-wrap">
                        <input
                          className={`edit-input ${formErrors.phone ? "error-state" : ""}`}
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          placeholder="+254 700 000 000"
                        />
                        <IcoPhone />
                      </div>
                      {formErrors.phone && (
                        <div className="field-error"><IcoAlert />{formErrors.phone}</div>
                      )}
                    </div>

                    {/* Organisation — read-only */}
                    <div className="edit-field">
                      <label className="edit-label">Organisation</label>
                      <div className="input-wrap">
                        <input
                          className="edit-input"
                          type="text"
                          value={profile?.organization || ""}
                          disabled
                        />
                        <IcoBuilding />
                      </div>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                      {saving
                        ? <><div className="spinner" /> Saving…</>
                        : <><IcoSave /> Save Changes</>}
                    </button>
                    <button className="btn-discard" onClick={handleDiscard}>Discard</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── MEMBERSHIP DETAILS CARD ── */}
          <div className="section-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><IcoShield /></div>
                <div>
                  <div className="card-title">Membership Details</div>
                  <div className="card-sub">Plan type, status and expiry information</div>
                </div>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="field-grid">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Skel w="40%" h={12} />
                      <Skel w="70%" h={18} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="field-grid">
                  {[
                    { label: "Membership Type",   value: profile?.type },
                    { label: "Account Status",    value: profile?.status?.charAt(0).toUpperCase() + profile?.status?.slice(1) },
                    { label: "Expiration Date",   value: formatDate(profile?.expiration) },
                    { label: "Organisation",      value: profile?.organization },
                  ].map((f) => (
                    <div key={f.label} className="info-field">
                      <div className="info-label">{f.label}</div>
                      <div className="info-value">{f.value || "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* ── TOASTS ── */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" ? <IcoCheck /> : <IcoAlert />}
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}