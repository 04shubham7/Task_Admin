import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../api/axiosInstance';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskStatusControl from '../components/TaskStatusControl';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/tasks?limit=25');
        const tasks = res.data.data || [];
        setTasks(tasks);
        setStats({
          total: tasks.length,
          todo: tasks.filter(t => t.status === 'Todo').length,
          inProgress: tasks.filter(t => t.status === 'In Progress').length,
          done: tasks.filter(t => t.status === 'Done').length,
        });
      } catch (err) {
        setError('Unable to load dashboard tasks.');
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const canEditTask = (task) => {
    if (!user) return false;
    if (user.role === 'Admin') {
      return !task.assignedBy || task.assignedBy === user.id;
    }
    return task.assignedTo === user.id;
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => {
      const nextTasks = prev.map(task => (task.id === updatedTask.id ? updatedTask : task));
      setStats({
        total: nextTasks.length,
        todo: nextTasks.filter(t => t.status === 'Todo').length,
        inProgress: nextTasks.filter(t => t.status === 'In Progress').length,
        done: nextTasks.filter(t => t.status === 'Done').length,
      });
      return nextTasks;
    });
  };

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

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-premium">
          <h3 className="text-lg font-bold mb-2">System Diagnostics</h3>
          <p className="text-slate-500 text-sm">All interfaces operational. Use the navigation bar to update assignments or review PDF attachments dynamically synced via AWS S3 secure buckets.</p>
          {error && <p className="mt-3 text-sm text-amber-600">{error}</p>}
        </div>

        <div className="p-8 bg-white border border-slate-100 rounded-2xl shadow-premium">
          <h3 className="text-lg font-bold mb-4">Quick Status Board</h3>
          <div className="space-y-4 max-h-[420px] overflow-auto pr-1">
            {tasks.map(task => (
              <div key={task.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Assigned to: {task.User?.email || 'Unassigned'}</p>
                    {task.AssignedByUser?.email && (
                      <p className="text-xs text-slate-500 mt-1">Assigned by: {task.AssignedByUser.email}</p>
                    )}
                  </div>
                  <TaskStatusControl
                    taskId={task.id}
                    currentStatus={task.status}
                    canEdit={canEditTask(task)}
                    onUpdated={handleTaskUpdated}
                  />
                </div>
              </div>
            ))}
            {tasks.length === 0 && <p className="text-sm text-slate-500">No tasks available yet.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;