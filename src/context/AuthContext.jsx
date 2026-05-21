import { createContext, useContext, useState } from 'react';
import { users } from '../data/schema';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = users.find(u => u.Email === email && u.Password === password);
    if (user) { setCurrentUser(user); return { success: true, user }; }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => setCurrentUser(null);

  const hasPermission = (feature) => {
    if (!currentUser) return false;
    const p = {
      Admin: ['dashboard','shipments','containers','yard','dispatch','billing','customs','users','tracking'],
      Customer: ['dashboard','shipments','containers','yard','billing','tracking'],
      Transporter: ['dashboard','shipments','dispatch','tracking'],
      CustomsOfficer: ['dashboard','shipments','customs','tracking'],
    };
    return (p[currentUser.Role] || []).includes(feature);
  };

  const canWrite = (feature) => {
    if (!currentUser) return false;
    const w = {
      Admin: ['shipments','containers','yard','dispatch','billing','customs','users'],
      Customer: ['shipments'],
      Transporter: ['dispatch'],
      CustomsOfficer: ['customs'],
    };
    return (w[currentUser.Role] || []).includes(feature);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, hasPermission, canWrite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
