import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getContainerById, getItemsByContainer } from '../data/helpers';

export default function YardMap() {
  const { currentUser } = useAuth();
  const { yards, yardSlots, containers, assignSlot, releaseSlot } = useData();
  const isAdmin = currentUser?.Role === 'Admin';
  const [selectedYard, setSelectedYard] = useState(yards[0].YardID);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slots = yardSlots.filter(ys => ys.YardID === selectedYard);
  const yard = yards.find(y => y.YardID === selectedYard);
  const occupied = slots.filter(s => s.SlotStatus === 'Occupied').length;
  const reserved = slots.filter(s => s.SlotStatus === 'Reserved').length;
  const free = slots.length - occupied - reserved;
  const occPct = Math.round((occupied / slots.length) * 100);

  const slotDetail = selectedSlot ? slots.find(s => s.SlotID === selectedSlot) : null;
  const slotContainer = slotDetail?.ContainerID ? getContainerById(slotDetail.ContainerID) : null;
  const slotItems = slotContainer ? getItemsByContainer(slotContainer.ContainerID) : [];

  const unassignedContainers = containers.filter(c =>
    !yardSlots.some(ys => ys.ContainerID === c.ContainerID && ys.SlotStatus === 'Occupied')
    && (c.Status === 'Stored' || c.Status === 'Pending' || c.Status === 'InTransit')
  );

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/yard_illustration.png" alt="Yard" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>🏗️ Yard Map</h2>
            <p>Visual grid of YardSlots — click any slot to view or manage</p>
          </div>
        </div>
        <div className="hero-3d">
          <img src="/images/yard_illustration.png" alt="" />
        </div>
      </div>

      <div className="page-header">
        <div className="subtitle">{yard?.Name} — {yard?.Location}</div>
        <select className="form-control" style={{ width: 280 }} value={selectedYard} onChange={e => { setSelectedYard(e.target.value); setSelectedSlot(null); }}>
          {yards.map(y => <option key={y.YardID} value={y.YardID}>{y.Name} — {y.Location}</option>)}
        </select>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3"/></svg>
          </div>
          <div><div className="stat-value">{yard?.Name}</div><div className="stat-label">{yard?.Location}</div></div>
        </div>
        <div className="stat-card"><div className="stat-icon green">✅</div><div><div className="stat-value">{free}</div><div className="stat-label">Free Slots</div></div></div>
        <div className="stat-card"><div className="stat-icon red">📦</div><div><div className="stat-value">{occupied}</div><div className="stat-label">Occupied</div></div></div>
        <div className="stat-card"><div className="stat-icon amber">⏳</div><div><div className="stat-value">{reserved}</div><div className="stat-label">Reserved</div></div></div>
      </div>

      <div className="occupancy-bar" style={{ marginBottom: 22 }}>
        <div className="occupancy-fill" style={{ width: `${occPct}%` }}></div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header"><h3>Yard Grid — {yard?.Name}</h3></div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 18, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'rgba(16,185,129,0.5)', width: 12, height: 12, borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(16,185,129,0.3)' }}></span> Free</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'rgba(239,68,68,0.5)', width: 12, height: 12, borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(239,68,68,0.3)' }}></span> Occupied</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'rgba(245,158,11,0.5)', width: 12, height: 12, borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px rgba(245,158,11,0.3)' }}></span> Reserved</span>
          </div>
          <div className="yard-grid">
            {slots.map((s, idx) => (
              <div key={s.SlotID} className={`yard-slot ${s.SlotStatus.toLowerCase()}`}
                onClick={() => setSelectedSlot(s.SlotID)}
                style={{
                  outline: selectedSlot === s.SlotID ? '2px solid var(--accent)' : 'none',
                  outlineOffset: 3,
                  animation: `popIn .3s ease backwards`,
                  animationDelay: `${idx * 0.02}s`
                }}>
                {s.SlotStatus === 'Occupied' ? '📦' : s.SlotStatus === 'Reserved' ? '⏳' : '✓'}
                <span className="slot-id">{s.SlotID}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Slot Details</h3></div>
          {!slotDetail ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '50px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>🏗️</div>
              Click a slot to view details
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Slot ID</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{slotDetail.SlotID}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Yard (FK)</div><div style={{ fontSize: 13, fontWeight: 600 }}>{slotDetail.YardID}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</div><span className={`badge ${slotDetail.SlotStatus.toLowerCase()}`}>{slotDetail.SlotStatus}</span></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Container (FK)</div><div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{slotDetail.ContainerID || '—'}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Assigned</div><div style={{ fontSize: 13 }}>{slotDetail.AssignedDate || '—'}</div></div>
                <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Released</div><div style={{ fontSize: 13 }}>{slotDetail.ReleasedDate || 'Ongoing'}</div></div>
              </div>

              {isAdmin && slotDetail.SlotStatus === 'Free' && unassignedContainers.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 10 }}>⚡ Assign Container</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {unassignedContainers.slice(0, 5).map(c => (
                      <button key={c.ContainerID} className="btn btn-xs btn-success" onClick={() => assignSlot(slotDetail.SlotID, c.ContainerID)}>
                        {c.ContainerID} ({c.Size})
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {isAdmin && slotDetail.SlotStatus === 'Occupied' && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 8 }}>
                  <button className="btn btn-sm btn-danger" onClick={() => { releaseSlot(slotDetail.SlotID); setSelectedSlot(null); }}>📤 Release Slot</button>
                </div>
              )}

              {slotContainer && (
                <>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 10 }}>📦 Container Info</div>
                    <div style={{ fontSize: 13, color: 'var(--text-sec)' }}>Size: {slotContainer.Size} | Type: {slotContainer.Type} | Shipment: {slotContainer.ShipmentID}</div>
                  </div>
                  {slotItems.length > 0 && (
                    <div className="goods-list" style={{ marginTop: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 8 }}>📋 Goods Inside</div>
                      {slotItems.map(item => (
                        <div className="goods-item" key={item.ItemID}>
                          <span className="item-id">{item.ItemID}</span>
                          <span className="item-desc">{item.Description}</span>
                          <span className="item-meta">${item.Value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
