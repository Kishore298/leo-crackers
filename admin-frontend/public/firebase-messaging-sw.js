self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('[firebase-messaging-sw.js] Received push event', payload);

      const title = payload?.notification?.title || 'Leo Crackers Update';
      const options = {
        body: payload?.notification?.body || 'You have a new notification.',
        icon: '/assets/leo-logo.png',
        badge: '/assets/leo-logo.png',
        data: payload?.data || {}
      };

      event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
      console.error('Error parsing push payload', err);
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
