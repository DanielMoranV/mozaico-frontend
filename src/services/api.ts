import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8091/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para requests (aquí se podrá agregar JWT más adelante)
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Agregar JWT token cuando se implemente autenticación
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log("Requesting:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      // TODO: Manejar logout automático cuando se implemente auth
      console.warn("Token expirado o no válido");
    }
    return Promise.reject(error);
  }
);
