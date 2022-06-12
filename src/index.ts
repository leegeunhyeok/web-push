type Store = {
  pushSupport: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

type Elements = {
  message: HTMLInputElement | null;
  targetUserId: HTMLInputElement | null;
}

const userId = localStorage.getItem('userId');
const elements: Elements = {
  message: null,
  targetUserId: null,
};

const store: Store = {
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
  const targetId = elements.targetUserId?.value;
  const message = elements.message?.value ?? '';
  console.log('sendPushNotification', { targetId, message });

  if (!targetId) {
    alert('Target userId cannot be empty');
    return;
  }

  await fetch('/send-push-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetId, message }),
  });
}

function logout () {
  localStorage.removeItem('userId');
  location.href = '/login.html';
}

window.onload = () => {
  elements.message = document.getElementById('message') as HTMLInputElement;
  elements.targetUserId = document.getElementById('target_user_id') as HTMLInputElement;
}

registerServiceWorker();
