import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../api/axiosInstance';
import { Plus, Filter, FileText, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TaskStatusControl from '../components/TaskStatusControl';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [files, setFiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTasks = async () => {
    try {
      const url = filterStatus ? `/tasks?status=${filterStatus}` : '/tasks';
      const res = await API.get(url);
      setTasks(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks. Please sign in again.');
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (user?.role !== 'Admin') return;
    try {
      const res = await API.get('/users');
      setUsers(res.data.users || []);
      setError('');
    } catch (err) {
      setUsers([]);
      if (err.response?.status === 403) {
        setError('Admin access required to assign tasks to other members.');
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [filterStatus, user?.role]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      setError('Maximum 3 PDF attachments are allowed.');
      return;
    }
    setFiles(e.target.files);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('priority', priority);
    if (user?.role === 'Admin' && assignedTo) {
      formData.append('assignedTo', assignedTo);
    }
    
    Array.from(files).forEach(file => {
      formData.append('documents', file);
    });

    try {
      await API.post('/tasks', formData);
      setTitle(''); setDescription(''); setFiles([]);
      setAssignedTo('');
      setSuccess('Task uploaded successfully.');
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Task upload failed. Please log in again and retry.';
      setError(message);
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if(!confirm("Proceed with deletion configuration?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete task.');
      console.error(err);
    }
  };

  const getDocumentUrl = (doc) => {
    return `${API.defaults.baseURL}/tasks/download?url=${encodeURIComponent(doc)}`;
  };

  const canEditTask = (task) => {
    if (!user) return false;
    if (user.role === 'Admin') {
      return !task.assignedBy || task.assignedBy === user.id;
    }
    return task.assignedTo === user.id;
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Module */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-premium h-fit transition-colors duration-300">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-slate-100"><Plus size={18}/> Initialize Task</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Create a task and upload up to 3 PDF attachments.</p>
          {error && <div className="mb-4 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</div>}
          {success && <div className="mb-4 rounded-xl border border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">{success}</div>}
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input type="text" placeholder="Title" required value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
            <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border rounded-xl text-sm h-24 text-slate-900 dark:text-slate-100 placeholder:text-slate-400" />
            <div className="grid grid-cols-2 gap-4">
              <select value={status} onChange={e=>setStatus(e.target.value)} className="p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border rounded-xl text-sm text-slate-900 dark:text-slate-100">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border rounded-xl text-sm text-slate-900 dark:text-slate-100">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {user?.role === 'Admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Assign To</label>
                <select
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border rounded-xl text-sm text-slate-900 dark:text-slate-100"
                >
                  <option value="">Assign to me</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Attachments (Max 3 PDFs)</label>
              <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="w-full text-xs text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-slate-700 dark:file:text-indigo-300" />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-md hover:bg-indigo-700 transition-colors">Deploy Task</button>
          </form>
        </div>

        {/* Display System Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-premium transition-colors duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"><Filter size={16}/> Filter Registry</div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="p-2 bg-slate-50 dark:bg-slate-700 border rounded-xl text-xs outline-none text-slate-900 dark:text-slate-100 dark:border-slate-600">
              <option value="">All Signatures</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="space-y-4">
            {tasks.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-premium flex flex-col justify-between gap-4 transition-colors duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{t.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t.description}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-2">
                      Assigned to: {t.User?.email || t.assignedTo || 'Unassigned'}
                    </p>
                    {t.AssignedByUser?.email && (
                      <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-1">
                        Assigned by: {t.AssignedByUser.email}
                      </p>
                    )}
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-between border-t pt-4 border-slate-50 dark:border-slate-700">
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 rounded">{t.priority}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <TaskStatusControl
                      taskId={t.id}
                      currentStatus={t.status}
                      canEdit={canEditTask(t)}
                      onUpdated={handleTaskUpdated}
                    />
                    {t.documents && t.documents.length > 0 && (
                      <div className="flex gap-2 flex-wrap justify-end">
                        {t.documents.map((doc, idx) => (
                          <a key={idx} href={getDocumentUrl(doc)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-1 rounded-lg">
                            <FileText size={12}/> <Download size={12}/> Doc {idx+1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tasks;