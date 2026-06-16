const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/').get(protect, getBanners).post(protect, upload.single('image'), createBanner);
router.route('/:id').put(protect, upload.single('image'), updateBanner).delete(protect, deleteBanner);

module.exports = router;