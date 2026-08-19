import React from "react";
import { ArrowLeft, ArrowRight, Briefcase, Info } from "lucide-react";
import type { Language } from "../i18n/translations";
import { GlassCard } from "../components/GlassCard";
import { richTextToPlainText } from "../components/RichText";

interface Props { currentLang: Language; vacancies: any[]; onNavigate: (path: string) => void; onBack: () => void; }

export const VacanciesView: React.FC<Props> = ({ currentLang, vacancies, onNavigate, onBack }) => {
  const activeVacancies = vacancies.filter((item) => item.active !== false);
  return <main className="vacancies-page"><div className="vacancies-container">
    <button className="btn btn-secondary" onClick={onBack}><ArrowLeft size={18} />{currentLang === "ka" ? "უკან" : "Back"}</button>
    <header className="vacancies-header"><h1>{currentLang === "ka" ? "ვაკანსიები" : "Vacancies"}</h1><p>{currentLang === "ka" ? "შემოუერთდით ბელადენტის პროფესიონალ გუნდს" : "Join the professional BelaDent team"}</p></header>
    <div className="vacancies-list">{activeVacancies.length ? activeVacancies.map((item) => {
      const title = currentLang === "ka" ? item.titleKa : item.titleEn;
      const position = currentLang === "ka" ? item.positionKa : item.positionEn;
      const body = richTextToPlainText(currentLang === "ka" ? item.descriptionKa : item.descriptionEn);
      return <GlassCard key={item.id} className="vacancy-row" onClick={() => onNavigate(`vacancy/${item.id}`)}>
        <div className="vacancy-icon"><Briefcase size={34} /></div><div className="vacancy-copy"><span className="vacancy-position">{position}</span><h2>{title}</h2><p>{body?.slice(0, 180)}{body?.length > 180 ? "…" : ""}</p><strong>{currentLang === "ka" ? "სრულად ნახვა" : "View vacancy"} <ArrowRight size={17} /></strong></div>
      </GlassCard>;
    }) : <div className="vacancies-empty"><Info size={34} />{currentLang === "ka" ? "ამჟამად ვაკანსიები არ არის." : "No vacancies at the moment."}</div>}</div>
  </div><style>{`
    .vacancies-page{min-height:80vh;padding:120px 24px 80px;background:var(--bg-color,#f8fafc)}.vacancies-container{max-width:950px;margin:auto}.vacancies-header{text-align:center;margin:20px auto 48px}
    .vacancies-header h1{font-size:clamp(2rem,4vw,3rem)}.vacancies-header p{color:var(--text-muted);margin-top:12px}.vacancies-list{display:flex;flex-direction:column;gap:22px}
    .vacancy-row{display:grid;grid-template-columns:100px 1fr;align-items:center;padding:28px;cursor:pointer}.vacancy-icon{width:76px;height:76px;border-radius:20px;display:grid;place-items:center;background:var(--primary-light);color:var(--primary)}
    .vacancy-copy h2{font-size:1.4rem;margin:7px 0}.vacancy-position{color:var(--primary);font-weight:700;text-transform:uppercase;font-size:.8rem;letter-spacing:.06em}.vacancy-copy p{color:var(--text-muted);line-height:1.6;margin-bottom:14px}
    .vacancy-copy strong{display:flex;align-items:center;gap:7px;color:var(--primary)}.vacancies-empty{display:flex;justify-content:center;gap:12px;padding:70px;color:var(--text-muted)}@media(max-width:650px){.vacancy-row{grid-template-columns:1fr}.vacancy-icon{margin-bottom:18px}}
  `}</style></main>;
};
