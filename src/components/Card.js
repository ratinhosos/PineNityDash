'use client';
export default function Card({ icon, label, value, live = true }) {
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-icon">{icon}</div>
        {live && <span className="live">Live</span>}
      </div>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
    </div>
  );
}
