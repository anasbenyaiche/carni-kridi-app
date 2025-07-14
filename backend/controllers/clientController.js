const BaseController = require('./BaseController');
const clientService = require('../services/clientService');
const { validationResult } = require('express-validator');

class ClientController extends BaseController {
  async getClients(req, res) {
    try {
      const { page, limit } = this.extractPaginationParams(req.query);
      const { search } = this.extractSearchParams(req.query);
      const storeId = req.user.storeId;

      const result = await clientService.getClientsByStore(storeId, { page, limit, search });
      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getClient(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const result = await clientService.getClientWithBalance(id, storeId);
      
      if (!result) {
        return this.handleNotFound(res, 'Client not found');
      }

      this.handleSuccess(res, result);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createClient(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.handleBadRequest(res, { errors: errors.array() });
      }

      const storeId = req.user.storeId;
      const client = await clientService.createClient(req.body, storeId);
      
      this.handleSuccess(res, client, 201);
    } catch (error) {
      if (error.message === 'Client already exists in this store') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async updateClient(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const client = await clientService.updateClient(id, req.body, storeId);
      
      if (!client) {
        return this.handleNotFound(res, 'Client not found');
      }

      this.handleSuccess(res, client);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const result = await clientService.deleteClient(id, storeId);
      
      if (!result) {
        return this.handleNotFound(res, 'Client not found');
      }

      this.handleSuccess(res, { message: 'Client deleted successfully' });
    } catch (error) {
      if (error.message === 'Cannot delete client with outstanding debt') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }
}

module.exports = new ClientController();