import React, { useEffect } from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';
import { RichTextContent } from '../components/RichText';

interface ServiceDetailViewProps {
  currentLang: Language;
  serviceId: string;
  services: any[];
  onBack: () => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ currentLang, serviceId, services, onBack }) => {
  const service = services.find(s => s.id.toString() === serviceId || s.slug === serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return (
      <div className="detail-page-container">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={20} /> უკან დაბრუნება</button>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>{currentLang === 'ka' ? 'სერვისი ვერ მოიძებნა' : 'Service not found'}</h2>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ka' ? service.titleKa : service.titleEn;
  const description = currentLang === 'ka' ? service.descriptionKa : service.descriptionEn;

  return (
    <div className="detail-page-container animate-fade-in">
      <div className="detail-header-wrapper">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> {currentLang === 'ka' ? 'უკან' : 'Back'}
        </button>
      </div>

      <div className="detail-content-wrapper glass-panel">
        <div className="service-profile-header">
          <div className="service-avatar">
            {service.imageUrl ? (
              <img src={getFullImageUrl(service.imageUrl)} alt={title} />
            ) : (
              <Stethoscope size={60} className="service-placeholder-icon" />
            )}
          </div>
          <div className="service-title-block">
            <h1 className="detail-title">{title}</h1>
            <span className="service-accent" aria-hidden="true" />
          </div>
        </div>
        <RichTextContent className="detail-body-text" html={description} />
      </div>

      <style>{`
        .detail-page-container {
          min-height: 100vh;
          padding: 120px 24px 60px;
          max-width: 900px;
          margin: 0 auto;
        }

        .detail-header-wrapper {
          margin-bottom: 24px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--card-border);
          padding: 8px 16px;
          border-radius: 8px;
          color: var(--text-dark);
          font-family: var(--font-heading);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-4px);
        }

        .detail-content-wrapper {
          padding: 40px;
          border-radius: 16px;
        }

        .detail-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: var(--primary);
          margin: 0;
          line-height: 1.12;
        }

        .service-profile-header {
          display: flex;
          align-items: flex-start;
          gap: 44px;
          flex-wrap: wrap;
          margin-bottom: 42px;
        }

        .service-avatar {
          width: 220px;
          height: 220px;
          border-radius: 20px;
          overflow: hidden;
          background: var(--input-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid var(--primary-light);
          flex-shrink: 0;
        }

        .service-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .service-placeholder-icon { color: var(--primary); }
        .service-title-block { flex: 1; min-width: 240px; padding-top: 6px; }
        .service-accent { display: block; width: 42px; height: 10px; margin-top: 26px; border-radius: 99px; background: var(--accent-cyan); }

        .detail-body-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-dark);
        }

        @media (max-width: 640px) {
          .detail-content-wrapper { padding: 24px; }
          .service-profile-header { gap: 24px; margin-bottom: 30px; }
          .service-avatar { width: 170px; height: 170px; }
          .service-title-block { min-width: 100%; }
        }
      `}</style>
    </div>
  );
};
