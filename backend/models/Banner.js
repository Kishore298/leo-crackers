const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  image: { type: String, required: true }, // Cloudinary URL
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);