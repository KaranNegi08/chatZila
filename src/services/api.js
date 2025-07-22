// api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add auth token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle global auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }

    return Promise.reject(error);
  }
);

/* ------------------------ ✅ Auth APIs ------------------------ */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

/* ------------------------ ✅ Room APIs ------------------------ */
export const roomsAPI = {
  getMyRooms: () => api.get('/rooms/my-rooms'),
  getAvailableRooms: (search = '') => api.get(`/rooms/available?search=${search}`),
  createRoom: (data) => api.post('/rooms/create', data),
  sendJoinRequest: (roomId) => api.post(`/rooms/${roomId}/join-request`),
  handleJoinRequest: (notificationId, action) =>
    api.post(`/rooms/join-request/${notificationId}/${action}`),
  inviteUser: (roomId, email) => api.post(`/rooms/${roomId}/invite`, { email }),
  getRoomMembers: (roomId) => api.get(`/rooms/${roomId}/members`),
};

/* ------------------------ ✅ Message APIs ------------------------ */
export const messagesAPI = {
  getRoomMessages: (roomId, page = 1) =>
    api.get(`/messages/${roomId}?page=${page}`),
  sendMessage: (roomId, data) => api.post(`/messages/${roomId}`, data),
  addReaction: (messageId, emoji) =>
    api.post(`/messages/${messageId}/reaction`, { emoji }),
};

/* ------------------------ ✅ Notification APIs ------------------------ */
export const notificationsAPI = {
  getNotifications: (page = 1, unreadOnly = false) =>
    api.get(`/notifications?page=${page}&unreadOnly=${unreadOnly}`),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  respondToInvitation: (notificationId, action) =>
    api.post(`/notifications/${notificationId}/respond`, { action }),
};

/* ------------------------ ✅ File APIs ------------------------ */
export const filesAPI = {
  uploadFile: (roomId, formData) =>
    api.post(`/files/upload/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  getFileUrl: (filename) =>
    `${API_BASE_URL.replace('/api', '')}/uploads/${filename}`,
};

export default api;
