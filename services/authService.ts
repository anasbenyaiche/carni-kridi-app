import { apiClient, tokenManager } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'admin' | 'attara' | 'worker' | 'client';
  storeId?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    storeId?: string;
    verified: boolean;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token for future requests
    await tokenManager.setToken(token);
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    const { token, user } = response.data;
    
    // Store token for future requests
    await tokenManager.setToken(token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, remove local token
      console.warn('Logout request failed:', error);
    } finally {
      await tokenManager.removeToken();
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/refresh');
    const { token } = response.data;
    
    // Update stored token
    await tokenManager.setToken(token);
    
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password: newPassword
    });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },

  async resendVerification(): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  },

  async checkAuth(): Promise<boolean> {
    try {
      const token = await tokenManager.getToken();
      if (!token) return false;

      await apiClient.get('/auth/me');
      return true;
    } catch (error) {
      await tokenManager.removeToken();
      return false;
    }
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};