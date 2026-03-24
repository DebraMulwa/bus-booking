"use client";
import { useState } from "react";
import tripsData from "../data/trips.json";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --ink: #0a0a0f; --paper: #f5f3ee; --cream: #ede9e0;
    --accent: #e85d26; --accent2: #2d6be4; --muted: #9a9488;
  }

  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--paper); font-family:'Poppins',sans-serif; }

  .trips-page { min-height:100vh; background:var(--paper); }

  /* HERO BANNER */
  .trips-hero {
    background: var(--ink);
    padding: 60px 24px 80px;
    position: relative;
    overflow: hidden;
  }
  .trips-hero::before {
    content:'';
    position:absolute; inset:0;
    background-image:
      radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.4) 0%,transparent 100%),
      radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.3) 0%,transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.3) 0%,transparent 100%),
      radial-gradient(1px 1px at 40% 90%,rgba(255,255,255,0.2) 0%,transparent 100%),
      radial-gradient(1px 1px at 90% 50%,rgba(255,255,255,0.3) 0%,transparent 100%);
    background-size:300px 300px,250px 250px,400px 400px,320px 320px,280px 280px;
  }
  .trips-hero-inner {
    max-width: 960px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .trips-hero .label {
    font-size:0.7rem; letter-spacing:0.3em; color:var(--accent);
    text-transform:uppercase; margin-bottom:12px; display:block;
  }
  .trips-hero h1 {
    font-family:'Poppins',sans-serif; font-size:clamp(2.2rem,5vw,3.5rem);
    font-weight:800; color:var(--paper); line-height:1; letter-spacing:-0.02em;
    margin-bottom:8px;
  }
  .trips-hero h1 span { color:var(--accent); }
  .trips-hero p {
    color:var(--muted); font-size:0.9rem; margin-top:12px;
  }

  /* SEARCH BAR */
  .search-bar {
    background: white;
    border-radius: 16px;
    padding: 8px;
    display: flex;
    gap: 8px;
    margin-top: 32px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    flex-wrap: wrap;
  }
  .search-select {
    flex: 1;
    min-width: 140px;
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    color: var(--ink);
    background: var(--cream);
    outline: none;
    cursor: pointer;
  }
  .search-btn {
    padding: 12px 28px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .search-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(232,93,38,0.3); }

  /* TRIPS LIST */
  .trips-list-section {
    max-width: 960px;
    margin: 0 auto;
    padding: 48px 24px;
  }
  .trips-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  .trips-header h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ink);
  }
  .trips-count {
    font-size: 0.78rem;
    color: var(--muted);
    background: var(--cream);
    padding: 6px 14px;
    border-radius: 20px;
  }

  /* TRIP CARD */
  .trip-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 16px;
    border: 1.5px solid rgba(0,0,0,0.06);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 20px;
    align-items: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .trip-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    border-color: var(--accent);
  }
  @media(max-width:600px) {
    .trip-card { grid-template-columns:1fr; }
  }

  .trip-route {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  .trip-city {
    font-family: 'Poppins', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--ink);
  }
  .trip-arrow {
    flex: 1;
    max-width: 80px;
    height: 1px;
    background: linear-gradient(to right, var(--ink), var(--accent));
    position: relative;
  }
  .trip-arrow::after {
    content: '→';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--accent);
    font-size: 0.9rem;
  }

  .trip-meta {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  .trip-meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .trip-meta-item .meta-label {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .trip-meta-item .meta-val {
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--ink);
  }

  .seats-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
  }
  .seats-badge.plenty { background: #e8f5e9; color: #2e7d32; }
  .seats-badge.limited { background: #fff3e0; color: #e65100; }
  .seats-badge.full { background: #fce4ec; color: #c62828; }

  .trip-card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
  .trip-price {
    font-family: 'Poppins', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--ink);
  }
  .trip-price span {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--muted);
  }
  .select-btn {
    padding: 10px 24px;
    background: var(--ink);
    color: var(--paper);
    border: none;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .select-btn::before {
    content:'';
    position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 60%);
  }
  .select-btn:hover { background: var(--accent); transform: translateY(-1px); }

  /* NO RESULTS */
  .no-results {
    text-align: center;
    padding: 60px 24px;
    color: var(--muted);
  }
  .no-results .icon { font-size: 3rem; margin-bottom: 16px; }
  .no-results h3 { font-family:'Poppins',sans-serif; font-size:1.1rem; color:var(--ink); margin-bottom:8px; }
  .no-results p { font-size:0.85rem; }
`;

const CITIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];

function TicketIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 8.5A2.5 2.5 0 0 0 6.5 6H17.5A2.5 2.5 0 0 0 20 8.5V10a2 2 0 1 0 0 4v1.5a2.5 2.5 0 0 0-2.5 2.5H6.5A2.5 2.5 0 0 0 4 15.5V14a2 2 0 1 0 0-4V8.5Z" />
      <path d="M9 8v8" />
      <path d="M15 8v8" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function BusIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 16h10" />
      <path d="M17 17.5V19a1 1 0 0 1-1 1v0a1 1 0 0 1-1-1v-1.5" />
      <path d="M8 17.5V19a1 1 0 0 1-1 1v0a1 1 0 0 1-1-1v-1.5" />
      <path d="M5 17.5V9a7 7 0 0 1 14 0v8.5" />
      <path d="M5 13h14" />
      <path d="M8 9h.01" />
      <path d="M16 9h.01" />
    </svg>
  );
}

export default function TripsPage({ onSelectTrip, onMyBookings }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [filtered, setFiltered] = useState(tripsData.trips);

  const handleSearch = () => {
    const results = tripsData.trips.filter((t) => {
      const matchFrom = from ? t.from === from : true;
      const matchTo = to ? t.to === to : true;
      return matchFrom && matchTo;
    });
    setFiltered(results);
  };

  const getAvailableSeats = (trip) => trip.totalSeats - trip.takenSeats.length;

  const getSeatsBadge = (available) => {
    if (available === 0) return { cls: "full", label: "Full" };
    if (available <= 10) return { cls: "limited", label: `${available} left` };
    return { cls: "plenty", label: `${available} available` };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="trips-page">

        {/* HERO */}
        <div className="trips-hero">
          <div className="trips-hero-inner">
            <span className="label">Where are you headed?</span>
            <h1>Find your<br /><span>next ride</span></h1>
            <p>Pick a trip below and choose your seat — no account needed.</p>
            <button
              className="mt-4 inline-flex min-h-[3.25rem] items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold leading-none text-[#f5f3ee] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg"
              onClick={onMyBookings}
            >
              <TicketIcon />
              <span>My Bookings</span>
            </button>
      
            <div className="search-bar">
              <select className="search-select" value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">From — any city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="search-select" value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="">To — any city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                className="inline-flex min-h-[3.5rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#e85d26] px-7 py-4 text-xs font-bold uppercase leading-none tracking-[0.22em] text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:min-w-[11rem]"
                onClick={handleSearch}
              >
                <span>Search</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* TRIPS LIST */}
        <div className="trips-list-section">
          <div className="trips-header">
            <h2>Available Trips</h2>
            <span className="trips-count">{filtered.length} trip{filtered.length !== 1 ? "s" : ""} found</span>
          </div>

          {filtered.length === 0 ? (
            <div className="no-results">
              <div className="icon" style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", color:"var(--accent)" }}>
                <BusIcon />
              </div>
              <h3>No trips found</h3>
              <p>Try a different route or clear your search.</p>
            </div>
          ) : (
            filtered.map((trip) => {
              const available = getAvailableSeats(trip);
              const badge = getSeatsBadge(available);
              return (
                <div className="trip-card" key={trip.id} onClick={() => onSelectTrip(trip)}>
                  <div>
                    <div className="trip-route">
                      <span className="trip-city">{trip.from}</span>
                      <div className="trip-arrow" />
                      <span className="trip-city">{trip.to}</span>
                    </div>
                    <div className="trip-meta">
                      <div className="trip-meta-item">
                        <span className="meta-label">Date</span>
                        <span className="meta-val">{trip.date}</span>
                      </div>
                      <div className="trip-meta-item">
                        <span className="meta-label">Departure</span>
                        <span className="meta-val">{trip.time}</span>
                      </div>
                      <div className="trip-meta-item">
                        <span className="meta-label">Seats</span>
                        <span className={`seats-badge ${badge.cls}`}>● {badge.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="trip-card-right">
                    <div className="trip-price">
                      KES {trip.price.toLocaleString()}
                      <span> /seat</span>
                    </div>
                    <button
                      className="inline-flex min-h-[3.25rem] min-w-[10rem] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#0a0a0f] px-6 py-4 text-xs font-bold uppercase leading-none tracking-[0.18em] text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-[#e85d26] hover:shadow-xl"
                      onClick={(e) => { e.stopPropagation(); onSelectTrip(trip); }}
                    >
                      <span>Select</span>
                      <ArrowRightIcon />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
