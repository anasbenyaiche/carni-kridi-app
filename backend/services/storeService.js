const BaseService = require('./BaseService');
const Store = require('../models/Store');

class StoreService extends BaseService {
  constructor() {
    super(Store);
  }

  async getStoreById(storeId, includeOwner = true) {
    const populate = includeOwner ? 'ownerId' : '';
    const select = includeOwner ? 'name email' : '';
    
    if (populate) {
      return await this.findById(storeId, `${populate} ${select}`);
    }
    return await this.findById(storeId);
  }

  async getStoresByOwner(ownerId) {
    return await this.find(
      { ownerId },
      {
        sort: { createdAt: -1 }
      }
    );
  }

  async createStore(storeData, ownerId) {
    const store = await this.create({
      ...storeData,
      ownerId,
    });

    return store;
  }

  async updateStore(storeId, storeData, ownerId = null) {
    const store = await this.findById(storeId);
    
    if (!store) {
      return null;
    }

    // If ownerId is provided, verify store belongs to owner
    if (ownerId && store.ownerId.toString() !== ownerId.toString()) {
      return null;
    }

    // Merge settings if provided
    const updateData = { ...storeData };
    if (storeData.settings && store.settings) {
      updateData.settings = { ...store.settings, ...storeData.settings };
    }

    return await this.update(storeId, updateData);
  }

  async deleteStore(storeId, ownerId) {
    const store = await this.findById(storeId);
    
    if (!store || store.ownerId.toString() !== ownerId.toString()) {
      return null;
    }

    // TODO: Add validation to check if store has active clients/transactions
    // For now, we'll allow deletion

    return await this.delete(storeId);
  }

  async toggleStoreStatus(storeId, ownerId) {
    const store = await this.getStoreById(storeId, false);
    
    if (!store || store.ownerId.toString() !== ownerId.toString()) {
      return null;
    }

    return await this.update(storeId, { active: !store.active });
  }

  async getStoreSettings(storeId) {
    const store = await this.findById(storeId);
    return store ? store.settings : null;
  }

  async updateStoreSettings(storeId, settings, ownerId = null) {
    const store = await this.findById(storeId);
    
    if (!store) {
      return null;
    }

    // If ownerId is provided, verify store belongs to owner
    if (ownerId && store.ownerId.toString() !== ownerId.toString()) {
      return null;
    }

    const updatedSettings = { ...store.settings, ...settings };
    
    return await this.update(storeId, { settings: updatedSettings });
  }

  async getActiveStores() {
    return await this.find(
      { active: true },
      {
        populate: 'ownerId',
        select: 'name email',
        sort: { createdAt: -1 }
      }
    );
  }

  async searchStores(searchTerm) {
    const filter = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
      ]
    };

    return await this.find(filter, {
      populate: 'ownerId',
      select: 'name email',
      sort: { name: 1 }
    });
  }
}

module.exports = new StoreService();