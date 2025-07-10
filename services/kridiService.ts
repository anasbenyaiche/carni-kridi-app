import { apiClient } from './api';

export interface KridiEntry {
  _id: string;
  clientId: string;
  storeId: string;
  amount: number;
  reason: string;
  type: 'debt' | 'payment';
  status: 'unpaid' | 'partial' | 'paid';
  paidAmount: number;
  remainingAmount: number;
  paymentDate?: Date;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const kridiService = {
  async getKridiEntries(clientId: string, page = 1, limit = 20) {
    const response = await apiClient.get(`/kridi/client/${clientId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  async addKridiEntry(entryData: {
    clientId: string;
    amount: number;
    reason: string;
    type: 'debt' | 'payment';
  }) {
    const response = await apiClient.post('/kridi', entryData);
    return response.data;
  },

  async markPayment(entryId: string, paidAmount: number) {
    const response = await apiClient.put(`/kridi/${entryId}/payment`, {
      paidAmount
    });
    return response.data;
  },

  async getSummary() {
    const response = await apiClient.get('/kridi/summary');
    return response.data;
  },

  async deleteEntry(entryId: string) {
    const response = await apiClient.delete(`/kridi/${entryId}`);
    return response.data;
  },
};