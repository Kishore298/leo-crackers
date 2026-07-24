const Notification = require('../models/Notification');
const Admin = require('../models/Admin');

// Get latest notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ read: false });
    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark single notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { returnDocument: 'after' }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

// Delete a single notification
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications' });
  }
};

// Save FCM token for the admin
const saveToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    // Since there's typically one admin or we use req.admin._id
    const adminId = req.admin._id;
    
    await Admin.findByIdAndUpdate(adminId, {
      $addToSet: { fcmTokens: token }
    });

    res.json({ message: 'Token saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving token' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  saveToken
};
