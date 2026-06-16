const express = require('express');
const router = express.Router();
const multer = require('multer');
const { importData } = require('../controllers/importController');
const { protect } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, upload.single('file'), importData);

module.exports = router;