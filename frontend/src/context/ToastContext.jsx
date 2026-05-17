import React, { createContext, useContext, useCallback, useState } from 'react';
import Toaster from '../components/Toaster';

const ToastContext = createContext();

let idSeq = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4500 }) => {
    const id = String(idSeq++);
    setToasts(prev => [{ id, title, message, type, duration }, ...prev]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = { addToast, removeToast, toasts };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
