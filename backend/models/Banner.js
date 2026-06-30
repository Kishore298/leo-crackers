const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, enum: ['image', 'text'], default: 'image' },
  image: { type: String }, // Cloudinary URL, optional for text banners
  text: { type: String },
  textColor: { type: String, default: '#ffffff' },
  fontSize: { type: String, default: '16px' },
  fontWeight: { type: String, default: 'normal' },
  textAlign: { type: String, default: 'center' },
  posX: { type: String, default: '50%' },
  posY: { type: String, default: '50%' },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);