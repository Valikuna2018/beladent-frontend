import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { PublicView } from './views/PublicView';
import { AdminLogin } from './views/AdminLogin';
import { AdminPanel } from './views/AdminPanel';
import { ServiceDetailView } from './views/ServiceDetailView';
import { DoctorDetailView } from './views/DoctorDetailView';
import { VacancyDetailView } from './views/VacancyDetailView';
import { ServicesView } from './views/ServicesView';
import { DoctorsView } from './views/DoctorsView';
import { NewsView } from './views/NewsView';
import { NewsDetailView } from './views/NewsDetailView';
import { VacanciesView } from './views/VacanciesView';
import { SmileGalleryView } from './views/SmileGalleryView';
import { SmileGalleryDetailView } from './views/SmileGalleryDetailView';
import type { Language } from './i18n/translations';
import { publicApi, getAuthToken, clearSession } from './services/api';
import { richTextToPlainText } from './components/RichText';

const sectionFromPath = (pathname: string) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
  if (!clean) return 'home';
  if (clean.toLowerCase() === 'security') return 'login';
  const [page, id] = clean.split('/');
  const map: Record<string, string> = {
    services: 'services', doctors: 'doctors', news: 'news', vacancies: 'vacancies',
    'smile-gallery': 'smile-gallery', about: 'about', contact: 'contact'
  };
  const section = map[page];
  const detail: Record<string, string> = { services: 'service', doctors: 'doctor', news: 'news', vacancies: 'vacancy', 'smile-gallery': 'smile-gallery' };
  return section ? (id ? `${detail[section] || section}/${id}` : section) : 'home';
};

const pathFromSection = (section: string) => {
  if (section === 'home') return '/';
  if (section === 'login' || section === 'dashboard') return '/Security';
  const [page, id] = section.split('/');
  const plural: Record<string, string> = { service: 'services', doctor: 'doctors', vacancy: 'vacancies' };
  return `/${plural[page] || page}${id ? `/${encodeURIComponent(id)}` : ''}`;
};

