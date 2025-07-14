const BaseService = require('./BaseService');
const User = require('../models/User');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async getUsersByStore(storeId) {
    return await this.find(
      { storeId },
      {
        select: '-passwordHash',
        sort: { createdAt: -1 }
      }
    );
  }

  async getUserById(userId, includePassword = false) {
    const select = includePassword ? '' : '-passwordHash';
    return await this.findById(userId, '', select);
  }

  async getUserByEmail(email) {
    return await this.findOne({ email });
  }

  async getUserByPhone(phone) {
    return await this.findOne({ phone });
  }

  async createUser(userData) {
    // Check for existing email
    const existingEmail = await this.getUserByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Check for existing phone
    const existingPhone = await this.getUserByPhone(userData.phone);
    if (existingPhone) {
      throw new Error('Phone number already exists');
    }

    return await this.create(userData);
  }

  async updateUserRole(userId, role, storeId) {
    const user = await this.findById(userId);
    
    if (!user || user.storeId.toString() !== storeId.toString()) {
      return null;
    }

    if (!['worker', 'client'].includes(role)) {
      throw new Error('Invalid role');
    }

    return await this.update(userId, { role });
  }

  async updateUser(userId, userData, storeId = null) {
    const user = await this.findById(userId);
    
    if (!user) {
      return null;
    }

    // If storeId is provided, verify user belongs to store
    if (storeId && user.storeId.toString() !== storeId.toString()) {
      return null;
    }

    // Remove sensitive fields that shouldn't be updated directly
    const { passwordHash, _id, ...updateData } = userData;

    return await this.update(userId, updateData);
  }

  async validatePassword(userId, candidatePassword) {
    const user = await this.getUserById(userId, true);
    if (!user) {
      return false;
    }

    return await user.comparePassword(candidatePassword);
  }

  async getUserProfile(userId) {
    return await this.findById(userId, 'storeId', '-passwordHash');
  }

  async getAdminUsers() {
    return await this.find(
      { role: 'admin' },
      {
        select: '-passwordHash',
        sort: { createdAt: -1 }
      }
    );
  }

  async getUsersByRole(role, storeId = null) {
    const filter = { role };
    if (storeId) {
      filter.storeId = storeId;
    }

    return await this.find(filter, {
      select: '-passwordHash',
      sort: { createdAt: -1 }
    });
  }
}

module.exports = new UserService();