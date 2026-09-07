import React, { useEffect } from 'react';
import { ArrowLeft, Newspaper } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';
import { RichTextContent } from '../components/RichText';

interface Props { currentLang: Language; newsId: string; news: any[]; onBack: () => void; }

export const NewsDetailView: React.FC<Props> = ({ currentLang, newsId, news, onBack }) => {
  const item = news.find((entry) => String(entry.id) === newsId);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!item) {
    return <main className="news-detail-page"><button className="back-btn site-back-button" onClick={onBack}><ArrowLeft size={20} />{currentLang === 'ka' ? 'უკან' : 'Back'}</button><h1>{currentLang === 'ka' ? 'სიახლე ვერ მოიძებნა' : 'News item not found'}</h1></main>;
  }

  const title = currentLang === 'ka' ? item.titleKa : item.titleEn;
  const bodyText = currentLang === 'ka' ? item.textKa : item.textEn;

  return (
    <main className="news-detail-page animate-fade-in">
      <div className="news-header-wrapper">
        <button className="back-btn site-back-button" onClick={onBack}><ArrowLeft size={20} />{currentLang === 'ka' ? 'უკან' : 'Back'}</button>
      </div>
      <article className="news-detail-card glass-panel">
        <div className="news-profile-header">
          <div className="news-image-compact">
            {item.imageUrl ? <img src={getFullImageUrl(item.imageUrl)} alt={title} /> : <Newspaper size={60} />}
          </div>
          <div className="news-title-block">
            <h1>{title}</h1>
            <span className="news-accent" aria-hidden="true" />
          </div>
        </div>
        <RichTextContent className="news-full-text" html={bodyText} />
      </article>
      <style>{`
        .news-detail-page{min-height:100vh;padding:120px 24px 60px;max-width:900px;margin:0 auto}.news-header-wrapper{margin-bottom:24px}.back-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.1);border:1px solid var(--card-border);padding:8px 16px;border-radius:8px;color:var(--text-dark);font-family:var(--font-heading);font-weight:500;cursor:pointer;transition:.2s}.back-btn:hover{background:rgba(255,255,255,.2);transform:translateX(-4px)}
        .news-detail-card{padding:40px;border-radius:16px}.news-profile-header{display:flex;align-items:flex-start;gap:44px;flex-wrap:wrap;margin-bottom:42px}.news-image-compact{width:220px;height:220px;border-radius:20px;overflow:hidden;background:var(--input-bg);display:flex;align-items:center;justify-content:center;border:4px solid var(--primary-light);color:var(--primary);flex-shrink:0}.news-image-compact img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}.news-title-block{flex:1;min-width:240px;padding-top:6px}.news-title-block h1{font-family:var(--font-heading);font-size:clamp(2rem,5vw,3.2rem);color:var(--primary);margin:0;line-height:1.12;overflow-wrap:anywhere}.news-accent{display:block;width:42px;height:10px;margin-top:26px;border-radius:99px;background:var(--accent-cyan)}.news-full-text{font-size:1.1rem;line-height:1.8;color:var(--text-dark)}
        @media(max-width:640px){.news-detail-card{padding:24px}.news-profile-header{gap:24px;margin-bottom:30px}.news-image-compact{width:170px;height:170px}.news-title-block{min-width:100%}}
      `}</style>
    </main>
  );
};
