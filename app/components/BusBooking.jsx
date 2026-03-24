import { useState, useEffect, useCallback } from "react";

// ── GOOGLE FONTS + CSS VARS (inject once) ───────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
    :root {
      --ink: #0a0a0f; --paper: #f5f3ee; --cream: #ede9e0;
      --accent: #e85d26; --accent2: #2d6be4; --muted: #9a9488;
      --seat-avail: #ffffff; --seat-taken: #d1cfc8;
      --seat-selected: #e85d26; --seat-border: #c8c4bb;
    }
    * { margin:0; padding:0; box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { background:var(--paper); color:var(--ink); font-family:'Poppins',sans-serif; overflow-x:hidden; }

    /* HERO */
    .hero-section { height:300vh; position:relative; }
    .sticky-scene { position:sticky; top:0; height:100vh; overflow:hidden; display:flex; align-items:center; justify-content:center; background:var(--ink); }
    .starfield { position:absolute; inset:0; background:radial-gradient(ellipse at 50% 30%,#1a1830 0%,#0a0a0f 70%); }
    .starfield::before { content:''; position:absolute; inset:0;
      background-image:
        radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),
        radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.4) 0%,transparent 100%),
        radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.5) 0%,transparent 100%),
        radial-gradient(1px 1px at 10% 80%,rgba(255,255,255,0.3) 0%,transparent 100%),
        radial-gradient(1px 1px at 90% 50%,rgba(255,255,255,0.4) 0%,transparent 100%),
        radial-gradient(1px 1px at 40% 90%,rgba(255,255,255,0.3) 0%,transparent 100%),
        radial-gradient(1.5px 1.5px at 70% 20%,rgba(255,255,255,0.5) 0%,transparent 100%),
        radial-gradient(1px 1px at 30% 50%,rgba(255,255,255,0.4) 0%,transparent 100%);
      background-size:300px 300px,250px 250px,400px 400px,350px 350px,280px 280px,320px 320px,290px 290px,410px 410px;
    }
    .hero-text { position:absolute; top:12%; left:50%; transform:translateX(-50%); text-align:center; z-index:20; pointer-events:none; transition:opacity 0.4s ease; }
    .hero-text .label { font-family:'Poppins',sans-serif; font-size:0.7rem; letter-spacing:0.3em; color:var(--accent); text-transform:uppercase; margin-bottom:8px; }
    .hero-text h1 { font-family:'Poppins',sans-serif; font-size:clamp(2.5rem,6vw,4.5rem); font-weight:800; color:var(--paper); line-height:1; letter-spacing:-0.02em; }
    .hero-text h1 span { color:var(--accent); }
    .scroll-hint { position:absolute; bottom:8%; left:50%; transform:translateX(-50%); z-index:20; display:flex; flex-direction:column; align-items:center; gap:8px; transition:opacity 0.4s; }
    .scroll-hint span { font-family:'Poppins',sans-serif; font-size:0.65rem; letter-spacing:0.25em; color:var(--muted); text-transform:uppercase; }
    .scroll-arrow { width:1px; height:40px; background:linear-gradient(to bottom,var(--muted),transparent); animation:scrollPulse 2s ease-in-out infinite; }
    @keyframes scrollPulse { 0%,100%{opacity:0.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.2)} }

    /* BOOKING */
    .booking-section { min-height:100vh; background:var(--paper); padding:80px 24px 120px; position:relative; }
    .booking-section::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(to right,transparent,var(--ink),transparent); opacity:0.15; }
    .booking-inner { max-width:960px; margin:0 auto; display:grid; grid-template-columns:1fr 320px; gap:60px; align-items:start; }
    @media(max-width:768px){ .booking-inner{grid-template-columns:1fr;gap:40px;} }
    .section-header { margin-bottom:36px; }
    .section-header .tag { display:inline-flex; align-items:center; gap:8px; font-size:0.65rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; }
    .section-header .tag::before { content:''; width:20px; height:1px; background:var(--accent); }
    .section-header h2 { font-family:'Poppins',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:800; letter-spacing:-0.03em; line-height:1.1; }
    .booking-actions {
      display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:28px;
      width:fit-content; padding:12px; background:white; border:1px solid rgba(10,10,15,0.08);
      border-radius:18px; box-shadow:0 18px 42px rgba(10,10,15,0.08);
    }
    .booking-action-icon { width:16px; height:16px; flex:none; }
    .booking-back-btn {
      display:inline-flex; align-items:center; gap:8px;
      background:#f5f3ee; border:1px solid rgba(10,10,15,0.12);
      color:var(--ink); padding:15px 22px; min-height:52px; border-radius:14px; cursor:pointer;
      font-family:'Poppins',sans-serif; font-size:0.82rem; font-weight:700;
      box-shadow:0 8px 22px rgba(10,10,15,0.06); transition:all 0.2s;
    }
    .booking-back-btn:hover {
      background:white; border-color:rgba(232,93,38,0.35); transform:translateY(-1px);
    }
    .booking-mybookings-btn {
      display:inline-flex; align-items:center; gap:8px;
      background:var(--accent); border:1px solid var(--accent);
      color:var(--paper); padding:15px 22px; min-height:52px; border-radius:14px; cursor:pointer;
      font-family:'Poppins',sans-serif; font-size:0.82rem; font-weight:700;
      box-shadow:0 14px 28px rgba(232,93,38,0.24); transition:all 0.2s;
    }
    .booking-mybookings-btn:hover {
      background:#f06f3d; border-color:#f06f3d; transform:translateY(-1px);
    }
    @media(max-width:640px){
      .booking-actions { width:100%; }
      .booking-back-btn, .booking-mybookings-btn { flex:1; justify-content:center; }
    }
    .route-bar { display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--ink); border-radius:12px; margin-bottom:40px; color:var(--paper); }
    .route-bar .city { font-family:'Poppins',sans-serif; font-size:1rem; font-weight:700; }
    .route-bar .arr { flex:1; height:1px; background:linear-gradient(to right,rgba(255,255,255,0.2),rgba(232,93,38,0.6),rgba(255,255,255,0.2)); position:relative; }
    .route-bar .arr::after { content:'→'; position:absolute; right:0; top:50%; transform:translateY(-50%); color:var(--accent); font-size:0.9rem; }
    .route-bar .detail { font-size:0.7rem; color:rgba(255,255,255,0.4); text-align:right; }
    .route-bar .detail strong { display:block; color:rgba(255,255,255,0.8); font-size:0.8rem; }
    .legend { display:flex; gap:20px; margin-bottom:32px; flex-wrap:wrap; }
    .legend-item { display:flex; align-items:center; gap:8px; font-size:0.75rem; color:var(--muted); }
    .legend-dot { width:20px; height:20px; border-radius:5px; border:1.5px solid; }
    .ld-avail { background:var(--seat-avail); border-color:var(--seat-border); }
    .ld-taken { background:var(--seat-taken); border-color:var(--seat-taken); }
    .ld-selected { background:var(--seat-selected); border-color:var(--seat-selected); }

    /* BUS FLOOR */
    .bus-floor { background:var(--cream); border-radius:32px 32px 20px 20px; padding:32px 24px; border:1.5px solid rgba(0,0,0,0.08); box-shadow:0 4px 24px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.8); }
    .bus-front { width:80%; height:3px; background:linear-gradient(to right,transparent,var(--accent),transparent); margin:0 auto 28px; border-radius:2px; opacity:0.4; }
    .driver-zone { display:flex; justify-content:space-between; align-items:center; padding:0 8px 20px; margin-bottom:28px; border-bottom:1.5px dashed rgba(0,0,0,0.1); }
    .driver-seat { width:40px; height:36px; background:linear-gradient(135deg,#c8c4bb,#b5b1a8); border-radius:8px 8px 4px 4px; display:flex; align-items:center; justify-content:center; font-size:1rem; }
    .driver-label { font-size:0.6rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); }
    .door-marker { font-size:0.65rem; color:var(--accent); letter-spacing:0.1em; text-transform:uppercase; border:1px solid currentColor; padding:3px 8px; border-radius:4px; }
    .seat-grid { display:flex; flex-direction:column; gap:10px; }
    .seat-row { display:grid; grid-template-columns:28px 1fr 1fr 28px 1fr 1fr; gap:8px; align-items:center; }
    .row-num { font-size:0.6rem; color:var(--muted); text-align:center; font-family:'Poppins',sans-serif; font-weight:600; }

    /* SEAT */
    .seat { width:100%; aspect-ratio:1; border-radius:8px 8px 5px 5px; border:1.5px solid var(--seat-border); background:var(--seat-avail); cursor:pointer; position:relative; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); outline:none; display:flex; align-items:center; justify-content:center; font-size:0.55rem; font-family:'Poppins',sans-serif; font-weight:700; color:var(--muted); box-shadow:0 2px 0 rgba(0,0,0,0.08); }
    .seat::before { content:''; position:absolute; top:-4px; left:50%; transform:translateX(-50%); width:40%; height:4px; background:var(--seat-avail); border-radius:3px 3px 0 0; border:1.5px solid var(--seat-border); border-bottom:none; }
    .seat:hover:not(.taken):not(.seat-sel) { transform:translateY(-3px) scale(1.05); border-color:var(--accent2); box-shadow:0 6px 16px rgba(45,107,228,0.2),0 2px 0 rgba(0,0,0,0.08); color:var(--accent2); }
    .seat-sel { background:var(--seat-selected)!important; border-color:var(--seat-selected)!important; color:white!important; transform:translateY(-2px) scale(1.05)!important; box-shadow:0 6px 20px rgba(232,93,38,0.35),0 2px 0 rgba(0,0,0,0.1)!important; }
    .seat-sel::before { background:var(--seat-selected)!important; border-color:var(--seat-selected)!important; }
    .taken { background:var(--seat-taken)!important; border-color:var(--seat-taken)!important; cursor:not-allowed!important; color:#b0ada5!important; box-shadow:none!important; }
    .taken::before { background:var(--seat-taken)!important; border-color:var(--seat-taken)!important; }
    .taken::after { content:'×'; font-size:0.9rem; color:#b0ada5; position:absolute; }
    .bus-back { margin-top:24px; padding-top:16px; border-top:1.5px dashed rgba(0,0,0,0.1); display:flex; justify-content:center; }
    .back-row-label { font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); }

    /* SUMMARY */
    .summary-panel { position:sticky; top:32px; }
    .summary-card { background:var(--ink); border-radius:20px; padding:28px; color:var(--paper); margin-bottom:16px; }
    .summary-card h3 { font-family:'Poppins',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.25em; text-transform:uppercase; color:var(--muted); margin-bottom:20px; }
    .selected-seats-list { min-height:80px; margin-bottom:24px; }
    .no-seats-msg { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:24px 0; color:var(--muted); font-size:0.8rem; text-align:center; opacity:0.6; }
    .seat-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:6px 10px; font-family:'Poppins',sans-serif; font-size:0.8rem; font-weight:700; margin:3px; cursor:pointer; transition:all 0.2s; animation:tagPop 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .seat-tag:hover { background:rgba(232,93,38,0.2); border-color:var(--accent); }
    .remove { color:var(--muted); font-size:0.9rem; }
    @keyframes tagPop { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
    .divider { height:1px; background:rgba(255,255,255,0.08); margin:20px 0; }
    .s-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; font-size:0.82rem; }
    .s-row .lbl { color:var(--muted); }
    .s-row .val { font-family:'Poppins',sans-serif; font-weight:600; }
    .s-row.total .val { font-size:1.2rem; color:var(--accent); }
    .s-row.total .lbl { color:var(--paper); font-size:0.85rem; }
    .passenger-counter { display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; margin-bottom:16px; }
    .counter-label { font-size:0.78rem; color:var(--muted); }
    .counter-label strong { display:block; color:var(--paper); font-family:'Poppins',sans-serif; font-size:0.9rem; }
    .counter-btns { display:flex; align-items:center; gap:12px; }
    .counter-btn { width:28px; height:28px; border-radius:8px; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.07); color:var(--paper); font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
    .counter-btn:hover { background:var(--accent); border-color:var(--accent); }
    .counter-num { font-family:'Poppins',sans-serif; font-weight:800; font-size:1.1rem; min-width:20px; text-align:center; }
    .book-btn { width:100%; padding:16px; background:var(--accent); color:white; border:none; border-radius:14px; font-family:'Poppins',sans-serif; font-size:0.85rem; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 20px rgba(232,93,38,0.3); position:relative; overflow:hidden; }
    .book-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.15) 0%,transparent 60%); }
    .book-btn:hover:not(:disabled) { transform:translateY(-2px) scale(1.02); box-shadow:0 8px 28px rgba(232,93,38,0.45); }
    .book-btn:disabled { opacity:0.4; cursor:not-allowed; }
    .info-card { background:var(--cream); border-radius:16px; padding:20px; border:1.5px solid rgba(0,0,0,0.07); font-size:0.78rem; color:var(--muted); line-height:1.6; }
    .info-card strong { color:var(--ink); display:block; margin-bottom:4px; font-family:'Poppins',sans-serif; font-size:0.8rem; }
    .seat-warning { font-size:0.72rem; color:var(--accent); text-align:center; margin-top:8px; min-height:18px; font-family:'Poppins',sans-serif; }

    /* MODAL */
    .modal-backdrop { position:fixed; inset:0; background:rgba(10,10,15,0.85); backdrop-filter:blur(8px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; opacity:0; pointer-events:none; transition:opacity 0.3s; }
    .modal-backdrop.open { opacity:1; pointer-events:all; }
    .modal { background:var(--paper); border-radius:28px; padding:48px 40px; max-width:420px; width:100%; text-align:center; transform:scale(0.9) translateY(20px); transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1); border:1.5px solid rgba(0,0,0,0.06); }
    .modal-backdrop.open .modal { transform:scale(1) translateY(0); }
    .modal-icon { width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg,var(--accent),#ff8055); margin:0 auto 24px; display:flex; align-items:center; justify-content:center; font-size:1.8rem; box-shadow:0 12px 36px rgba(232,93,38,0.3); }
    .modal h2 { font-family:'Poppins',sans-serif; font-size:1.6rem; font-weight:800; margin-bottom:8px; letter-spacing:-0.02em; }
    .modal p { color:var(--muted); font-size:0.85rem; line-height:1.7; margin-bottom:24px; }
    .booking-ref { background:var(--cream); border-radius:12px; padding:16px; margin-bottom:28px; font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:800; letter-spacing:0.2em; color:var(--accent); }
    .booked-seats-display { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-bottom:28px; }
    .booked-seat-chip { background:var(--ink); color:var(--paper); border-radius:8px; padding:6px 12px; font-family:'Poppins',sans-serif; font-size:0.85rem; font-weight:700; }
    .modal-close-btn { width:100%; padding:14px; background:var(--ink); color:var(--paper); border:none; border-radius:12px; font-family:'Poppins',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; transition:all 0.2s; }
    .modal-close-btn:hover { background:#1e1e2e; transform:translateY(-1px); }
  `}</style>
);

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const ROWS = 12;
const PRICE = 1200;
const PRETAKEN = ["1A","1B","2C","2D","3A","4B","4D","5A","5C","6B","7A","7D","8C","9A","9B","10D"];
const LETTERS = ["A","B","C","D"];

// ── BUS SVG ──────────────────────────────────────────────────────────────────
function BusSVG() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", filter:"drop-shadow(0 40px 80px rgba(232,93,38,0.15))" }}>
      <rect x="20" y="30" width="360" height="155" rx="18" fill="#1e1e2e" stroke="#e85d26" strokeWidth="1.5"/>
      <rect x="320" y="48" width="48" height="80" rx="8" fill="#2d3a5e" stroke="rgba(45,107,228,0.4)" strokeWidth="1"/>
      {[40,100,160,220].map((x,i) => (
        <rect key={i} x={x} y="50" width="48" height="38" rx="6" fill="#2d3a5e" stroke="rgba(45,107,228,0.3)" strokeWidth="1"/>
      ))}
      <rect x="280" y="50" width="28" height="38" rx="6" fill="#2d3a5e" stroke="rgba(45,107,228,0.3)" strokeWidth="1"/>
      <rect x="20" y="100" width="360" height="3" fill="#e85d26" opacity="0.6"/>
      <circle cx="80" cy="190" r="20" fill="#0a0a0f" stroke="#333" strokeWidth="2"/>
      <circle cx="80" cy="190" r="10" fill="#1a1a2e" stroke="#555" strokeWidth="1.5"/>
      <circle cx="310" cy="190" r="20" fill="#0a0a0f" stroke="#333" strokeWidth="2"/>
      <circle cx="310" cy="190" r="10" fill="#1a1a2e" stroke="#555" strokeWidth="1.5"/>
      <rect x="250" y="110" width="32" height="60" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3,3"/>
      <rect x="368" y="70" width="8" height="20" rx="4" fill="#e85d26" opacity="0.8"/>
      <text x="200" y="88" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="10" fill="rgba(255,255,255,0.15)" letterSpacing="8">RIDEFLOW</text>
    </svg>
  );
}

function ArrowLeftIcon({ className = "booking-action-icon" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function TicketIcon({ className = "booking-action-icon" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 8.5A2.5 2.5 0 0 0 6.5 6H17.5A2.5 2.5 0 0 0 20 8.5V10a2 2 0 1 0 0 4v1.5a2.5 2.5 0 0 0-2.5 2.5H6.5A2.5 2.5 0 0 0 4 15.5V14a2 2 0 1 0 0-4V8.5Z" />
      <path d="M9 8v8" />
      <path d="M15 8v8" />
    </svg>
  );
}

function MiniBusIcon({ className = "booking-action-icon" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 14h14" />
      <path d="M7 17.5V19" />
      <path d="M17 17.5V19" />
      <path d="M5 17.5V9a7 7 0 0 1 14 0v8.5" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}

function ChairIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 11V7a2 2 0 1 1 4 0v4" />
      <path d="M7 11h6a3 3 0 0 1 3 3v1H4v-1a3 3 0 0 1 3-3Z" />
      <path d="M6 15v4" />
      <path d="M14 15v4" />
    </svg>
  );
}

function CheckIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection({ progress }) {
  let busStyle = {};
  let heroOpacity = 1;
  let hintOpacity = 1;
  let overlayOpacity = 0;
  let groundOpacity = 0;

  if (progress < 0.4) {
    const p = progress / 0.4;
    busStyle = { transform: `scale(${1 + p * 0.3}) translateY(${p * -10}px)`, opacity: 1 };
    heroOpacity = 1 - p * 0.6;
    hintOpacity = Math.max(0, 1 - p * 2);
    groundOpacity = p * 0.8;
  } else if (progress < 0.75) {
    const p = (progress - 0.4) / 0.35;
    busStyle = { transform: `scale(${1.3 + p * 8}) translateY(${-10 - p * 5}px)`, opacity: Math.max(0, 1 - p * 1.5) };
    heroOpacity = 0; hintOpacity = 0;
    overlayOpacity = Math.min(p * 1.2, 1);
    groundOpacity = Math.max(0, 0.8 - p);
  } else {
    busStyle = { opacity: 0 };
    overlayOpacity = 1;
  }

  return (
    <section className="hero-section" id="heroSection">
      <div className="sticky-scene">
        <div className="starfield" />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"40%", background:"linear-gradient(to top,#0d0d14 0%,transparent 100%)", opacity: groundOpacity }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,#1e1a2e 0%,#0a0a0f 100%)", opacity: overlayOpacity, pointerEvents:"none", zIndex:5 }} />
        <div className="hero-text" style={{ opacity: heroOpacity }}>
          <div className="label">Your journey starts here</div>
          <h1>Ride<span>Flow</span></h1>
        </div>
        <div style={{ position:"relative", zIndex:10, width:"min(500px,90vw)", transformOrigin:"center center", willChange:"transform", ...busStyle }}>
          <BusSVG />
        </div>
        <div className="scroll-hint" style={{ opacity: hintOpacity }}>
          <span>scroll to board</span>
          <div className="scroll-arrow" />
        </div>
      </div>
    </section>
  );
}

// ── SEAT BUTTON ───────────────────────────────────────────────────────────────
function Seat({ id, taken, selected, onClick }) {
  return (
    <button
      className={`seat ${taken ? "taken" : ""} ${selected ? "seat-sel" : ""}`}
      onClick={() => !taken && onClick(id)}
      disabled={taken}
      aria-label={`Seat ${id}${taken ? " taken" : selected ? " selected" : ""}`}
    >
      {!taken && id}
    </button>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function BusBooking({ trip, modifyBooking, onBack, onMyBookings }) {
  const [takenSeats, setTakenSeats] = useState(new Set());
  const STORAGE_KEY = trip ? `rideflow_taken_${trip.id}` : "rideflow_taken_seats";
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [passengers, setPassengers] = useState(1);
  const [warning, setWarning] = useState("");
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [confirmedSeats, setConfirmedSeats] = useState([]);

  // Load taken seats
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let taken = stored ? JSON.parse(stored) : (trip?.takenSeats || PRETAKEN);

    // if modifying, release the old seats so user can repick
    if (modifyBooking) {
      taken = taken.filter(s => !modifyBooking.seats.includes(s));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(taken));
    }

    setTakenSeats(new Set(taken));
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("heroSection");
      if (hero) setProgress(Math.min(window.scrollY / (hero.offsetHeight * 0.6), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-clear warning
  useEffect(() => {
    if (!warning) return;
    const t = setTimeout(() => setWarning(""), 3000);
    return () => clearTimeout(t);
  }, [warning]);

  const handleSeatClick = useCallback((id) => {
    setSelectedSeats(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else {
        if (next.size >= passengers) {
          setWarning(`You've set ${passengers} passenger${passengers > 1 ? "s" : ""}. Increase count or deselect first.`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }, [passengers]);

  const deselect = (id) => setSelectedSeats(prev => { const n = new Set(prev); n.delete(id); return n; });

  const incPassengers = () => { if (passengers < 6) setPassengers(p => p + 1); };
  const decPassengers = () => {
    if (passengers <= 1) return;
    const newCount = passengers - 1;
    setPassengers(newCount);
    setSelectedSeats(prev => new Set([...prev].sort().slice(0, newCount)));
  };

 const handleBook = () => {
    // if modifying, cancel the old booking first
    if (modifyBooking) {
      const bookings = JSON.parse(localStorage.getItem("rideflow_bookings") || "[]");
      const updated = bookings.map(b => b.ref === modifyBooking.ref ? { ...b, status: "cancelled" } : b);
      localStorage.setItem("rideflow_bookings", JSON.stringify(updated));
    }

    if (selectedSeats.size === 0) return;
    if (selectedSeats.size !== passengers) {
      setWarning(`Please select exactly ${passengers} seat${passengers > 1 ? "s" : ""}.`);
      return;
    }

    const newTaken = new Set([...takenSeats, ...selectedSeats]);
    setTakenSeats(newTaken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newTaken]));

    const ref = "RF-" + Math.random().toString(36).slice(2, 8).toUpperCase();

    // save booking to localStorage
    const pricePerSeat = trip?.price ?? PRICE;
    const newBooking = {
      ref,
      tripId: trip.id,
      from: trip.from,
      to: trip.to,
      date: trip.date,
      time: trip.time,
      price: pricePerSeat,
      seats: [...selectedSeats].sort(),
      status: "confirmed",
    };
    const existing = JSON.parse(localStorage.getItem("rideflow_bookings") || "[]");
    localStorage.setItem("rideflow_bookings", JSON.stringify([...existing, newBooking]));

    setBookingRef(ref);
    setConfirmedSeats([...selectedSeats].sort());
    setSelectedSeats(new Set());
    setModalOpen(true);
  };

  const sorted = [...selectedSeats].sort();
  const routeFrom = trip?.from ?? "Departure";
  const routeTo = trip?.to ?? "Destination";
  const routeTime = trip?.time ?? "--:--";
  const routeDate = trip?.date ?? "Date TBD";
  const pricePerSeat = trip?.price ?? PRICE;
  const total = selectedSeats.size * pricePerSeat;

  return (
    <>
      <FontLoader />
      <HeroSection progress={progress} />

      <section className="booking-section">
        <div className="booking-inner">

          {/* ── LEFT: SEAT MAP ── */}
          <div>
            <div className="booking-actions">
              <button className="booking-back-btn" onClick={onBack}>
                <ArrowLeftIcon />
                <span>Back to trips</span>
              </button>
              <button className="booking-mybookings-btn" onClick={onMyBookings}>
                <TicketIcon />
                <span>My Bookings</span>
              </button>
            </div>
            <div className="section-header">
              <div className="tag">Pick your spot</div>
              <h2>Choose<br />your seat</h2>
            </div>
            <div className="route-bar">
              <span className="city">{routeFrom}</span>
              <div className="arr" />
              <span className="city">{routeTo}</span>
              <div style={{ marginLeft:12 }}>
                <div className="detail"><strong>{routeTime}</strong>{routeDate}</div>
              </div>
            </div>

            <div className="legend">
              {[["ld-avail","Available"],["ld-selected","Your pick"],["ld-taken","Taken"]].map(([cls,label]) => (
                <div className="legend-item" key={cls}>
                  <div className={`legend-dot ${cls}`} /><span>{label}</span>
                </div>
              ))}
            </div>

            <div className="bus-floor">
              <div className="bus-front" />
              <div className="driver-zone">
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div className="driver-seat"><MiniBusIcon /></div>
                  <span className="driver-label">Driver</span>
                </div>
                <div className="door-marker">Door</div>
              </div>

              {/* Seat grid */}
              <div className="seat-grid">
                {Array.from({ length: ROWS }, (_, i) => i + 1).map(row => (
                  <div className="seat-row" key={row}>
                    <div className="row-num">{row}</div>
                    {[0,1].map(col => {
                      const id = `${row}${LETTERS[col]}`;
                      return <Seat key={id} id={id} taken={takenSeats.has(id)} selected={selectedSeats.has(id)} onClick={handleSeatClick} />;
                    })}
                    <div /> {/* aisle */}
                    {[2,3].map(col => {
                      const id = `${row}${LETTERS[col]}`;
                      return <Seat key={id} id={id} taken={takenSeats.has(id)} selected={selectedSeats.has(id)} onClick={handleSeatClick} />;
                    })}
                    <div className="row-num">{row}</div>
                  </div>
                ))}
              </div>

              <div className="bus-back">
                <span className="back-row-label">← Rear of Bus →</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: SUMMARY ── */}
          <div className="summary-panel">
            <div className="summary-card">
              <h3>Booking Summary</h3>

              <div className="passenger-counter">
                <div className="counter-label">
                  Passengers <strong>{passengers}</strong>
                </div>
                <div className="counter-btns">
                  <button className="counter-btn" onClick={decPassengers}>−</button>
                  <span className="counter-num">{passengers}</span>
                  <button className="counter-btn" onClick={incPassengers}>+</button>
                </div>
              </div>

              <div className="selected-seats-list">
                {selectedSeats.size === 0 ? (
                  <div className="no-seats-msg">
                    <ChairIcon />
                    <span>Tap a seat to select it</span>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexWrap:"wrap" }}>
                    {sorted.map(id => (
                      <div key={id} className="seat-tag" onClick={() => deselect(id)}>
                        <span>Seat {id}</span><span className="remove">×</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {warning && <div className="seat-warning">{warning}</div>}

              <div className="divider" />
              <div className="s-row"><span className="lbl">Seats selected</span><span className="val">{selectedSeats.size}</span></div>
              <div className="s-row"><span className="lbl">Price per seat</span><span className="val">KES {pricePerSeat.toLocaleString()}</span></div>
              <div className="s-row total"><span className="lbl">Total</span><span className="val">KES {total.toLocaleString()}</span></div>
              <div className="divider" />

              <button className="book-btn" onClick={handleBook} disabled={selectedSeats.size === 0}>
                Reserve Seats →
              </button>
            </div>

            <div className="info-card">
              <strong>No account needed</strong>
              Select your seats, confirm, and your booking reference is generated instantly. No login, no hassle.
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      <div className={`modal-backdrop ${modalOpen ? "open" : ""}`} onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="modal">
          <div className="modal-icon"><CheckIcon /></div>
          <h2>You're booked!</h2>
          <p>Your seats have been reserved. Show this reference at the terminal.</p>
          <div className="booking-ref">{bookingRef}</div>
          <div className="booked-seats-display">
            {confirmedSeats.map(id => <div key={id} className="booked-seat-chip">Seat {id}</div>)}
          </div>
          <button className="modal-close-btn" onClick={() => setModalOpen(false)}>Done, thanks!</button>
        </div>
      </div>
    </>
  );
}
