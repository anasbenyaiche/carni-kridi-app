const BaseController = require('./BaseController');
const kridiService = require('../services/kridiService');
const clientService = require('../services/clientService');
const { validationResult } = require('express-validator');

class KridiController extends BaseController {
  async getKridiEntriesByClient(req, res) {
    try {
      const { clientId } = req.params;
      const { page, limit } = this.extractPaginationParams(req.query);
      const storeId = req.user.storeId;

      // Verify client belongs to user's store
      const client = await clientService.findById(clientId);
      if (!client || client.storeId.toString() !== storeId.toString()) {
        return this.handleNotFound(res, 'Client not found');
      }

      const result = await kridiService.getKridiEntriesByClient(clientId, { page, limit });
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createKridiEntry(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.handleBadRequest(res, { errors: errors.array() });
      }

      const createdBy = req.user._id;
      const entry = await kridiService.createKridiEntry(req.body, createdBy);
      
      this.handleSuccess(res, entry, 201);
    } catch (error) {
      if (error.message === 'Client not found') {
        return this.handleNotFound(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async markPayment(req, res) {
    try {
      const { id } = req.params;
      const { paidAmount } = req.body;
      const storeId = req.user.storeId;

      if (!paidAmount || paidAmount <= 0) {
        return this.handleBadRequest(res, 'Valid payment amount is required');
      }

      const entry = await kridiService.markPayment(id, paidAmount, storeId);
      
      if (!entry) {
        return this.handleNotFound(res, 'Kridi entry not found');
      }

      this.handleSuccess(res, entry);
    } catch (error) {
      if (error.message === 'Payment amount cannot exceed remaining amount') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async getSummary(req, res) {
    try {
      const storeId = req.user.storeId;
      const summary = await kridiService.getStoreSummary(storeId);
      
      this.handleSuccess(res, summary);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getRecentEntries(req, res) {
    try {
      const storeId = req.user.storeId;
      const { limit = 10 } = req.query;
      
      const entries = await kridiService.getRecentEntries(storeId, parseInt(limit));
      this.handleSuccess(res, entries);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getEntriesByStore(req, res) {
    try {
      const storeId = req.user.storeId;
      const { page, limit } = this.extractPaginationParams(req.query);
      const { type, status, startDate, endDate } = req.query;

      const options = { 
        page, 
        limit, 
        type, 
        status, 
        startDate, 
        endDate 
      };

      const result = await kridiService.getEntriesByStore(storeId, options);
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateEntry(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const entry = await kridiService.updateEntry(id, req.body, storeId);
      
      if (!entry) {
        return this.handleNotFound(res, 'Kridi entry not found');
      }

      this.handleSuccess(res, entry);
    } catch (error) {
      if (error.message === 'Only unpaid entries can be updated') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async deleteEntry(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const result = await kridiService.deleteEntry(id, storeId);
      
      if (!result) {
        return this.handleNotFound(res, 'Kridi entry not found');
      }

      this.handleSuccess(res, { message: 'Kridi entry deleted successfully' });
    } catch (error) {
      if (error.message === 'Only unpaid entries can be deleted') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async getEntry(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const entry = await kridiService.findById(id, 'clientId createdBy');
      
      if (!entry || entry.storeId.toString() !== storeId.toString()) {
        return this.handleNotFound(res, 'Kridi entry not found');
      }

      this.handleSuccess(res, entry);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

module.exports = new KridiController();