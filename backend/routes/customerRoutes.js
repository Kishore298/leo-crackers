const express = require('express');
const router = express.Router();
const { getCustomers } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCustomers);

module.exports = router;