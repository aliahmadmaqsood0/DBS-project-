import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getCustomerById, getItemsByContainer, getTotalWeightByContainer, getTotalValueByContainer } from '../data/helpers';

export default function Shipments() {
  const { currentUser, canWrite } = useAuth();
  const { shipments, containers, customers, addShipment, updateShipment, deleteShipment } = useData();
  const isAdmin = currentUser?.Role === 'Admin';
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [expandedContainer, setExpandedContainer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ Type: 'Import', Date: '', Status: 'Placed', CustomerID: '' });

  const userShipments = isAdmin ? shipments :
    currentUser?.Role === 'Customer' ? shipments.filter(s => {
      const cust = customers.find(c => c.UserID === currentUser.UserID);
      return cust && s.CustomerID === cust.CustomerID;
    }) : shipments;

  const filtered = filter === 'All' ? userShipments : userShipments.filter(s => s.Status === filter);
  const statuses = ['All', 'Placed', 'InTransit', 'Stored', 'Settled', 'Completed'];

  const openAdd = () => {
    setEditItem(null);
    setForm({ Type: 'Import', Date: new Date().toISOString().split('T')[0], Status: 'Placed', CustomerID: customers[0]?.CustomerID || '' });
    setShowModal(true);
  };
  const openEdit = (sh) => {
    setEditItem(sh);
    setForm({ Type: sh.Type, Date: sh.Date, Status: sh.Status, CustomerID: sh.CustomerID });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editItem) updateShipment(editItem.ShipmentID, form);
    else addShipment(form);
    setShowModal(false);
  };

  const shipContainers = (shipmentID) => containers.filter(c => c.ShipmentID === shipmentID);

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/hero_banner.png" alt="Shipments" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>📦 Shipments</h2>
            <p>Manage all shipments with FK links to Customers, Containers & Goods</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <div>
          <div className="subtitle">{filtered.length} shipments found · {filter} filter</div>
        </div>
        {isAdmin && <button className="btn btn-primary" onClick={openAdd}>+ New Shipment</button>}
      </div>

      <div className="action-bar" style={{ marginBottom: 20 }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}>{s} {s !== 'All' && `(${userShipments.filter(sh => sh.Status === s).length})`}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ShipmentID</th><th>Type</th><th>Date</th><th>Status</th><th>CustomerID</th><th>Customer</th><th>Containers</th>{isAdmin && <th>Actions</th>}</tr></thead>
            <tbody>
              {filtered.map((sh, idx) => {
                const cust = getCustomerById(sh.CustomerID);
                const isExpanded = expanded === sh.ShipmentID;
                const ctrs = shipContainers(sh.ShipmentID);
                return [
                  <tr key={sh.ShipmentID} style={{ cursor: 'pointer', animation: `slideInLeft .4s ease backwards`, animationDelay: `${idx * 0.05}s` }} onClick={() => setExpanded(isExpanded ? null : sh.ShipmentID)}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{sh.ShipmentID}</td>
                    <td><span className={`badge ${sh.Type.toLowerCase()}`}>{sh.Type}</span></td>
                    <td>{sh.Date}</td>
                    <td><span className={`badge ${sh.Status.toLowerCase()}`}>{sh.Status}</span></td>
                    <td style={{ color: '#a78bfa' }}>{sh.CustomerID}</td>
                    <td>{cust?.CompanyName || 'N/A'}</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{ctrs.length}</td>
                    {isAdmin && (
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-xs btn-secondary" onClick={() => openEdit(sh)}>✏️</button>
                          <button className="btn btn-xs btn-danger" onClick={() => deleteShipment(sh.ShipmentID)}>🗑</button>
                        </div>
                      </td>
                    )}
                  </tr>,
                  isExpanded && (
                    <tr key={sh.ShipmentID + '-exp'}>
                      <td colSpan={isAdmin ? 8 : 7} style={{ padding: 0 }}>
                        <div style={{ padding: '18px 26px', background: 'rgba(0,0,0,0.2)', animation: 'slideUp .3s ease' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#a78bfa' }}>
                            📦 Containers linked to {sh.ShipmentID} ({ctrs.length})
                          </div>
                          {ctrs.length === 0 ? <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No containers assigned</div> : (
                            <table>
                              <thead><tr><th>ContainerID</th><th>Size</th><th>Type</th><th>Status</th><th>Items</th></tr></thead>
                              <tbody>
                                {ctrs.map(c => {
                                  const items = getItemsByContainer(c.ContainerID);
                                  const isCtrExp = expandedContainer === c.ContainerID;
                                  return [
                                    <tr key={c.ContainerID}>
                                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{c.ContainerID}</td>
                                      <td>{c.Size}</td><td>{c.Type}</td>
                                      <td><span className={`badge ${c.Status.toLowerCase()}`}>{c.Status}</span></td>
                                      <td>
                                        <button className="btn btn-xs btn-secondary" onClick={e => { e.stopPropagation(); setExpandedContainer(isCtrExp ? null : c.ContainerID); }}>
                                          {isCtrExp ? '▲ Hide' : `▼ ${items.length} Items`}
                                        </button>
                                      </td>
                                    </tr>,
                                    isCtrExp && (
                                      <tr key={c.ContainerID + '-items'}>
                                        <td colSpan={5} style={{ padding: 0 }}>
                                          <div className="goods-list" style={{ animation: 'slideUp .3s ease' }}>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', marginBottom: 10 }}>
                                              📋 Goods inside {c.ContainerID} — Weight: {getTotalWeightByContainer(c.ContainerID).toLocaleString()} kg | Value: ${getTotalValueByContainer(c.ContainerID).toLocaleString()}
                                            </div>
                                            {items.map(item => (
                                              <div className="goods-item" key={item.ItemID}>
                                                <span className="item-id">{item.ItemID}</span>
                                                <span className="item-desc">{item.Description}</span>
                                                <span className="item-meta">{item.Weight.toLocaleString()} kg</span>
                                                <span className="item-meta">Qty: {item.Quantity}</span>
                                                <span className="item-meta">${item.Value.toLocaleString()}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </td>
                                      </tr>
                                    )
                                  ];
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? `✏️ Edit ${editItem.ShipmentID}` : '📦 New Shipment'}</h3>
            <div className="form-group">
              <label>Type</label>
              <select className="form-control" value={form.Type} onChange={e => setForm({ ...form, Type: e.target.value })}>
                <option>Import</option><option>Export</option><option>Transit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input className="form-control" type="date" value={form.Date} onChange={e => setForm({ ...form, Date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.Status} onChange={e => setForm({ ...form, Status: e.target.value })}>
                {['Placed','InTransit','Stored','Settled','Completed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Customer</label>
              <select className="form-control" value={form.CustomerID} onChange={e => setForm({ ...form, CustomerID: e.target.value })}>
                {customers.map(c => <option key={c.CustomerID} value={c.CustomerID}>{c.CustomerID} — {c.CompanyName}</option>)}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editItem ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
