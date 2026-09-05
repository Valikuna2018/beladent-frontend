const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export function getAuthToken(): string | null {
  return localStorage.getItem('beladent_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('beladent_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('beladent_token');
}

export function getUsername(): string | null {
  return localStorage.getItem('beladent_username');
}

export function getRole(): string | null {
  return localStorage.getItem('beladent_role');
}

export function setSession(token: string, username: string, role: string) {
  setAuthToken(token);
  localStorage.setItem('beladent_username', username);
  localStorage.setItem('beladent_role', role);
}

export function clearSession() {
  clearAuthToken();
  localStorage.removeItem('beladent_username');
  localStorage.removeItem('beladent_role');
}

export interface FetchOptions extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const token = getAuthToken();

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (body) {
    if (body instanceof FormData) {
      // For FormData, let the browser set the boundary and content-type automatically
    } else {
      headers.set('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Session expired or unauthorized
      clearSession();
    }
    const errorText = await response.text();
    let errMsg = 'API Request Failed';
    try {
      const errorJson = JSON.parse(errorText);
      errMsg = errorJson.message || errMsg;
    } catch {
      errMsg = errorText || errMsg;
    }
    throw new Error(errMsg);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as Promise<T>;
}

// Public API Requests
export const publicApi = {
  getSiteSettings: () => apiFetch<any>('/api/public/site-settings'),
  getAbout: () => apiFetch<any>('/api/public/about'),
  getContactInfo: () => apiFetch<any>('/api/public/contact-info'),
  getServices: () => apiFetch<any[]>('/api/public/services'),
  getServiceBySlug: (slug: string) => apiFetch<any>(`/api/public/services/${slug}`),
  getDoctors: () => apiFetch<any[]>('/api/public/doctors'),
  getDoctorBySlug: (slug: string) => apiFetch<any>(`/api/public/doctors/${slug}`),
  getGallery: () => apiFetch<any[]>('/api/public/gallery'),
  getPartners: () => apiFetch<any[]>('/api/public/partners'),
  getSmileGallery: () => apiFetch<any[]>('/api/public/smile-gallery'),
  getVacancies: () => apiFetch<any[]>('/api/public/vacancies'),
  getNews: () => apiFetch<any[]>('/api/public/news'),
  getNewsById: (id: number | string) => apiFetch<any>(`/api/public/news/${id}`),
};

// Admin API Requests
export const adminApi = {
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiFetch<{ message: string }>('/api/admin/account/password', {
      method: 'PUT',
      body: data,
    }),

  // Site Settings
  getSiteSettings: () => apiFetch<any>('/api/admin/site-settings'),
  updateSiteSettings: (data: FormData) => apiFetch<any>('/api/admin/site-settings', {
    method: 'PUT',
    body: data,
  }),

  // About Info
  getAbout: () => apiFetch<any>('/api/admin/about'),
  updateAbout: (data: FormData) => apiFetch<any>('/api/admin/about', {
    method: 'PUT',
    body: data,
  }),

  // Contact Info
  getContactInfo: () => apiFetch<any>('/api/admin/contact-info'),
  updateContactInfo: (data: any) => apiFetch<any>('/api/admin/contact-info', {
    method: 'PUT',
    body: data,
  }),

  // Services
  getServices: () => apiFetch<any[]>('/api/admin/services'),
  getServiceById: (id: number) => apiFetch<any>(`/api/admin/services/${id}`),
  createService: (data: FormData) => apiFetch<any>('/api/admin/services', {
    method: 'POST',
    body: data,
  }),
  updateService: (id: number, data: FormData) => apiFetch<any>(`/api/admin/services/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteService: (id: number) => apiFetch<void>(`/api/admin/services/${id}`, {
    method: 'DELETE',
  }),

  // Doctors
  getDoctors: () => apiFetch<any[]>('/api/admin/doctors'),
  getDoctorById: (id: number) => apiFetch<any>(`/api/admin/doctors/${id}`),
  createDoctor: (data: FormData) => apiFetch<any>('/api/admin/doctors', {
    method: 'POST',
    body: data,
  }),
  updateDoctor: (id: number, data: FormData) => apiFetch<any>(`/api/admin/doctors/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteDoctor: (id: number) => apiFetch<void>(`/api/admin/doctors/${id}`, {
    method: 'DELETE',
  }),

  // Gallery
  getGallery: () => apiFetch<any[]>('/api/admin/gallery'),
  getGalleryById: (id: number) => apiFetch<any>(`/api/admin/gallery/${id}`),
  createGalleryImage: (data: FormData) => apiFetch<any>('/api/admin/gallery', {
    method: 'POST',
    body: data,
  }),
  updateGalleryImage: (id: number, data: FormData) => apiFetch<any>(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteGalleryImage: (id: number) => apiFetch<void>(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
  }),

  // Partner companies
  getPartners: () => apiFetch<any[]>('/api/admin/partners'),
  createPartner: (data: FormData) => apiFetch<any>('/api/admin/partners', { method: 'POST', body: data }),
  updatePartner: (id: number, data: FormData) => apiFetch<any>(`/api/admin/partners/${id}`, { method: 'PUT', body: data }),
  deletePartner: (id: number) => apiFetch<void>(`/api/admin/partners/${id}`, { method: 'DELETE' }),

  getSmileGallery: () => apiFetch<any[]>('/api/admin/smile-gallery'),
  createSmileGalleryItem: (data: FormData) => apiFetch<any>('/api/admin/smile-gallery', { method: 'POST', body: data }),
  updateSmileGalleryItem: (id: number, data: FormData) => apiFetch<any>(`/api/admin/smile-gallery/${id}`, { method: 'PUT', body: data }),
  deleteSmileGalleryItem: (id: number) => apiFetch<void>(`/api/admin/smile-gallery/${id}`, { method: 'DELETE' }),

  // Vacancies
  getVacancies: () => apiFetch<any[]>('/api/admin/vacancies'),
  getVacancyById: (id: number) => apiFetch<any>(`/api/admin/vacancies/${id}`),
  createVacancy: (data: any) => apiFetch<any>('/api/admin/vacancies', {
    method: 'POST',
    body: data,
  }),
  updateVacancy: (id: number, data: any) => apiFetch<any>(`/api/admin/vacancies/${id}`, {
    method: 'PUT',
    body: data,
  }),
  deleteVacancy: (id: number) => apiFetch<void>(`/api/admin/vacancies/${id}`, {
    method: 'DELETE',
  }),

  getNews: () => apiFetch<any[]>('/api/admin/news'),
  createNews: (data: FormData) => apiFetch<any>('/api/admin/news', { method: 'POST', body: data }),
  updateNews: (id: number, data: FormData) => apiFetch<any>(`/api/admin/news/${id}`, { method: 'PUT', body: data }),
  deleteNews: (id: number) => apiFetch<void>(`/api/admin/news/${id}`, { method: 'DELETE' }),
};

// Image utility to map relative uploads
export function getFullImageUrl(urlPath: string | null): string {
  if (!urlPath) return '';
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  return `${BASE_URL}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
}
