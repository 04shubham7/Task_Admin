import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../api/axiosInstance';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data.users || []);
      setError('');
    } catch (err) {
      setUsers([]);
      setError(err.response?.status === 403 ? 'Admin access required to view all users.' : 'Unable to load users.');
      console.error(err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (id) => {
    if (!confirm("Erase user profile authentication metadata?")) return;
    // optimistic UI: remove locally first
    const prev = users;
    const next = users.filter(u => u.id !== id);
    setUsers(next);
    addToast({ title: 'Deleting user', message: 'Removing user from registry...', type: 'info' });
    try {
      await API.delete(`/users/${id}`);
      addToast({ title: 'Deleted', message: 'User removed successfully', type: 'success' });
    } catch (err) {
      // revert on failure
      setUsers(prev);
      addToast({ title: 'Delete failed', message: 'Could not delete user. Try again.', type: 'error' });
      console.error(err);
    } finally {
      // remove intermediate toast
      // allow it to auto-dismiss; nothing to do here
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white border border-slate-100 rounded-2xl shadow-premium overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
          <ShieldAlert className="text-indigo-600" size={20} />
          <h2 className="text-base font-bold">Account Registry (Admin Operations)</h2>
        </div>
        {error && <div className="m-6 mb-0 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">{error}</div>}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider border-b">
              <th className="p-4">UUID Connection Reference</th>
              <th className="p-4">Email Designation</th>
              <th className="p-4">System Role Permission</th>
              <th className="p-4 text-right">Erase</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-mono text-xs text-slate-400">{u.id}</td>
                <td className="p-4 font-medium text-slate-800">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Users;