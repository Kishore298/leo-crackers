const mongoose = require('mongoose');

const globalDiscountSchema = new mongoose.Schema({
  discountPercentage: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('GlobalDiscount', globalDiscountSchema);