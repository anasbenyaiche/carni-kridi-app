const mongoose = require('mongoose');

const kridiEntrySchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['debt', 'payment'],
    default: 'debt',
  },
  status: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid',
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    default: function() {
      return this.amount - this.paidAmount;
    },
  },
  paymentDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
kridiEntrySchema.index({ clientId: 1, createdAt: -1 });
kridiEntrySchema.index({ storeId: 1, createdAt: -1 });

// Update remaining amount before saving
kridiEntrySchema.pre('save', function(next) {
  this.remainingAmount = this.amount - this.paidAmount;
  this.updatedAt = Date.now();
  
  // Update status based on payment
  if (this.paidAmount >= this.amount) {
    this.status = 'paid';
    this.paymentDate = this.paymentDate || Date.now();
  } else if (this.paidAmount > 0) {
    this.status = 'partial';
  } else {
    this.status = 'unpaid';
  }
  
  next();
});

module.exports = mongoose.model('KridiEntry', kridiEntrySchema);