const { initializeApp, cert } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const Notification = require('../models/Notification');
const Admin = require('../models/Admin');

// Initialize Firebase Admin only if credentials are provided
let isFirebaseInitialized = false;
let messaging;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines if present
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    messaging = getMessaging(app);
    isFirebaseInitialized = true;
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.warn('⚠️ Firebase credentials missing in .env. Push notifications will be mocked.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

/**
 * Sends a push notification to all admins and saves it in the database.
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data payload (e.g. { orderId: '...' })
 */
const sendAdminPushNotification = async (title, body, data = {}) => {
  try {
    // Save to MongoDB
    const notification = await Notification.create({
      title,
      message: body,
      type: data.type || 'INFO',
      orderId: data.orderId || null
    });

    if (!isFirebaseInitialized) {
      console.log(`[MOCK PUSH] Sent: "${title}" - ${body}`);
      return notification;
    }

    // Fetch all admin FCM tokens
    const admins = await Admin.find({ fcmTokens: { $exists: true, $not: { $size: 0 } } });
    let tokens = [];
    admins.forEach(admin => {
      tokens = tokens.concat(admin.fcmTokens);
    });

    // Remove duplicates
    tokens = [...new Set(tokens)];

    if (tokens.length === 0) {
      console.log('No admin FCM tokens found. Skipping push notification.');
      return notification;
    }

    // Send Multicast Message
    const message = {
      notification: { title, body },
      data: {
        ...data,
        notificationId: notification._id.toString()
      },
      tokens
    };

    const response = await messaging.sendEachForMulticast(message);

    // Optionally remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      if (failedTokens.length > 0) {
        await Admin.updateMany({}, { $pullAll: { fcmTokens: failedTokens } });
        console.log(`Removed ${failedTokens.length} invalid FCM tokens.`);
      }
    }

    return notification;
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = {
  sendAdminPushNotification,
  isFirebaseInitialized
};