const sortByOrder = (items: any[] = []) => [...items].sort((a, b) =>
  (Number(a?.sortOrder) || 0) - (Number(b?.sortOrder) || 0) || (Number(a?.id) || 0) - (Number(b?.id) || 0)
);

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('beladent_lang');
    return (saved as Language) || 'ka';
  });

  const [activeSection, setActiveSection] = useState<string>(() => sectionFromPath(window.location.pathname));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminView, setAdminView] = useState<boolean>(false);

  // Global Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Dynamic backend data states
  const [loading, setLoading] = useState<boolean>(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [smileGallery, setSmileGallery] = useState<any[]>([]);

  // Toggle dynamic translation key in localStorage
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('beladent_lang', newLang);
    
    // Dynamically update page Title/Meta tags if siteSettings is available
    if (siteSettings) {
      document.title = newLang === 'ka' 
        ? (siteSettings.seoTitleKa || siteSettings.clinicNameKa || 'ბელადენტი')
        : (siteSettings.seoTitleEn || siteSettings.clinicNameEn || 'BelaDent');
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const navigateTo = (section: string, replace = false) => {
    const path = pathFromSection(section);
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({ beladent: true, section }, '', path);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = (fallback: string) => {
    if (window.history.state?.beladent) window.history.back();
    else navigateTo(fallback, true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminView(true); // Jump directly into CMS Console
    navigateTo('dashboard', true);
  };

  const handleLogout = () => {
    clearSession();
    setIsAdmin(false);
    setAdminView(false);
    navigateTo('home', true);
    showToast(
      lang === 'ka' ? 'წარმატებით გამოხვედით მართვის პანელიდან' : 'Logged out of CMS successfully',
      'info'
    );
  };

  const loadAllPublicData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [settingsData, aboutData, contactData, servicesData, doctorsData, partnersData, vacanciesData, newsData, smileGalleryData] = await Promise.all([
        publicApi.getSiteSettings().catch(() => null),
        publicApi.getAbout().catch(() => null),
        publicApi.getContactInfo().catch(() => null),
        publicApi.getServices().catch(() => []),
        publicApi.getDoctors().catch(() => []),
        publicApi.getPartners().catch(() => []),
        publicApi.getVacancies().catch(() => []),
        publicApi.getNews().catch(() => []),
        publicApi.getSmileGallery().catch(() => []),
      ]);

      setSiteSettings(settingsData);
      setAbout(aboutData);
      setContactInfo(contactData);
      setServices(sortByOrder(servicesData || []));
      setDoctors(sortByOrder(doctorsData || []));
      setPartners(sortByOrder(partnersData || []));
      setVacancies(vacanciesData || []);
      setNews(sortByOrder(newsData || []));
      setSmileGallery(sortByOrder(smileGalleryData || []));

      // Update HTML metadata dynamically
      const activeTitle = lang === 'ka'
        ? (settingsData?.seoTitleKa || settingsData?.clinicNameKa || 'ბელადენტი')
        : (settingsData?.seoTitleEn || settingsData?.clinicNameEn || 'BelaDent');
      document.title = activeTitle;

      // Update SEO description meta tag
      const activeDesc = lang === 'ka' ? settingsData?.seoDescriptionKa : settingsData?.seoDescriptionEn;
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', activeDesc || 'BelaDent Dental Clinic');

    } catch (err) {
      console.error('Failed to load public API data from Spring Boot', err);
      // Fail silently or show fallback data
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Check local storage token validity on start
    const token = getAuthToken();
    if (token) {
      setIsAdmin(true);
    }

    // Secret admin login URL
    window.history.replaceState({ beladent: true, section: sectionFromPath(window.location.pathname) }, '', window.location.href);
    const onPopState = () => {
      setActiveSection(sectionFromPath(window.location.pathname));
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPopState);

    loadAllPublicData(true);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync title updates if language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    if (siteSettings) {
      const activeTitle = lang === 'ka'
        ? (siteSettings.seoTitleKa || siteSettings.clinicNameKa || 'ბელადენტი')
        : (siteSettings.seoTitleEn || siteSettings.clinicNameEn || 'BelaDent');
      document.title = activeTitle;
    }
  }, [lang, siteSettings]);

  useEffect(() => {
    const detailId = activeSection.split('/')[1];
    const pick = (items: any[]) => items.find((item) => String(item.id) === detailId || item.slug === detailId);
    const entity = activeSection.startsWith('service/') ? pick(services)
      : activeSection.startsWith('doctor/') ? pick(doctors)
      : activeSection.startsWith('news/') ? pick(news)
      : activeSection.startsWith('vacancy/') ? pick(vacancies)
      : activeSection.startsWith('smile-gallery/') ? pick(smileGallery) : null;
    const clinic = lang === 'ka' ? (siteSettings?.clinicNameKa || 'ბელა დენტი') : (siteSettings?.clinicNameEn || 'BelaDent');
    const listTitles: Record<string, string> = lang === 'ka'
      ? { services: 'სერვისები', doctors: 'ექიმები', news: 'სიახლეები', vacancies: 'ვაკანსიები', 'smile-gallery': 'ღიმილის გალერეა', about: 'ჩვენ შესახებ', contact: 'კონტაქტი' }
      : { services: 'Services', doctors: 'Doctors', news: 'News', vacancies: 'Vacancies', 'smile-gallery': 'Smile Gallery', about: 'About Us', contact: 'Contact' };
    const customSeoTitle = entity && (lang === 'ka' ? entity.seoTitleKa : entity.seoTitleEn);
    const entityTitle = customSeoTitle || (entity && (activeSection.startsWith('doctor/')
      ? `${lang === 'ka' ? entity.firstNameKa : entity.firstNameEn} ${lang === 'ka' ? entity.lastNameKa : entity.lastNameEn}`.trim()
      : (lang === 'ka' ? entity.titleKa : entity.titleEn)));
    const title = entityTitle ? `${entityTitle} | ${clinic}`
      : activeSection === 'home' ? (lang === 'ka' ? siteSettings?.seoTitleKa : siteSettings?.seoTitleEn) || clinic
      : `${listTitles[activeSection] || clinic} | ${clinic}`;
    const customMetaDescription = entity && (lang === 'ka' ? entity.metaDescriptionKa : entity.metaDescriptionEn);
    const rawDescription = customMetaDescription || (entity && (activeSection.startsWith('doctor/')
      ? (lang === 'ka' ? entity.specializationKa : entity.specializationEn)
      : (lang === 'ka' ? (entity.shortDescriptionKa || entity.descriptionKa || entity.textKa) : (entity.shortDescriptionEn || entity.descriptionEn || entity.textEn))));
    const description = richTextToPlainText(rawDescription || (lang === 'ka' ? siteSettings?.seoDescriptionKa : siteSettings?.seoDescriptionEn) || clinic).slice(0, 160);
    document.title = title;
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
      if (!element) {
        element = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        if (selector === 'meta[name="description"]') element.setAttribute('name', 'description');
        if (selector === 'meta[property="og:title"]') element.setAttribute('property', 'og:title');
        if (selector === 'meta[property="og:description"]') element.setAttribute('property', 'og:description');
        if (selector === 'meta[property="og:url"]') element.setAttribute('property', 'og:url');
        if (selector.startsWith('link')) element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', window.location.href);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', window.location.href);
  }, [activeSection, lang, siteSettings, services, doctors, news, vacancies, smileGallery]);

  useEffect(() => {
    if (activeSection === 'about' || activeSection === 'contact') {
      window.setTimeout(() => document.getElementById(activeSection)?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [activeSection]);

  // General clinic info resolvers
  const clinicName = siteSettings
    ? (lang === 'ka' ? siteSettings.clinicNameKa : siteSettings.clinicNameEn)
    : 'BelaDent';

  const activeLogoUrl = lang === 'ka'
    ? (siteSettings?.geoLogoUrl || siteSettings?.logoUrl)
    : (siteSettings?.logoUrl || siteSettings?.geoLogoUrl);

  const footerPhones = contactInfo
    ? { phone1: contactInfo.phone1, phone2: contactInfo.phone2 }
    : undefined;

  return (
    <>
      {/* 1. Navbar Navigation Shell */}
      <Navbar
        currentLang={lang}
        setLang={handleSetLang}
        activeSection={activeSection}
        setActiveSection={navigateTo}
        isAdmin={isAdmin}
        isAdminView={isAdminView}
        setAdminView={setAdminView}
        onLogout={handleLogout}
        logoUrl={activeLogoUrl}
        clinicName={clinicName}
        services={services}
      />

      {/* 2. Main content router */}
      {isAdminView ? (
        <AdminPanel
          currentLang={lang}
          onLogout={handleLogout}
          onShowToast={showToast}
          onRefreshPublicData={loadAllPublicData}
        />
      ) : activeSection === 'login' ? (
        <AdminLogin
          currentLang={lang}
          onLoginSuccess={handleLoginSuccess}
          onShowToast={showToast}
        />
      ) : activeSection.startsWith('service/') ? (
        <ServiceDetailView
          currentLang={lang}
          serviceId={activeSection.split('/')[1]}
          services={services}
          onBack={() => goBack('services')}
        />
      ) : activeSection === 'services' ? (
        <ServicesView
          currentLang={lang}
          services={services}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            navigateTo(path);
          }}
          onBack={() => goBack('home')}
        />
      ) : activeSection.startsWith('doctor/') ? (
        <DoctorDetailView
          currentLang={lang}
          doctorId={activeSection.split('/')[1]}
          doctors={doctors}
          onBack={() => goBack('doctors')}
        />
      ) : activeSection === 'doctors' ? (
        <DoctorsView
          currentLang={lang}
          doctors={doctors}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            navigateTo(path);
          }}
          onBack={() => goBack('home')}
        />
      ) : activeSection.startsWith('news/') ? (
        <NewsDetailView
          currentLang={lang}
          newsId={activeSection.split('/')[1]}
          news={news}
          onBack={() => goBack('news')}
        />
      ) : activeSection === 'news' ? (
        <NewsView
          currentLang={lang}
          news={news}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            navigateTo(path);
          }}
          onBack={() => goBack('home')}
        />
      ) : activeSection.startsWith('vacancy/') ? (
        <VacancyDetailView
          currentLang={lang}
          vacancyId={activeSection.split('/')[1]}
          vacancies={vacancies}
          onBack={() => goBack('vacancies')}
        />
      ) : activeSection === 'vacancies' ? (
        <VacanciesView
          currentLang={lang}
          vacancies={vacancies}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            navigateTo(path);
          }}
          onBack={() => goBack('home')}
        />
      ) : activeSection.startsWith('smile-gallery/') ? (
        <SmileGalleryDetailView
          currentLang={lang}
          itemId={activeSection.split('/')[1]}
          items={smileGallery}
          onBack={() => goBack('smile-gallery')}
        />
      ) : activeSection === 'smile-gallery' ? (
        <SmileGalleryView
          currentLang={lang}
          items={smileGallery}
          siteSettings={siteSettings}
          onBack={() => goBack('home')}
          onNavigate={navigateTo}
        />
      ) : (
        <PublicView
          currentLang={lang}
          siteSettings={siteSettings}
          about={about}
          contactInfo={contactInfo}
          services={services}
          doctors={doctors}
          partners={partners}
          vacancies={vacancies}
          loading={loading}
          onShowToast={showToast}
          onNavigate={(path) => {
            navigateTo(path);
          }}
        />
      )}

      {/* 3. Footer info panel (Hidden inside Administrative Console CRUD workspace) */}
      {!isAdminView && (
        <Footer
          currentLang={lang}
          clinicName={clinicName}
          logoUrl={activeLogoUrl}
          phone1={footerPhones?.phone1}
          phone2={footerPhones?.phone2}
          email={contactInfo?.email}
          address={contactInfo ? (lang === 'ka' ? contactInfo.addressKa : contactInfo.addressEn) : undefined}
          facebookUrl={contactInfo?.facebookUrl}
          instagramUrl={contactInfo?.instagramUrl}
          linkedinUrl={contactInfo?.linkedinUrl}
          youtubeUrl={contactInfo?.youtubeUrl}
          googleMapsUrl={contactInfo?.googleMapsUrl}
          mondaySaturdayOpen={contactInfo?.mondaySaturdayOpen}
          mondaySaturdayClose={contactInfo?.mondaySaturdayClose}
          mondayFridayOpen={contactInfo?.mondayFridayOpen}
          mondayFridayClose={contactInfo?.mondayFridayClose}
          saturdayOpen={contactInfo?.saturdayOpen}
          saturdayClose={contactInfo?.saturdayClose}
          saturdayClosed={contactInfo?.saturdayClosed ?? false}
          sundayOpen={contactInfo?.sundayOpen}
          sundayClose={contactInfo?.sundayClose}
          sundayClosed={contactInfo?.sundayClosed ?? true}
          descriptionKa={contactInfo?.footerDescriptionKa}
          descriptionEn={contactInfo?.footerDescriptionEn}
        />
      )}

      {/* 4. Common Toast Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default App;
