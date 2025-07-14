const BaseController = require('./BaseController');
const userService = require('../services/userService');
const { validationResult } = require('express-validator');

class UserController extends BaseController {
  async getUsers(req, res) {
    try {
      const storeId = req.user.storeId;
      const users = await userService.getUsersByStore(storeId);
      
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return this.handleNotFound(res, 'User not found');
      }

      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.user._id;
      const user = await userService.getUserProfile(userId);
      
      if (!user) {
        return this.handleNotFound(res, 'User not found');
      }

      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.handleBadRequest(res, { errors: errors.array() });
      }

      const user = await userService.createUser(req.body);
      this.handleSuccess(res, user, 201);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const storeId = req.user.storeId;

      const user = await userService.updateUser(id, req.body, storeId);
      
      if (!user) {
        return this.handleNotFound(res, 'User not found');
      }

      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const storeId = req.user.storeId;

      const user = await userService.updateUserRole(id, role, storeId);
      
      if (!user) {
        return this.handleNotFound(res, 'User not found');
      }

      this.handleSuccess(res, { message: 'User role updated successfully' });
    } catch (error) {
      if (error.message === 'Invalid role') {
        return this.handleBadRequest(res, error.message);
      }
      this.handleError(res, error);
    }
  }

  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const storeId = req.user.storeId;

      const users = await userService.getUsersByRole(role, storeId);
      this.handleSuccess(res, users);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Additional authorization checks can be added here
      // For now, we'll implement basic deletion
      
      this.handleError(res, new Error('User deletion not implemented'), 501);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}

module.exports = new UserController();