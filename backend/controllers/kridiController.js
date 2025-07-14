const Client = require('../models/Client');
const KridiEntry = require('../models/KridiEntry');

// Call this after creating/updating/deleting a KridiEntry
async function updateClientDebtAndPaid(clientId) {
  const entries = await KridiEntry.find({ clientId });

  const totalDebt = entries
    .filter(e => e.type === 'debt')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalPaid = entries
    .filter(e => e.type === 'payment')
    .reduce((sum, e) => sum + e.amount, 0);

  await Client.findByIdAndUpdate(clientId, {
    totalDebt,
    totalPaid,
  });
}

// Example usage after creating a KridiEntry
async function createKridiEntry(req, res) {
  const entry = await KridiEntry.create(req.body);
  await updateClientDebtAndPaid(entry.clientId);
  res.json(entry);
}

// Example usage after updating a KridiEntry
async function updateKridiEntry(req, res) {
  const entry = await KridiEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await updateClientDebtAndPaid(entry.clientId);
  res.json(entry);
}

// Example usage after deleting a KridiEntry
async function deleteKridiEntry(req, res) {
  const entry = await KridiEntry.findByIdAndDelete(req.params.id);
  if (entry) {
    await updateClientDebtAndPaid(entry.clientId);
  }
  res.json({ success: true });
}