const BaseController = require('./BaseController');
const clientService = require('../services/clientService');
const { validationResult } = require('express-validator');
const Client = require('../models/Client');
const KridiEntry = require('../models/KridiEntry');
const fs = require('fs');
const ExcelJS = require('exceljs'); // <-- Use exceljs instead of xlsx

class ClientController extends BaseController {
  async getClients(req, res) {
    try {
      const { page, limit } = this.extractPaginationParams(req.query);
      const { search } = this.extractSearchParams(req.query);
      const storeId = req.user.storeId;

      const query = { storeId };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];  
      }

      const clients = await Client.find(query)
        .sort({ lastTransaction: -1, name: 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Client.countDocuments(query);

      // Calculate debt and paid for each client
      const clientsWithBalance = await Promise.all(clients.map(async (client) => {
        const totalDebtAgg = await KridiEntry.aggregate([
          { $match: { clientId: client._id, type: 'debt' } },
          { $group: { _id: null, total: { $sum: '$remainingAmount' } } },
        ]);
        const totalPaidAgg = await KridiEntry.aggregate([
          { $match: { clientId: client._id, type: 'payment' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalDebt = totalDebtAgg[0]?.total || 0;
        const totalPaid = totalPaidAgg[0]?.total || 0;
        const currentBalance = totalDebt - totalPaid;

        return {
          ...client.toObject(),
          totalDebt,
          totalPaid,
          currentBalance,
        };
      }));

      res.json({
        clients: clientsWithBalance,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({ error: 'Failed to get clients' });
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

  // --- EXCELJS IMPORT FUNCTIONALITY ---
  async importClientsFromExcel(req, res) {
    try {
      const filePath = req.file.path;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];

      // Assuming first row is header: name | phone | email | debt
      const rows = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // skip header
        const [name, phone, email, debt] = row.values.slice(1); // skip first empty cell
        rows.push({ name, phone, email, debt });
      });

      for (const row of rows) {
        const { name, phone, email, debt } = row;
        if (!name || !phone || !debt) continue;

        // Create or find client
        let client = await Client.findOne({ phone, storeId: req.user.storeId });
        if (!client) {
          client = new Client({
            name,
            phone,
            email,
            storeId: req.user.storeId,
          });
          await client.save();
        }

        // Create debt entry if debt > 0
        if (Number(debt) > 0) {
          await KridiEntry.create({
            clientId: client._id,
            storeId: req.user.storeId,
            amount: Number(debt),
            reason: 'Import Excel',
            type: 'debt',
            createdBy: req.user._id,
          });
        }
      }

      fs.unlinkSync(filePath); // Clean up uploaded file
      res.json({ message: 'Import terminé avec succès.' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'import.' });
    }
  }

  async exportClientsToExcel(req, res) {
    try {
      const storeId = req.user.storeId;
      const clients = await Client.find({ storeId }).sort({ name: 1 });

      // Prepare workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Clients');

      // Add header row
      worksheet.addRow(['Nom', 'Téléphone', 'Email', 'Limite Crédit', 'Dette', 'Payé', 'Solde']);

      // For each client, calculate debt/paid and add row
      for (const client of clients) {
        // Calculate debt and paid
        const totalDebtAgg = await KridiEntry.aggregate([
          { $match: { clientId: client._id, type: 'debt' } },
          { $group: { _id: null, total: { $sum: '$remainingAmount' } } },
        ]);
        const totalPaidAgg = await KridiEntry.aggregate([
          { $match: { clientId: client._id, type: 'payment' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalDebt = totalDebtAgg[0]?.total || 0;
        const totalPaid = totalPaidAgg[0]?.total || 0;
        const currentBalance = totalDebt - totalPaid;

        worksheet.addRow([
          client.name,
          client.phone,
          client.email || '',
          client.creditLimit || '',
          totalDebt,
          totalPaid,
          currentBalance,
        ]);
      }

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=clients.xlsx'
      );

      // Write workbook to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'export.' });
    }
  }
}

module.exports = new ClientController();
