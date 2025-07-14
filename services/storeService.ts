import { apiClient } from './api';

export interface Store {
  _id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  settings: {
    currency: string;
    language: 'ar' | 'fr' | 'en';
    maxCreditLimit: number;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoreData {
  name: string;
  address: string;
  phone: string;
  settings?: {
    currency?: string;
    language?: 'ar' | 'fr' | 'en';
    maxCreditLimit?: number;
  };
}

export interface UpdateStoreData {
  name?: string;
  address?: string;
  phone?: string;
  settings?: {
    currency?: string;
    language?: 'ar' | 'fr' | 'en';
    maxCreditLimit?: number;
  };
}

export const storeService = {
  async getStore(): Promise<Store> {
    const response = await apiClient.get('/stores');
    return response.data;
  },

  async getStoreById(id: string): Promise<Store> {
    const response = await apiClient.get(`/stores/${id}`);
    return response.data;
  },

  async createStore(storeData: CreateStoreData): Promise<Store> {
    const response = await apiClient.post('/stores', storeData);
    return response.data;
  },

  async updateStore(storeData: UpdateStoreData): Promise<Store> {
    const response = await apiClient.put('/stores', storeData);
    return response.data;
  },

  async deleteStore(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/stores/${id}`);
    return response.data;
  },

  async getStoresByOwner(): Promise<Store[]> {
    const response = await apiClient.get('/stores/my-stores');
    return response.data;
  },

  async toggleStoreStatus(id: string): Promise<Store> {
    const response = await apiClient.put(`/stores/${id}/toggle-status`);
    return response.data;
  },

  async getStoreSettings(): Promise<Store['settings']> {
    const response = await apiClient.get('/stores/settings');
    return response.data;
  },

  async updateStoreSettings(settings: UpdateStoreData['settings']): Promise<Store['settings']> {
    const response = await apiClient.put('/stores/settings', settings);
    return response.data;
  },

  async searchStores(searchTerm: string): Promise<Store[]> {
    const response = await apiClient.get('/stores/search', {
      params: { search: searchTerm }
    });
    return response.data;
  },

  async getActiveStores(): Promise<Store[]> {
    const response = await apiClient.get('/stores/active');
    return response.data;
  },
};