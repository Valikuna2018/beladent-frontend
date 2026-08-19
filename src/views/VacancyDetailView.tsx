import React, { useEffect } from 'react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { RichTextContent } from '../components/RichText';

interface VacancyDetailViewProps {
  currentLang: Language;
  vacancyId: string;
  vacancies: any[];
  onBack: () => void;
}

export const VacancyDetailView: React.FC<VacancyDetailViewProps> = ({ currentLang, vacancyId, vacancies, onBack }) => {
  const vacancy = vacancies.find(v => v.id.toString() === vacancyId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!vacancy) {
    return (
      <div className="detail-page-container">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={20} /> უკან დაბრუნება</button>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>{currentLang === 'ka' ? 'ვაკანსია ვერ მოიძებნა' : 'Vacancy not found'}</h2>
        </div>
      </div>
    );
  }

  const title = currentLang === 'ka' ? vacancy.titleKa : vacancy.titleEn;
  const position = currentLang === 'ka' ? vacancy.positionKa : vacancy.positionEn;
  const description = currentLang === 'ka' ? vacancy.descriptionKa : vacancy.descriptionEn;

  return (
    <div className="detail-page-container animate-fade-in">
      <div className="detail-header-wrapper">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} /> {currentLang === 'ka' ? 'უკან' : 'Back'}
        </button>
      </div>

      <div className="detail-content-wrapper glass-panel">
        <div className="vacancy-header">
          <div className="vacancy-icon-box">
            <Briefcase size={32} />
          </div>
          <div>
            <h1 className="detail-title mb-1">{title}</h1>
            <div className="vacancy-position-tag">{position}</div>
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

        .vacancy-header {
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--input-border);
          padding-bottom: 24px;
        }

        .vacancy-icon-box {
          width: 64px;
          height: 64px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .mb-1 { margin-bottom: 8px; }

        .vacancy-position-tag {
          display: inline-block;
          background: var(--accent-cyan);
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .detail-body-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-dark);
        }
      `}</style>
    </div>
  );
};
