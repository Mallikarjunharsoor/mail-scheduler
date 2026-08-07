import axios from 'axios';
import { getSavedToken } from './auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000'}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getSavedToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
