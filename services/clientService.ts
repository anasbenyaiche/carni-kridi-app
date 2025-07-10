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
};