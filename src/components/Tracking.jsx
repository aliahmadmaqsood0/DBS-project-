import { useState } from 'react';
import { getTrackingTimeline } from '../data/helpers';

export default function Tracking() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault(); setError('');
    const q = query.trim().toUpperCase();
    if (!q) return;
    const r = getTrackingTimeline(q);
    if (!r) { setError(`No shipment or container found for "${q}"`); setResult(null); return; }
    setResult(r);
  };

  const quickIds = ['SH001', 'SH002', 'SH004', 'CN001', 'CN003'];

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/hero_banner.png" alt="Tracking" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>🔍 Tracking Timeline</h2>
            <p>Search by ShipmentID or ContainerID — aggregates all related data</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 250, marginBottom: 0 }}>
            <label>Enter ShipmentID or ContainerID</label>
            <input className="form-control" value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. SH001 or CN001" />
          </div>
          <button className="btn btn-primary" type="submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Track
          </button>
        </form>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: '30px' }}>Quick:</span>
          {quickIds.map((id, idx) => (
            <button key={id} className="btn btn-sm btn-secondary" style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${idx * 0.08}s` }}
              onClick={() => { setQuery(id); const r = getTrackingTimeline(id); if (r) { setResult(r); setError(''); } }}>{id}</button>
          ))}
        </div>
        {error && <div className="error-msg" style={{ marginTop: 14 }}>⚠ {error}</div>}
      </div>

      {result && (
        <div className="two-col">
          <div className="card">
            <div className="card-header"><h3>Shipment Overview</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ShipmentID</div><div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{result.shipment.ShipmentID}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Type</div><div style={{ fontSize: 14, fontWeight: 600 }}>{result.shipment.Type}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Date</div><div style={{ fontSize: 14 }}>{result.shipment.Date}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</div><span className={`badge ${result.shipment.Status.toLowerCase()}`}>{result.shipment.Status}</span></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CustomerID (FK)</div><div style={{ fontSize: 14, color: '#a78bfa' }}>{result.shipment.CustomerID}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Containers</div><div style={{ fontSize: 14, fontWeight: 600 }}>{result.containers.length}</div></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Timeline</h3></div>
            <div className="timeline">
              {result.timeline.map((t, i) => (
                <div className={`timeline-item ${t.status}`} key={i}>
                  <div className="timeline-title">{t.icon} {t.title}</div>
                  <div className="timeline-date">{t.date}</div>
                  <div className="timeline-detail">{t.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
