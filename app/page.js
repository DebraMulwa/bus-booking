"use client";
import { useState, useEffect } from "react";
import TripsPage from "./components/TripsPage";
import BusBooking from "./components/BusBooking";
import MyBookings from "./components/MyBookings";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Poppins',sans-serif; overflow-x:hidden; }
  .hero-wrap { height: 250vh; position: relative; }
  .sticky-scene {
    position: sticky; top: 0; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #0a0a0f; overflow: hidden;
  }
  .starfield {
    position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 30%,#1a1830 0%,#0a0a0f 70%);
  }
  .starfield::before {
    content:''; position:absolute; inset:0;
    background-image:
      radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),
      radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.4) 0%,transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.5) 0%,transparent 100%),
      radial-gradient(1px 1px at 90% 50%,rgba(255,255,255,0.4) 0%,transparent 100%);
    background-size:300px 300px,250px 250px,400px 400px,280px 280px;
  }
  .hero-text {
    position:absolute; top:12%; left:50%; transform:translateX(-50%);
    text-align:center; z-index:20; pointer-events:none; white-space:nowrap;
  }
  .hero-text .label {
    font-size:0.7rem; letter-spacing:0.3em; color:#e85d26;
    text-transform:uppercase; margin-bottom:8px; display:block;
  }
  .hero-text h1 {
    font-family:'Poppins',sans-serif; font-size:clamp(2.5rem,6vw,4.5rem);
    font-weight:800; color:#f5f3ee; line-height:1; letter-spacing:-0.02em;
  }
  .hero-text h1 span { color:#e85d26; }
  .scroll-hint {
    position:absolute; bottom:8%; left:50%; transform:translateX(-50%);
    z-index:20; display:flex; flex-direction:column; align-items:center; gap:8px;
  }
  .scroll-hint span { font-size:0.65rem; letter-spacing:0.25em; color:#9a9488; text-transform:uppercase; }
  .scroll-arrow { width:1px; height:40px; background:linear-gradient(to bottom,#9a9488,transparent); animation:scrollPulse 2s ease-in-out infinite; }
  @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
`;

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
      <rect x="368" y="70" width="8" height="20" rx="4" fill="#e85d26" opacity="0.8"/>
      <text x="200" y="88" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="10" fill="rgba(255,255,255,0.15)" letterSpacing="8">RIDEFLOW</text>
    </svg>
  );
}

export default function Home() {
  const [view, setView] = useState("trips"); // trips | booking | mybookings
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modifyBooking, setModifyBooking] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("heroWrap");
      if (!heroEl) return;
      const p = Math.min(window.scrollY / (heroEl.offsetHeight * 0.55), 1);
      setProgress(p);
      if (p >= 1) setShowContent(true);
      else setShowContent(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const busScale = 1 + progress * 9;
  const busOpacity = Math.max(0, 1 - progress * 1.8);
  const heroOpacity = Math.max(0, 1 - progress * 2.5);
  const hintOpacity = Math.max(0, 1 - progress * 3);

  if (showContent) {
    if (view === "booking" && selectedTrip) {
      return (
        <BusBooking
          trip={selectedTrip}
          modifyBooking={modifyBooking}
          onBack={() => { setView("trips"); setModifyBooking(null); }}
          onMyBookings={() => setView("mybookings")}
        />
      );
    }
    if (view === "mybookings") {
      return (
        <MyBookings
          onBack={() => setView("trips")}
          onModify={(booking) => {
            setModifyBooking(booking);
            setSelectedTrip({ id: booking.tripId, from: booking.from, to: booking.to, date: booking.date, time: booking.time, price: booking.price ?? 1200 });
            setView("booking");
          }}
        />
      );
    }
    return (
      <TripsPage
        onSelectTrip={(trip) => { setSelectedTrip(trip); setView("booking"); }}
        onMyBookings={() => setView("mybookings")}
      />
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="hero-wrap" id="heroWrap">
        <div className="sticky-scene">
          <div className="starfield" />
          <div className="hero-text" style={{ opacity: heroOpacity }}>
            <span className="label">Your journey starts here</span>
            <h1>Ride<span>Flow</span></h1>
          </div>
          <div style={{ position:"relative", zIndex:10, width:"min(500px,90vw)", transformOrigin:"center center", transform:`scale(${busScale})`, opacity: busOpacity }}>
            <BusSVG />
          </div>
          <div className="scroll-hint" style={{ opacity: hintOpacity }}>
            <span>scroll to board</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </div>
    </>
  );
}
