import React from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';
import { RichTextContent } from '../components/RichText';

interface Props { currentLang: Language; items: any[]; siteSettings?: any; onBack: () => void; onNavigate: (path: string) => void; }

export const SmileGalleryView: React.FC<Props> = ({ currentLang, items, siteSettings, onBack, onNavigate }) => (
  <main className="smile-gallery-page">
    <div className="smile-gallery-container">
      <button className="btn btn-secondary smile-back site-back-button" onClick={onBack}><ArrowLeft size={18} />{currentLang === 'ka' ? 'უკან' : 'Back'}</button>
      <header className="smile-gallery-header">
        <h1>{currentLang === 'ka' ? 'ღიმილის გალერეა' : 'Smile Gallery'}</h1>
        <p>{currentLang === 'ka' ? (siteSettings?.smileGallerySubtitleKa || 'ჩვენი პაციენტების ბედნიერი ღიმილები') : (siteSettings?.smileGallerySubtitleEn || 'Happy smiles from our patients')}</p>
      </header>
      {items.length ? <div className="smile-gallery-grid">
        {items.map((item) => {
          const title = currentLang === 'ka' ? item.titleKa : item.titleEn;
          const text = currentLang === 'ka' ? item.textKa : item.textEn;
          return <article className="smile-gallery-card" key={item.id} role="button" tabIndex={0} onClick={() => onNavigate(`smile-gallery/${item.id}`)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate(`smile-gallery/${item.id}`); }}>
            <div className="smile-gallery-image">{item.imageUrl ? <img src={getFullImageUrl(item.imageUrl)} alt={title} /> : <ImageIcon size={48} />}</div>
            <div className="smile-gallery-copy"><h2>{title}</h2>{text && <RichTextContent className="smile-gallery-text" html={text} />}</div>
          </article>;
        })}
      </div> : <div className="smile-gallery-empty"><ImageIcon size={38} /><p>{currentLang === 'ka' ? 'გალერეა ჯერ ცარიელია.' : 'The gallery is empty.'}</p></div>}
    </div>
    <style>{`
      .smile-gallery-page{min-height:80vh;padding:120px 24px 90px;background:var(--bg-color,#f4f9ff)}
      .smile-gallery-container{max-width:1200px;margin:auto}.smile-back{display:inline-flex;gap:8px;align-items:center}
      .smile-gallery-header{text-align:center;margin:24px auto 52px}.smile-gallery-header h1{font-size:clamp(2.2rem,5vw,3.5rem);color:var(--text-dark)}.smile-gallery-header p{margin-top:12px;color:var(--text-muted);font-size:1.05rem}
      .smile-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
      .smile-gallery-card{overflow:hidden;border:1px solid var(--card-border);border-radius:22px;background:rgba(255,255,255,.86);box-shadow:0 12px 35px rgba(30,64,175,.08);transition:transform .22s ease,box-shadow .22s ease;cursor:pointer}
      .smile-gallery-card:hover{transform:translateY(-5px);box-shadow:0 18px 42px rgba(30,64,175,.14)}
      .smile-gallery-image{aspect-ratio:4/3;background:var(--primary-light);display:grid;place-items:center;color:var(--primary);overflow:hidden}.smile-gallery-image img{width:100%;height:100%;object-fit:cover;display:block}
      .smile-gallery-copy{padding:24px}.smile-gallery-copy h2{font-size:1.3rem;color:var(--text-dark);margin-bottom:12px}.smile-gallery-text{color:var(--text-muted);line-height:1.65;font-size:.95rem}
      .smile-gallery-empty{padding:80px 20px;display:grid;place-items:center;gap:12px;color:var(--text-muted)}
      @media(max-width:900px){.smile-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
      @media(max-width:600px){.smile-gallery-page{padding:105px 16px 70px}.smile-gallery-grid{grid-template-columns:1fr;gap:20px}.smile-gallery-header{margin-bottom:36px}}
    `}</style>
  </main>
);
