export type {};
declare const self: ServiceWorkerGlobalScope;

type PushMessage = {
  title: string;
  body: string;
}

function log (...args: any[]) {
  console.log('service-worker:', ...args);
}

self.addEventListener('install', (event: ExtendableEvent) => {
  log('install', { event });
});

self.addEventListener('push', (event: PushEvent) => {
  log('push', { event });

  const message = event.data?.json() as PushMessage;
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      actions: [
        { title: 'Open Google', action: 'https://google.com' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  log('notificationclick', { event });
  self.clients.openWindow(event.action);
});
