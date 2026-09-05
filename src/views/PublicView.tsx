import React, { useEffect, useRef, useState } from "react";
import { Phone, ArrowRight, Info, Check, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Language } from "../i18n/translations";
import { translations } from "../i18n/translations";
import { GlassCard } from "../components/GlassCard";
import { getFullImageUrl } from "../services/api";
import { RichTextContent, richTextToPlainText } from "../components/RichText";

interface PublicViewProps {
  currentLang: Language;
  siteSettings: any;
  about: any;
  contactInfo: any;
  services: any[];
  doctors: any[];
  partners: any[];
  vacancies: any[];
  loading: boolean;
  onShowToast: (msg: string, type: "success" | "error" | "info") => void;
  onNavigate: (path: string) => void;
}

export const PublicView: React.FC<PublicViewProps> = ({
  currentLang,
  siteSettings,
  about,
  services,
  doctors,
  partners,
  vacancies,
  loading,
  onNavigate,
}) => {
  const t = translations[currentLang];
  const [heroSlide, setHeroSlide] = useState(0);
  const doctorsTrackRef = useRef<HTMLDivElement>(null);
  const partnersTrackRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const heroImages = [
    siteSettings?.backgroundImageUrl,
    siteSettings?.backgroundImageUrl2,
    siteSettings?.backgroundImageUrl3,
  ].filter(Boolean).map(getFullImageUrl);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroImages.length), 4000);
    return () => window.clearInterval(timer);
  }, [heroImages.join("|")]);

  useEffect(() => {
    if (partners.length < 2) return;
    const timer = window.setInterval(() => {
      const track = partnersTrackRef.current;
      if (!track || track.matches(':hover')) return;
      const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({ left: reachedEnd ? 0 : track.scrollLeft + 218, behavior: 'smooth' });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [partners.length]);

  if (loading) {
    return (
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh" }}>
        <div style={{ width:60,height:60,border:"4px solid #e2f4f4",borderTop:"4px solid #0e4f50",borderRadius:"50%",animation:"spin 1s linear infinite" }}></div>
        <p style={{ marginTop:20,fontWeight:500,color:"#0e4f50" }}>{t.loading}</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const clinicTitle = currentLang === "ka"
    ? (siteSettings?.clinicNameKa || "ბელადენტი")
    : (siteSettings?.clinicNameEn || "BelaDent");

  const seoDescription = currentLang === "ka"
    ? (siteSettings?.seoDescriptionKa || "სტომატოლოგიური კლინიკა თბილისში")
    : (siteSettings?.seoDescriptionEn || "Dental clinic in Tbilisi, Georgia");

  void clinicTitle;
  const changeHeroSlide = (direction: number) => {
    if (heroImages.length) setHeroSlide((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  const scrollDoctors = (direction: number) => {
    doctorsTrackRef.current?.scrollBy({ left: direction * 328, behavior: "smooth" });
  };

  const scrollPartners = (direction: number) => {
    partnersTrackRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  };

  return (
    <div className="public-landing-shell">
      {/* HERO */}
      <section
        id="home"
        className="hero-section"
      >
        {heroImages.map((image, index) => (
          <div key={image} className={`hero-slide ${index === heroSlide ? "active" : ""}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.38),rgba(0,0,0,0.64)),url(${image})` }} />
        ))}
        {heroImages.length > 1 && <>
          <button className="carousel-arrow hero-arrow left" onClick={() => changeHeroSlide(-1)} aria-label="Previous image"><ChevronLeft size={30} /></button>
          <button className="carousel-arrow hero-arrow right" onClick={() => changeHeroSlide(1)} aria-label="Next image"><ChevronRight size={30} /></button>
          <div className="hero-dots">{heroImages.map((_, index) => <button key={index} className={index === heroSlide ? "active" : ""} onClick={() => setHeroSlide(index)} aria-label={`Image ${index + 1}`} />)}</div>
        </>}
        <div className="hero-container animate-fade-in">
          <span className="hero-eyebrow">✨ {clinicTitle}</span>
          <h1 className={`hero-headline ${currentLang === "ka" ? "georgian" : ""}`}>
            {currentLang === "ka"
              ? (siteSettings?.seoTitleKa || "თქვენი ღიმილის ფორმულა")
              : (siteSettings?.seoTitleEn || "The Formula for Your Smile")}
          </h1>
          <p className="hero-subtext">{seoDescription}</p>
          <div className="hero-actions">
            <button onClick={() => onNavigate("services")} className="btn btn-primary btn-lg">
              <span>{t.navServices}</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => scrollToSection("contact")} className="btn btn-secondary btn-lg">
              <Phone size={18} />
              <span>{t.navContact}</span>
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="public-section">
        <div className="section-header">
          <h2>{t.sectionServices}</h2>
          <p className="section-subtitle">{t.sectionServicesSub}</p>
        </div>
        <div className="services-grid">
          {services.length > 0 ? services.map((service) => (
            <GlassCard key={service.id} className="service-card" onClick={() => onNavigate('service/' + (service.slug || service.id))}>
              <div className="card-image-box">
                {service.imageUrl ? (
                  <img src={getFullImageUrl(service.imageUrl)} alt={currentLang === "ka" ? service.titleKa : service.titleEn} className="card-img" />
                ) : (
                  <div className="card-image-fallback">🦷</div>
                )}
                <div className="img-overlay-blur">
                  <span className="view-details-tag">
                    <Eye size={16} />
                    {currentLang === "ka" ? "მეტი" : "View more"}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{currentLang === "ka" ? service.titleKa : service.titleEn}</h3>
                <p className="card-description-snippet">
                  {richTextToPlainText(currentLang === "ka" ? service.descriptionKa : service.descriptionEn).slice(0, 100)}...
                </p>
              </div>
            </GlassCard>
          )) : (
            <div className="empty-state"><Info size={32} /><p>{currentLang === "ka" ? "სერვისები ჯერ არ არის დამატებული." : "No services added yet."}</p></div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="about-full-section">
        <div className="about-inner">
          <div className="about-visual-panel">
            {about?.imageUrl ? (
              <div className="about-image-box">
                <img src={getFullImageUrl(about.imageUrl)} alt={currentLang === "ka" ? (about.titleKa || "ჩვენ შესახებ") : (about.titleEn || "About us")} className="about-image" />
              </div>
            ) : <div className="about-stat-box">
              <span className="about-big-num">10+</span>
              <span className="about-big-label">{currentLang === "ka" ? "წლის გამოცდილება" : "Years of Experience"}</span>
              <span className="about-cyan-tag">{currentLang === "ka" ? "უმაღლესი ხარისხი" : "Premium Quality"}</span>
            </div>}
          </div>
          <div className="about-text-panel">
            <span className="content-eyebrow">{t.sectionAbout}</span>
            <h2 className="about-heading">
              {currentLang === "ka"
                ? (about?.titleKa || "ბელადენტი – ჯანსაღი ღიმილი")
                : (about?.titleEn || "BelaDent – A Healthy Smile")}
            </h2>
            <RichTextContent
              className="about-body-text"
              html={currentLang === "ka"
                ? (about?.descriptionKa || "ბელადენტი არის წამყვანი სტომატოლოგიური კლინიკა.")
                : (about?.descriptionEn || "BelaDent is a leading dental centre providing premium oral healthcare.")}
            />
            <div className="about-features">
              {[
                currentLang === "ka" ? "საერთაშორისო სტერილიზაციის სტანდარტები" : "International Sterilization Standards",
                currentLang === "ka" ? "ციფრული რენტგენის დიაგნოსტიკა" : "Digital X-ray Diagnostics",
                currentLang === "ka" ? "უმტკივნეულო, კომფორტული მკურნალობა" : "Pain-free, Comfortable Treatment",
              ].map((feat, i) => (
                <div className="feat-row" key={i}>
                  <div className="feat-dot"><Check size={14} /></div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER COMPANIES */}
      {partners?.length > 0 && (
        <section className="public-section partners-section">
          <div className="section-header">
            <h2>{currentLang === "ka" ? "პარტნიორები" : "Our Partners"}</h2>
          </div>
          <div className="partners-carousel">
            {partners.length > 4 && <button className="carousel-arrow partner-arrow left" onClick={() => scrollPartners(-1)} aria-label="Previous partners"><ChevronLeft size={25} /></button>}
            <div className="partners-track" ref={partnersTrackRef}>
              {partners.filter((partner) => partner.active !== false).map((partner) => (
                <div className="partner-card" key={partner.id}>
                  <img src={getFullImageUrl(partner.imageUrl)} alt={partner.name || "Partner company"} />
                  {partner.name?.trim() && <span>{partner.name}</span>}
                </div>
              ))}
            </div>
            {partners.length > 4 && <button className="carousel-arrow partner-arrow right" onClick={() => scrollPartners(1)} aria-label="Next partners"><ChevronRight size={25} /></button>}
          </div>
        </section>
      )}

      {/* DOCTORS */}
      <section id="doctors" className="public-section">
        <div className="section-header">
          <h2>{t.sectionDoctors}</h2>
          <p className="section-subtitle">{t.sectionDoctorsSub}</p>
        </div>
        <div className="doctors-carousel">
          {doctors.length > 1 && <button className="carousel-arrow doctor-arrow left" onClick={() => scrollDoctors(-1)} aria-label="Previous doctors"><ChevronLeft size={28} /></button>}
        <div className="doctors-grid" ref={doctorsTrackRef}>
          {doctors.length > 0 ? doctors.map((doctor) => (
            <GlassCard key={doctor.id} className="doctor-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('doctor/' + (doctor.slug || doctor.id))}>
              <div className="doctor-img-wrap">
                {doctor.imageUrl
                  ? <img src={getFullImageUrl(doctor.imageUrl)} alt="" className="doctor-img" />
                  : <div className="doctor-fallback">🧑‍⚕️</div>}
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">
                  {currentLang === "ka"
                    ? `${doctor.firstNameKa} ${doctor.lastNameKa}`
                    : `${doctor.firstNameEn} ${doctor.lastNameEn}`}
                </h3>
                <span className="doctor-tag">
                  {currentLang === "ka"
                    ? (doctor.specializationKa || "სტომატოლოგი")
                    : (doctor.specializationEn || "Dental Specialist")}
                </span>
                {(doctor.descriptionKa || doctor.descriptionEn) && (
                  <p className="doctor-bio">
                    {richTextToPlainText(currentLang === "ka" ? doctor.descriptionKa : doctor.descriptionEn)}
                  </p>
                )}
              </div>
            </GlassCard>
          )) : (
            <div className="empty-state"><Info size={32} /><p>{currentLang === "ka" ? "ექიმები ჯერ არ არიან დამატებული." : "No doctors added yet."}</p></div>
          )}
        </div>
          {doctors.length > 1 && <button className="carousel-arrow doctor-arrow right" onClick={() => scrollDoctors(1)} aria-label="Next doctors"><ChevronRight size={28} /></button>}
        </div>
      </section>

      {/* VACANCIES */}
      <section id="vacancies" className="public-section">
        <div className="section-header">
          <h2>{currentLang === "ka" ? "ვაკანსიები" : "Vacancies"}</h2>
          <p className="section-subtitle">{currentLang === "ka" ? "შემოგვიერთდით ჩვენს გუნდში" : "Join our team"}</p>
        </div>
        <div className="services-grid">
          {vacancies?.length > 0 ? vacancies.filter(v => v.active).map((vacancy) => (
            <GlassCard key={vacancy.id} className="service-card" hoverEffect={false} style={{ cursor: 'pointer' }} onClick={() => onNavigate('vacancy/' + vacancy.id)}>
              <div className="card-body">
                <h3 className="card-title">{currentLang === "ka" ? vacancy.titleKa : vacancy.titleEn}</h3>
                <span className="about-cyan-tag" style={{ display: "inline-block", marginBottom: 12 }}>
                  {currentLang === "ka" ? vacancy.positionKa : vacancy.positionEn}
                </span>
                <p className="card-description-snippet" style={{ whiteSpace: "pre-line" }}>
                  {richTextToPlainText(currentLang === "ka" ? vacancy.descriptionKa : vacancy.descriptionEn)}
                </p>
              </div>
            </GlassCard>
          )) : (
            <div className="empty-state"><Info size={32} /><p>{currentLang === "ka" ? "ამჟამად ვაკანსიები არ არის." : "No vacancies at the moment."}</p></div>
          )}
        </div>
      </section>

      <style>{`
        .public-landing-shell { width: 100%; }
        #services { display: none; }
        #vacancies { display: none; }
        .hero-section {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(rgba(0,0,0,0.48),rgba(0,0,0,0.72));
          background-size: cover; background-position: center;
          color: white; padding: 80px 24px 40px; text-align: center; position: relative; overflow: hidden;
        }
        .hero-container { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 20px; position: relative; z-index: 2; }
        .hero-eyebrow { display: none; }
        .hero-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transform: scale(1.03); transition: opacity .8s ease, transform 4.8s ease; }
        .hero-slide.active { opacity: 1; transform: scale(1); }
        .carousel-arrow { width: 50px; height: 50px; border: 1px solid rgba(255,255,255,.45); border-radius: 50%; display: grid; place-items: center; cursor: pointer; transition: transform .2s, background .2s; z-index: 4; }
        .carousel-arrow:hover { transform: scale(1.08); }
        .hero-arrow { position: absolute; top: 50%; transform: translateY(-50%); color: white; background: rgba(15,23,42,.32); backdrop-filter: blur(8px); }
        .hero-arrow:hover { transform: translateY(-50%) scale(1.08); background: rgba(20,76,168,.88); }
        .hero-arrow.left { left: 28px; } .hero-arrow.right { right: 28px; }
        .hero-dots { position: absolute; z-index: 4; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 9px; }
        .hero-dots button { width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%; background: rgba(255,255,255,.45); cursor: pointer; transition: width .25s, background .25s; }
        .hero-dots button.active { width: 28px; border-radius: 8px; background: white; }
        .hero-headline { font-size: clamp(2rem,5vw,3.6rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; background: linear-gradient(135deg,#fff 40%,#e0f2fe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-headline.georgian { line-height: 1.35; padding: 0.08em 0 0.22em; overflow: visible; letter-spacing: -0.015em; }
        .hero-subtext { font-size: clamp(1rem,2.5vw,1.2rem); color: #94a3b8; max-width: 620px; line-height: 1.6; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
        .btn-lg { padding: 14px 32px; font-size: 1.05rem; border-radius: 14px; }
        .public-section { max-width: 1200px; margin: 0 auto; padding: 90px 24px; }
        @media (max-width: 768px) { .public-section { padding: 60px 16px; } }
        .section-header { text-align: center; max-width: 680px; margin: 0 auto 56px; }
        .section-subtitle { font-size: 1.05rem; color: var(--text-muted); margin-top: 12px; }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(320px,1fr)); gap: 28px; }
        @media (max-width: 576px) { .services-grid { grid-template-columns: 1fr; } }
        .service-card { cursor: pointer; overflow: hidden; padding: 0; display: flex; flex-direction: column; }
        .card-image-box { position: relative; height: 210px; overflow: hidden; background: rgba(14,116,144,0.05); }
        .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .service-card:hover .card-img { transform: scale(1.07); }
        .card-image-fallback { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 54px; }
        .img-overlay-blur { position: absolute; inset: 0; background: rgba(14,79,80,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; backdrop-filter: blur(3px); transition: opacity 0.3s ease; }
        .service-card:hover .img-overlay-blur { opacity: 1; }
        .view-details-tag { background: white; color: var(--primary); padding: 8px 16px; border-radius: 99px; font-family: var(--font-heading); font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .card-body { padding: 22px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .card-title { font-size: 1.2rem; color: var(--text-dark); }
        .card-description-snippet { font-size: 0.92rem; line-height: 1.5; color: var(--text-muted); }
        .about-full-section { background: linear-gradient(135deg,hsl(216 86% 97%) 0%,hsl(198 90% 97%) 100%); padding: 90px 24px; }
        .about-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
        @media (max-width: 900px) { .about-inner { grid-template-columns: 1fr; gap: 40px; } }
        .about-visual-panel { display: flex; justify-content: center; }
        .about-image-box { width: 100%; max-width: 450px; aspect-ratio: 4 / 3; border-radius: 24px; overflow: hidden; background: var(--primary-light); box-shadow: 0 20px 50px rgba(20,76,168,0.20); }
        .about-image { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .about-stat-box { width: 100%; max-width: 360px; padding: 60px 40px; border-radius: 24px; background: linear-gradient(135deg,var(--primary) 0%,hsl(216 82% 25%) 100%); color: white; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 12px; box-shadow: 0 20px 50px rgba(20,76,168,0.22); }
        .about-big-num { font-family: var(--font-heading); font-weight: 800; font-size: 5rem; line-height: 1; }
        .about-big-label { font-family: var(--font-heading); font-weight: 600; font-size: 1.15rem; }
        .about-cyan-tag { font-size: 0.9rem; color: var(--accent-cyan); font-weight: 500; letter-spacing: 0.04em; }
        .about-text-panel { display: flex; flex-direction: column; gap: 18px; }
        .content-eyebrow { font-family: var(--font-heading); font-weight: 600; font-size: 0.88rem; letter-spacing: 0.05em; color: var(--primary); }
        .about-heading { font-size: clamp(1.8rem,3vw,2.4rem); }
        .about-body-text { font-size: 1rem; line-height: 1.7; color: var(--text-muted); }
        .about-features { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
        .feat-row { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; font-weight: 500; color: var(--text-dark); }
        .feat-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .doctors-carousel { position: relative; padding: 0 62px; }
        .partners-section { padding-top:54px; padding-bottom:42px; }
        .partners-section .section-header { margin-bottom:32px; }
        .partners-section + #doctors { padding-top:52px; }
        .partners-carousel { position:relative; padding:0 64px; }
        .partners-track { display:flex; gap:18px; overflow-x:auto; scroll-behavior:smooth; scroll-snap-type:x mandatory; scrollbar-width:none; padding:10px 4px 14px; }
        .partners-track::-webkit-scrollbar { display:none; }
        .partner-card { flex:0 0 200px; height:150px; padding:20px; border:1px solid rgba(20,76,168,.1); border-radius:20px; background:rgba(255,255,255,.82); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; scroll-snap-align:start; box-shadow:0 10px 28px rgba(30,64,175,.07); transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease; }
        .partner-card:hover { transform:translateY(-4px); border-color:rgba(20,76,168,.25); box-shadow:0 16px 34px rgba(30,64,175,.12); }
        .partner-card img { width:150px; max-width:100%; height:82px; object-fit:contain; display:block; }
        .partner-card span { color:var(--text-dark); font-weight:650; font-size:.9rem; line-height:1.2; text-align:center; }
        .partner-arrow { position:absolute; top:50%; transform:translateY(-58%); color:var(--primary); background:rgba(255,255,255,.94); border-color:rgba(20,76,168,.18); box-shadow:0 8px 24px rgba(15,23,42,.12); }
        .partner-arrow:hover { transform:translateY(-58%) scale(1.07); background:var(--primary); color:white; }
        .partner-arrow.left { left:2px; }
        .partner-arrow.right { right:2px; }
        .doctors-grid { display: flex; gap: 28px; overflow-x: auto; padding: 4px; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .doctors-grid::-webkit-scrollbar { display: none; }
        .doctor-arrow { position: absolute; top: 50%; transform: translateY(-50%); color: var(--primary); background: white; border-color: rgba(14,116,144,.2); box-shadow: 0 8px 24px rgba(15,23,42,.13); }
        .doctor-arrow:hover { transform: translateY(-50%) scale(1.08); background: var(--primary); color: white; }
        .doctor-arrow.left { left: 0; } .doctor-arrow.right { right: 0; }
        .doctor-card { overflow: hidden; padding: 0; display: flex; flex-direction: column; flex: 0 0 min(260px, 76vw); scroll-snap-align: start; }
        .doctor-img-wrap { height: 230px; overflow: hidden; background: var(--primary-light); }
        .doctor-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .doctor-card:hover .doctor-img { transform: scale(1.04); }
        .doctor-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 72px; }
        .doctor-info { padding: 18px; display: flex; flex-direction: column; gap: 5px; }
        .doctor-name { font-size: 1.05rem; color: var(--text-dark); }
        .doctor-tag { font-size: 0.78rem; font-family: var(--font-heading); font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 0.06em; }
        .doctor-bio { font-size: 0.88rem; line-height: 1.5; color: var(--text-muted); margin-top: 4px; }
        .gallery-masonry { display: grid; grid-template-columns: repeat(auto-fill,minmax(250px,1fr)); gap: 18px; }
        .gallery-cell { position: relative; height: 210px; border-radius: 16px; overflow: hidden; cursor: pointer; padding: 0; }
        .gallery-cell-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .gallery-cell:hover .gallery-cell-img { transform: scale(1.08); }
        .gallery-cell-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 14px 14px; background: linear-gradient(to top,rgba(0,0,0,0.75),transparent); color: white; font-family: var(--font-heading); font-size: 0.88rem; font-weight: 500; opacity: 0; transition: opacity 0.3s ease; }
        .gallery-cell:hover .gallery-cell-overlay { opacity: 1; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: flex-start; }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
        .contact-info-col { display: flex; flex-direction: column; gap: 16px; }
        .contact-info-card { display: flex; align-items: center; gap: 18px; padding: 20px 24px; }
        .contact-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .phone-icon { background: rgba(14,116,144,0.1); color: var(--primary); }
        .mail-icon { background: rgba(14,165,233,0.1); color: #0ea5e9; }
        .map-icon { background: rgba(16,185,129,0.1); color: #10b981; }
        .contact-card-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; color: var(--text-muted); margin-bottom: 4px; }
        .contact-card-value { display: block; font-family: var(--font-heading); font-weight: 600; font-size: 1.05rem; color: var(--text-dark); transition: color 0.2s ease; }
        .contact-card-value:hover { color: var(--primary); }
        .contact-card-value.secondary { font-size: 0.95rem; margin-top: 2px; }
        .social-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 4px; }
        .social-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--text-muted); font-family: var(--font-heading); font-weight: 600; font-size: 0.88rem; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer; text-decoration: none; }
        .social-btn:hover { color: white; transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
        .social-btn.facebook:hover { background: #1877f2; border-color: #1877f2; }
        .social-btn.instagram:hover { background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); border-color: transparent; }
        .social-btn.linkedin:hover { background: #0077b5; border-color: #0077b5; }
        .social-btn.youtube:hover { background: #ff0000; border-color: #ff0000; }
        .map-frame-wrap { width: 100%; height: 420px; overflow: hidden; border-radius: 20px; padding: 0; }
        .map-iframe { width: 100%; height: 100%; border: none; }
        .map-placeholder { width: 100%; height: 420px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); border-radius: 20px; }
        .empty-state { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 12px; color: var(--text-muted); text-align: center; }
        @media (max-width: 700px) {
          .hero-arrow { width: 42px; height: 42px; }
          .hero-arrow.left { left: 10px; } .hero-arrow.right { right: 10px; }
          .doctors-carousel { padding: 0 46px; }
          .doctor-arrow { width: 40px; height: 40px; }
          .doctors-grid { gap: 16px; }
          .doctor-card { flex-basis: min(220px, 70vw); }
          .doctor-img-wrap { height: 190px; }
          .doctor-info { padding: 14px; }
          .partners-section { padding-top:42px; padding-bottom:32px; }
          .partners-section + #doctors { padding-top:42px; }
          .partners-carousel { padding:0 46px; }
          .partner-card { flex-basis:170px; height:134px; padding:16px; }
          .partner-card img { width:125px; height:70px; }
          .partner-arrow { width:40px; height:40px; }
        }
      `}</style>
    </div>
  );
};
