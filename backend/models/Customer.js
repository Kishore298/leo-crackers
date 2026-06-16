const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  whatsappNumber: { type: String },
  email: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);