import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculateInvoiceAmount } from '../data/helpers';
import { useState, useEffect, useRef } from 'react';

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = typeof value === 'number' ? value : parseInt(value) || 0;
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { start = num; clearInterval(timer); }
      setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span ref={ref} className="animated-value">{prefix}{display.toLocaleString()}{suffix}</span>;
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { shipments, containers, yardSlots, invoices, trucks, customsClearances, dispatches, clearances } = useData();

  const totalShipments = shipments.length;
  const activeContainers = containers.filter(c => c.Status === 'Stored' || c.Status === 'InTransit').length;
  const occupiedSlots = yardSlots.filter(s => s.SlotStatus === 'Occupied').length;
  const freeSlots = yardSlots.filter(s => s.SlotStatus === 'Free').length;
  const reservedSlots = yardSlots.filter(s => s.SlotStatus === 'Reserved').length;
  const totalSlots = yardSlots.length;
  const pendingClearances = clearances.filter(c => c.Status !== 'Cleared').length;
  const activeTrucks = trucks.filter(t => t.Status === 'OnRoute').length;

  const s = {
    Placed: shipments.filter(sh => sh.Status === 'Placed').length,
    InTransit: shipments.filter(sh => sh.Status === 'InTransit').length,
    Stored: shipments.filter(sh => sh.Status === 'Stored').length,
    Settled: shipments.filter(sh => sh.Status === 'Settled').length,
    Completed: shipments.filter(sh => sh.Status === 'Completed').length,
  };

  const arriving = shipments.filter(x => x.Type === 'Import').length;
  const departing = shipments.filter(x => x.Type === 'Export').length;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const barVals = [45, 62, 38, 78, 90, 55, 30];
  const maxBar = Math.max(...barVals);

  let cumPct = 0;
  const segments = [
    { label: 'Occupied', val: occupiedSlots, color: '#f87171' },
    { label: 'Available', val: freeSlots, color: '#3b82f6' },
    { label: 'Reserved', val: reservedSlots, color: '#fbbf24' },
  ];
  const gradParts = segments.map(seg => {
    const pct = (seg.val / totalSlots) * 100;
    const part = `${seg.color} ${cumPct}% ${cumPct + pct}%`;
    cumPct += pct;
    return part;
  });

  const c20 = containers.filter(c => c.Size === '20ft').length;
  const c40 = containers.filter(c => c.Size === '40ft').length;
  const cReef = containers.filter(c => c.Type === 'Refrigerated').length;
  const cTotal = containers.length;

  const recent = [
    ...shipments.slice(-3).map(sh => ({ type: 'shipment', id: sh.ShipmentID, title: `Shipment ${sh.ShipmentID}`, sub: `${sh.Type} → ${sh.Status}`, amount: null, time: sh.Date })),
    ...invoices.slice(-2).map(inv => { const b = calculateInvoiceAmount(inv.ShipmentID); return { type: 'invoice', id: inv.InvoiceID, title: `Invoice ${inv.InvoiceID}`, sub: `${inv.ShipmentID} → ${inv.Status}`, amount: `$${b.total.toFixed(2)}`, time: inv.IssueDate }; }),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const invList = invoices.map(inv => ({ id: inv.InvoiceID, amount: calculateInvoiceAmount(inv.ShipmentID).total, status: inv.Status }));
  const totalRev = invList.reduce((sum, i) => sum + i.amount, 0);
  const monthlyData = [50, 120, 90, 160, 140];

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/hero_banner.png" alt="DryPort Operations" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>Welcome back, {currentUser?.Name} 👋</h2>
            <p>Here's an overview of your dryport operations today</p>
          </div>
        </div>
        <div className="hero-3d">
          <img src="/images/yard_illustration.png" alt="" />
        </div>
      </div>

      {/* Hero Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div><div className="stat-value"><AnimatedCounter value={totalShipments} /></div><div className="stat-label">Total Shipments</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div><div className="stat-value"><AnimatedCounter value={activeContainers} /></div><div className="stat-label">Active Containers</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div><div className="stat-value"><AnimatedCounter value={Math.round(totalRev)} prefix="$" /></div><div className="stat-label">Total Revenue</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div><div className="stat-value"><AnimatedCounter value={activeTrucks} /></div><div className="stat-label">Active Trucks</div></div>
        </div>
      </div>

      {/* Row 1: 3 cards */}
      <div className="dash-grid">
        {/* Logistics Overview */}
        <div className="card">
          <div className="card-header">
            <h3>Logistics Overview</h3>
            <select className="form-control" style={{ width: 110, padding: '5px 10px', fontSize: 12 }}>
              <option>All Status</option><option>Import</option><option>Export</option>
            </select>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>↗ {arriving} Arriving</span> &nbsp;·&nbsp; <span style={{ color: '#fbbf24', fontWeight: 600 }}>↙ {departing} Departing</span>
          </div>
          <div className="chart-bar-group">
            {barVals.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="chart-bar" style={{ height: `${(v / maxBar) * 100}%`, background: i === 4 ? 'var(--gradient)' : 'linear-gradient(180deg, rgba(59,130,246,0.4), rgba(59,130,246,0.1))', borderRadius: '8px 8px 0 0', animationDelay: `${i * 0.1}s` }}></div>
                <div className="chart-bar-label">{days[i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Yard Utilization */}
        <div className="card">
          <div className="card-header"><h3>Yard Utilization</h3></div>
          <div className="donut-wrap">
            <div className="donut" style={{ background: `conic-gradient(${gradParts.join(', ')})` }}>
              <div className="donut-center"><AnimatedCounter value={Math.round((occupiedSlots / totalSlots) * 100)} suffix="%" /></div>
            </div>
            <div className="donut-legend">
              {segments.map(seg => (
                <div key={seg.label}><span className="dot" style={{ background: seg.color }}></span>{seg.label} — {seg.val}</div>
              ))}
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>Total Slots: {totalSlots}</div>
            </div>
          </div>
        </div>

        {/* Container Inventory */}
        <div className="card">
          <div className="card-header"><h3>Container Inventory</h3></div>
          <div className="container-stats-grid">
            <div className="container-stat"><div className="val"><AnimatedCounter value={c20} /></div><div className="lbl">20ft</div></div>
            <div className="container-stat"><div className="val"><AnimatedCounter value={c40} /></div><div className="lbl">40ft</div></div>
            <div className="container-stat"><div className="val"><AnimatedCounter value={cReef} /></div><div className="lbl">Reefer</div></div>
            <div className="container-stat"><div className="val"><AnimatedCounter value={cTotal} /></div><div className="lbl">Total</div></div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--text-sec)' }}>Status Breakdown</div>
            <div className="status-row"><span>In Transit</span><span className="val">{s.InTransit}</span><span>Stored</span><span className="val">{s.Stored}</span></div>
            <div className="status-row"><span>Pending</span><span className="val">{containers.filter(c => c.Status === 'Pending').length}</span><span>Released</span><span className="val">{containers.filter(c => c.Status === 'Released').length}</span></div>
          </div>
        </div>
      </div>

      {/* Row 2: 2 cards */}
      <div className="dash-grid-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header"><h3>Recent Activities</h3><span className="view-all">View all →</span></div>
          {recent.map((r, idx) => (
            <div className="activity-item" key={r.id} style={{ animation: 'slideInLeft .4s ease backwards', animationDelay: `${0.4 + idx * 0.1}s` }}>
              <div className="activity-icon" style={{ background: r.type === 'shipment' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)' }}>
                {r.type === 'shipment' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                )}
              </div>
              <div className="activity-info">
                <div className="title">{r.title}</div>
                <div className="sub">{r.sub}</div>
              </div>
              <div className="activity-amount">
                {r.amount || ''}<div className="time">{r.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="card">
          <div className="card-header"><h3>Financial Summary</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--text-sec)' }}>Revenue Trend</div>
              <svg viewBox="0 0 200 80" style={{ width: '100%', height: 80 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
                </defs>
                {/* Area fill */}
                <path fill="url(#areaGrad)" d={`M0,80 ${monthlyData.map((v, i) => `L${i * 50},${80 - (v / 200) * 80}`).join(' ')} L200,80 Z`} />
                <polyline fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  points={monthlyData.map((v, i) => `${i * 50},${80 - (v / 200) * 80}`).join(' ')}
                  style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'drawLine 2s ease forwards .5s' }} />
                {monthlyData.map((v, i) => (
                  <circle key={i} cx={i * 50} cy={80 - (v / 200) * 80} r="4" fill="#3b82f6" stroke="#0a0e1a" strokeWidth="2.5" style={{ animation: `popIn .3s ease backwards ${0.8 + i * 0.15}s` }} />
                ))}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                {['Jan','Feb','Mar','Apr','May'].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: 'var(--text-sec)' }}>Invoices</div>
              {invList.map(inv => (
                <div className="inv-list-item" key={inv.id}>
                  <span style={{ color: 'var(--accent)' }}>{inv.id}</span>
                  <span className="amount">${inv.amount.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 18, fontWeight: 900, color: 'var(--text)', textAlign: 'right', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Total: ${totalRev.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
