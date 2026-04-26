'use client';
export default function Tabs({ value, onChange, options }) {
  return (
    <div className="tabs">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
