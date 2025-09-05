// src/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  purpose: { type: String, enum: ['appointment', 'medicine'], required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
