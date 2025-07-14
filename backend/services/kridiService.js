const BaseService = require('./BaseService');
const KridiEntry = require('../models/KridiEntry');
const Client = require('../models/Client');

class KridiService extends BaseService {
  constructor() {
    super(KridiEntry);
  }

  async getKridiEntriesByClient(clientId, options = {}) {
    const { page = 1, limit = 20 } = options;

    const entries = await this.find(
      { clientId },
      {
        sort: { createdAt: -1 },
        limit: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        populate: 'createdBy',
        select: 'name'
      }
    );

    const total = await this.count({ clientId });

    return {
      entries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    };
  }

  async createKridiEntry(entryData, createdBy) {
    // Verify client exists and belongs to store
    const client = await Client.findById(entryData.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const entry = await this.create({
      ...entryData,
      storeId: client.storeId,
      createdBy,
    });

    // Update client's last transaction date
    await Client.findByIdAndUpdate(entryData.clientId, {
      lastTransaction: new Date(),
    });

    return entry;
  }

  async markPayment(entryId, paidAmount, storeId) {
    const entry = await this.findById(entryId);
    
    if (!entry || entry.storeId.toString() !== storeId.toString()) {
      return null;
    }

    if (paidAmount > entry.remainingAmount) {
      throw new Error('Payment amount cannot exceed remaining amount');
    }

    const newPaidAmount = entry.paidAmount + paidAmount;
    const remainingAmount = entry.amount - newPaidAmount;

    let status = 'unpaid';
    let paymentDate = entry.paymentDate;

    if (remainingAmount <= 0) {
      status = 'paid';
      paymentDate = new Date();
    } else if (newPaidAmount > 0) {
      status = 'partial';
    }

    return await this.update(entryId, {
      paidAmount: newPaidAmount,
      remainingAmount,
      status,
      paymentDate,
    });
  }

  async getStoreSummary(storeId) {
    const summary = await this.aggregate([
      { $match: { storeId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          remaining: { $sum: '$remainingAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const clientCount = await Client.countDocuments({ storeId });
    const activeClients = await Client.countDocuments({ 
      storeId, 
      lastTransaction: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
    });

    return {
      summary,
      clientCount,
      activeClients,
    };
  }

  async getRecentEntries(storeId, limit = 10) {
    return await this.find(
      { storeId },
      {
        sort: { createdAt: -1 },
        limit,
        populate: 'clientId createdBy',
        select: 'name phone name'
      }
    );
  }

  async getEntriesByStore(storeId, options = {}) {
    const { 
      page = 1, 
      limit = 20, 
      type = null, 
      status = null,
      startDate = null,
      endDate = null 
    } = options;

    const filter = { storeId };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const entries = await this.find(filter, {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      populate: 'clientId createdBy',
      select: 'name phone name'
    });

    const total = await this.count(filter);

    return {
      entries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    };
  }

  async deleteEntry(entryId, storeId) {
    const entry = await this.findById(entryId);
    
    if (!entry || entry.storeId.toString() !== storeId.toString()) {
      return null;
    }

    // Only allow deletion of unpaid entries
    if (entry.status !== 'unpaid') {
      throw new Error('Only unpaid entries can be deleted');
    }

    return await this.delete(entryId);
  }

  async updateEntry(entryId, entryData, storeId) {
    const entry = await this.findById(entryId);
    
    if (!entry || entry.storeId.toString() !== storeId.toString()) {
      return null;
    }

    // Only allow updating reason and amount for unpaid entries
    if (entry.status !== 'unpaid') {
      throw new Error('Only unpaid entries can be updated');
    }

    const allowedFields = ['reason', 'amount'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (entryData[field] !== undefined) {
        updateData[field] = entryData[field];
      }
    });

    // Recalculate remaining amount if amount is updated
    if (updateData.amount) {
      updateData.remainingAmount = updateData.amount - entry.paidAmount;
    }

    return await this.update(entryId, updateData);
  }
}

module.exports = new KridiService();