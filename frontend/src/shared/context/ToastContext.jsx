import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

const TYPE_STYLES = {
  success: { border: '#bbf7d0', bg: '#f0fdf4', icon: '#16a34a', text: '#14532d' },
  error:   { border: '#fecaca', bg: '#fef2f2', icon: '#e11d48', text: '#7f1d1d' },
  warning: { border: '#fef3c7', bg: '#fffbeb', icon: '#b45309', text: '#78350f' },
  info:    { border: '#dbeafe', bg: '#eff6ff', icon: '#1d4ed8', text: '#1e3a8a' },
};

function ToastIcon({ type, color }) {
  if (type === 'success') {
    return <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
  }
  if (type === 'error') {
    return <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
  }
  if (type === 'warning') {
    return <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  }
  return <svg width="18" height="18" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [closing, setClosing] = useState({});
  const idRef = useRef(0);

  const removeToast = useCallback((id) => {
    setClosing(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      setClosing(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 200);
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', width: 360, maxWidth: 'calc(100vw - 48px)', pointerEvents: 'none' }}>
        {toasts.map(t => {
          const s = TYPE_STYLES[t.type] || TYPE_STYLES.info;
          return (
            <div key={t.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 12,
                padding: '14px 16px', marginBottom: 10, boxShadow: '0 12px 32px rgba(0,0,0,0.13)',
                pointerEvents: 'auto', overflow: 'hidden',
                animation: `${closing[t.id] ? 'toastOut' : 'toastIn'} 0.2s ease both`,
              }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}><ToastIcon type={t.type} color={s.icon} /></div>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: s.text, lineHeight: 1.5 }}>{t.message}</div>
              <button onClick={() => removeToast(t.id)}
                style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: s.icon, opacity: 0.55, padding: 2, display: 'flex' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
