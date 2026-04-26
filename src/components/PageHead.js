'use client';
export default function PageHead({ icon, title, accent, subtitle, actions }) {
  return (
    <div className="page-head">
      <div className="page-title">
        <h1>{icon} {title} {accent && <span>{accent}</span>}</h1>
        <p>{subtitle}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{actions}</div>
    </div>
  );
}
