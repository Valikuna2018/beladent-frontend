import React from 'react';
import { ArrowLeft, Eye, Info, Stethoscope } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { GlassCard } from '../components/GlassCard';
import { getFullImageUrl } from '../services/api';
import { richTextToPlainText } from '../components/RichText';

interface Props {
  currentLang: Language;
  doctors: any[];
  siteSettings?: any;
  onNavigate: (path: string) => void;
  onBack: () => void;
}

export const DoctorsView: React.FC<Props> = ({ currentLang, doctors, siteSettings, onNavigate, onBack }) => {
  const t = translations[currentLang];
  const activeDoctors = doctors.filter((doctor) => doctor.active !== false);

  return (
    <main className="doctors-page">
      <div className="doctors-container">
        <button className="btn btn-secondary site-back-button doctors-back" onClick={onBack}>
          <ArrowLeft size={18} />
          {currentLang === 'ka' ? 'უკან' : 'Back'}
        </button>

        <header className="doctors-header">
          <h1>{t.sectionDoctors}</h1>
          <p>
            {currentLang === 'ka'
              ? (siteSettings?.doctorsSubtitleKa || t.sectionDoctorsSub)
              : (siteSettings?.doctorsSubtitleEn || t.sectionDoctorsSub)}
          </p>
        </header>

        {activeDoctors.length ? (
          <div className="doctors-grid">
            {activeDoctors.map((doctor) => {
              const name = currentLang === 'ka'
                ? `${doctor.firstNameKa || ''} ${doctor.lastNameKa || ''}`.trim()
                : `${doctor.firstNameEn || ''} ${doctor.lastNameEn || ''}`.trim();
              const specialization = currentLang === 'ka' ? doctor.specializationKa : doctor.specializationEn;
              const description = richTextToPlainText(currentLang === 'ka' ? doctor.descriptionKa : doctor.descriptionEn);

              return (
                <GlassCard
                  key={doctor.id}
                  className="doctor-list-card"
                  onClick={() => onNavigate(`doctor/${doctor.slug || doctor.id}`)}
                >
                  <div className="doctor-list-image">
                    {doctor.imageUrl ? (
                      <img src={getFullImageUrl(doctor.imageUrl)} alt={currentLang === 'ka' ? (doctor.imageAltKa || name) : (doctor.imageAltEn || name)} />
                    ) : (
                      <Stethoscope size={52} />
                    )}
                  </div>
                  <div className="doctor-list-copy">
                    <h2>{name}</h2>
                    {specialization && <span className="doctor-specialization">{specialization}</span>}
                    {description && <p>{description.slice(0, 135)}{description.length > 135 ? '…' : ''}</p>}
                    <strong><Eye size={17} /> {currentLang === 'ka' ? 'სრულად' : 'View more'}</strong>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <div className="doctors-empty"><Info size={34} />{currentLang === 'ka' ? 'ექიმები ჯერ არ არის დამატებული.' : 'No doctors added yet.'}</div>
        )}
      </div>

      <style>{`
        .doctors-page{min-height:80vh;padding:120px 24px 80px;background:var(--bg-app)}
        .doctors-container{max-width:1200px;margin:0 auto}.doctors-back{margin-bottom:34px}
        .doctors-header{text-align:center;max-width:720px;margin:0 auto 50px}.doctors-header h1{font-size:clamp(2rem,4vw,3rem)}.doctors-header p{color:var(--text-muted);margin-top:12px}
        .doctors-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px}
        .doctor-list-card{padding:24px;cursor:pointer;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden}
        .doctor-list-image{width:190px;height:190px;border-radius:22px;background:var(--primary-light);border:4px solid var(--primary-light);overflow:hidden;display:grid;place-items:center;color:var(--primary)}
        .doctor-list-image img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transition:transform .35s ease}.doctor-list-card:hover img{transform:scale(1.04)}
        .doctor-list-copy{padding-top:22px;display:flex;flex-direction:column;align-items:center;flex:1}.doctor-list-copy h2{font-size:1.3rem;color:var(--text-dark)}
        .doctor-specialization{color:var(--primary);font-weight:700;margin-top:8px}.doctor-list-copy p{color:var(--text-muted);line-height:1.6;margin:12px 0 18px}
        .doctor-list-copy strong{display:flex;align-items:center;gap:7px;color:var(--primary);margin-top:auto}.doctors-empty{display:flex;align-items:center;justify-content:center;gap:12px;padding:70px;color:var(--text-muted)}
        @media(max-width:600px){.doctors-page{padding:105px 16px 70px}.doctors-grid{grid-template-columns:1fr}.doctor-list-card{padding:22px}.doctor-list-image{width:170px;height:170px}}
      `}</style>
    </main>
  );
};
