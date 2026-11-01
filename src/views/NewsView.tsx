import React from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import type { Language } from "../i18n/translations";
import { GlassCard } from "../components/GlassCard";
import { getFullImageUrl } from "../services/api";
import { richTextToPlainText } from "../components/RichText";

interface Props { currentLang: Language; news: any[]; siteSettings?: any; onNavigate: (path: string) => void; onBack: () => void; }

export const NewsView: React.FC<Props> = ({ currentLang, news, siteSettings, onNavigate, onBack }) => {
  const activeNews = news.filter((item) => item.active !== false);
  return (
    <main className="news-page"><div className="news-container">
      <button className="btn btn-secondary site-back-button" onClick={onBack}><ArrowLeft size={18} />{currentLang === "ka" ? "უკან" : "Back"}</button>
      <header className="news-header"><h1>{currentLang === "ka" ? "სიახლეები" : "News"}</h1><p>{currentLang === 'ka' ? (siteSettings?.newsSubtitleKa || 'ბელადენტის უახლესი ამბები და სასარგებლო ინფორმაცია') : (siteSettings?.newsSubtitleEn || 'Latest updates and useful information from BelaDent')}</p></header>
      <div className="news-list">
        {activeNews.length ? activeNews.map((item) => {
          const title = currentLang === "ka" ? item.titleKa : item.titleEn;
          const body = richTextToPlainText(currentLang === "ka" ? item.textKa : item.textEn);
          return <GlassCard key={item.id} className="news-row" onClick={() => onNavigate(`news/${item.id}`)}>
            <div className="news-thumb">{item.imageUrl ? <img src={getFullImageUrl(item.imageUrl)} alt={currentLang === "ka" ? (item.imageAltKa || title) : (item.imageAltEn || title)} /> : <div className="news-fallback">📰</div>}</div>
            <div className="news-copy"><h2>{title}</h2><p>{body?.slice(0, 180)}{body?.length > 180 ? "…" : ""}</p><span className="read-more-link">{currentLang === "ka" ? "ვრცლად" : "View more"} <ArrowRight size={17} /></span></div>
          </GlassCard>;
        }) : <div className="news-empty"><Info size={34} />{currentLang === "ka" ? "სიახლეები ჯერ არ არის დამატებული." : "No news has been added yet."}</div>}
      </div>
    </div><style>{`
      .news-page{min-height:80vh;padding:120px 24px 80px;background:var(--bg-app)}.news-container{max-width:1050px;margin:auto}.news-header{text-align:center;margin:20px auto 48px;max-width:720px}
      .news-header h1{font-size:clamp(2rem,4vw,3rem)}.news-header p{color:var(--text-muted);margin-top:12px}.news-list{display:flex;flex-direction:column;gap:24px}.news-row{padding:0;overflow:hidden;display:grid;grid-template-columns:minmax(240px,36%) 1fr;cursor:pointer}
      .news-thumb{min-height:220px;background:var(--primary-light)}.news-thumb img{width:100%;height:100%;object-fit:cover}.news-fallback{height:100%;display:grid;place-items:center;font-size:60px}.news-copy{padding:30px;display:flex;flex-direction:column;justify-content:center}
      .news-copy h2{font-size:1.45rem}.news-copy p{color:var(--text-muted);line-height:1.65;margin:12px 0 18px}.news-copy span{display:flex;align-items:center;gap:7px;color:var(--primary);font-weight:700}.news-empty{display:flex;justify-content:center;gap:12px;padding:70px;color:var(--text-muted)}
      @media(max-width:700px){.news-row{grid-template-columns:1fr}.news-thumb{height:210px}.news-copy{padding:22px}}
    `}</style></main>
  );
};
