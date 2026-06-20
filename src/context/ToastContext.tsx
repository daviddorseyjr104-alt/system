import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

const COLORS = {
  success: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', icon: <CheckCircle2 size={14} style={{ color: '#10B981' }} /> },
  error:   { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   icon: <AlertCircle size={14} style={{ color: '#F87171' }} /> },
  info:    { bg: 'rgba(201,168,76,0.08)',  border: 'rgba(201,168,76,0.25)',  icon: <Info size={14} style={{ color: '#C9A84C' }} /> },
};

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        {toasts.map(t => {
          const cfg = COLORS[t.type];
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(12,12,12,0.95)', border: `1px solid ${cfg.border}`, borderRadius: '10px', padding: '10px 14px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', pointerEvents: 'all', minWidth: '240px', maxWidth: '380px', animation: 'slide-up 0.2s ease' }}>
              {cfg.icon}
              <span style={{ flex: 1, color: 'rgba(245,230,200,0.85)', fontSize: '13px', lineHeight: 1.4 }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)} style={{ color: 'rgba(245,230,200,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
