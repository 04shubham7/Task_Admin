import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toaster = ({ toasts = [], removeToast }) => {
  useEffect(() => {
    const timers = toasts.map(t => setTimeout(() => removeToast(t.id), 4500));
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <div key={t.id} className="max-w-sm w-full glass-toast p-3 rounded-lg shadow-lg flex items-start gap-3 border">
          <div className="flex-1">
            <div className="font-semibold text-sm">{t.title || (t.type === 'error' ? 'Error' : 'Notice')}</div>
            <div className="text-xs text-slate-700 mt-1">{t.message}</div>
          </div>
          <button onClick={() => removeToast(t.id)} className="text-slate-600 hover:text-slate-900 p-1">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
