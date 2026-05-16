import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import API from '../api/axiosInstance';
import { Plus, Filter, FileText, Download, Trash2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [files, setFiles] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTasks = async () => {
    try {
      const url = filterStatus ? `/tasks?status=${filterStatus}` : '/tasks';
      const res = await API.get(url);
      setTasks(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchTasks(); }, [filterStatus]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      alert("Maximum allowance capped at 3 validation documents.");
      return;
    }
    setFiles(e.target.files);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    formData.append('priority', priority);
    
    Array.from(files).forEach(file => {
      formData.append('documents', file);
    });

    try {
      await API.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTitle(''); setDescription(''); setFiles([]);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if(!confirm("Proceed with deletion configuration?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Module */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium h-fit">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Initialize Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input type="text" placeholder="Title" required value={title} onChange={e=>setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm" />
            <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl text-sm h-24" />
            <div className="grid grid-cols-2 gap-4">
              <select value={status} onChange={e=>setStatus(e.target.value)} className="p-3 bg-slate-50 border rounded-xl text-sm">
                <option value="Todo">Todo</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Done">Done</option>
              </select>
              <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-3 bg-slate-50 border rounded-xl text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">Attachments (Max 3 PDFs)</label>
              <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-md">Deploy Task</button>
          </form>
        </div>

        {/* Display System Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-premium">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600"><Filter size={16}/> Filter Registry</div>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="p-2 bg-slate-50 border rounded-xl text-xs outline-none">
              <option value="">All Signatures</option>
              <option value="Todo">Todo</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="space-y-4">
            {tasks.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium flex flex-col justify-between gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{t.title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{t.description}</p>
                  </div>
                  <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
                <div className="flex flex-wrap gap-2 items-center justify-between border-t pt-4 border-slate-50">
                  <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 rounded">{t.status}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-700 rounded">{t.priority}</span>
                  </div>
                  {t.documents && t.documents.length > 0 && (
                    <div className="flex gap-2">
                      {t.documents.map((doc, idx) => (
                        <a key={idx} href={doc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                          <FileText size={12}/> <Download size={12}/> Doc {idx+1}
                        </a>
                      ))}
                    </div>
                  )}
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