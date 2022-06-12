type Store = {
  pushSupport: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
  pushSubscription: PushSubscription | null;
}

type Elements = {
  notificationPermission: HTMLParagraphElement | null;
  pushSupport: HTMLParagraphElement | null;
  registration: HTMLParagraphElement | null;
  subscription: HTMLPreElement | null;
  message: HTMLInputElement | null;
  targetUserId: HTMLInputElement | null;
}

const userId = localStorage.getItem('userId');
const elements: Elements = {
  // Status text
  registration: null,
  pushSupport: null,
  notificationPermission: null,
  subscription: null,
  // Inputs
  message: null,
  targetUserId: null,
};

const store: Store = {
  pushSupport: false,
  serviceWorkerRegistration: null,
  pushSubscription: null,
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
  store.pushSubscription = await registration?.pushManager?.getSubscription();

  updateStatus();
}

async function sendSubscriptionToServer (subscription?: PushSubscription) {
  console.log('sendSubscriptionToServer', { subscription });

  if (!subscription) {
    console.warn('sendSubscriptionToServer - subscription cannot be empty');
    return;
  }

  const response = await fetch('/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, subscription }),
  });

  console.log('sendSubscriptionToServer', { response });
}

async function subscribeToPush () {
  const response = await fetch('/vapid-public-key');
  const vapidPublicKey = await response.text();
  console.log('subscribeToPush', { vapidPublicKey });

  const registration = store.serviceWorkerRegistration;

  if (!registration) {
    console.warn('subscribeToPush - service worker is not registered');
    return;
  }

  const subscription = await registration?.pushManager.subscribe({
    applicationServerKey: vapidPublicKey,
    userVisibleOnly: true,
  });
  store.pushSubscription = subscription;
  await sendSubscriptionToServer(subscription);

  updateStatus();
}

async function sendPushNotification () {
  const targetId = elements.targetUserId?.value;
  const message = elements.message?.value ?? '';
  console.log('sendPushNotification', { targetId, message });

  if (!targetId) {
    alert('Target userId cannot be empty');
    return;
  }

  const response = await fetch('/send-push-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targetId, message }),
  });

  console.log('sendPushNotification', { response });
}

async function updateStatus () {
  const setText = (element: HTMLElement | null, value: string | boolean) => {
    if (element) {
      element.textContent = value.toString();
      typeof value === 'boolean' && element.classList.add(value ? 't' : 'f');
    }
  }

  setText(elements.registration, !!store.serviceWorkerRegistration);
  setText(elements.pushSupport, store.pushSupport);
  setText(elements.notificationPermission, Notification.permission);
  setText(elements.subscription, JSON.stringify(store.pushSubscription, null, 2));
}

function logout () {
  localStorage.removeItem('userId');
  location.href = '/login.html';
}

window.onload = () => {
  elements.registration = document.getElementById('registration_status') as HTMLParagraphElement;
  elements.pushSupport = document.getElementById('push_support_status') as HTMLParagraphElement;
  elements.notificationPermission = document.getElementById('notification_permission_status') as HTMLParagraphElement;
  elements.subscription = document.getElementById('subscription') as HTMLPreElement;
  elements.message = document.getElementById('message') as HTMLInputElement;
  elements.targetUserId = document.getElementById('target_user_id') as HTMLInputElement;
  updateStatus();
}

registerServiceWorker();
