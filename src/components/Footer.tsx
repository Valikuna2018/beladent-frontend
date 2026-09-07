import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';

interface FooterProps {
  currentLang: Language;
  clinicName: string;
  logoUrl?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  googleMapsUrl?: string;
  mondaySaturdayOpen?: string;
  mondaySaturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
  sundayClosed?: boolean;
  descriptionKa?: string;
  descriptionEn?: string;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  clinicName,
  logoUrl,
  phone1 = '+995 599 00 00 00',
  phone2,
  email = 'info@beladent.ge',
  address = 'Tbilisi, Georgia',
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
  googleMapsUrl,
  mondaySaturdayOpen = '10:00',
  mondaySaturdayClose = '20:00',
  sundayOpen = '10:00',
  sundayClose = '18:00',
  sundayClosed = true,
  descriptionKa,
  descriptionEn,
}) => {
  const t = translations[currentLang];
  const currentYear = new Date().getFullYear();
  const weekOpen = mondaySaturdayOpen || '10:00';
  const weekClose = mondaySaturdayClose || '20:00';
  const sunOpen = sundayOpen || '10:00';
  const sunClose = sundayClose || '18:00';
  const mondaySaturdayLabel = currentLang === 'ka'
    ? `ორშაბათი - შაბათი: ${weekOpen} - ${weekClose}`
    : `Monday - Saturday: ${weekOpen} - ${weekClose}`;
  const sundayLabel = sundayClosed
    ? (currentLang === 'ka' ? 'კვირა: დასვენება' : 'Sunday: Closed')
    : (currentLang === 'ka'
      ? `კვირა: ${sunOpen} - ${sunClose}`
      : `Sunday: ${sunOpen} - ${sunClose}`);
  const googleMapsLink = (() => {
    if (!googleMapsUrl) return '';
    const iframeMatch = googleMapsUrl.match(/src=["']([^"']+)["']/i);
    const candidate = (iframeMatch?.[1] || googleMapsUrl).trim().replace(/&amp;/g, '&');
    try {
      const parsed = new URL(candidate);
      const isGoogleMaps = parsed.protocol === 'https:' && (
        /(^|\.)google\.[a-z.]+$/.test(parsed.hostname) ||
        parsed.hostname === 'maps.app.goo.gl'
      );
      return isGoogleMaps ? candidate : '';
    } catch {
      return '';
    }
  })();
  const mapSrc = (() => {
    if (!googleMapsLink) return '';
    const candidate = googleMapsLink;
    try {
      const parsed = new URL(candidate);
      const isGoogleMaps = parsed.protocol === 'https:' && (
        /(^|\.)google\.[a-z.]+$/.test(parsed.hostname) ||
        parsed.hostname === 'maps.app.goo.gl'
      );
      if (!isGoogleMaps) return '';
      if (parsed.pathname.includes('/maps/embed') || parsed.searchParams.get('output') === 'embed') {
        return candidate;
      }

      const preciseCoordinates = candidate.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
      const viewportCoordinates = candidate.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      const coordinates = preciseCoordinates || viewportCoordinates;
      if (coordinates) {
        return `https://www.google.com/maps?q=${coordinates[1]},${coordinates[2]}&z=17&output=embed`;
      }

      const placeMatch = parsed.pathname.match(/\/maps\/place\/([^/]+)/);
      if (placeMatch) {
        return `https://www.google.com/maps?q=${encodeURIComponent(decodeURIComponent(placeMatch[1]).replace(/\+/g, ' '))}&output=embed`;
      }
      return '';
    } catch {
      return '';
    }
  })();

  return (
    <footer id="contact" className="footer-section">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            {logoUrl ? (
              <img src={getFullImageUrl(logoUrl)} alt={`${clinicName} logo`} className="footer-brand-logo-img" />
            ) : (
              <span className="footer-brand-logo">🦷</span>
            )}
            <span className={`footer-brand-title ${currentLang === 'ka' ? 'georgian-brand-title' : 'english-brand-title'}`}>
              {clinicName}
            </span>
          </div>
          <p className="footer-description">
            {currentLang === 'ka'
              ? (descriptionKa || 'მაღალი კვალიფიკაციის ექიმები, კომფორტული და უსაფრთხო გარემო და გარანტირებული შედეგი.')
              : (descriptionEn || 'Highly qualified specialists, comfortable and safe environment, and guaranteed results.')}
          </p>
          {/* Social Icons */}
          <div className="social-links-grid">
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn facebook" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
            {youtubeUrl && (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn youtube" title="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            )}
          </div>
        </div>

        {/* Contacts column */}
        <div className="footer-col contact-col">
          <h4 className="footer-title">{t.navContact}</h4>
          <div className="footer-contact-list">
            <a href={`tel:${phone1}`} className="contact-item-link">
              <Phone size={16} />
              <span>{phone1}</span>
            </a>
            {phone2 && (
              <a href={`tel:${phone2}`} className="contact-item-link">
                <Phone size={16} />
                <span>{phone2}</span>
              </a>
            )}
            <a href={`mailto:${email}`} className="contact-item-link">
              <Mail size={16} />
              <span>{email}</span>
            </a>
            {googleMapsLink ? (
              <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="contact-item-link" aria-label={`${address} — Google Maps`}>
                <MapPin size={16} />
                <span>{address}</span>
              </a>
            ) : (
              <div className="contact-item-text">
                <MapPin size={16} />
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Working Hours column */}
        <div className="footer-col hours-col">
          <h4 className="footer-title">{t.workingHours}</h4>
          <div className="working-hours-list">
            <div className="hours-item">
              <Clock size={16} />
              <span>{mondaySaturdayLabel}</span>
            </div>
            <div className="hours-item">
              <Clock size={16} />
              <span>{sundayLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {mapSrc && (
        <div className="footer-map-wrap">
          <iframe
            src={mapSrc}
            className="footer-map-frame"
            title={currentLang === 'ka' ? 'კლინიკის მდებარეობა' : 'Clinic location'}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      )}

      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {currentYear} {clinicName}. {currentLang === 'ka' ? 'ყველა უფლება დაცულია' : 'All rights reserved.'}
        </p>
      </div>

      <style>{`
        .footer-section {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          padding: 60px 0 24px;
          margin-top: auto;
          width: 100%;
        }

        .footer-map-wrap {
          max-width: 1200px;
          height: 380px;
          margin: 8px auto 44px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }

        .footer-map-frame {
          width: 100%;
          height: 100%;
          border: 0;
          display: block;
        }

        @media (max-width: 1248px) {
          .footer-map-wrap { margin-left: 24px; margin-right: 24px; }
        }

        @media (max-width: 600px) {
          .footer-map-wrap { height: 300px; margin-left: 16px; margin-right: 16px; border-radius: 14px; }
        }

        .dark-theme .footer-section {
          background: rgba(15, 23, 42, 0.6);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 40px;
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.2fr;
          gap: 48px;
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand-logo {
          font-size: 24px;
        }

        .footer-brand-logo-img {
          width: 58px;
          height: 58px;
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }

        .footer-brand-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          color: #1557ad;
        }

        .footer-brand-title.georgian-brand-title {
          font-family: 'BPG Nino Mtavruli', 'Sylfaen', sans-serif;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1;
        }


        .footer-brand-title.english-brand-title {
          font-family: 'Segoe UI', Arial, sans-serif;
          font-weight: 700;
          letter-spacing: 0;
        }

        .footer-description {
          font-size: 0.92rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .social-links-grid {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .social-icon-btn:hover {
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .social-icon-btn.facebook:hover { background: #3b5998; border-color: #3b5998; }
        .social-icon-btn.instagram:hover { background: #e1306c; border-color: #e1306c; }
        .social-icon-btn.linkedin:hover { background: #0077b5; border-color: #0077b5; }
        .social-icon-btn.youtube:hover { background: #ff0000; border-color: #ff0000; }

        .footer-title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--text-dark);
          position: relative;
          padding-bottom: 8px;
        }
        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 32px;
          height: 2px;
          background: var(--primary);
          border-radius: 99px;
        }

        .footer-contact-list,
        .working-hours-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item-link,
        .hours-item,
        .contact-item-text {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .contact-item-link {
          transition: all 0.2s ease;
        }
        .contact-item-link:hover {
          color: var(--primary);
          padding-left: 4px;
        }

        .footer-bottom {
          border-top: 1px solid var(--input-border);
          padding-top: 24px;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .copyright-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </footer>
  );
};
