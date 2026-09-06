import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Stethoscope,
  Briefcase,
  Image as ImageIcon,
  HeartHandshake,
  Settings,
  Info,
  PhoneCall,
  Plus,
  Edit2,
  Trash2,
  Loader,
  LogOut,
  Upload,
  Newspaper,
  KeyRound
} from 'lucide-react';
import type { Language } from '../i18n/translations';
import { translations } from '../i18n/translations';
import { adminApi, getFullImageUrl } from '../services/api';
import { GlassCard } from '../components/GlassCard';
import { CustomModal } from '../components/CustomModal';
import { RichTextEditor } from '../components/RichText';

interface AdminPanelProps {
  currentLang: Language;
  onLogout: () => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onRefreshPublicData: () => void;
}

type SidebarTab =
  | 'dashboard'
  | 'services'
  | 'doctors'
  | 'gallery'
  | 'partners'
  | 'vacancies'
  | 'news'
  | 'smile-gallery'
  | 'about'
  | 'contact'
  | 'settings'
  | 'security';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentLang,
  onLogout,
  onShowToast,
  onRefreshPublicData,
}) => {
  const t = translations[currentLang];
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Loaded DB data states
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [smileGallery, setSmileGallery] = useState<any[]>([]);
  const [, setAbout] = useState<any>(null);
  const [, setContactInfo] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Form Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Dynamic Form Fields
  const [formFields, setFormFields] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null); // for settings: logo and background
  const [selectedFile3, setSelectedFile3] = useState<File | null>(null);
  const [selectedFile4, setSelectedFile4] = useState<File | null>(null);
  const [selectedFile5, setSelectedFile5] = useState<File | null>(null);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Force Dark Theme inside Admin console for extremely premium premium aesthetics
  useEffect(() => {
    document.body.classList.add('dark-theme');
    setSelectedFile(null);
    setSelectedFile2(null);
    setSelectedFile3(null);
    setSelectedFile4(null);
    setSelectedFile5(null);
    fetchTabInitialData(activeTab);
    return () => {
      document.body.classList.remove('dark-theme');
    };
  }, [activeTab]);

  const fetchTabInitialData = async (tab: SidebarTab) => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const [serv, doc, gall, vac] = await Promise.all([
          adminApi.getServices(),
          adminApi.getDoctors(),
          adminApi.getGallery(),
          adminApi.getVacancies(),
        ]);
        setServices(serv);
        setDoctors(doc);
        setGallery(gall);
        setVacancies(vac);
      } else if (tab === 'services') {
        const data = await adminApi.getServices();
        setServices(data);
      } else if (tab === 'doctors') {
        const data = await adminApi.getDoctors();
        setDoctors(data);
      } else if (tab === 'gallery') {
        const data = await adminApi.getGallery();
        setGallery(data);
      } else if (tab === 'partners') {
        const data = await adminApi.getPartners();
        setPartners(data);
      } else if (tab === 'vacancies') {
        const data = await adminApi.getVacancies();
        setVacancies(data);
      } else if (tab === 'news') {
        const data = await adminApi.getNews();
        setNews(data);
      } else if (tab === 'smile-gallery') {
        const data = await adminApi.getSmileGallery();
        setSmileGallery(data);
      } else if (tab === 'about') {
        const data = await adminApi.getAbout();
        setAbout(data || {});
        setFormFields(data || {});
      } else if (tab === 'contact') {
        const data = await adminApi.getContactInfo();
        setContactInfo(data || {});
        setFormFields(data || {});
      } else if (tab === 'settings') {
        const data = await adminApi.getSiteSettings();
        setSiteSettings(data || {});
        setFormFields(data || {});
      }
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || t.actionError, 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD actions helper
  const openFormModal = (type: 'create' | 'edit', item?: any) => {
    setModalType(type);
    setSelectedFile(null);
    setSelectedFile2(null);
    setSelectedFile3(null);
    setSelectedFile4(null);
    setSelectedFile5(null);

    if (type === 'edit' && item) {
      setSelectedId(item.id);
      setFormFields({ ...item });
    } else {
      setSelectedId(null);
      // Initialize fresh fields based on tab
      if (activeTab === 'services') {
        setFormFields({ titleKa: '', titleEn: '', slug: '', descriptionKa: '', descriptionEn: '', sortOrder: 0, active: true });
      } else if (activeTab === 'doctors') {
        setFormFields({ firstNameKa: '', firstNameEn: '', lastNameKa: '', lastNameEn: '', specializationKa: '', specializationEn: '', slug: '', descriptionKa: '', descriptionEn: '', sortOrder: 0, active: true });
      } else if (activeTab === 'gallery') {
        setFormFields({ titleKa: '', titleEn: '', sortOrder: 0, active: true });
      } else if (activeTab === 'partners') {
        setFormFields({ name: '', sortOrder: 0, active: true });
      } else if (activeTab === 'vacancies') {
        setFormFields({ titleKa: '', titleEn: '', positionKa: '', positionEn: '', descriptionKa: '', descriptionEn: '', active: true });
      } else if (activeTab === 'news') {
        setFormFields({ titleKa: '', titleEn: '', textKa: '', textEn: '', sortOrder: 0, active: true });
      } else if (activeTab === 'smile-gallery') {
        setFormFields({ titleKa: '', titleEn: '', textKa: '', textEn: '', sortOrder: 0, active: true });
      }
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (activeTab === 'services') {
        const formData = new FormData();
        formData.append('titleKa', formFields.titleKa || '');
        formData.append('titleEn', formFields.titleEn || '');
        formData.append('slug', formFields.slug || '');
        formData.append('descriptionKa', formFields.descriptionKa || '');
        formData.append('descriptionEn', formFields.descriptionEn || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);

        if (modalType === 'create') {
          await adminApi.createService(formData);
        } else if (selectedId) {
          await adminApi.updateService(selectedId, formData);
        }
      } else if (activeTab === 'doctors') {
        const formData = new FormData();
        formData.append('firstNameKa', formFields.firstNameKa || '');
        formData.append('firstNameEn', formFields.firstNameEn || '');
        formData.append('lastNameKa', formFields.lastNameKa || '');
        formData.append('lastNameEn', formFields.lastNameEn || '');
        formData.append('specializationKa', formFields.specializationKa || '');
        formData.append('specializationEn', formFields.specializationEn || '');
        formData.append('slug', formFields.slug || '');
        formData.append('descriptionKa', formFields.descriptionKa || '');
        formData.append('descriptionEn', formFields.descriptionEn || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);

        if (modalType === 'create') {
          await adminApi.createDoctor(formData);
        } else if (selectedId) {
          await adminApi.updateDoctor(selectedId, formData);
        }
      } else if (activeTab === 'gallery') {
        const formData = new FormData();
        formData.append('titleKa', formFields.titleKa || '');
        formData.append('titleEn', formFields.titleEn || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);

        if (modalType === 'create') {
          await adminApi.createGalleryImage(formData);
        } else if (selectedId) {
          await adminApi.updateGalleryImage(selectedId, formData);
        }
      } else if (activeTab === 'partners') {
        const formData = new FormData();
        formData.append('name', formFields.name || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);
        if (modalType === 'create') await adminApi.createPartner(formData);
        else if (selectedId) await adminApi.updatePartner(selectedId, formData);
      } else if (activeTab === 'vacancies') {
        const payload = {
          titleKa: formFields.titleKa,
          titleEn: formFields.titleEn,
          positionKa: formFields.positionKa,
          positionEn: formFields.positionEn,
          descriptionKa: formFields.descriptionKa,
          descriptionEn: formFields.descriptionEn,
          active: formFields.active ?? true,
        };

        if (modalType === 'create') {
          await adminApi.createVacancy(payload);
        } else if (selectedId) {
          await adminApi.updateVacancy(selectedId, payload);
        }
      } else if (activeTab === 'news') {
        const formData = new FormData();
        formData.append('titleKa', formFields.titleKa || '');
        formData.append('titleEn', formFields.titleEn || '');
        formData.append('textKa', formFields.textKa || '');
        formData.append('textEn', formFields.textEn || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);
        if (modalType === 'create') await adminApi.createNews(formData);
        else if (selectedId) await adminApi.updateNews(selectedId, formData);
      } else if (activeTab === 'smile-gallery') {
        const formData = new FormData();
        formData.append('titleKa', formFields.titleKa || '');
        formData.append('titleEn', formFields.titleEn || '');
        formData.append('textKa', formFields.textKa || '');
        formData.append('textEn', formFields.textEn || '');
        formData.append('sortOrder', String(formFields.sortOrder || 0));
        formData.append('active', String(formFields.active ?? true));
        if (selectedFile) formData.append('file', selectedFile);
        if (modalType === 'create') await adminApi.createSmileGalleryItem(formData);
        else if (selectedId) await adminApi.updateSmileGalleryItem(selectedId, formData);
      } else if (activeTab === 'about') {
        const formData = new FormData();
        formData.append('titleKa', formFields.titleKa || '');
        formData.append('titleEn', formFields.titleEn || '');
        formData.append('descriptionKa', formFields.descriptionKa || '');
        formData.append('descriptionEn', formFields.descriptionEn || '');
        if (selectedFile) formData.append('file', selectedFile);
        await adminApi.updateAbout(formData);
      } else if (activeTab === 'contact') {
        const payload = {
          phone1: formFields.phone1,
          phone2: formFields.phone2,
          email: formFields.email,
          addressKa: formFields.addressKa,
          addressEn: formFields.addressEn,
          facebookUrl: formFields.facebookUrl,
          instagramUrl: formFields.instagramUrl,
          linkedinUrl: formFields.linkedinUrl,
          youtubeUrl: formFields.youtubeUrl,
          googleMapsUrl: formFields.googleMapsUrl,
          mondaySaturdayOpen: formFields.mondaySaturdayOpen || '10:00',
          mondaySaturdayClose: formFields.mondaySaturdayClose || '20:00',
          sundayOpen: formFields.sundayOpen || '10:00',
          sundayClose: formFields.sundayClose || '18:00',
          sundayClosed: formFields.sundayClosed ?? true,
          footerDescriptionKa: formFields.footerDescriptionKa || '',
          footerDescriptionEn: formFields.footerDescriptionEn || '',
        };
        await adminApi.updateContactInfo(payload);
      } else if (activeTab === 'settings') {
        const formData = new FormData();
        formData.append('clinicNameKa', formFields.clinicNameKa || '');
        formData.append('clinicNameEn', formFields.clinicNameEn || '');
        formData.append('seoTitleKa', formFields.seoTitleKa || '');
        formData.append('seoTitleEn', formFields.seoTitleEn || '');
        formData.append('seoDescriptionKa', formFields.seoDescriptionKa || '');
        formData.append('seoDescriptionEn', formFields.seoDescriptionEn || '');
        ['services', 'doctors', 'news', 'vacancies', 'smileGallery'].forEach((section) => {
          formData.append(`${section}SubtitleKa`, formFields[`${section}SubtitleKa`] || '');
          formData.append(`${section}SubtitleEn`, formFields[`${section}SubtitleEn`] || '');
        });
        if (selectedFile) formData.append('logoFile', selectedFile);
        if (selectedFile5) formData.append('geoLogoFile', selectedFile5);
        if (selectedFile2) formData.append('backgroundFile', selectedFile2);
        if (selectedFile3) formData.append('backgroundFile2', selectedFile3);
        if (selectedFile4) formData.append('backgroundFile3', selectedFile4);

        await adminApi.updateSiteSettings(formData);
      }

      onShowToast(t.saveSuccess, 'success');
      setIsModalOpen(false);
      fetchTabInitialData(activeTab);
      onRefreshPublicData(); // Propagate changes back to landing page
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || t.actionError, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t.deleteConfirmation)) return;
    setActionLoading(true);

    try {
      if (activeTab === 'services') {
        await adminApi.deleteService(id);
      } else if (activeTab === 'doctors') {
        await adminApi.deleteDoctor(id);
      } else if (activeTab === 'gallery') {
        await adminApi.deleteGalleryImage(id);
      } else if (activeTab === 'partners') {
        await adminApi.deletePartner(id);
      } else if (activeTab === 'vacancies') {
        await adminApi.deleteVacancy(id);
      } else if (activeTab === 'news') {
        await adminApi.deleteNews(id);
      } else if (activeTab === 'smile-gallery') {
        await adminApi.deleteSmileGalleryItem(id);
      }

      onShowToast(t.deleteSuccess, 'success');
      fetchTabInitialData(activeTab);
      onRefreshPublicData();
    } catch (err: any) {
      console.error(err);
      onShowToast(err.message || t.actionError, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordFields.newPassword.length < 8) {
      onShowToast(currentLang === 'ka' ? 'ახალი პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს' : 'New password must contain at least 8 characters', 'error');
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      onShowToast(currentLang === 'ka' ? 'ახალი პაროლები არ ემთხვევა' : 'New passwords do not match', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.changePassword({ currentPassword: passwordFields.currentPassword, newPassword: passwordFields.newPassword });
      setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
      onShowToast(currentLang === 'ka' ? 'პაროლი წარმატებით შეიცვალა' : 'Password changed successfully', 'success');
    } catch (err: any) {
      onShowToast(err.message || (currentLang === 'ka' ? 'პაროლის შეცვლა ვერ მოხერხდა' : 'Could not change password'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-layout animate-fade-in">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🦷</span>
          <span className="sidebar-title">{clinicSettingsName()}</span>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('dashboard')} className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>{t.adminSidebarDashboard}</span>
          </button>
          <button onClick={() => setActiveTab('services')} className={`sidebar-link ${activeTab === 'services' ? 'active' : ''}`}>
            <HeartHandshake size={20} />
            <span>{t.adminSidebarServices}</span>
          </button>
          <button onClick={() => setActiveTab('doctors')} className={`sidebar-link ${activeTab === 'doctors' ? 'active' : ''}`}>
            <Stethoscope size={20} />
            <span>{t.adminSidebarDoctors}</span>
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`sidebar-link ${activeTab === 'gallery' ? 'active' : ''}`}>
            <ImageIcon size={20} />
            <span>{t.adminSidebarGallery}</span>
          </button>
          <button onClick={() => setActiveTab('partners')} className={`sidebar-link ${activeTab === 'partners' ? 'active' : ''}`}>
            <HeartHandshake size={20} />
            <span>{currentLang === 'ka' ? 'პარტნიორები' : 'Partners'}</span>
          </button>
          <button onClick={() => setActiveTab('smile-gallery')} className={`sidebar-link ${activeTab === 'smile-gallery' ? 'active' : ''}`}>
            <ImageIcon size={20} />
            <span>{currentLang === 'ka' ? 'ღიმილის გალერეა' : 'Smile Gallery'}</span>
          </button>
          <button onClick={() => setActiveTab('vacancies')} className={`sidebar-link ${activeTab === 'vacancies' ? 'active' : ''}`}>
            <Briefcase size={20} />
            <span>{t.adminSidebarVacancies}</span>
          </button>
          <button onClick={() => setActiveTab('news')} className={`sidebar-link ${activeTab === 'news' ? 'active' : ''}`}>
            <Newspaper size={20} />
            <span>{currentLang === 'ka' ? 'სიახლეები' : 'News'}</span>
          </button>
          <button onClick={() => setActiveTab('about')} className={`sidebar-link ${activeTab === 'about' ? 'active' : ''}`}>
            <Info size={20} />
            <span>{t.adminSidebarAbout}</span>
          </button>
          <button onClick={() => setActiveTab('contact')} className={`sidebar-link ${activeTab === 'contact' ? 'active' : ''}`}>
            <PhoneCall size={20} />
            <span>{t.adminSidebarContact}</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} />
            <span>{t.adminSidebarSettings}</span>
          </button>
          <button onClick={() => setActiveTab('security')} className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}>
            <KeyRound size={20} />
            <span>{currentLang === 'ka' ? 'პაროლის შეცვლა' : 'Change Password'}</span>
          </button>
        </nav>

        <button onClick={onLogout} className="btn-sidebar-logout">
          <LogOut size={20} />
          <span>{t.navLogout}</span>
        </button>
      </aside>

      {/* Main Workspace Area */}
      <main className="admin-workspace">
        {loading ? (
          <div className="workspace-loader-shell">
            <Loader className="spin-icon" size={40} />
            <p>{t.loading}</p>
          </div>
        ) : (
          <div className="workspace-container">
            {/* TABS RENDERING */}
            
            {/* A: DASHBOARD HOME */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-view animate-fade-in">
                <div className="dashboard-hero-card glass-panel">
                  <h1>{t.adminDashboardWelcome}</h1>
                  <p>{t.adminDashboardWelcomeSub}</p>
                </div>

                <div className="stats-row">
                  <div className="stat-card glass-panel">
                    <HeartHandshake className="stat-icon teal" size={32} />
                    <div className="stat-info">
                      <span className="stat-num">{services.length}</span>
                      <span className="stat-label">{t.adminTotalServices}</span>
                    </div>
                  </div>
                  <div className="stat-card glass-panel">
                    <Stethoscope className="stat-icon blue" size={32} />
                    <div className="stat-info">
                      <span className="stat-num">{doctors.length}</span>
                      <span className="stat-label">{t.adminTotalDoctors}</span>
                    </div>
                  </div>
                  <div className="stat-card glass-panel">
                    <ImageIcon className="stat-icon purple" size={32} />
                    <div className="stat-info">
                      <span className="stat-num">{gallery.length}</span>
                      <span className="stat-label">{t.adminTotalGallery}</span>
                    </div>
                  </div>
                  <div className="stat-card glass-panel">
                    <Briefcase className="stat-icon mint" size={32} />
                    <div className="stat-info">
                      <span className="stat-num">{vacancies.length}</span>
                      <span className="stat-label">{t.adminTotalVacancies}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* B: CRUD MANAGERS (Services, Doctors, Gallery, Vacancies) */}
            {(activeTab === 'services' || activeTab === 'doctors' || activeTab === 'gallery' || activeTab === 'partners' || activeTab === 'smile-gallery' || activeTab === 'vacancies' || activeTab === 'news') && (
              <div className="crud-view animate-fade-in">
                <div className="workspace-header">
                  <h2>
                    {activeTab === 'services' && t.adminSidebarServices}
                    {activeTab === 'doctors' && t.adminSidebarDoctors}
                    {activeTab === 'gallery' && t.adminSidebarGallery}
                    {activeTab === 'partners' && (currentLang === 'ka' ? 'პარტნიორები' : 'Partners')}
                    {activeTab === 'smile-gallery' && (currentLang === 'ka' ? 'ღიმილის გალერეა' : 'Smile Gallery')}
                    {activeTab === 'vacancies' && t.adminSidebarVacancies}
                    {activeTab === 'news' && (currentLang === 'ka' ? 'სიახლეები' : 'News')}
                  </h2>
                  <button onClick={() => openFormModal('create')} className="btn btn-primary" disabled={actionLoading}>
                    <Plus size={18} />
                    <span>{t.addBtn}</span>
                  </button>
                </div>

                <div className="table-responsive glass-panel">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        {(activeTab === 'services' || activeTab === 'doctors' || activeTab === 'gallery' || activeTab === 'partners' || activeTab === 'smile-gallery' || activeTab === 'news') && <th>{currentLang === 'ka' ? 'სურათი' : 'Image'}</th>}
                        <th>{currentLang === 'ka' ? 'სათაური / სახელი' : 'Title / Name'}</th>
                        {activeTab === 'vacancies' && <th>{currentLang === 'ka' ? 'პოზიცია' : 'Position'}</th>}
                        {activeTab !== 'vacancies' && <th>{t.fieldSortOrder}</th>}
                        <th>{t.fieldActive}</th>
                        <th>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderTableRows()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* C: SIMPLE FORMS (About, Contact Info, Site Settings) */}
            {(activeTab === 'about' || activeTab === 'contact' || activeTab === 'settings') && (
              <div className="simple-form-view animate-fade-in">
                <div className="workspace-header">
                  <h2>
                    {activeTab === 'about' && t.adminSidebarAbout}
                    {activeTab === 'contact' && t.adminSidebarContact}
                    {activeTab === 'settings' && t.adminSidebarSettings}
                  </h2>
                </div>

                <GlassCard className="form-workspace-card" hoverEffect={false}>
                  <form onSubmit={handleFormSubmit} className="admin-full-form">
                    {renderSimpleFormFields()}
                    
                    <button type="submit" className="btn btn-primary form-submit-btn" disabled={actionLoading}>
                      {actionLoading ? <Loader className="spin-icon" size={18} /> : t.saveBtn}
                    </button>
                  </form>
                </GlassCard>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="simple-form-view animate-fade-in">
                <div className="workspace-header">
                  <h2>{currentLang === 'ka' ? 'პაროლის შეცვლა' : 'Change Password'}</h2>
                </div>
                <GlassCard className="form-workspace-card" hoverEffect={false}>
                  <form onSubmit={handlePasswordChange} className="admin-full-form">
                    <div className="form-group">
                      <label>{currentLang === 'ka' ? 'მიმდინარე პაროლი' : 'Current password'}</label>
                      <input className="glass-input" type="password" autoComplete="current-password" required value={passwordFields.currentPassword} onChange={(e) => setPasswordFields({ ...passwordFields, currentPassword: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>{currentLang === 'ka' ? 'ახალი პაროლი' : 'New password'}</label>
                      <input className="glass-input" type="password" autoComplete="new-password" minLength={8} required value={passwordFields.newPassword} onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>{currentLang === 'ka' ? 'გაიმეორეთ ახალი პაროლი' : 'Confirm new password'}</label>
                      <input className="glass-input" type="password" autoComplete="new-password" minLength={8} required value={passwordFields.confirmPassword} onChange={(e) => setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary form-submit-btn" disabled={actionLoading}>
                      {actionLoading ? <Loader className="spin-icon" size={18} /> : (currentLang === 'ka' ? 'პაროლის შენახვა' : 'Save Password')}
                    </button>
                  </form>
                </GlassCard>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reusable Form Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? `${t.addBtn}` : `${t.edit}`}
        maxWidth="1050px"
      >
        <form onSubmit={handleFormSubmit} className="modal-crud-form">
          {renderModalFormFields()}
          
          <div className="form-modal-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={actionLoading}>
              {t.cancelBtn}
            </button>
            <button type="submit" className="btn btn-primary" disabled={actionLoading}>
              {actionLoading ? <Loader className="spin-icon" size={18} /> : t.saveBtn}
            </button>
          </div>
        </form>
      </CustomModal>

      <style>{`
        .admin-layout {
          min-height: 100vh;
          width: 100%;
          display: block;
          background: var(--bg-app);
          color: var(--text-dark);
          box-sizing: border-box;
          padding-top: 80px; /* offset navbar */
        }

        /* Sidebar CSS */
        .admin-sidebar {
          height: calc(100vh - 80px);
          position: fixed;
          top: 80px;
          left: 0;
          width: 280px;
          border-radius: 0;
          border-right: 1px solid var(--card-border);
          border-top: none;
          border-bottom: none;
          border-left: none;
          display: flex;
          flex-direction: column;
          padding: 24px;
          z-index: 10;
          @media (max-width: 992px) {
            position: relative;
            height: auto;
            width: 100%;
            top: 0;
            border-right: none;
            border-bottom: 1px solid var(--card-border);
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .sidebar-logo {
          font-size: 24px;
        }

        .sidebar-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--text-dark);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-weight: 550;
          font-size: 0.95rem;
          padding: 12px 16px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-link:hover {
          color: var(--text-dark);
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-link.active {
          color: var(--accent-cyan);
          background: rgba(14, 165, 233, 0.1);
        }

        .btn-sidebar-logout {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: none;
          color: #f43f5e;
          font-family: var(--font-heading);
          font-weight: 600;
          padding: 12px 16px;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          @media (max-width: 992px) {
            margin-top: 20px;
          }
        }
        .btn-sidebar-logout:hover {
          background: rgba(244, 63, 94, 0.08);
        }

        /* Workspace Area CSS */
        .admin-workspace {
          margin-left: 280px;
          padding: 40px;
          box-sizing: border-box;
          overflow-y: auto;
          min-height: calc(100vh - 80px);
          @media (max-width: 992px) {
            margin-left: 0;
            padding: 24px 16px;
          }
        }

        .workspace-loader-shell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          gap: 16px;
          color: var(--text-muted);
        }

        .workspace-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 16px;
        }

        /* Stats Row CSS */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-top: 32px;
        }

        .stat-card {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat-icon {
          padding: 10px;
          border-radius: 12px;
        }
        .stat-icon.teal { background: rgba(13, 148, 136, 0.1); color: #0d9488; }
        .stat-icon.blue { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
        .stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .stat-icon.mint { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--text-dark);
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 550;
        }

        .dashboard-hero-card {
          padding: 40px;
          background: linear-gradient(135deg, rgba(14, 79, 80, 0.5) 0%, rgba(9, 13, 22, 0.8) 100%);
          border: 1px solid var(--card-border);
        }

        /* CRUD Table Styling */
        .table-responsive {
          overflow-x: auto;
          border-radius: 16px;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th,
        .admin-table td {
          padding: 16px 20px;
          font-size: 0.92rem;
          border-bottom: 1px solid var(--input-border);
        }

        .admin-table th {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--text-dark);
          background: rgba(255, 255, 255, 0.02);
        }

        .admin-table td {
          color: var(--text-muted);
        }

        .table-thumb-box {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .table-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .table-thumb-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .row-bold-title {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--text-dark);
        }

        .badge-status {
          display: inline-flex;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-family: var(--font-heading);
          font-weight: 600;
          text-transform: uppercase;
        }
        .badge-status.active {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
        .badge-status.inactive {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
        }

        .table-actions-flex {
          display: flex;
          gap: 8px;
        }

        .btn-action-table {
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          color: var(--text-muted);
          padding: 6px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          transition: all 0.2s ease;
        }
        .btn-action-table:hover {
          color: var(--text-dark);
          border-color: var(--text-dark);
        }
        .btn-action-table.btn-delete-row:hover {
          color: #f43f5e;
          border-color: #f43f5e;
          background: rgba(244, 63, 94, 0.05);
        }

        /* Simple Forms Layout */
        .form-workspace-card {
          padding: 32px;
        }

        .admin-full-form,
        .modal-crud-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 900px) {
          .modal-crud-form { min-width: 820px; }
        }

        .form-double-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          @media (max-width: 768px) {
            grid-template-columns: 1fr;
          }
        }

        .file-upload-zone {
          border: 2px dashed var(--input-border);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          background: var(--input-bg);
          transition: all 0.25s ease;
        }
        .file-upload-zone:hover {
          border-color: var(--accent-cyan);
          background: rgba(14, 165, 233, 0.05);
        }

        .upload-icon {
          color: var(--text-muted);
        }

        .upload-filename {
          font-size: 0.85rem;
          font-family: var(--font-heading);
          color: var(--accent-cyan);
        }

        .img-preview-box {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--input-border);
        }

        .checkbox-container-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--text-dark);
          user-select: none;
        }

        .custom-checkbox-input {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          accent-color: var(--primary);
        }

        .form-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
          border-top: 1px solid var(--input-border);
          padding-top: 16px;
        }

        .form-submit-btn {
          align-self: flex-start;
          min-width: 140px;
          height: 44px;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Helper resolvers
  function clinicSettingsName(): string {
    if (siteSettings) {
      return currentLang === 'ka' ? siteSettings.clinicNameKa : siteSettings.clinicNameEn;
    }
    return 'BelaDent CMS';
  }

  function renderTableRows() {
    let list: any[] = [];
    if (activeTab === 'services') list = services;
    else if (activeTab === 'doctors') list = doctors;
    else if (activeTab === 'gallery') list = gallery;
    else if (activeTab === 'partners') list = partners;
    else if (activeTab === 'vacancies') list = vacancies;
    else if (activeTab === 'news') list = news;
    else if (activeTab === 'smile-gallery') list = smileGallery;

    if (list.length === 0) {
      return (
        <tr>
          <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
            {currentLang === 'ka' ? 'ჩანაწერები ვერ მოიძებნა' : 'No records found.'}
          </td>
        </tr>
      );
    }

    return list.map((item) => (
      <tr key={item.id}>
        {(activeTab === 'services' || activeTab === 'doctors' || activeTab === 'gallery' || activeTab === 'partners' || activeTab === 'smile-gallery' || activeTab === 'news') && (
          <td>
            <div className="table-thumb-box">
              {item.imageUrl ? (
                <img src={getFullImageUrl(item.imageUrl)} alt="" className="table-thumb" />
              ) : (
                <div className="table-thumb-fallback">🦷</div>
              )}
            </div>
          </td>
        )}
        
        <td>
          <div className="row-bold-title">
            {activeTab === 'doctors' ? (
              currentLang === 'ka' ? `${item.firstNameKa} ${item.lastNameKa}` : `${item.firstNameEn} ${item.lastNameEn}`
            ) : activeTab === 'partners' ? (
              item.name || (currentLang === 'ka' ? 'სახელის გარეშე' : 'No name')
            ) : (
              currentLang === 'ka' ? item.titleKa : item.titleEn
            )}
          </div>
        </td>

        {activeTab === 'vacancies' && (
          <td>{currentLang === 'ka' ? item.positionKa : item.positionEn}</td>
        )}

        {activeTab !== 'vacancies' && (
          <td>{item.sortOrder || 0}</td>
        )}

        <td>
          <span className={`badge-status ${item.active ? 'active' : 'inactive'}`}>
            {item.active ? t.active : t.inactive}
          </span>
        </td>

        <td>
          <div className="table-actions-flex">
            <button onClick={() => openFormModal('edit', item)} className="btn-action-table" title={t.edit} disabled={actionLoading}>
              <Edit2 size={16} />
            </button>
            <button onClick={() => handleDelete(item.id)} className="btn-action-table btn-delete-row" title={t.delete} disabled={actionLoading}>
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  function renderSimpleFormFields() {
    if (activeTab === 'about') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldTitleKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleKa || ''}
                onChange={(e) => setFormFields({ ...formFields, titleKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldTitleEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleEn || ''}
                onChange={(e) => setFormFields({ ...formFields, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescKa}</label>
            <RichTextEditor value={formFields.descriptionKa || ''} onChange={(value) => setFormFields({ ...formFields, descriptionKa: value })} minHeight={260} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescEn}</label>
            <RichTextEditor value={formFields.descriptionEn || ''} onChange={(value) => setFormFields({ ...formFields, descriptionEn: value })} minHeight={260} />
          </div>

          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'ჩვენ შესახებ სურათი' : 'About section image'}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააჭირეთ სურათის ასატვირთად' : 'Click to upload image'}</span>
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && <div className="img-preview-box mt-2"><img src={getFullImageUrl(formFields.imageUrl)} alt="About" className="table-thumb" /></div>}
          </div>
        </>
      );
    }

    if (activeTab === 'contact') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldPhone1}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.phone1 || ''}
                onChange={(e) => setFormFields({ ...formFields, phone1: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldPhone2}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.phone2 || ''}
                onChange={(e) => setFormFields({ ...formFields, phone2: e.target.value })}
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldEmail}</label>
              <input
                type="email"
                className="glass-input"
                value={formFields.email || ''}
                onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldGoogleMapsUrl}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.googleMapsUrl || ''}
                onChange={(e) => setFormFields({ ...formFields, googleMapsUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldAddressKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.addressKa || ''}
                onChange={(e) => setFormFields({ ...formFields, addressKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldAddressEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.addressEn || ''}
                onChange={(e) => setFormFields({ ...formFields, addressEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'ორშაბათი - შაბათი: გახსნა' : 'Monday - Saturday: Opens'}</label>
              <input type="time" className="glass-input" value={formFields.mondaySaturdayOpen || '10:00'} onChange={(e) => setFormFields({ ...formFields, mondaySaturdayOpen: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'ორშაბათი - შაბათი: დახურვა' : 'Monday - Saturday: Closes'}</label>
              <input type="time" className="glass-input" value={formFields.mondaySaturdayClose || '20:00'} onChange={(e) => setFormFields({ ...formFields, mondaySaturdayClose: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-container-label">
              <input type="checkbox" className="custom-checkbox-input" checked={formFields.sundayClosed ?? true} onChange={(e) => setFormFields({ ...formFields, sundayClosed: e.target.checked })} />
              <span>{currentLang === 'ka' ? 'კვირას კლინიკა დაკეტილია' : 'Clinic is closed on Sunday'}</span>
            </label>
          </div>

          {!(formFields.sundayClosed ?? true) && (
            <div className="form-double-col">
              <div className="form-group">
                <label className="form-label">{currentLang === 'ka' ? 'კვირა: გახსნა' : 'Sunday: Opens'}</label>
                <input type="time" className="glass-input" value={formFields.sundayOpen || '10:00'} onChange={(e) => setFormFields({ ...formFields, sundayOpen: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">{currentLang === 'ka' ? 'კვირა: დახურვა' : 'Sunday: Closes'}</label>
                <input type="time" className="glass-input" value={formFields.sundayClose || '18:00'} onChange={(e) => setFormFields({ ...formFields, sundayClose: e.target.value })} required />
              </div>
            </div>
          )}

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'ფუტერის ტექსტი (ქართული)' : 'Footer text (Georgian)'}</label>
              <textarea className="glass-input" rows={4} value={formFields.footerDescriptionKa || ''} onChange={(e) => setFormFields({ ...formFields, footerDescriptionKa: e.target.value })} placeholder="ტექსტი და ემოჯი 😊" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {['🦷', '😊', '✨', '💙', '📍', '📞'].map((emoji) => <button key={emoji} type="button" className="btn-toolbar" onClick={() => setFormFields({ ...formFields, footerDescriptionKa: (formFields.footerDescriptionKa || '') + emoji })}>{emoji}</button>)}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'ფუტერის ტექსტი (ინგლისური)' : 'Footer text (English)'}</label>
              <textarea className="glass-input" rows={4} value={formFields.footerDescriptionEn || ''} onChange={(e) => setFormFields({ ...formFields, footerDescriptionEn: e.target.value })} placeholder="Text and emoji 😊" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {['🦷', '😊', '✨', '💙', '📍', '📞'].map((emoji) => <button key={emoji} type="button" className="btn-toolbar" onClick={() => setFormFields({ ...formFields, footerDescriptionEn: (formFields.footerDescriptionEn || '') + emoji })}>{emoji}</button>)}
              </div>
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldFacebookUrl}</label>
              <input
                type="url"
                className="glass-input"
                value={formFields.facebookUrl || ''}
                onChange={(e) => setFormFields({ ...formFields, facebookUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldInstagramUrl}</label>
              <input
                type="url"
                className="glass-input"
                value={formFields.instagramUrl || ''}
                onChange={(e) => setFormFields({ ...formFields, instagramUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldLinkedinUrl}</label>
              <input
                type="url"
                className="glass-input"
                value={formFields.linkedinUrl || ''}
                onChange={(e) => setFormFields({ ...formFields, linkedinUrl: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldYoutubeUrl}</label>
              <input
                type="url"
                className="glass-input"
                value={formFields.youtubeUrl || ''}
                onChange={(e) => setFormFields({ ...formFields, youtubeUrl: e.target.value })}
              />
            </div>
          </div>
        </>
      );
    }

    if (activeTab === 'settings') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldClinicNameKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.clinicNameKa || ''}
                onChange={(e) => setFormFields({ ...formFields, clinicNameKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldClinicNameEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.clinicNameEn || ''}
                onChange={(e) => setFormFields({ ...formFields, clinicNameEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldSeoTitleKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.seoTitleKa || ''}
                onChange={(e) => setFormFields({ ...formFields, seoTitleKa: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldSeoTitleEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.seoTitleEn || ''}
                onChange={(e) => setFormFields({ ...formFields, seoTitleEn: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldSeoDescriptionKa}</label>
            <input
              type="text"
              className="glass-input"
              value={formFields.seoDescriptionKa || ''}
              onChange={(e) => setFormFields({ ...formFields, seoDescriptionKa: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldSeoDescriptionEn}</label>
            <input
              type="text"
              className="glass-input"
              value={formFields.seoDescriptionEn || ''}
              onChange={(e) => setFormFields({ ...formFields, seoDescriptionEn: e.target.value })}
            />
          </div>

          {[
            ['services', currentLang === 'ka' ? 'სერვისების აღწერა' : 'Services subtitle'],
            ['doctors', currentLang === 'ka' ? 'ექიმების აღწერა' : 'Doctors subtitle'],
            ['news', currentLang === 'ka' ? 'სიახლეების აღწერა' : 'News subtitle'],
            ['vacancies', currentLang === 'ka' ? 'ვაკანსიების აღწერა' : 'Vacancies subtitle'],
            ['smileGallery', currentLang === 'ka' ? 'ღიმილის გალერეის აღწერა' : 'Smile Gallery subtitle'],
          ].map(([key, label]) => (
            <div className="form-double-col" key={key}>
              <div className="form-group"><label className="form-label">{label} — ქართული</label><textarea className="glass-input" rows={3} value={formFields[`${key}SubtitleKa`] || ''} onChange={(e) => setFormFields({ ...formFields, [`${key}SubtitleKa`]: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">{label} — English</label><textarea className="glass-input" rows={3} value={formFields[`${key}SubtitleEn`] || ''} onChange={(e) => setFormFields({ ...formFields, [`${key}SubtitleEn`]: e.target.value })} /></div>
            </div>
          ))}

          {/* Files uploads settings */}
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'კლინიკის ძირითადი / ინგლისური ლოგო' : 'Default / English clinic logo'}</label>
              <label className="file-upload-zone">
                <Upload className="upload-icon" size={24} />
                <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ასატვირთად' : 'Click to Upload Logo'}</span>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
              </label>
              {formFields.logoUrl && !selectedFile && (
                <div className="img-preview-box mt-2">
                  <img src={getFullImageUrl(formFields.logoUrl)} alt="logo" className="table-thumb" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'მთავარი სურათი 1' : 'Hero image 1'}</label>
              <label className="file-upload-zone">
                <Upload className="upload-icon" size={24} />
                <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ასატვირთად' : 'Click to Upload Background'}</span>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => setSelectedFile2(e.target.files?.[0] || null)}
                />
                {selectedFile2 && <span className="upload-filename">{selectedFile2.name}</span>}
              </label>
              {formFields.backgroundImageUrl && !selectedFile2 && (
                <div className="img-preview-box mt-2">
                  <img src={getFullImageUrl(formFields.backgroundImageUrl)} alt="bg" className="table-thumb" />
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'კლინიკის ქართული ლოგო' : 'Georgian clinic logo'}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააჭირეთ ქართული ლოგოს ასატვირთად' : 'Click to upload Georgian logo'}</span>
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setSelectedFile5(e.target.files?.[0] || null)} />
              {selectedFile5 && <span className="upload-filename">{selectedFile5.name}</span>}
            </label>
            {formFields.geoLogoUrl && !selectedFile5 && <div className="img-preview-box mt-2"><img src={getFullImageUrl(formFields.geoLogoUrl)} alt="Georgian logo" className="table-thumb" /></div>}
          </div>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'მთავარი სურათი 2' : 'Hero image 2'}</label>
              <label className="file-upload-zone">
                <Upload className="upload-icon" size={24} />
                <span>{currentLang === 'ka' ? 'დააჭირეთ ასატვირთად' : 'Click to upload image'}</span>
                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setSelectedFile3(e.target.files?.[0] || null)} />
                {selectedFile3 && <span className="upload-filename">{selectedFile3.name}</span>}
              </label>
              {formFields.backgroundImageUrl2 && !selectedFile3 && <div className="img-preview-box mt-2"><img src={getFullImageUrl(formFields.backgroundImageUrl2)} alt="hero 2" className="table-thumb" /></div>}
            </div>
            <div className="form-group">
              <label className="form-label">{currentLang === 'ka' ? 'მთავარი სურათი 3' : 'Hero image 3'}</label>
              <label className="file-upload-zone">
                <Upload className="upload-icon" size={24} />
                <span>{currentLang === 'ka' ? 'დააჭირეთ ასატვირთად' : 'Click to upload image'}</span>
                <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setSelectedFile4(e.target.files?.[0] || null)} />
                {selectedFile4 && <span className="upload-filename">{selectedFile4.name}</span>}
              </label>
              {formFields.backgroundImageUrl3 && !selectedFile4 && <div className="img-preview-box mt-2"><img src={getFullImageUrl(formFields.backgroundImageUrl3)} alt="hero 3" className="table-thumb" /></div>}
            </div>
          </div>
        </>
      );
    }
  }

  function renderModalFormFields() {
    if (activeTab === 'news' || activeTab === 'smile-gallery') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldTitleKa}</label>
              <input type="text" className="glass-input" value={formFields.titleKa || ''} onChange={(e) => setFormFields({ ...formFields, titleKa: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldTitleEn}</label>
              <input type="text" className="glass-input" value={formFields.titleEn || ''} onChange={(e) => setFormFields({ ...formFields, titleEn: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'სრული ტექსტი (ქართულად)' : 'Full text (Georgian)'}</label>
            <RichTextEditor value={formFields.textKa || ''} onChange={(value) => setFormFields({ ...formFields, textKa: value })} minHeight={300} />
          </div>
          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'სრული ტექსტი (ინგლისურად)' : 'Full text (English)'}</label>
            <RichTextEditor value={formFields.textEn || ''} onChange={(value) => setFormFields({ ...formFields, textEn: value })} minHeight={300} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.fieldSortOrder}</label>
            <input type="number" className="glass-input" value={formFields.sortOrder || 0} onChange={(e) => setFormFields({ ...formFields, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group">
            <label className="form-label">{t.uploadImage}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააჭირეთ სურათის ასატვირთად' : 'Click to upload image'}</span>
              <input type="file" style={{ display: 'none' }} accept="image/*" required={activeTab === 'smile-gallery' && modalType === 'create'} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && <div className="img-preview-box"><img src={getFullImageUrl(formFields.imageUrl)} alt="" className="table-thumb" /></div>}
          </div>
          <div className="form-group">
            <label className="checkbox-container-label">
              <input type="checkbox" className="custom-checkbox-input" checked={formFields.active ?? true} onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })} />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'services') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldTitleKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleKa || ''}
                onChange={(e) => setFormFields({ ...formFields, titleKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldTitleEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleEn || ''}
                onChange={(e) => setFormFields({ ...formFields, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldSlug}</label>
              <input
                type="text"
                className="glass-input"
                placeholder="slug-path"
                value={formFields.slug || ''}
                onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldSortOrder}</label>
              <input
                type="number"
                className="glass-input"
                value={formFields.sortOrder || 0}
                onChange={(e) => setFormFields({ ...formFields, sortOrder: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescKa}</label>
            <RichTextEditor value={formFields.descriptionKa || ''} onChange={(value) => setFormFields({ ...formFields, descriptionKa: value })} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescEn}</label>
            <RichTextEditor value={formFields.descriptionEn || ''} onChange={(value) => setFormFields({ ...formFields, descriptionEn: value })} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.uploadImage}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ასატვირთად' : 'Click to Upload Image'}</span>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && (
              <div className="img-preview-box">
                <img src={getFullImageUrl(formFields.imageUrl)} alt="" className="table-thumb" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-container-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formFields.active ?? true}
                onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })}
              />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'doctors') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldFirstNameKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.firstNameKa || ''}
                onChange={(e) => setFormFields({ ...formFields, firstNameKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldFirstNameEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.firstNameEn || ''}
                onChange={(e) => setFormFields({ ...formFields, firstNameEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldLastNameKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.lastNameKa || ''}
                onChange={(e) => setFormFields({ ...formFields, lastNameKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldLastNameEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.lastNameEn || ''}
                onChange={(e) => setFormFields({ ...formFields, lastNameEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">სპეციალობა (ქართული)</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.specializationKa || ''}
                onChange={(e) => setFormFields({ ...formFields, specializationKa: e.target.value })}
                placeholder="მაგ. სტომატოლოგი"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization (English)</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.specializationEn || ''}
                onChange={(e) => setFormFields({ ...formFields, specializationEn: e.target.value })}
                placeholder="e.g. Dental Specialist"
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldSlug}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.slug || ''}
                onChange={(e) => setFormFields({ ...formFields, slug: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldSortOrder}</label>
              <input
                type="number"
                className="glass-input"
                value={formFields.sortOrder || 0}
                onChange={(e) => setFormFields({ ...formFields, sortOrder: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescKa}</label>
            <RichTextEditor value={formFields.descriptionKa || ''} onChange={(value) => setFormFields({ ...formFields, descriptionKa: value })} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescEn}</label>
            <RichTextEditor value={formFields.descriptionEn || ''} onChange={(value) => setFormFields({ ...formFields, descriptionEn: value })} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.uploadImage}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ასატვირთად' : 'Click to Upload Image'}</span>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && (
              <div className="img-preview-box">
                <img src={getFullImageUrl(formFields.imageUrl)} alt="" className="table-thumb" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-container-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formFields.active ?? true}
                onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })}
              />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldTitleKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleKa || ''}
                onChange={(e) => setFormFields({ ...formFields, titleKa: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldTitleEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleEn || ''}
                onChange={(e) => setFormFields({ ...formFields, titleEn: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldSortOrder}</label>
            <input
              type="number"
              className="glass-input"
              value={formFields.sortOrder || 0}
              onChange={(e) => setFormFields({ ...formFields, sortOrder: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t.uploadImage}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ასატვირთად' : 'Click to Upload Image'}</span>
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && (
              <div className="img-preview-box">
                <img src={getFullImageUrl(formFields.imageUrl)} alt="" className="table-thumb" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-container-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formFields.active ?? true}
                onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })}
              />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'partners') {
      return (
        <>
          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'კომპანიის სახელი (არასავალდებულო)' : 'Company name (optional)'}</label>
            <input
              type="text"
              className="glass-input"
              value={formFields.name || ''}
              onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t.fieldSortOrder}</label>
            <input type="number" className="glass-input" value={formFields.sortOrder || 0}
              onChange={(e) => setFormFields({ ...formFields, sortOrder: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group">
            <label className="form-label">{currentLang === 'ka' ? 'კომპანიის ლოგო' : 'Company logo'}</label>
            <label className="file-upload-zone">
              <Upload className="upload-icon" size={24} />
              <span>{currentLang === 'ka' ? 'დააწკაპუნეთ ლოგოს ასატვირთად' : 'Click to upload logo'}</span>
              <input type="file" style={{ display: 'none' }} accept="image/*"
                required={modalType === 'create'} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              {selectedFile && <span className="upload-filename">{selectedFile.name}</span>}
            </label>
            {formFields.imageUrl && !selectedFile && <div className="img-preview-box"><img src={getFullImageUrl(formFields.imageUrl)} alt="" className="table-thumb" /></div>}
          </div>
          <div className="form-group">
            <label className="checkbox-container-label">
              <input type="checkbox" className="custom-checkbox-input" checked={formFields.active ?? true}
                onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })} />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }

    if (activeTab === 'vacancies') {
      return (
        <>
          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldTitleKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleKa || ''}
                onChange={(e) => setFormFields({ ...formFields, titleKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldTitleEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.titleEn || ''}
                onChange={(e) => setFormFields({ ...formFields, titleEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-double-col">
            <div className="form-group">
              <label className="form-label">{t.fieldPositionKa}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.positionKa || ''}
                onChange={(e) => setFormFields({ ...formFields, positionKa: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t.fieldPositionEn}</label>
              <input
                type="text"
                className="glass-input"
                value={formFields.positionEn || ''}
                onChange={(e) => setFormFields({ ...formFields, positionEn: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescKa}</label>
            <RichTextEditor value={formFields.descriptionKa || ''} onChange={(value) => setFormFields({ ...formFields, descriptionKa: value })} />
          </div>

          <div className="form-group">
            <label className="form-label">{t.fieldDescEn}</label>
            <RichTextEditor value={formFields.descriptionEn || ''} onChange={(value) => setFormFields({ ...formFields, descriptionEn: value })} />
          </div>

          <div className="form-group">
            <label className="checkbox-container-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={formFields.active ?? true}
                onChange={(e) => setFormFields({ ...formFields, active: e.target.checked })}
              />
              <span>{t.fieldActive}</span>
            </label>
          </div>
        </>
      );
    }
  }
};
