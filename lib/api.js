import axios from 'axios';
import { API_BASE_URL } from './constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  healthCheck: () => api.get('/api/health'),
  addContent: (contentData) => api.post('/api/content', contentData),
  getLanguages: () => api.get('/api/languages'),
  getCategories: () => api.get('/api/categories'),
  getStats: () => api.get('/api/stats'),
  getContent: (language, category) =>  api.get(`/api/content?language=${language}&category=${category}`),
  getNextId: (language, category) => api.get(`/api/next-id?language=${language}&category=${category}`),
  searchContent: (language, query) => api.get(`/api/search/${language}?query=${query}`),
};

export default api;
