// client/src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';

const NotificationContext = window.__NotificationContext || (window.__NotificationContext = createContext(null));

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Web Audio API chime synthesis for micro-interactions
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Pleasant dual-tone major third chime (E5 and G#5)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    osc2.frequency.setValueAtTime(830.61, audioCtx.currentTime); // G#5
    
    // ADSR Envelope: Fast attack, slow smooth exponential decay
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.55);
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(audioCtx.currentTime + 0.6);
    osc2.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.warn('Web Audio playback failed or blocked:', e);
  }
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );
  
  // Custom confirmation dialog state
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: '',
    title: 'Confirm Action',
    danger: false,
    resolve: null
  });

  // Show HTML5 native OS notification
  const showSystemNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.png'
        });
      } catch (e) {
        console.error('Failed to display native system notification:', e);
      }
    }
  }, []);

  const showNotification = useCallback((message, options = {}) => {
    const { 
      type = 'info', 
      title = options.title || (type.charAt(0).toUpperCase() + type.slice(1)), 
      duration = 4000,
      system = true
    } = options;

    const id = Date.now() + Math.random();

    // Trigger audio cue
    playNotificationSound();

    // Add toast to UI
    setToasts(prev => [...prev, { id, message, type, title, duration }]);

    // Trigger OS level system notification
    if (system && permission === 'granted') {
      showSystemNotification(title, message);
    }

    // Auto-remove toast
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [permission, showSystemNotification]);

  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, removing: true } : toast
      )
    );
    
    // Wait for slide-out animation to finish
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  // Expose async confirmation promise
  const confirmAction = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        message,
        title: options.title || 'Confirm Action',
        danger: options.danger || false,
        resolve
      });
    });
  }, []);

  // Request system notification permission on load
  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      } catch (err) {
        console.error('Error requesting notification permission:', err);
      }
    }
    return 'denied';
  }, []);

  // Override window.alert to automatically route through our custom notifications
  useEffect(() => {
    const originalAlert = window.alert;
    
    window.alert = (message) => {
      let type = 'info';
      const msgLower = String(message).toLowerCase();
      
      // Auto-categorize alerts based on keywords
      if (msgLower.includes('error') || msgLower.includes('fail') || msgLower.includes('denied') || msgLower.includes('rejected')) {
        type = 'error';
      } else if (msgLower.includes('success') || msgLower.includes('saved') || msgLower.includes('approved') || msgLower.includes('confirmed')) {
        type = 'success';
      } else if (msgLower.includes('warning') || msgLower.includes('please') || msgLower.includes('required') || msgLower.includes('must')) {
        type = 'warning';
      }

      showNotification(message, { 
        type, 
        title: type.charAt(0).toUpperCase() + type.slice(1) + ' Alert',
        system: true 
      });
    };

    // Request permissions early
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission();
    }

    // Dynamic style injection for premium glassmorphism & slide transitions
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .toast-container {
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 380px;
        width: calc(100% - 48px);
        pointer-events: none;
      }
      .toast-card {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.4);
        animation: toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transition: all 0.3s ease;
      }
      .toast-card.removing {
        animation: toastSlideOut 0.3s cubic-bezier(0.7, 0, 0.84, 0) forwards;
      }
      .toast-icon {
        flex-shrink: 0;
        margin-top: 2px;
      }
      .toast-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .toast-title {
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 14px;
        color: #1F2937;
      }
      .toast-message {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        color: #4B5563;
        line-height: 1.4;
      }
      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #9CA3AF;
        transition: all 0.2s ease;
        flex-shrink: 0;
      }
      .toast-close:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #4B5563;
      }
      
      /* HSL-tailored Premium Alert Theme styling */
      .toast-success {
        border-left: 4px solid #10B981;
      }
      .toast-success .toast-icon {
        color: #10B981;
      }
      .toast-error {
        border-left: 4px solid #EF4444;
      }
      .toast-error .toast-icon {
        color: #EF4444;
      }
      .toast-warning {
        border-left: 4px solid #F59E0B;
      }
      .toast-warning .toast-icon {
        color: #F59E0B;
      }
      .toast-info {
        border-left: 4px solid #3B82F6;
      }
      .toast-info .toast-icon {
        color: #3B82F6;
      }
      
      /* Premium Confirm Dialog Styles */
      .confirm-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(15, 23, 42, 0.3);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000000;
        opacity: 0;
        animation: confirmFadeIn 0.2s ease-out forwards;
      }
      .confirm-card {
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
        border-radius: 16px;
        padding: 24px;
        width: 90%;
        max-width: 400px;
        transform: scale(0.95);
        animation: confirmScaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      .confirm-header {
        margin-bottom: 12px;
      }
      .confirm-title {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-weight: 800 !important;
        font-size: 1.15rem !important;
        color: #1e293b;
      }
      .confirm-message {
        font-family: 'Inter', sans-serif !important;
        font-size: 0.9rem !important;
        color: #475569 !important;
        line-height: 1.5 !important;
        margin-bottom: 24px;
      }
      .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
      .confirm-btn {
        font-family: 'Plus Jakarta Sans', sans-serif !important;
        font-weight: 700 !important;
        font-size: 0.85rem !important;
        padding: 9px 18px;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }
      .confirm-btn-cancel {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
      .confirm-btn-cancel:hover {
        background: #e2e8f0;
        color: #1e293b;
      }
      .confirm-btn-action {
        background: #10B981;
        color: white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
      }
      .confirm-btn-action:hover {
        background: #059669;
        box-shadow: 0 6px 16px rgba(5, 150, 105, 0.25);
      }
      .confirm-btn-danger {
        background: #ef4444;
        color: white;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
      }
      .confirm-btn-danger:hover {
        background: #dc2626;
        box-shadow: 0 6px 16px rgba(220, 38, 38, 0.25);
      }
      
      @keyframes toastSlideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
      }
      @keyframes confirmFadeIn {
        to { opacity: 1; }
      }
      @keyframes confirmScaleIn {
        to { transform: scale(1); }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      window.alert = originalAlert;
      document.head.removeChild(styleTag);
    };
  }, [showNotification, requestPermission]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="toast-icon" />;
      case 'error':
        return <ErrorIcon className="toast-icon" />;
      case 'warning':
        return <WarningIcon className="toast-icon" />;
      case 'info':
      default:
        return <InfoIcon className="toast-icon" />;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, requestPermission, permission, confirmAction }}>
      {children}
      
      {/* Dynamic Toast Portal */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`toast-card toast-${toast.type} ${toast.removing ? 'removing' : ''}`}
          >
            {getIcon(toast.type)}
            <div className="toast-content">
              <span className="toast-title">{toast.title}</span>
              <span className="toast-message">{toast.message}</span>
            </div>
            <button 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <CloseIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Dialog Portal */}
      {confirmState.open && (
        <div className="confirm-overlay">
          <div className="confirm-card">
            <div className="confirm-header">
              <Typography className="confirm-title">
                {confirmState.title}
              </Typography>
            </div>
            <Typography className="confirm-message">
              {confirmState.message}
            </Typography>
            <div className="confirm-actions">
              <button 
                type="button"
                className="confirm-btn confirm-btn-cancel"
                onClick={() => {
                  confirmState.resolve(false);
                  setConfirmState(prev => ({ ...prev, open: false }));
                }}
              >
                Cancel
              </button>
              <button 
                type="button"
                className={`confirm-btn ${confirmState.danger ? 'confirm-btn-danger' : 'confirm-btn-action'}`}
                onClick={() => {
                  confirmState.resolve(true);
                  setConfirmState(prev => ({ ...prev, open: false }));
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};
