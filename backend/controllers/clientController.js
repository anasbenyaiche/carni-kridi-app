const Client = require('../models/Client');
const KridiEntry = require('../models/KridiEntry');

// Get all clients for a store, with computed debt/paid
exports.getClients = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
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
};

// Get single client with summary
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const recentTransactions = await KridiEntry.find({ clientId: client._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name');

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

    res.json({
      client,
      balance,
      recentTransactions,
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to get client' });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const { name, phone, email, address, creditLimit, notes } = req.body;

    const existingClient = await Client.findOne({ 
      phone, 
      storeId: req.user.storeId 
    });
    if (existingClient) {
      return res.status(400).json({ error: 'Client already exists in this store' });
    }

    const client = new Client({
      name,
      phone,
      email,
      address,
      creditLimit,
      notes,
      storeId: req.user.storeId,
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const { name, phone, email, address, creditLimit, notes } = req.body;

    Object.assign(client, {
      name: name || client.name,
      phone: phone || client.phone,
      email: email || client.email,
      address: address || client.address,
      creditLimit: creditLimit || client.creditLimit,
      notes: notes || client.notes,
    });

    await client.save();
    res.json(client);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.storeId.toString() !== req.user.storeId.toString()) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const outstandingDebt = await KridiEntry.aggregate([
      { $match: { clientId: client._id, status: { $ne: 'paid' } } },
      { $group: { _id: null, total: { $sum: '$remainingAmount' } } },
    ]);

    if (outstandingDebt[0]?.total > 0) {
      return res.status(400).json({ error: 'Cannot delete client with outstanding debt' });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};