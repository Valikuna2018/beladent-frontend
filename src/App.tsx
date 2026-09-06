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
import { NewsView } from './views/NewsView';
import { NewsDetailView } from './views/NewsDetailView';
import { VacanciesView } from './views/VacanciesView';
import { SmileGalleryView } from './views/SmileGalleryView';
import { SmileGalleryDetailView } from './views/SmileGalleryDetailView';
import type { Language } from './i18n/translations';
import { publicApi, getAuthToken, clearSession } from './services/api';

function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('beladent_lang');
    return (saved as Language) || 'ka';
  });

  const [activeSection, setActiveSection] = useState<string>('home');
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

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminView(true); // Jump directly into CMS Console
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    clearSession();
    setIsAdmin(false);
    setAdminView(false);
    setActiveSection('home');
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
      setServices(servicesData || []);
      setDoctors(doctorsData || []);
      setPartners(partnersData || []);
      setVacancies(vacanciesData || []);
      setNews(newsData || []);
      setSmileGallery(smileGalleryData || []);

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
    // Check local storage token validity on start
    const token = getAuthToken();
    if (token) {
      setIsAdmin(true);
    }

    // Secret admin login URL
    if (window.location.pathname === '/Security') {
      setActiveSection('login');
    }

    loadAllPublicData(true);
  }, []);

  // Sync title updates if language changes
  useEffect(() => {
    if (siteSettings) {
      const activeTitle = lang === 'ka'
        ? (siteSettings.seoTitleKa || siteSettings.clinicNameKa || 'ბელადენტი')
        : (siteSettings.seoTitleEn || siteSettings.clinicNameEn || 'BelaDent');
      document.title = activeTitle;
    }
  }, [lang, siteSettings]);

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
        setActiveSection={setActiveSection}
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
          onBack={() => setActiveSection('services')}
        />
      ) : activeSection === 'services' ? (
        <ServicesView
          currentLang={lang}
          services={services}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            setActiveSection(path);
            window.scrollTo(0, 0);
          }}
          onBack={() => setActiveSection('home')}
        />
      ) : activeSection.startsWith('doctor/') ? (
        <DoctorDetailView
          currentLang={lang}
          doctorId={activeSection.split('/')[1]}
          doctors={doctors}
          onBack={() => setActiveSection('home')}
        />
      ) : activeSection.startsWith('news/') ? (
        <NewsDetailView
          currentLang={lang}
          newsId={activeSection.split('/')[1]}
          news={news}
          onBack={() => setActiveSection('news')}
        />
      ) : activeSection === 'news' ? (
        <NewsView
          currentLang={lang}
          news={news}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            setActiveSection(path);
            window.scrollTo(0, 0);
          }}
          onBack={() => setActiveSection('home')}
        />
      ) : activeSection.startsWith('vacancy/') ? (
        <VacancyDetailView
          currentLang={lang}
          vacancyId={activeSection.split('/')[1]}
          vacancies={vacancies}
          onBack={() => setActiveSection('home')}
        />
      ) : activeSection === 'vacancies' ? (
        <VacanciesView
          currentLang={lang}
          vacancies={vacancies}
          siteSettings={siteSettings}
          onNavigate={(path) => {
            setActiveSection(path);
            window.scrollTo(0, 0);
          }}
          onBack={() => setActiveSection('home')}
        />
      ) : activeSection.startsWith('smile-gallery/') ? (
        <SmileGalleryDetailView
          currentLang={lang}
          itemId={activeSection.split('/')[1]}
          items={smileGallery}
          onBack={() => setActiveSection('smile-gallery')}
        />
      ) : activeSection === 'smile-gallery' ? (
        <SmileGalleryView
          currentLang={lang}
          items={smileGallery}
          siteSettings={siteSettings}
          onBack={() => setActiveSection('home')}
          onNavigate={(path) => { setActiveSection(path); window.scrollTo(0, 0); }}
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
            setActiveSection(path);
            window.scrollTo(0, 0);
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
