import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile')
};

export const wasteRequestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`)
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getAll: () => api.get('/inquiries'),
  respond: (id, data) => api.put(`/inquiries/${id}`, data)
};

export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`)
};

export const configAPI = {
  getAll: () => api.get('/configs'),
  getActive: (cityId) => api.get(`/configs/${cityId}`),
  create: (data) => api.post('/configs', data),
  update: (id, data) => api.put(`/configs/${id}`, data),
  delete: (id) => api.delete(`/configs/${id}`),
  toggleActive: (id, isActive) => api.patch(`/configs/${id}`, { isActive }),
  getVersions: (cityId) => api.get(`/configs/${cityId}/versions`)
};

export default api;