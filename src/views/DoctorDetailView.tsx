import React, { useEffect } from 'react';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';
import { RichTextContent } from '../components/RichText';

interface DoctorDetailViewProps {
  currentLang: Language;
  doctorId: string;
  doctors: any[];
  onBack: () => void;
}

export const DoctorDetailView: React.FC<DoctorDetailViewProps> = ({ currentLang, doctorId, doctors, onBack }) => {
  const doctor = doctors.find(d => d.id.toString() === doctorId || d.slug === doctorId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!doctor) {
    return (
      <div className="detail-page-container">
        <button className="back-btn site-back-button" onClick={onBack}><ArrowLeft size={20} /> უკან დაბრუნება</button>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>{currentLang === 'ka' ? 'ექიმი ვერ მოიძებნა' : 'Doctor not found'}</h2>
        </div>
      </div>
    );
  }

  const name = currentLang === 'ka' ? `${doctor.firstNameKa} ${doctor.lastNameKa}` : `${doctor.firstNameEn} ${doctor.lastNameEn}`;
  const spec = currentLang === 'ka'
    ? (doctor.specializationKa || 'სტომატოლოგი')
    : (doctor.specializationEn || 'Dental Specialist');
  const bio = currentLang === 'ka' ? doctor.descriptionKa : doctor.descriptionEn;

  return (
    <div className="detail-page-container animate-fade-in">
      <div className="detail-header-wrapper">
        <button className="back-btn site-back-button" onClick={onBack}>
          <ArrowLeft size={20} /> {currentLang === 'ka' ? 'უკან' : 'Back'}
        </button>
      </div>

      <div className="detail-content-wrapper glass-panel doctor-profile">
        <div className="doctor-profile-header">
          <div className="doctor-avatar-large">
            {doctor.imageUrl ? (
              <img src={getFullImageUrl(doctor.imageUrl)} alt={currentLang === 'ka' ? (doctor.imageAltKa || name) : (doctor.imageAltEn || name)} />
            ) : (
              <Stethoscope size={64} className="doctor-placeholder-icon" />
            )}
          </div>
          <div className="doctor-info-block">
            <h1 className="detail-title doctor-name">{name}</h1>
            <div className="doctor-spec-tag">{spec}</div>
            <div className="doctor-socials mt-3">
              {doctor.linkedinUrl && (
                <a href={doctor.linkedinUrl} target="_blank" rel="noopener noreferrer" className="doc-social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              )}
              {doctor.youtubeUrl && (
                <a href={doctor.youtubeUrl} target="_blank" rel="noopener noreferrer" className="doc-social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
        
          <RichTextContent className="detail-body-text" html={bio} />
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

        .doctor-profile-header {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .doctor-avatar-large {
          width: 200px;
          height: 200px;
          border-radius: 20px;
          overflow: hidden;
          background: var(--input-bg);
          border: 4px solid var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .doctor-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .doctor-info-block {
          flex: 1;
        }

        .doctor-name {
          margin-bottom: 12px;
        }

        .doctor-spec-tag {
          display: inline-block;
          background: var(--accent-cyan);
          color: white;
          padding: 6px 14px;
          border-radius: 99px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .doc-social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--input-bg);
          color: var(--primary);
          transition: all 0.2s;
          margin-right: 12px;
        }

        .doc-social-link:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }

        .detail-body-text {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-dark);
        }

        .mt-3 {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};
