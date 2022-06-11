type Store = {
  ready: boolean;
  pushSupport: boolean;
  serviceWorkerRegistration: null | ServiceWorkerRegistration;
}

const userId = localStorage.getItem('userId');
const store: Store = {
  ready: false,
  pushSupport: false,
  serviceWorkerRegistration: null,
};

if (!userId) location.href = '/login.html';

async function registerServiceWorker () {
  if (!('serviceWorker' in navigator)) return;

  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    registration = await navigator.serviceWorker.register('/dist/service-worker.js');
  }

  store.serviceWorkerRegistration = registration ?? null;
  store.pushSupport = !!registration?.pushManager;
}

async function sendSubscriptionToServer (subscription?: PushSubscription) {
  console.log('sendSubscriptionToServer', { subscription });

  if (!subscription) return;

  await fetch('/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, subscription }),
  });
}

async function subscribeToPush () {
  const response = await fetch('/vapid-public-key');
  const vapidPublicKey = await response.text();
  console.log('subscribeToPush', { vapidPublicKey });

  const registration = store.serviceWorkerRegistration;
  const subscription = await registration?.pushManager.subscribe({
    applicationServerKey: vapidPublicKey,
    userVisibleOnly: true,
  });
  await sendSubscriptionToServer(subscription);
}

async function sendPushNotification () {
  const targetId = (document.getElementById('target_id') as HTMLInputElement).value;
  console.log('sendPushNotification', { targetId });
  await fetch('/send-push-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetId }),
  });
}

window.onload = () => store.ready = true;

registerServiceWorker();
