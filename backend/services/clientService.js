const BaseService = require('./BaseService');
const Client = require('../models/Client');
const KridiEntry = require('../models/KridiEntry');

class ClientService extends BaseService {
  constructor() {
    super(Client);
  }

  async getClientsByStore(storeId, options = {}) {
    const { page = 1, limit = 20, search = '' } = options;
    
    const filter = { storeId };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await this.find(filter, {
      sort: { lastTransaction: -1, name: 1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await this.count(filter);

    return {
      clients,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    };
  }

  async getClientWithBalance(clientId, storeId) {
    const client = await this.findById(clientId);
    
    if (!client || client.storeId.toString() !== storeId.toString()) {
      return null;
    }

    // Get recent transactions
    const recentTransactions = await KridiEntry.find({ clientId: client._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name');

    // Calculate balance
    const totalDebt = await KridiEntry.aggregate([
      { $match: { clientId: client._id, type: 'debt' } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } },
    ]);

    const totalPaid = await KridiEntry.aggregate([
      { $match: { clientId: client._id, type: 'payment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const balance = {
      totalDebt: totalDebt[0]?.total || 0,
      totalPaid: totalPaid[0]?.total || 0,
      currentBalance: (totalDebt[0]?.total || 0) - (totalPaid[0]?.total || 0),
    };

    return {
      client,
      balance,
      recentTransactions,
    };
  }

  async createClient(clientData, storeId) {
    // Check if client exists in same store
    const existingClient = await this.findOne({ 
      phone: clientData.phone, 
      storeId 
    });
    
    if (existingClient) {
      throw new Error('Client already exists in this store');
    }

    const client = await this.create({
      ...clientData,
      storeId,
    });

    return client;
  }

  async updateClient(clientId, clientData, storeId) {
    const client = await this.findById(clientId);
    
    if (!client || client.storeId.toString() !== storeId.toString()) {
      return null;
    }

    const updatedClient = await this.update(clientId, clientData);
    return updatedClient;
  }

  async deleteClient(clientId, storeId) {
    const client = await this.findById(clientId);
    
    if (!client || client.storeId.toString() !== storeId.toString()) {
      return null;
    }

    // Check if client has outstanding debt
    const outstandingDebt = await KridiEntry.aggregate([
      { $match: { clientId: client._id, status: { $ne: 'paid' } } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } },
    ]);

    if (outstandingDebt[0]?.total > 0) {
      throw new Error('Cannot delete client with outstanding debt');
    }

    return await this.delete(clientId);
  }
}

module.exports = new ClientService();