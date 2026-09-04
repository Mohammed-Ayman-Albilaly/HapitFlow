import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const habitService = {
  getHabits: () => api.get('/habits'),
  createHabit: (data: any) => api.post('/habits', data),
  updateHabit: (id: string, data: any) => api.patch(`/habits/${id}`, data),
  deleteHabit: (id: string) => api.delete(`/habits/${id}`),
  completeHabit: (id: string) => api.post(`/tracking/${id}/complete`),
  getHistory: (id: string) => api.get(`/tracking/${id}/history`),
};

export const categoryService = {
  getCategories: () => api.get('/categories'),
  createCategory: (data: any) => api.post('/categories', data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};
