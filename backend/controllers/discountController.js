const GlobalDiscount = require('../models/GlobalDiscount');
const Product = require('../models/Product');

// get global discount
const getDiscount = async (req, res) => {
  try {
    const discount = await GlobalDiscount.findOne({});
    res.json(discount || { discountPercentage: 0, isActive: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// update global discount
const updateDiscount = async (req, res) => {
  try {
    let discount = await GlobalDiscount.findOne({});
    if (discount) {
      discount.discountPercentage = req.body.discountPercentage;
      discount.isActive = req.body.isActive;
      await discount.save();
    } else {
      discount = new GlobalDiscount(req.body);
      await discount.save();
    }
    
    // Update all products' actualPrice
    const percentage = discount.isActive ? discount.discountPercentage : 0;
    const products = await Product.find({});
    
    // Process in batches or parallel (Promise.all)
    const updatePromises = products.map(product => {
      product.actualPrice = Math.round(product.mrp - (product.mrp * (percentage / 100)));
      return product.save();
    });
    
    await Promise.all(updatePromises);

    res.json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
};

module.exports = { getDiscount, updateDiscount };