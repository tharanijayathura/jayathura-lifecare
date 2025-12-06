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
      // Only redirect if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Use setTimeout to avoid race conditions with React state updates
        setTimeout(() => {
          window.location.href = '/login';
        }, 100);
      }
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
  // For patients: excludes prescription medicines
  // For pharmacists/admins: includes all medicines including prescription
  getAll: (params) => API.get('/medicines', { params }),
  getById: (id) => API.get(`/medicines/${id}`),
  // For pharmacists: includes all medicines including prescription
  getAllPharmacist: (params) => API.get('/medicines/pharmacist', { params }),
  // For admins: includes all medicines with stock alerts
  getAllAdmin: (params) => API.get('/medicines/admin', { params }),
  create: (formData) => API.post('/medicines', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/medicines/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/medicines/${id}`),
  deleteAll: () => API.delete('/medicines/all'),
  createAlert: (id, reason) => API.post(`/medicines/${id}/alert`, { reason }),
  clearAlert: (id) => API.post(`/medicines/${id}/clear-alert`),
};

export const prescriptionAPI = {
  upload: (formData) => API.post('/patients/prescription/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
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

export const patientAPI = {
  // Profile
  getProfile: () => API.get('/patients/profile'),
  getDetailedProfile: () => API.get('/patients/profile/detailed'),
  updateProfile: (data) => API.put('/patients/profile', data),
  
  // Prescription
  uploadPrescription: (formData) => API.post('/patients/prescription/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Orders
  createOrder: () => API.post('/patients/order/create'),
  getOrderStatus: (orderId) => API.get(`/patients/order/${orderId}/status`),
  confirmOrder: (orderId) => API.put(`/patients/order/${orderId}/confirm`),
  trackDelivery: (orderId) => API.get(`/patients/order/${orderId}/track`),
  getOrdersHistory: () => API.get('/patients/orders/history'),
  
  // Cart
  addToCart: (data) => API.post('/patients/cart/add', data),
  removeFromCart: (orderItemId, orderId) => API.delete(`/patients/cart/item/${orderItemId}?orderId=${orderId}`),
  
  // Billing
  viewBill: (orderId) => API.get(`/patients/order/${orderId}/bill`),
  initiatePayment: (invoiceId) => API.post('/patients/payment/initiate', { invoiceId }),
  chooseCOD: (orderId) => API.put(`/patients/order/${orderId}/cod`),
  getInvoices: () => API.get('/patients/invoices'),
  
  // Medicines
  browseOTC: () => API.get('/patients/medicines/otc'),
  searchMedicines: (keyword) => API.get('/patients/medicines/search', { params: { keyword } }),
  
  // Refill
  viewRefillDraft: (refillPlanId) => API.get(`/patients/refill/${refillPlanId}`),
  confirmRefillOrder: (refillPlanId) => API.post(`/patients/refill/${refillPlanId}/confirm`),
  
  // Other
  requestAudioInstructions: (orderId) => API.post(`/patients/order/${orderId}/audio-request`),
  submitFeedback: (orderId, rating, comments) => API.post(`/patients/order/${orderId}/feedback`, { rating, comments }),
  handleUnavailableMedicine: (orderId, medicineId, action) => API.put(`/patients/order/${orderId}/unavailable/${medicineId}`, { action }),
  getOutOfStockNotifications: () => API.get('/patients/notifications/out-of-stock'),
  logout: () => API.post('/patients/logout'),
};

export const pharmacistAPI = {
  // Prescriptions
  getPendingPrescriptions: () => API.get('/pharmacists/prescriptions/pending'),
  getPrescriptionDetails: (prescriptionId) => API.get(`/pharmacists/prescription/${prescriptionId}`),
  addPrescriptionItemToOrder: (prescriptionId, medicineId, quantity) => API.post(`/pharmacists/prescription/${prescriptionId}/add-item`, { medicineId, quantity }),
  markPrescriptionVerified: (prescriptionId) => API.put(`/pharmacists/prescription/${prescriptionId}/verify`),
  markPrescriptionRejected: (prescriptionId, reason) => API.put(`/pharmacists/prescription/${prescriptionId}/reject`, { reason }),
  
  // Orders
  addOTCToOrder: (orderId, medicineId, quantity) => API.post(`/pharmacists/order/${orderId}/add-otc`, { medicineId, quantity }),
  generateAutoBill: (orderId) => API.post(`/pharmacists/order/${orderId}/generate-bill`),
  assignToDelivery: (orderId, deliveryPersonId) => API.put(`/pharmacists/order/${orderId}/assign-delivery`, { deliveryPersonId }),
  
  // Stock
  checkStock: (medicineId) => API.get(`/pharmacists/medicine/${medicineId}/stock`),
  markStockOut: (medicineId) => API.put(`/pharmacists/medicine/${medicineId}/stock-out`),
  suggestAlternativeMedicine: (originalId, alternativeId, orderId) => API.post(`/pharmacists/medicine/${originalId}/suggest-alternative`, { alternativeId, orderId }),
  
  // Audio
  provideAudioInstructions: (orderId, formData) => API.post(`/pharmacists/order/${orderId}/audio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Patients
  flagChronicPatient: (patientId, conditions) => API.put(`/pharmacists/patient/${patientId}/flag-chronic`, { conditions }),
  
  // Refill Plans
  createRefillPlan: (patientId, medicineId, quantity, intervalDays) => API.post('/pharmacists/refill-plan/create', { patientId, medicineId, quantity, intervalDays }),
  reviewRefillDraft: (refillPlanId) => API.get(`/pharmacists/refill-plan/${refillPlanId}`),
};

export default API;