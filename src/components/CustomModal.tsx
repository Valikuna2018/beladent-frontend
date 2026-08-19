import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '550px',
}) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <GlassCard
        className="modal-content-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        hoverEffect={false}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body-content">{children}</div>
      </GlassCard>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: overlayFadeIn 0.25s ease-out;
        }

        .modal-content-card {
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          padding: 24px;
          animation: cardSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .dark-theme .modal-content-card {
          background: rgba(15, 23, 42, 0.95);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--input-border);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 1.35rem;
          color: var(--text-dark);
          font-weight: 600;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          transition: all 0.2s ease;
        }
        .modal-close-btn:hover {
          color: var(--text-dark);
          background: rgba(0, 0, 0, 0.05);
        }
        .dark-theme .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-body-content {
          overflow: auto;
          flex: 1;
          padding: 0 8px 8px 0;
          scrollbar-gutter: stable;
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes cardSlideUp {
          from {
            transform: translateY(30px) scale(0.95);
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
