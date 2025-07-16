import axios from 'axios';
import { apiClient } from './api';

export interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  totalDebt: number;
  totalPaid: number;
  lastTransaction?: Date;
  notes?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientBalance {
  totalDebt: number;
  totalPaid: number;
  currentBalance: number;
}

export interface ClientWithBalance extends Client {
  balance: ClientBalance;
  recentTransactions: any[];
}

export const clientService = {
  async getClients(page = 1, limit = 20, search = '') {
    const response = await apiClient.get('/clients', {
      params: { page, limit, search }
    });
    return response.data;
  },

  async getClient(id: string): Promise<ClientWithBalance> {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  async createClient(clientData: Partial<Client>) {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  },

  async updateClient(id: string, clientData: Partial<Client>) {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data;
  },

  async deleteClient(id: string) {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },

  async exportClients() {
    const response = await axios.get('/api/clients/export', {
      responseType: 'blob', // Important for file download
    });
    // For web: trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clients.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async importClients(fileUri: string) {
    const formData = new FormData();
    // For React Native, you may need to use expo-file-system to get the file
    // For web, just use the File object
    formData.append('file', {
      uri: fileUri,
      name: 'clients.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    } as any);

    await axios.post('/api/clients/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};