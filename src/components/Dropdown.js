'use client';
import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ value, options = [], onChange, placeholder = 'Selecionar' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const cur = options.find(o => o.value === value);
  return (
    <div className="dropdown" ref={ref}>
      <button type="button" className="dd-toggle" onClick={() => setOpen(!open)}>
        <span>{cur ? (<>{cur.icon && <span style={{marginRight:6}}>{cur.icon}</span>}{cur.label}</>) : placeholder}</span>
        <span style={{ color: '#FFD700' }}>▾</span>
      </button>
      {open && (
        <div className="dd-menu">
          {options.length === 0 && <div className="dd-item" style={{ opacity: 0.5 }}>Sem opções</div>}
          {options.map(o => (
            <div key={o.value} className="dd-item" onClick={() => { onChange(o.value); setOpen(false); }}>
              {o.icon && <span>{o.icon}</span>}
              <span>{o.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
