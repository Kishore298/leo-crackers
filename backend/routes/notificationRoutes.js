const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  saveToken 
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getNotifications).delete(protect, deleteAllNotifications);
router.route('/read-all').put(protect, markAllAsRead);
router.route('/token').post(protect, saveToken);
router.route('/:id')
  .put(protect, markAsRead)
  .delete(protect, deleteNotification);

module.exports = router;
