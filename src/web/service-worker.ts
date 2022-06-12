/// <reference lib="webworker" />

const _self = self as unknown as ServiceWorkerGlobalScope;

type PushMessage = {
  title: string;
  body: string;
}

function log (...args: any[]) {
  console.log('service-worker:', ...args);
}

_self.addEventListener('install', (event: ExtendableEvent) => {
  log('install', { event });
  event.waitUntil(_self.skipWaiting());
});

_self.addEventListener('activate', (event: ExtendableEvent) => {
  log('activate', { event });
});

_self.addEventListener('push', (event: PushEvent) => {
  log('push', { event });

  const message = event.data?.json() as PushMessage;
  event.waitUntil(
    _self.registration.showNotification(message.title, {
      body: message.body,
      actions: [
        { title: 'Open Google', action: 'https://google.com' },
      ],
    })
  );
});

_self.addEventListener('notificationclick', (event: NotificationEvent) => {
  log('notificationclick', { event });
  _self.clients.openWindow(event.action);
});
