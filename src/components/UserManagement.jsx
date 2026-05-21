import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ Name: '', Email: '', Password: '', Role: 'Customer', Phone: '' });

  const roleColors = { Admin: '#3b82f6', Customer: '#a78bfa', Transporter: '#fbbf24', CustomsOfficer: '#34d399' };
  const roleIcons = { Admin: '🔑', Customer: '🏢', Transporter: '🚛', CustomsOfficer: '🛂' };

  const openAdd = () => { setEditItem(null); setForm({ Name: '', Email: '', Password: '', Role: 'Customer', Phone: '' }); setShowModal(true); };
  const openEdit = (u) => { setEditItem(u); setForm({ Name: u.Name, Email: u.Email, Password: u.Password, Role: u.Role, Phone: u.Phone }); setShowModal(true); };
  const handleSave = () => { if (editItem) updateUser(editItem.UserID, form); else addUser(form); setShowModal(false); };

  return (
    <>
      {/* Hero Banner */}
      <div className="page-hero">
        <img src="/images/hero_banner.png" alt="Users" />
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>👥 User Management</h2>
            <p>Admin-only — USER table with Role-Based Access Control</p>
          </div>
        </div>
      </div>

      <div className="page-header">
        <div className="subtitle">{users.length} users registered across 4 roles</div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {['Admin', 'Customer', 'Transporter', 'CustomsOfficer'].map((role, idx) => (
          <div className="stat-card" key={role} style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="stat-icon" style={{ background: `${roleColors[role]}15`, fontSize: 22 }}>
              {roleIcons[role]}
            </div>
            <div>
              <div className="stat-value">{users.filter(u => u.Role === role).length}</div>
              <div className="stat-label">{role}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Users</h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Admin (full access) | Customer (own data) | Transporter (dispatch) | Customs (clearance)
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>UserID</th><th>Name</th><th>Email</th><th>Role</th><th>Phone</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.UserID} style={{ animation: `slideInLeft .3s ease backwards`, animationDelay: `${idx * 0.05}s` }}>
                  <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{u.UserID}</td>
                  <td style={{ fontWeight: 500 }}>{u.Name}</td>
                  <td>{u.Email}</td>
                  <td><span className="badge" style={{ background: `${roleColors[u.Role]}15`, color: roleColors[u.Role] }}>{u.Role}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.Phone}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-xs btn-secondary" onClick={() => openEdit(u)}>✏️ Edit</button>
                      <button className="btn btn-xs btn-danger" onClick={() => deleteUser(u.UserID)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editItem ? `✏️ Edit ${editItem.Name}` : '👤 Add New User'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label>Name</label><input className="form-control" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} placeholder="Full Name" /></div>
              <div className="form-group"><label>Phone</label><input className="form-control" value={form.Phone} onChange={e => setForm({ ...form, Phone: e.target.value })} placeholder="+92-300-..." /></div>
            </div>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.Email} onChange={e => setForm({ ...form, Email: e.target.value })} placeholder="user@example.com" /></div>
            <div className="form-group"><label>Password</label><input className="form-control" type="password" value={form.Password} onChange={e => setForm({ ...form, Password: e.target.value })} placeholder="Password" /></div>
            <div className="form-group"><label>Role</label>
              <select className="form-control" value={form.Role} onChange={e => setForm({ ...form, Role: e.target.value })}>
                <option>Admin</option><option>Customer</option><option>Transporter</option><option>CustomsOfficer</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editItem ? 'Update' : 'Add User'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
