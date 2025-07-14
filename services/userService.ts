import { apiClient } from './api';

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: 'admin' | 'attara' | 'worker' | 'client';
  storeId?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  role?: 'admin' | 'attara' | 'worker' | 'client';
  storeId?: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  email?: string;
  role?: 'admin' | 'attara' | 'worker' | 'client';
  verified?: boolean;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async getUserProfile(): Promise<User> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  async updateUserRole(id: string, role: string): Promise<{ message: string }> {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiClient.get(`/users/role/${role}`);
    return response.data;
  },

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  },
};