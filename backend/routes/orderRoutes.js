const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, createOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getOrders).post(createOrder); // Public order creation
router.route('/:id').put(protect, updateOrderStatus);

module.exports = router;
