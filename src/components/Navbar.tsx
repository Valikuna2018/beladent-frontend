import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { getFullImageUrl } from '../services/api';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAdmin: boolean;
  isAdminView: boolean;
  setAdminView: (view: boolean) => void;
  onLogout: () => void;
  logoUrl?: string;
  clinicName: string;
  services?: any[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  setLang,
  activeSection,
  setActiveSection,
  isAdmin,
  isAdminView,
  setAdminView,
  onLogout,
  logoUrl,
  clinicName,
  services = [],
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setAdminView(false); // Return to public view
    setActiveSection(section);
    
    if (
      section === 'services' ||
      section === 'news' ||
      section === 'vacancies' ||
      section.startsWith('service/') ||
      section.startsWith('doctor/') ||
      section.startsWith('vacancy/') ||
      section.startsWith('news/')
    ) {
       window.scrollTo(0, 0);
       return;
    }

    if (section === 'home') {
       setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
       return;
    }
    
    // Smooth scroll to section after view loads
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) {
        const offset = 80; // height of navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const navItems = [
    {
      id: 'about-dropdown',
      label: t.navAbout,
      dropdown: [
        { id: 'about', label: t.navAbout },
        { id: 'news', label: currentLang === 'ka' ? 'სიახლეები' : 'News' },
        { id: 'vacancies', label: currentLang === 'ka' ? 'ვაკანსიები' : 'Vacancies' },
      ]
    },
    {
      id: 'services-dropdown',
      label: t.navServices,
      dropdown: [
        { id: 'services', label: currentLang === 'ka' ? 'ყველა სერვისი' : 'All Services' },
        ...services.filter(s => s.active).map(s => ({
          id: 'service/' + (s.slug || s.id),
          label: currentLang === 'ka' ? s.titleKa : s.titleEn
        }))
      ]
    },
    { id: 'doctors', label: t.navDoctors },
    { id: 'smile-gallery', label: currentLang === 'ka' ? 'ღიმილის გალერეა' : 'Smile Gallery' },
    { id: 'contact', label: t.navContact },
  ];

  return (
    <header className={`main-nav ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-container">
        {/* Brand / Logo */}
        <div className="brand-logo" onClick={() => handleNavClick('home')}>
          {logoUrl ? (
            <img src={getFullImageUrl(logoUrl)} alt="BelaDent Logo" className="logo-img" />
          ) : (
            <div className="logo-fallback-icon">🦷</div>
          )}
          <span className="clinic-title">{clinicName}</span>
        </div>

        {/* Desktop Navigation */}
        {!isAdminView ? (
          <nav className="desktop-links">
            {navItems.map((item) => (
              <div 
                key={item.id} 
                className="nav-item-wrapper"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}>
                    {item.label}
                    <svg style={{ marginLeft: 4, width: 12, height: 12 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                )}

                {item.dropdown && activeDropdown === item.id && (
                  <div className="nav-dropdown-menu">
                    {item.dropdown.map(subItem => (
                      <button 
                        key={subItem.id} 
                        className="dropdown-item-btn"
                        onClick={() => handleNavClick(subItem.id)}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        ) : (
          <div className="admin-view-indicator">
            <Settings size={18} className="spin-slow" />
            <span>{t.navAdminPanel}</span>
          </div>
        )}

        {/* Global Toolbar */}
        <div className="toolbar-controls">
          {/* Language Selector */}
          <div className="lang-switcher">
            <button
              onClick={() => setLang(currentLang === 'ka' ? 'en' : 'ka')}
              className="btn-toolbar"
              title="Switch Language"
            >
              <Globe size={18} />
              <span className="lang-text">{currentLang === 'ka' ? 'ქარ' : 'EN'}</span>
            </button>
          </div>

          {/* Admin Navigation - only visible when logged in */}
          {isAdmin && (
            <div className="admin-actions">
              {isAdminView ? (
                <button onClick={() => setAdminView(false)} className="btn btn-secondary btn-nav-sm">
                  {t.navHome}
                </button>
              ) : (
                <button onClick={() => setAdminView(true)} className="btn btn-primary btn-nav-sm">
                  <User size={16} />
                  <span className="admin-btn-text">{t.navAdminPanel}</span>
                </button>
              )}
              <button onClick={onLogout} className="btn-toolbar logout-btn" title={t.navLogout}>
                <LogOut size={18} />
              </button>
            </div>
          )}

          {/* Mobile Hamburguer */}
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-links-drawer">
          {!isAdminView ? (
            navItems.map((item) => (
              <React.Fragment key={item.id}>
                {item.dropdown ? (
                  <div className="mobile-dropdown-wrapper">
                    <button
                      type="button"
                      className="mobile-dropdown-header"
                      onClick={() => setMobileExpandedDropdown(mobileExpandedDropdown === item.id ? null : item.id)}
                      aria-expanded={mobileExpandedDropdown === item.id}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={mobileExpandedDropdown === item.id ? 'expanded' : ''} size={21} />
                    </button>
                    {mobileExpandedDropdown === item.id && (
                      <div className="mobile-dropdown-content">
                        {item.dropdown.map(subItem => (
                          <button
                            key={subItem.id}
                            onClick={() => handleNavClick(subItem.id)}
                            className="mobile-sub-link-btn"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-nav-link-btn ${activeSection === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="mobile-nav-admin-title">{t.navAdminPanel}</div>
          )}

          {/* Mobile Admin Actions */}
          {isAdmin && (
            <div className="mobile-drawer-admin-section">
              {isAdminView ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAdminView(false);
                  }}
                  className="btn btn-secondary mobile-btn"
                >
                  {t.navHome}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAdminView(true);
                  }}
                  className="btn btn-primary mobile-btn"
                >
                  {t.navAdminPanel}
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="btn btn-danger mobile-btn"
              >
                <LogOut size={16} />
                <span>{t.navLogout}</span>
              </button>
            </div>
          )}
        </nav>
      )}

      <style>{`
        .main-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 999;
          background: #ffffff;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          transition: all 0.3s ease;
        }

        .main-nav.scrolled {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .dark-theme .main-nav {
          background: rgba(15, 23, 42, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .dark-theme .main-nav.scrolled {
          background: rgba(15, 23, 42, 0.88);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .logo-img {
          width: 110px;
          height: 62px;
          object-fit: contain;
          object-position: center;
          display: block;
          flex-shrink: 0;
        }

        .logo-fallback-icon {
          font-size: 28px;
          animation: wiggle 3s infinite ease-in-out;
        }

        .clinic-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.38rem;
          color: #1557ad;
          background: none;
          -webkit-text-fill-color: #1557ad;
          white-space: nowrap;
        }

        .desktop-links {
          display: flex;
          gap: 6px;
        }

        .nav-item-wrapper {
          position: relative;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--bg-app);
          border: 1px solid var(--input-border);
          border-radius: 12px;
          padding: 8px 0;
          min-width: 220px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.2s ease-out;
          z-index: 100;
        }

        .dropdown-item-btn {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 20px;
          background: transparent;
          border: none;
          color: var(--text-dark);
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-item-btn:hover {
          background: var(--primary-light);
          color: var(--primary);
          padding-left: 26px;
        }

        .dark-theme .nav-dropdown-menu {
          background: var(--card-bg);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-link-btn {
          background: transparent;
          border: none;
          color: var(--text-dark);
          font-family: var(--font-heading);
          font-weight: 550;
          font-size: 0.94rem;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
        }

        .nav-link-btn:hover {
          color: var(--primary);
          background: rgba(14, 116, 144, 0.06);
        }

        .nav-link-btn.active {
          color: var(--primary);
          background: var(--primary-light);
        }

        .dark-theme .nav-link-btn.active {
          background: rgba(255, 255, 255, 0.08);
          color: var(--accent-cyan);
        }

        .admin-view-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1rem;
        }

        .dark-theme .admin-view-indicator {
          color: var(--accent-cyan);
        }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-toolbar {
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--text-dark);
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-toolbar:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: var(--primary);
          color: var(--primary);
        }
        .dark-theme .btn-toolbar:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .admin-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-nav-sm {
          padding: 8px 16px;
          font-size: 0.88rem;
          border-radius: 10px;
        }

        .admin-btn-text {
          @media (max-width: 768px) {
            display: none;
          }
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-dark);
          cursor: pointer;
          padding: 4px;
        }

        .mobile-links-drawer {
          display: none;
        }

        .spin-slow {
          animation: spin 8s infinite linear;
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .logo-img { width: 96px; height: 56px; }
          .clinic-title { font-size: 1.05rem; white-space: nowrap; }
          .desktop-links {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }

          .main-nav.menu-open {
            background: var(--bg-app);
            height: 100vh;
          }

          .main-nav.menu-open .nav-container {
            height: 80px;
          }

          .mobile-links-drawer {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 80px;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 18px 24px 32px;
            gap: 12px;
            animation: fadeIn 0.3s ease-out;
            height: auto;
            overflow-y: auto;
            background: var(--bg-app);
            border-top: 1px solid var(--input-border);
          }

          .mobile-nav-link-btn {
            background: transparent;
            border: none;
            color: var(--text-dark);
            font-family: var(--font-heading);
            font-weight: 600;
            font-size: 1.2rem;
            padding: 12px 16px;
            border-radius: 10px;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
          }

          .mobile-dropdown-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mobile-dropdown-header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: none;
            background: transparent;
            font-family: var(--font-heading);
            font-weight: 600;
            font-size: 1.2rem;
            padding: 12px 16px;
            color: var(--text-dark);
            cursor: pointer;
            text-align: left;
          }

          .mobile-dropdown-header svg {
            flex-shrink: 0;
            transition: transform 0.22s ease;
          }

          .mobile-dropdown-header svg.expanded {
            transform: rotate(180deg);
          }

          .mobile-dropdown-content {
            display: flex;
            flex-direction: column;
            padding-left: 16px;
            border-left: 2px solid var(--input-border);
            margin-left: 16px;
            max-height: 230px;
            overflow-y: auto;
            overscroll-behavior: contain;
            scrollbar-width: thin;
          }

          .mobile-sub-link-btn {
            background: transparent;
            border: none;
            color: var(--text-dark);
            font-family: var(--font-heading);
            font-weight: 500;
            font-size: 1.1rem;
            padding: 10px 16px;
            text-align: left;
            cursor: pointer;
          }

          .mobile-sub-link-btn:hover {
            color: var(--primary);
          }

          .mobile-nav-link-btn:hover,
          .mobile-nav-link-btn.active {
            color: var(--primary);
            background: var(--primary-light);
          }

          .mobile-nav-admin-title {
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1.3rem;
            color: var(--primary);
            padding: 12px 16px;
          }

          .mobile-drawer-admin-section {
            margin-top: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px 0;
            border-top: 1px solid var(--input-border);
          }

          .mobile-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 520px) {
          .nav-container { padding: 0 12px; }
          .brand-logo { gap: 7px; min-width: 0; }
          .logo-img { width: 78px; height: 52px; }
          .clinic-title { font-size: 0.95rem; }
          .toolbar-controls { gap: 6px; }
          .btn-toolbar { padding: 7px 9px; }
        }
      `}</style>
    </header>
  );
};
