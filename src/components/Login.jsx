import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Login() {
  const { login } = useAuth();
  const { users } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    const r = login(email, password);
    if (!r.success) setError(r.error);
  };

  const demoLogin = (e, p) => { setEmail(e); setPassword(p); login(e, p); };
  const demoUsers = users.filter((u, i, a) => a.findIndex(x => x.Role === u.Role) === i);

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg-orb1"></div>
      <div className="login-bg-orb2"></div>
      <div className="login-bg-orb3"></div>

      {/* Floating particles */}
      <div className="login-particles">
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
        <div className="login-particle"></div>
      </div>

      <div className="login-card">
        <div className="login-logo">DP</div>
        <h2>DryPort Management</h2>
        <p className="login-sub">Sign in to access the management dashboard</p>
        {error && <div className="error-msg">⚠ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@dryport.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 14 }}>Sign In →</button>
        </form>
        <div className="demo-logins">
          <h4>Quick Demo Access</h4>
          {demoUsers.map((u, i) => (
            <button key={u.UserID} className="demo-btn" onClick={() => demoLogin(u.Email, u.Password)} style={{ animationDelay: `${0.5 + i * 0.1}s`, animation: 'slideInLeft .4s ease backwards' }}>
              <span>👤 {u.Name}</span><span className="demo-role">{u.Role}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
