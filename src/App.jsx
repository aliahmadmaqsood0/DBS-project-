import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Shipments from './components/Shipments';
import YardMap from './components/YardMap';
import TruckDispatch from './components/TruckDispatch';
import Tracking from './components/Tracking';
import Billing from './components/Billing';
import Customs from './components/Customs';
import UserManagement from './components/UserManagement';

function ProtectedRoute({ children, perm }) {
  const { currentUser, hasPermission } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (perm && !hasPermission(perm)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="shipments" element={<ProtectedRoute perm="shipments"><Shipments /></ProtectedRoute>} />
        <Route path="yard" element={<ProtectedRoute perm="yard"><YardMap /></ProtectedRoute>} />
        <Route path="dispatch" element={<ProtectedRoute perm="dispatch"><TruckDispatch /></ProtectedRoute>} />
        <Route path="tracking" element={<ProtectedRoute perm="tracking"><Tracking /></ProtectedRoute>} />
        <Route path="billing" element={<ProtectedRoute perm="billing"><Billing /></ProtectedRoute>} />
        <Route path="customs" element={<ProtectedRoute perm="customs"><Customs /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute perm="users"><UserManagement /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
