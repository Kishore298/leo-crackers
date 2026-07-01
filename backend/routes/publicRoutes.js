const express = require('express');
const router = express.Router();
const { getHomeData, getProductBySlug, getCategoryBySlug } = require('../controllers/publicController');

router.get('/home', getHomeData);
router.get('/products/:slug', getProductBySlug);
router.get('/categories/:slug', getCategoryBySlug);

module.exports = router;