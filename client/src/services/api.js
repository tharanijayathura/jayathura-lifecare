// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => API.post('/auth/login', { email, password }),
  register: (userData) => API.post('/auth/register', userData),
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
};

export const medicineAPI = {
  getAll: (params) => API.get('/medicines', { params }),
  getById: (id) => API.get(`/medicines/${id}`),
  getAllAdmin: (params) => API.get('/medicines/admin', { params }),
  create: (formData) => API.post('/medicines', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/medicines/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/medicines/${id}`),
  createAlert: (id, reason) => API.post(`/medicines/${id}/alert`, { reason }),
  clearAlert: (id) => API.post(`/medicines/${id}/clear-alert`),
};

export const prescriptionAPI = {
  upload: (formData) => API.post('/prescriptions/upload', formData),
  getAll: () => API.get('/prescriptions'),
  verify: (id, status) => API.put(`/prescriptions/${id}/verify`, { status }),
};

export const adminAPI = {
  getPendingUsers: () => API.get('/admin/pending-users'),
  approveUser: (userId) => API.post(`/admin/approve/${userId}`),
  rejectUser: (userId) => API.post(`/admin/reject/${userId}`),
  getAllUsers: () => API.get('/admin/users'),
};

export const groceryAPI = {
  getAll: (params) => API.get('/groceries', { params }),
  getById: (id) => API.get(`/groceries/${id}`),
  getAllAdmin: () => API.get('/groceries/admin'),
  create: (formData) => API.post('/groceries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/groceries/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/groceries/${id}`),
  createAlert: (id, reason) => API.post(`/groceries/${id}/alert`, { reason }),
  clearAlert: (id) => API.post(`/groceries/${id}/clear-alert`),
};

export const chatAPI = {
  getConversation: (patientId) => API.get(`/chat/conversation${patientId ? `?patientId=${patientId}` : ''}`),
  getConversations: () => API.get('/chat/conversations'),
  sendMessage: (data) => API.post('/chat/message', data),
  markAsRead: (chatId) => API.put(`/chat/read/${chatId}`),
  closeChat: (chatId) => API.put(`/chat/close/${chatId}`),
};

export default API;