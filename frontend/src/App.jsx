import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Shared Protected Application Routes */}
      <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
      </Route>

      {/* Admin Strictly Authorized Route */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/users" element={<Users />} />
      </Route>

      {/* Fallback default route redirecting straight home */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;