const BaseController = require('./BaseController');
const storeService = require('../services/storeService');
const { validationResult } = require('express-validator');

class StoreController extends BaseController {
  async getStore(req, res) {
    try {
      const storeId = req.user.storeId;
      const store = await storeService.getStoreById(storeId, true);
      
      if (!store) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, store);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getStoreById(req, res) {
    try {
      const { id } = req.params;
      const store = await storeService.getStoreById(id, true);
      
      if (!store) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, store);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createStore(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.handleBadRequest(res, { errors: errors.array() });
      }

      const ownerId = req.user._id;
      const store = await storeService.createStore(req.body, ownerId);
      
      this.handleSuccess(res, store, 201);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateStore(req, res) {
    try {
      const storeId = req.user.storeId;
      const ownerId = req.user.role === 'attara' ? req.user._id : null;

      const store = await storeService.updateStore(storeId, req.body, ownerId);
      
      if (!store) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, store);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteStore(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const result = await storeService.deleteStore(id, ownerId);
      
      if (!result) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, { message: 'Store deleted successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getStoresByOwner(req, res) {
    try {
      const ownerId = req.user._id;
      const stores = await storeService.getStoresByOwner(ownerId);
      
      this.handleSuccess(res, stores);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async toggleStoreStatus(req, res) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;

      const store = await storeService.toggleStoreStatus(id, ownerId);
      
      if (!store) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, store);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getStoreSettings(req, res) {
    try {
      const storeId = req.user.storeId;
      const settings = await storeService.getStoreSettings(storeId);
      
      if (!settings) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, settings);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateStoreSettings(req, res) {
    try {
      const storeId = req.user.storeId;
      const ownerId = req.user.role === 'attara' ? req.user._id : null;

      const settings = await storeService.updateStoreSettings(storeId, req.body, ownerId);
      
      if (!settings) {
        return this.handleNotFound(res, 'Store not found');
      }

      this.handleSuccess(res, settings);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchStores(req, res) {
    try {
      const { search } = req.query;
      
      if (!search) {
        return this.handleBadRequest(res, 'Search term is required');
      }

      const stores = await storeService.searchStores(search);
      this.handleSuccess(res, stores);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getActiveStores(req, res) {
    try {
      const stores = await storeService.getActiveStores();
      this.handleSuccess(res, stores);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

module.exports = new StoreController();