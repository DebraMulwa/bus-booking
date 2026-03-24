"use client";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  :root {
    --ink: #0a0a0f; --paper: #f5f3ee; --cream: #ede9e0;
    --accent: #e85d26; --accent2: #2d6be4; --muted: #9a9488;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--paper); font-family:'Poppins',sans-serif; }

  .bookings-page { min-height:100vh; background:var(--paper); }

  /* HEADER */
  .bookings-hero {
    background: var(--ink); padding: 48px 24px 60px; position:relative; overflow:hidden;
  }
  .bookings-hero::before {
    content:''; position:absolute; inset:0;
    background-image:
      radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,0.4) 0%,transparent 100%),
      radial-gradient(1px 1px at 80% 10%,rgba(255,255,255,0.3) 0%,transparent 100%),
      radial-gradient(1.5px 1.5px at 60% 70%,rgba(255,255,255,0.3) 0%,transparent 100%);
    background-size:300px 300px,250px 250px,400px 400px;
  }
  .bookings-hero-inner { max-width:640px; margin:0 auto; position:relative; z-index:1; }
  .back-btn {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
    color:#f5f3ee; padding:8px 16px; border-radius:10px; cursor:pointer;
    font-family:'Poppins',sans-serif; font-size:0.78rem; font-weight:600;
    margin-bottom:24px; transition:all 0.2s;
  }
  .back-btn:hover { background:rgba(255,255,255,0.15); }
  .bookings-hero .label {
    font-size:0.65rem; letter-spacing:0.3em; color:var(--accent);
    text-transform:uppercase; margin-bottom:10px; display:block;
  }
  .bookings-hero h1 {
    font-family:'Poppins',sans-serif; font-size:clamp(1.8rem,4vw,2.8rem);
    font-weight:800; color:#f5f3ee; line-height:1.1; letter-spacing:-0.02em; margin-bottom:8px;
  }
  .bookings-hero p { color:var(--muted); font-size:0.85rem; }

  /* LOOKUP FORM */
  .lookup-form {
    background:white; border-radius:16px; padding:8px;
    display:flex; gap:8px; margin-top:28px;
    box-shadow:0 8px 32px rgba(0,0,0,0.2);
  }
  .lookup-input {
    flex:1; padding:12px 16px; border:none; border-radius:10px;
    font-family:'Poppins',sans-serif; font-size:0.85rem; color:var(--ink);
    background:var(--cream); outline:none; letter-spacing:0.05em;
  }
  .lookup-input::placeholder { color:var(--muted); }
  .lookup-btn {
    padding:12px 24px; background:var(--accent); color:white; border:none;
    border-radius:10px; font-family:'Poppins',sans-serif; font-weight:700;
    font-size:0.78rem; letter-spacing:0.05em; text-transform:uppercase;
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .lookup-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(232,93,38,0.3); }

  /* CONTENT */
  .bookings-content { max-width:640px; margin:0 auto; padding:48px 24px; }

  /* EMPTY STATE */
  .empty-state {
    text-align:center; padding:60px 24px; color:var(--muted);
  }
  .empty-state .icon { font-size:3rem; margin-bottom:16px; }
  .empty-state h3 { font-family:'Poppins',sans-serif; font-size:1.1rem; color:var(--ink); margin-bottom:8px; font-weight:700; }
  .empty-state p { font-size:0.85rem; line-height:1.6; }

  /* NOT FOUND */
  .not-found {
    background:#fff3f0; border:1.5px solid rgba(232,93,38,0.2);
    border-radius:16px; padding:24px; text-align:center; margin-top:8px;
  }
  .not-found .icon { font-size:2rem; margin-bottom:12px; }
  .not-found h3 { font-family:'Poppins',sans-serif; font-size:1rem; color:var(--ink); margin-bottom:6px; font-weight:700; }
  .not-found p { font-size:0.82rem; color:var(--muted); }

  /* BOOKING CARD */
  .booking-card {
    background:white; border-radius:20px; padding:28px;
    border:1.5px solid rgba(0,0,0,0.06);
    box-shadow:0 4px 20px rgba(0,0,0,0.06);
    animation: cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes cardIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }

  .card-top {
    display:flex; justify-content:space-between; align-items:flex-start;
    margin-bottom:20px; flex-wrap:wrap; gap:12px;
  }
  .booking-ref-badge {
    font-family:'Poppins',sans-serif; font-size:0.75rem; font-weight:700;
    letter-spacing:0.15em; color:var(--accent);
    background:#fff3f0; padding:6px 12px; border-radius:8px;
    border:1px solid rgba(232,93,38,0.2);
  }
  .status-badge {
    font-size:0.72rem; font-weight:700; padding:6px 12px; border-radius:8px;
    font-family:'Poppins',sans-serif; letter-spacing:0.05em;
  }
  .status-badge.confirmed { background:#e8f5e9; color:#2e7d32; }
  .status-badge.cancelled { background:#fce4ec; color:#c62828; }

  .card-route {
    display:flex; align-items:center; gap:12px; margin-bottom:20px;
  }
  .card-city {
    font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink);
  }
  .card-arrow {
    flex:1; max-width:60px; height:1px;
    background:linear-gradient(to right,var(--ink),var(--accent));
    position:relative;
  }
  .card-arrow::after {
    content:'→'; position:absolute; right:-8px; top:50%; transform:translateY(-50%);
    color:var(--accent); font-size:0.85rem;
  }

  .card-meta {
    display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;
  }
  .card-meta-item .meta-label {
    font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--muted); margin-bottom:3px;
  }
  .card-meta-item .meta-val {
    font-family:'Poppins',sans-serif; font-size:0.88rem; font-weight:600; color:var(--ink);
  }

  .seats-list {
    display:flex; flex-wrap:wrap; gap:6px; margin-bottom:20px;
  }
  .seat-chip {
    background:var(--cream); border-radius:8px; padding:5px 10px;
    font-family:'Poppins',sans-serif; font-size:0.78rem; font-weight:700; color:var(--ink);
  }
  .seat-chip.cancelled-seat {
    background:#fce4ec; color:#c62828; text-decoration:line-through;
  }

  .card-divider { height:1px; background:rgba(0,0,0,0.06); margin:20px 0; }

  .card-total {
    display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;
  }
  .card-total .lbl { font-size:0.82rem; color:var(--muted); }
  .card-total .val { font-family:'Poppins',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink); }

  .card-actions { display:flex; gap:10px; flex-wrap:wrap; }
  .action-btn {
    flex:1; padding:12px; border:none; border-radius:12px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:0.78rem;
    letter-spacing:0.05em; text-transform:uppercase; cursor:pointer;
    transition:all 0.2s; min-width:120px;
  }
  .action-btn.modify {
    background:var(--ink); color:var(--paper);
  }
  .action-btn.modify:hover { background:#1e1e2e; transform:translateY(-1px); }
  .action-btn.cancel {
    background:white; color:#c62828;
    border:1.5px solid rgba(198,40,40,0.2);
  }
  .action-btn.cancel:hover { background:#fce4ec; transform:translateY(-1px); }

  /* CANCEL CONFIRM */
  .cancel-confirm {
    background:#fff3f0; border:1.5px solid rgba(232,93,38,0.2);
    border-radius:16px; padding:24px; margin-top:16px;
    animation: cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .cancel-confirm h4 { font-family:'Poppins',sans-serif; font-weight:700; font-size:0.95rem; margin-bottom:8px; }
  .cancel-confirm p { font-size:0.82rem; color:var(--muted); margin-bottom:16px; line-height:1.6; }
  .confirm-btns { display:flex; gap:10px; }
  .confirm-btn {
    flex:1; padding:10px; border:none; border-radius:10px;
    font-family:'Poppins',sans-serif; font-weight:700; font-size:0.78rem;
    letter-spacing:0.05em; text-transform:uppercase; cursor:pointer; transition:all 0.2s;
  }
  .confirm-btn.yes { background:#c62828; color:white; }
  .confirm-btn.yes:hover { background:#b71c1c; }
  .confirm-btn.no { background:var(--cream); color:var(--ink); }
  .confirm-btn.no:hover { background:#ddd; }
`;

const PRICE_PER_SEAT = 1200;
const STORAGE_KEY = "rideflow_bookings";

function getBookings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export default function MyBookings({ onBack, onModify }) {
  const [refInput, setRefInput] = useState("");
  const [booking, setBooking] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [searched, setSearched] = useState(false);
  const bookingPrice = booking?.price ?? PRICE_PER_SEAT;

  const handleLookup = () => {
    const ref = refInput.trim().toUpperCase();
    if (!ref) return;
    const bookings = getBookings();
    const found = bookings.find((b) => b.ref === ref);
    setSearched(true);
    if (found) {
      setBooking(found);
      setNotFound(false);
    } else {
      setBooking(null);
      setNotFound(true);
    }
    setShowCancelConfirm(false);
  };

  const handleCancel = () => {
    const bookings = getBookings();
    const updated = bookings.map((b) =>
      b.ref === booking.ref ? { ...b, status: "cancelled" } : b
    );
    saveBookings(updated);
    setBooking({ ...booking, status: "cancelled" });
    setShowCancelConfirm(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="bookings-page">

        {/* HERO */}
        <div className="bookings-hero">
          <div className="bookings-hero-inner">
            <button className="back-btn" onClick={onBack}>← Back to trips</button>
            <span className="label">Manage your trip</span>
            <h1>My Bookings</h1>
            <p>Enter your booking reference to view, modify or cancel your reservation.</p>

            <div className="lookup-form">
              <input
                className="lookup-input"
                placeholder="Enter reference e.g. RF-ABC123"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
              <button className="lookup-btn" onClick={handleLookup}>Find →</button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="bookings-content">

          {/* default empty */}
          {!searched && (
            <div className="empty-state">
              <div className="icon">🎫</div>
              <h3>Find your booking</h3>
              <p>Type in the reference code you received<br />when you booked your seats.</p>
            </div>
          )}

          {/* not found */}
          {notFound && (
            <div className="not-found">
              <div className="icon">🔍</div>
              <h3>No booking found</h3>
              <p>We couldn't find a booking with that reference.<br />Double check and try again.</p>
            </div>
          )}

          {/* booking card */}
          {booking && (
            <div className="booking-card">
              <div className="card-top">
                <div className="booking-ref-badge">{booking.ref}</div>
                <div className={`status-badge ${booking.status}`}>
                  {booking.status === "confirmed" ? "✓ Confirmed" : "✕ Cancelled"}
                </div>
              </div>

              <div className="card-route">
                <span className="card-city">{booking.from}</span>
                <div className="card-arrow" />
                <span className="card-city">{booking.to}</span>
              </div>

              <div className="card-meta">
                <div className="card-meta-item">
                  <div className="meta-label">Date</div>
                  <div className="meta-val">{booking.date}</div>
                </div>
                <div className="card-meta-item">
                  <div className="meta-label">Departure</div>
                  <div className="meta-val">{booking.time}</div>
                </div>
                <div className="card-meta-item">
                  <div className="meta-label">Passengers</div>
                  <div className="meta-val">{booking.seats.length}</div>
                </div>
              </div>

              <div className="meta-label" style={{ marginBottom:8 }}>Seats</div>
              <div className="seats-list">
                {booking.seats.map((s) => (
                  <div key={s} className={`seat-chip ${booking.status === "cancelled" ? "cancelled-seat" : ""}`}>
                    Seat {s}
                  </div>
                ))}
              </div>

              <div className="card-divider" />

              <div className="card-total">
                <span className="lbl">Total paid</span>
                <span className="val">KES {(booking.seats.length * bookingPrice).toLocaleString()}</span>
              </div>

              {booking.status === "confirmed" && (
                <div className="card-actions">
                  <button className="action-btn modify" onClick={() => onModify(booking)}>
                    ✎ Modify Seats
                  </button>
                  <button className="action-btn cancel" onClick={() => setShowCancelConfirm(true)}>
                    ✕ Cancel Booking
                  </button>
                </div>
              )}

              {showCancelConfirm && (
                <div className="cancel-confirm">
                  <h4>Cancel this booking?</h4>
                  <p>Your seats will be released and made available to others. This cannot be undone.</p>
                  <div className="confirm-btns">
                    <button className="confirm-btn yes" onClick={handleCancel}>Yes, cancel it</button>
                    <button className="confirm-btn no" onClick={() => setShowCancelConfirm(false)}>Keep it</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
