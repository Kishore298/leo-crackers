const express = require('express');
const router = express.Router();
const { getOrders, updateOrderStatus, createOrder, getDashboardStats, resendOrderConfirmation } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/dashboard/stats').get(protect, getDashboardStats);
router.route('/').get(protect, getOrders).post(createOrder); // Public order creation
router.route('/:id').put(protect, updateOrderStatus);
router.route('/:id/resend-confirmation').post(protect, resendOrderConfirmation);

module.exports = router;
