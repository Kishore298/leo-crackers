const express = require('express');
const router = express.Router();
const { getDiscount, updateDiscount } = require('../controllers/discountController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getDiscount).post(protect, updateDiscount);

module.exports = router;