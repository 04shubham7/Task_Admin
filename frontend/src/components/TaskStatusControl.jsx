import { useEffect, useState } from 'react';
import API from '../api/axiosInstance';

const statusOptions = ['Todo', 'In Progress', 'Done'];

const statusStyles = {
  Todo: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  'In Progress': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  Done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
};

const TaskStatusControl = ({ taskId, currentStatus, canEdit, onUpdated }) => {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleSave = async () => {
    if (!canEdit || status === currentStatus) return;
    setSaving(true);
    setError('');

    try {
      const res = await API.patch(`/tasks/${taskId}/status`, { status });
      onUpdated?.(res.data.task);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update status.');
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${statusStyles[currentStatus] || statusStyles.Todo}`}>
        {currentStatus}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className={`px-2 py-1 rounded text-xs font-semibold outline-none border ${statusStyles[status] || statusStyles.Todo} border-transparent`}
      >
        {statusOptions.map(option => (
          <option key={option} value={option} className="text-slate-900">
            {option}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || status === currentStatus}
        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:hover:bg-slate-600"
      >
        {saving ? 'Saving…' : 'Update'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default TaskStatusControl;
