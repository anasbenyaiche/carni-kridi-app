const mongoose = require('mongoose');
const User = require('../models/User');
const Store = require('../models/Store');
const Client = require('../models/Client');
const KridiEntry = require('../models/KridiEntry');
require('dotenv').config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carni-kridi');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Store.deleteMany({});
    await Client.deleteMany({});
    await KridiEntry.deleteMany({});
// 1. Create a store owner instance (not saved yet)
const attara = new User({
  name: 'Ahmed Ben Salem',
  phone: '+21628123456',
  email: 'ahmed@example.com',
  passwordHash: '123456',
  role: 'attara',
  verified: true,
});

// 2. Create a store first
const store = new Store({
  name: 'Épicerie Ahmed',
  address: '123 Rue de la République, Tunis',
  phone: '+21628123456',
  ownerId: attara._id, // use the unsaved attara _id
  settings: {
    currency: 'TND',
    language: 'ar',
    maxCreditLimit: 1000,
  },
});
await store.save();

// 3. Now update attara with the storeId
attara.storeId = store._id;
await attara.save(); // save after storeId is defined

    // Create a worker
    const worker = new User({
      name: 'Fatima Khelil',
      phone: '+21629123456',
      email: 'fatima@example.com',
      passwordHash: '123456',
      role: 'worker',
      storeId: store._id,
      verified: true,
    });
    await worker.save();

    // Create clients
    const clients = [
      {
        name: 'Mohamed Trabelsi',
        phone: '+21625111111',
        email: 'mohamed@example.com',
        storeId: store._id,
        creditLimit: 500,
      },
      {
        name: 'Aisha Mansouri',
        phone: '+21625222222',
        email: 'aisha@example.com',
        storeId: store._id,
        creditLimit: 300,
      },
      {
        name: 'Youssef Benhamed',
        phone: '+21625333333',
        email: 'youssef@example.com',
        storeId: store._id,
        creditLimit: 800,
      },
    ];

    const createdClients = await Client.insertMany(clients);

    // Create kridi entries
    const kridiEntries = [
      {
        clientId: createdClients[0]._id,
        storeId: store._id,
        amount: 50,
        reason: 'Produits alimentaires',
        type: 'debt',
        createdBy: attara._id,
      },
      {
        clientId: createdClients[0]._id,
        storeId: store._id,
        amount: 20,
        reason: 'Paiement partiel',
        type: 'payment',
        createdBy: attara._id,
      },
      {
        clientId: createdClients[1]._id,
        storeId: store._id,
        amount: 75,
        reason: 'Courses de la semaine',
        type: 'debt',
        createdBy: worker._id,
      },
      {
        clientId: createdClients[2]._id,
        storeId: store._id,
        amount: 120,
        reason: 'Produits divers',
        type: 'debt',
        createdBy: attara._id,
      },
      {
        clientId: createdClients[2]._id,
        storeId: store._id,
        amount: 50,
        reason: 'Paiement',
        type: 'payment',
        createdBy: attara._id,
      },
    ];

    await KridiEntry.insertMany(kridiEntries);

    console.log('Database seeded successfully!');
    console.log('Login credentials:');
    console.log('Attara: ahmed@example.com / 123456');
    console.log('Worker: fatima@example.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();