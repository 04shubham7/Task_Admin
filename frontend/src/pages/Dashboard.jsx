import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../api/axiosInstance';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks');
        const tasks = res.data.data || [];
        setStats({
          total: tasks.length,
          todo: tasks.filter(t => t.status === 'Todo').length,
          inProgress: tasks.filter(t => t.status === 'In-Progress').length,
          done: tasks.filter(t => t.status === 'Done').length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cardVariants = [
    { label: 'Total Managed Tasks', val: stats.total, color: 'bg-blue-50 text-blue-600', icon: <Layers /> },
    { label: 'Pending Operations', val: stats.todo, color: 'bg-amber-50 text-amber-600', icon: <Clock /> },
    { label: 'Active Execution', val: stats.inProgress, color: 'bg-indigo-50 text-indigo-600', icon: <AlertTriangle /> },
    { label: 'Completed Deliveries', val: stats.done, color: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle2 /> },
  ];

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardVariants.map((c, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{c.val}</h3>
            </div>
            <div className={`p-4 rounded-xl ${c.color}`}>{c.icon}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-8 bg-white border border-slate-100 rounded-2xl shadow-premium">
        <h3 className="text-lg font-bold mb-2">System Diagnostics</h3>
        <p className="text-slate-500 text-sm">All interfaces operational. Use the navigation sidebar to update assignments or review PDF attachments dynamically synced via AWS S3 secure buckets.</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;