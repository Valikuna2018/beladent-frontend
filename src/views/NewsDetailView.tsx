import React from "react";
import { ArrowLeft } from "lucide-react";
import type { Language } from "../i18n/translations";
import { getFullImageUrl } from "../services/api";
import { RichTextContent } from "../components/RichText";

interface Props { currentLang: Language; newsId: string; news: any[]; onBack: () => void; }

export const NewsDetailView: React.FC<Props> = ({ currentLang, newsId, news, onBack }) => {
  const item = news.find((entry) => String(entry.id) === newsId);
  const title = item && (currentLang === "ka" ? item.titleKa : item.titleEn);
  const bodyText = item && (currentLang === "ka" ? item.textKa : item.textEn);
  const body = <RichTextContent html={bodyText} />;
  return (
    <main className="news-detail-page"><article className="news-article">
      <button className="btn btn-secondary" onClick={onBack}><ArrowLeft size={18} />{currentLang === "ka" ? "სიახლეებზე დაბრუნება" : "Back to news"}</button>
      {!item ? <h1>{currentLang === "ka" ? "სიახლე ვერ მოიძებნა" : "News item not found"}</h1> : <><h1>{title}</h1>{item.imageUrl && <img className="news-hero-image" src={getFullImageUrl(item.imageUrl)} alt={title} />}<div className="news-full-text">{body}</div></>}
    </article><style>{`
      .news-detail-page{min-height:80vh;padding:120px 24px 90px;background:var(--bg-color,#f8fafc)}.news-article{max-width:900px;margin:auto}.news-article h1{font-size:clamp(2rem,5vw,3.3rem);line-height:1.15;margin:36px 0 28px}
      .news-hero-image{width:min(100%,680px);aspect-ratio:16/9;max-height:382px;margin:0 auto;object-fit:cover;object-position:center;display:block;border-radius:16px;box-shadow:0 14px 35px rgba(15,23,42,.12)}.news-full-text{white-space:pre-line;font-size:1.08rem;line-height:1.85;color:var(--text-dark);margin-top:36px}
      @media(max-width:640px){.news-hero-image{width:100%;aspect-ratio:4/3;max-height:360px;border-radius:14px}}
    `}</style></main>
  );
};
