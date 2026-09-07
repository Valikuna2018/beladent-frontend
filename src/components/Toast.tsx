import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={20} />;
      case 'error':
        return <AlertTriangle className="toast-icon error" size={20} />;
      default:
        return <Info className="toast-icon info" size={20} />;
    }
  };

  return (
    <div className={`toast-bubble ${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">
        <X size={16} />
      </button>

      <style>{`
        .toast-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.4);
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #0f172a;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 500;
        }

        .dark-theme .toast-bubble {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f8fafc;
        }

        .toast-bubble.success {
          border-left: 4px solid #10b981;
        }

        .toast-bubble.error {
          border-left: 4px solid #f43f5e;
        }

        .toast-bubble.info {
          border-left: 4px solid #0ea5e9;
        }

        .toast-icon.success { color: #10b981; }
        .toast-icon.error { color: #f43f5e; }
        .toast-icon.info { color: #0ea5e9; }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          padding: 2px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .toast-close-btn:hover {
          color: #64748b;
          background: rgba(0, 0, 0, 0.05);
        }
        .dark-theme .toast-close-btn:hover {
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.05);
        }

        @keyframes slideIn {
          from {
            transform: translateY(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
