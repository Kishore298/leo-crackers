const GlobalDiscount = require('../models/GlobalDiscount');

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
      const updatedDiscount = await discount.save();
      res.json(updatedDiscount);
    } else {
      discount = new GlobalDiscount(req.body);
      const createdDiscount = await discount.save();
      res.status(201).json(createdDiscount);
    }
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error });
  }
};

module.exports = { getDiscount, updateDiscount };