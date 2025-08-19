import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
// Debug which API URL is used at runtime
console.log('[API] Base URL =', API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
export const tokenManager = {
  async setToken(token: string) {
    await AsyncStorage.setItem('authToken', token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },

  async removeToken() {
    await AsyncStorage.removeItem('authToken');
  },
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);

    // Add auth token to requests
    const token = await tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle auth errors
    if (error.response?.status === 401) {
      await tokenManager.removeToken();
      // You might want to redirect to login screen here
      // or dispatch a logout action
    }

    return Promise.reject(error);
  }
);

export default apiClient;
