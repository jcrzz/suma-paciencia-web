import React, { useState, ReactNode, useCallback } from 'react';

type Toast = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error';
};

export const ToastContext = React.createContext<{ push: (message: string, type?: 'info' | 'success' | 'error') => void } | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 sm:top-auto sm:bottom-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 text-sm font-body border-2 shadow-[4px_4px_0_rgba(20,24,23,0.18)] max-w-xs ${
              t.type === 'error' ? 'bg-[#9E2A22] text-[#F5F3EC] border-[#141817]'
              : t.type === 'success' ? 'bg-[#136847] text-[#F6EFE2] border-[#141817]'
              : 'bg-[#F6EFE2] text-[#136847] border-[#136847]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};