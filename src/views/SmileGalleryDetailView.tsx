import React, { useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';
import { RichTextContent } from '../components/RichText';

interface Props { currentLang: Language; itemId: string; items: any[]; onBack: () => void; }

export const SmileGalleryDetailView: React.FC<Props> = ({ currentLang, itemId, items, onBack }) => {
  const item = items.find((entry) => String(entry.id) === itemId);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!item) return <main className="smile-detail-page"><button className="smile-detail-back site-back-button" onClick={onBack}><ArrowLeft size={19} />{currentLang === 'ka' ? 'უკან' : 'Back'}</button><h1>{currentLang === 'ka' ? 'ჩანაწერი ვერ მოიძებნა' : 'Gallery item not found'}</h1></main>;

  const title = currentLang === 'ka' ? item.titleKa : item.titleEn;
  const text = currentLang === 'ka' ? item.textKa : item.textEn;
  return <main className="smile-detail-page animate-fade-in">
    <button className="smile-detail-back site-back-button" onClick={onBack}><ArrowLeft size={19} />{currentLang === 'ka' ? 'გალერეაზე დაბრუნება' : 'Back to gallery'}</button>
    <article className="smile-detail-card">
      <div className="smile-detail-image">{item.imageUrl ? <img src={getFullImageUrl(item.imageUrl)} alt={title} /> : <ImageIcon size={64} />}</div>
      <div className="smile-detail-copy"><h1>{title}</h1><span className="smile-detail-accent" />{text && <RichTextContent className="smile-detail-text" html={text} />}</div>
    </article>
    <style>{`
      .smile-detail-page{min-height:100vh;max-width:1280px;margin:auto;padding:120px 28px 80px}
      .smile-detail-back{display:inline-flex;align-items:center;gap:8px;padding:10px 17px;border:1px solid var(--card-border);border-radius:10px;background:rgba(255,255,255,.75);color:var(--text-dark);font-weight:600;cursor:pointer;margin-bottom:28px}.smile-detail-back:hover{transform:translateX(-3px)}
      .smile-detail-card{display:grid;grid-template-columns:minmax(320px,440px) minmax(0,1fr);align-items:stretch;overflow:hidden;border:1px solid var(--card-border);border-radius:24px;background:rgba(255,255,255,.9);box-shadow:0 18px 48px rgba(30,64,175,.1)}
      .smile-detail-image{min-height:470px;padding:24px;background:var(--primary-light);display:grid;place-items:center;color:var(--primary);overflow:hidden}.smile-detail-image img{width:100%;height:100%;max-height:470px;object-fit:contain;display:block;border-radius:16px}
      .smile-detail-copy{padding:32px 44px 44px;display:flex;flex-direction:column;justify-content:flex-start;min-width:0}.smile-detail-copy h1{max-width:100%;font-size:clamp(1.8rem,3.2vw,2.8rem);line-height:1.3;color:var(--text-dark);overflow-wrap:anywhere;word-break:normal}.smile-detail-accent{display:block;width:48px;height:8px;border-radius:99px;background:var(--accent-cyan);margin:18px 0 24px}.smile-detail-text{font-size:1.08rem;line-height:1.8;color:var(--text-dark);overflow-wrap:anywhere}
      @media(max-width:850px){.smile-detail-card{grid-template-columns:1fr}.smile-detail-image{min-height:360px}.smile-detail-image img{max-height:420px}.smile-detail-copy{padding:34px 30px 40px}}
      @media(max-width:650px){.smile-detail-page{padding:105px 16px 60px}.smile-detail-image{min-height:280px;padding:16px}.smile-detail-copy{padding:28px 22px 34px}}
    `}</style>
  </main>;
};
