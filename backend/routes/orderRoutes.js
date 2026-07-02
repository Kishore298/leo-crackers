const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, createOrder, getDashboardStats } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/dashboard/stats').get(protect, getDashboardStats);
router.route('/').get(protect, getOrders).post(createOrder); // Public order creation
router.route('/:id').put(protect, updateOrderStatus);

module.exports = router;
