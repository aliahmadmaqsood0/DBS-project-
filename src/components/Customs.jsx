import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getUserById } from '../data/helpers';

export default function Customs() {
  const { currentUser } = useAuth();
  const { clearances, shipments, users, updateClearance, addClearance } = useData();
  const isAdmin = currentUser?.Role === 'Admin';
  const isOfficer = currentUser?.Role === 'CustomsOfficer';
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ShipmentID: '', OfficerID: '', Status: 'Pending', Remarks: '' });

  const userClearances = isAdmin ? clearances :
    isOfficer ? clearances.filter(c => c.OfficerID === currentUser.UserID) : clearances;

  const openAdd = () => {
    const officers = users.filter(u => u.Role === 'CustomsOfficer');
    setForm({ ShipmentID: shipments[0]?.ShipmentID || '', OfficerID: officers[0]?.UserID || '', Status: 'Pending', ClearanceDate: null, Remarks: '' });
    setShowModal(true);
  };
  const handleSave = () => { addClearance(form); setShowModal(false); };
  const handleStatusChange = (c, newStatus) => {
    const update = { Status: newStatus };
    if (newStatus === 'Cleared') update.ClearanceDate = new Date().toISOString().split('T')[0];
    updateClearance(c.ClearanceID, update);
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/customs_clearance.png" alt="Customs" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>🛂 Customs Clearance</h2>
            <p>Clearance records — Officer assignment and status workflow</p>
          </div>
        </div>
        <div className="hero-3d">
          <img src="/images/customs_clearance.png" alt="" />
        </div>
      </div>

      <div className="page-header">
        <div className="subtitle">{userClearances.length} records</div>
        {isAdmin && <button className="btn btn-primary" onClick={openAdd}>+ New Clearance</button>}
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-icon blue">📋</div><div><div className="stat-value">{userClearances.length}</div><div className="stat-label">Total Records</div></div></div>
        <div className="stat-card"><div className="stat-icon green">✅</div><div><div className="stat-value">{userClearances.filter(c => c.Status === 'Cleared').length}</div><div className="stat-label">Cleared</div></div></div>
        <div className="stat-card"><div className="stat-icon amber">⏳</div><div><div className="stat-value">{userClearances.filter(c => c.Status === 'Pending' || c.Status === 'UnderReview').length}</div><div className="stat-label">Pending</div></div></div>
        <div className="stat-card"><div className="stat-icon red">❌</div><div><div className="stat-value">{userClearances.filter(c => c.Status === 'Rejected').length}</div><div className="stat-label">Rejected</div></div></div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ClearanceID</th><th>ShipmentID</th><th>OfficerID</th>
                <th>Officer</th><th>Status</th><th>Date</th><th>Remarks</th>
                {(isAdmin || isOfficer) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {userClearances.map((c, idx) => {
                const officer = getUserById(c.OfficerID);
                return (
                  <tr key={c.ClearanceID} style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${idx * 0.05}s` }}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{c.ClearanceID}</td>
                    <td style={{ color: '#a78bfa', fontWeight: 600 }}>{c.ShipmentID}</td>
                    <td style={{ color: '#a78bfa' }}>{c.OfficerID}</td>
                    <td>{officer?.Name || 'N/A'}</td>
                    <td><span className={`badge ${c.Status.toLowerCase()}`}>{c.Status}</span></td>
                    <td>{c.ClearanceDate || '—'}</td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                      {c.Remarks || '—'}
                    </td>
                    {(isAdmin || isOfficer) && (
                      <td>
                        {c.Status !== 'Cleared' && (
                          <div style={{ display: 'flex', gap: 5 }}>
                            {c.Status === 'Pending' && <button className="btn btn-xs btn-secondary" onClick={() => handleStatusChange(c, 'UnderReview')}>Review</button>}
                            <button className="btn btn-xs btn-success" onClick={() => handleStatusChange(c, 'Cleared')}>✓ Clear</button>
                            <button className="btn btn-xs btn-danger" onClick={() => handleStatusChange(c, 'Rejected')}>✕</button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>🛂 New Clearance Record</h3>
            <div className="form-group"><label>Shipment</label>
              <select className="form-control" value={form.ShipmentID} onChange={e => setForm({ ...form, ShipmentID: e.target.value })}>
                {shipments.map(s => <option key={s.ShipmentID} value={s.ShipmentID}>{s.ShipmentID} — {s.Type}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Officer</label>
              <select className="form-control" value={form.OfficerID} onChange={e => setForm({ ...form, OfficerID: e.target.value })}>
                {users.filter(u => u.Role === 'CustomsOfficer').map(u => <option key={u.UserID} value={u.UserID}>{u.UserID} — {u.Name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Remarks</label>
              <input className="form-control" value={form.Remarks} onChange={e => setForm({ ...form, Remarks: e.target.value })} placeholder="Optional remarks..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
