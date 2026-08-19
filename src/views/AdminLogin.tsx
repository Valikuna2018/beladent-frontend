import React, { useState } from 'react';
import { ShieldAlert, User, Lock, ArrowRight, Loader } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { apiFetch, setSession } from '../services/api';
import { GlassCard } from '../components/GlassCard';

interface AdminLoginProps {
  currentLang: Language;
  onLoginSuccess: (token: string, username: string, role: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  currentLang,
  onLoginSuccess,
  onShowToast,
}) => {
  const t = translations[currentLang];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      onShowToast(
        currentLang === 'ka' ? 'გთხოვთ შეავსოთ ყველა ველი' : 'Please fill out all fields',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      const response: any = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      });

      if (response && response.token) {
        setSession(response.token, response.username, response.role);
        onShowToast(
          currentLang === 'ka' ? 'ავტორიზაცია წარმატებით დასრულდა!' : 'Login successful!',
          'success'
        );
        onLoginSuccess(response.token, response.username, response.role);
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err: any) {
      console.error(err);
      onShowToast(
        err.message || (currentLang === 'ka' ? 'მომხმარებლის სახელი ან პაროლი არასწორია' : 'Invalid username or password'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="login-portal" className="login-section">
      <GlassCard className="login-card animate-fade-in" hoverEffect={false}>
        <div className="login-header">
          <div className="login-logo-circle">
            <ShieldAlert size={28} className="lock-icon" />
          </div>
          <h2 className="login-title-h2">{t.loginTitle}</h2>
          <p className="login-subtitle-p">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-fields">
          <div className="form-group">
            <label className="form-label">{t.username}</label>
            <div className="input-with-icon-box">
              <User className="input-field-icon" size={18} />
              <input
                type="text"
                className="glass-input input-padding-left"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.password}</label>
            <div className="input-with-icon-box">
              <Lock className="input-field-icon" size={18} />
              <input
                type="password"
                className="glass-input input-padding-left"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn-submit" disabled={loading}>
            {loading ? (
              <Loader className="spin-icon" size={18} />
            ) : (
              <>
                <span>{t.loginButton}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </GlassCard>

      <style>{`
        .login-section {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 40px;
          @media (max-width: 480px) {
            padding: 24px;
          }
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .login-logo-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(14, 116, 144, 0.1);
        }

        .login-title-h2 {
          font-size: 1.6rem;
          color: var(--text-dark);
          font-weight: 700;
        }

        .login-subtitle-p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .login-form-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-with-icon-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-padding-left {
          padding-left: 44px !important;
        }

        .login-btn-submit {
          width: 100%;
          justify-content: center;
          margin-top: 8px;
          height: 48px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
