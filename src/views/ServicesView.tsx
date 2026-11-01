import React from "react";
import { ArrowLeft, Eye, Info } from "lucide-react";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";
import { GlassCard } from "../components/GlassCard";
import { getFullImageUrl } from "../services/api";
import { richTextToPlainText } from "../components/RichText";

interface Props { currentLang: Language; services: any[]; siteSettings?: any; onNavigate: (path: string) => void; onBack: () => void; }

export const ServicesView: React.FC<Props> = ({ currentLang, services, siteSettings, onNavigate, onBack }) => {
  const t = translations[currentLang];
  const activeServices = services.filter((service) => service.active !== false);
  return (
    <main className="listing-page"><div className="listing-container">
      <button className="btn btn-secondary back-button site-back-button" onClick={onBack}><ArrowLeft size={18} />{currentLang === "ka" ? "მთავარ გვერდზე დაბრუნება" : "Back to home"}</button>
      <header className="listing-header"><h1>{t.sectionServices}</h1><p>{currentLang === 'ka' ? (siteSettings?.servicesSubtitleKa || t.sectionServicesSub) : (siteSettings?.servicesSubtitleEn || t.sectionServicesSub)}</p></header>
      <div className="listing-grid">
        {activeServices.length ? activeServices.map((service) => (
          <GlassCard key={service.id} className="listing-card" onClick={() => onNavigate(`service/${service.slug || service.id}`)}>
            <div className="listing-image-wrap">{service.imageUrl ? <img src={getFullImageUrl(service.imageUrl)} alt={currentLang === "ka" ? (service.imageAltKa || service.titleKa) : (service.imageAltEn || service.titleEn)} /> : <div className="listing-fallback">🦷</div>}</div>
            <div className="listing-body"><h2>{currentLang === "ka" ? service.titleKa : service.titleEn}</h2><p>{richTextToPlainText(currentLang === "ka" ? (service.shortDescriptionKa || service.descriptionKa) : (service.shortDescriptionEn || service.descriptionEn)).slice(0, 150)}</p><span className="read-more-link"><Eye size={16} /> {currentLang === "ka" ? "ვრცლად" : "View more"}</span></div>
          </GlassCard>
        )) : <div className="empty-list"><Info size={34} />{currentLang === "ka" ? "სერვისები ჯერ არ არის დამატებული." : "No services added yet."}</div>}
      </div>
    </div><style>{`
      .listing-page{min-height:80vh;padding:120px 24px 80px;background:var(--bg-app)}.listing-container{max-width:1200px;margin:0 auto}.back-button{margin-bottom:34px}
      .listing-header{text-align:center;max-width:720px;margin:0 auto 50px}.listing-header h1{font-size:clamp(2rem,4vw,3rem)}.listing-header p{color:var(--text-muted);margin-top:12px}
      .listing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px}.listing-card{padding:26px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;align-items:center;text-align:center}
      .listing-image-wrap{width:180px;height:180px;border-radius:20px;background:var(--primary-light);border:4px solid var(--primary-light);overflow:hidden;flex-shrink:0}
      .listing-image-wrap img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transition:transform .35s}.listing-card:hover img{transform:scale(1.04)}.listing-fallback{height:100%;display:grid;place-items:center;font-size:56px}
      .listing-body{padding:22px 0 0;display:flex;flex-direction:column;align-items:center;flex:1}.listing-body h2{font-size:1.25rem}.listing-body p{color:var(--text-muted);line-height:1.6;margin:10px 0 18px}.listing-body span{display:flex;align-items:center;gap:7px;color:var(--primary);font-weight:700;margin-top:auto}
      .empty-list{grid-column:1/-1;display:flex;align-items:center;justify-content:center;gap:12px;padding:70px;color:var(--text-muted)}
      @media(max-width:600px){.listing-card{padding:22px}.listing-image-wrap{width:160px;height:160px}}
    `}</style></main>
  );
};
