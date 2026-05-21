import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getShipmentById } from '../data/helpers';

export default function TruckDispatch() {
  const { currentUser } = useAuth();
  const { dispatches, drivers, trucks, shipments, addDispatch, updateDispatch, deleteDispatch, updateDriver, updateTruck } = useData();
  const isAdmin = currentUser?.Role === 'Admin';
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ TruckID: '', ShipmentID: '', DriverID: '', DispatchDate: '', ReturnDate: '', Status: 'Pending', RouteInfo: '' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ TruckID: trucks[0]?.TruckID || '', ShipmentID: shipments[0]?.ShipmentID || '', DriverID: drivers[0]?.DriverID || '', DispatchDate: new Date().toISOString().split('T')[0], ReturnDate: '', Status: 'Pending', RouteInfo: '' });
    setShowModal(true);
  };
  const openEdit = (d) => {
    setEditItem(d);
    setForm({ TruckID: d.TruckID, ShipmentID: d.ShipmentID, DriverID: d.DriverID, DispatchDate: d.DispatchDate, ReturnDate: d.ReturnDate || '', Status: d.Status, RouteInfo: d.RouteInfo });
    setShowModal(true);
  };
  const handleSave = () => {
    const data = { ...form, ReturnDate: form.ReturnDate || null };
    if (editItem) updateDispatch(editItem.DispatchID, data);
    else addDispatch(data);
    setShowModal(false);
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/truck_dispatch.png" alt="Truck Dispatch" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>🚛 Truck Dispatch</h2>
            <p>Operational engine — links Trucks, Drivers & Shipments</p>
          </div>
        </div>
        <div className="hero-3d">
          <img src="/images/truck_dispatch.png" alt="" />
        </div>
      </div>

      <div className="page-header">
        <div className="subtitle">{dispatches.length} dispatch records · {drivers.length} drivers · {trucks.length} trucks</div>
        {isAdmin && <button className="btn btn-primary" onClick={openAdd}>+ New Dispatch</button>}
      </div>

      <div className="two-col" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3>Drivers</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>License</th><th>Phone</th><th>Status</th>{isAdmin && <th>Action</th>}</tr></thead>
              <tbody>
                {drivers.map((d, idx) => (
                  <tr key={d.DriverID} style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${idx * 0.05}s` }}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{d.DriverID}</td>
                    <td style={{ fontWeight: 500 }}>{d.Name}</td><td>{d.LicenseNo}</td><td>{d.Phone}</td>
                    <td><span className={`badge ${d.Status.toLowerCase()}`}>{d.Status}</span></td>
                    {isAdmin && (
                      <td>
                        <select className="form-control" style={{ width: 110, padding: '4px 8px', fontSize: 11 }} value={d.Status} onChange={e => updateDriver(d.DriverID, { Status: e.target.value })}>
                          <option>Available</option><option>OnTrip</option><option>OffDuty</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Trucks</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Plate</th><th>Capacity</th><th>Status</th>{isAdmin && <th>Action</th>}</tr></thead>
              <tbody>
                {trucks.map((t, idx) => (
                  <tr key={t.TruckID} style={{ animation: `slideInRight .3s ease backwards`, animationDelay: `${idx * 0.05}s` }}>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{t.TruckID}</td>
                    <td>{t.PlateNumber}</td><td>{t.Capacity}</td>
                    <td><span className={`badge ${t.Status.toLowerCase()}`}>{t.Status}</span></td>
                    {isAdmin && (
                      <td>
                        <select className="form-control" style={{ width: 120, padding: '4px 8px', fontSize: 11 }} value={t.Status} onChange={e => updateTruck(t.TruckID, { Status: e.target.value })}>
                          <option>Available</option><option>OnRoute</option><option>Maintenance</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Dispatch Records</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>DispatchID</th><th>Truck</th><th>Shipment</th><th>Driver</th><th>Dispatched</th><th>Returned</th><th>Status</th><th>Route</th>{isAdmin && <th>Actions</th>}</tr></thead>
            <tbody>
              {dispatches.map((d, idx) => (
                <tr key={d.DispatchID} style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{d.DispatchID}</td>
                  <td style={{ color: '#a78bfa' }}>{d.TruckID}</td>
                  <td style={{ color: '#a78bfa' }}>{d.ShipmentID}</td>
                  <td style={{ color: '#a78bfa' }}>{d.DriverID}</td>
                  <td>{d.DispatchDate}</td>
                  <td>{d.ReturnDate || '—'}</td>
                  <td><span className={`badge ${d.Status.toLowerCase()}`}>{d.Status}</span></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.RouteInfo}</td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-xs btn-secondary" onClick={() => openEdit(d)}>✏️</button>
                        <button className="btn btn-xs btn-danger" onClick={() => deleteDispatch(d.DispatchID)}>🗑</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? `✏️ Edit ${editItem.DispatchID}` : '🚛 New Dispatch'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label>Truck</label><select className="form-control" value={form.TruckID} onChange={e => setForm({ ...form, TruckID: e.target.value })}>{trucks.map(t => <option key={t.TruckID} value={t.TruckID}>{t.TruckID} — {t.PlateNumber}</option>)}</select></div>
              <div className="form-group"><label>Driver</label><select className="form-control" value={form.DriverID} onChange={e => setForm({ ...form, DriverID: e.target.value })}>{drivers.map(d => <option key={d.DriverID} value={d.DriverID}>{d.DriverID} — {d.Name}</option>)}</select></div>
            </div>
            <div className="form-group"><label>Shipment</label><select className="form-control" value={form.ShipmentID} onChange={e => setForm({ ...form, ShipmentID: e.target.value })}>{shipments.map(s => <option key={s.ShipmentID} value={s.ShipmentID}>{s.ShipmentID} — {s.Type}</option>)}</select></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label>Dispatch Date</label><input className="form-control" type="date" value={form.DispatchDate} onChange={e => setForm({ ...form, DispatchDate: e.target.value })} /></div>
              <div className="form-group"><label>Return Date</label><input className="form-control" type="date" value={form.ReturnDate} onChange={e => setForm({ ...form, ReturnDate: e.target.value })} /></div>
            </div>
            <div className="form-group"><label>Status</label><select className="form-control" value={form.Status} onChange={e => setForm({ ...form, Status: e.target.value })}><option>Pending</option><option>InTransit</option><option>Completed</option></select></div>
            <div className="form-group"><label>Route Info</label><input className="form-control" value={form.RouteInfo} onChange={e => setForm({ ...form, RouteInfo: e.target.value })} placeholder="e.g. Karachi Port → Alpha Yard" /></div>
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
