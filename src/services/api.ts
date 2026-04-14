import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role: string; company?: string }) => 
    api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: object) => api.put('/auth/me', data),
};

export const userService = {
  getUsers: (params?: { role?: string; search?: string }) => api.get('/users', { params }),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: object) => api.put(`/users/${id}`, data),
};

export const meetingService = {
  getMeetings: (userId: string) => api.get('/meetings', { params: { userId } }),
  getMeeting: (id: string) => api.get(`/meetings/${id}`),
  createMeeting: (data: object) => api.post('/meetings', data),
  updateMeeting: (id: string, data: object) => api.put(`/meetings/${id}`, data),
  deleteMeeting: (id: string) => api.delete(`/meetings/${id}`),
};

export const documentService = {
  getDocuments: (userId: string) => api.get('/documents', { params: { userId } }),
  getDocument: (id: string) => api.get(`/documents/${id}`),
  createDocument: (data: object) => api.post('/documents', data),
  updateDocument: (id: string, data: object) => api.put(`/documents/${id}`, data),
  deleteDocument: (id: string) => api.delete(`/documents/${id}`),
  getSignatures: (userId: string) => api.get(`/documents/signatures/${userId}`),
  createSignature: (data: object) => api.post('/documents/signatures', data),
};

export const paymentService = {
  getTransactions: (userId: string) => api.get('/payments/transactions', { params: { userId } }),
  createTransaction: (data: object) => api.post('/payments/transactions', data),
  getPaymentMethods: (userId: string) => api.get('/payments/methods', { params: { userId } }),
  addPaymentMethod: (data: object) => api.post('/payments/methods', data),
  removePaymentMethod: (id: string) => api.delete(`/payments/methods/${id}`),
  getInvoices: (userId: string) => api.get('/payments/invoices', { params: { userId } }),
  createInvoice: (data: object) => api.post('/payments/invoices', data),
};

export const messageService = {
  getMessages: (userId: string) => api.get(`/messages/${userId}`),
  sendMessage: (data: { senderId: string; receiverId: string; content: string }) => 
    api.post('/messages', data),
  markAsRead: (id: string) => api.put(`/messages/${id}/read`),
};

export default api;