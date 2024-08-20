// src/services/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.VUE_APP_URL || 'http://localhost:8081/api',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitud
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
instance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Redirigir a la página de login si el usuario no está autenticado
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
