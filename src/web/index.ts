type Store = {
  pushSupport: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
  pushSubscription: PushSubscription | null;
}

type Elements = {
  currentUserId: HTMLParagraphElement | null;
  notificationPermission: HTMLParagraphElement | null;
  pushSupport: HTMLParagraphElement | null;
  registration: HTMLParagraphElement | null;
  subscription: HTMLPreElement | null;
  sendStatus: HTMLParagraphElement | null;
  message: HTMLInputElement | null;
  targetUserId: HTMLInputElement | null;
}

const userId = localStorage.getItem('userId');
const elements: Elements = {
  // Status text
  currentUserId: null,
  registration: null,
  pushSupport: null,
  notificationPermission: null,
  subscription: null,
  sendStatus: null,
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
    registration = await navigator.serviceWorker.register('/service-worker.js');
  }

  store.serviceWorkerRegistration = registration ?? null;
  store.pushSupport = !!registration?.pushManager;
  store.pushSubscription = await registration?.pushManager?.getSubscription();

  updateStatus();
}

async function postSubscription (subscription?: PushSubscription) {
  console.log('postSubscription', { subscription });

  if (!subscription) {
    showAlert('postSubscription - subscription cannot be empty');
    return;
  }

  const response = await fetch('/subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, subscription }),
  });

  console.log('postSubscription', { response });
}

async function deleteSubscription () {
  const response = await fetch('/subscription', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  console.log('deleteSubscription', { response });
}

async function subscribe () {
  if (store.pushSubscription) {
    showAlert('subscribe - already subscribed');
    return;
  }

  try {
    const response = await fetch('/vapid-public-key');
    const vapidPublicKey = await response.text();
    console.log('subscribe', { vapidPublicKey });

    const registration = store.serviceWorkerRegistration;

    if (!registration) {
      showAlert('subscribe - service worker is not registered');
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      applicationServerKey: vapidPublicKey,
      userVisibleOnly: true,
    });
    store.pushSubscription = subscription;
    await postSubscription(subscription);
  } catch (error) {
    console.error('subscribe', { error });
  } finally {
    updateStatus();
  }
}

async function unsubscribe () {
  const subscription = store.pushSubscription;

  if (!subscription) {
    showAlert('unsubscribe - push subscription not exist');
    return;
  }

  try {
    const unsubscribed = await subscription.unsubscribe();
    store.pushSubscription = null;
    console.log('unsubscribe', { unsubscribed });
    await deleteSubscription();
  } catch (error) {
    console.error('unsubscribe', { error });
  } finally {
    updateStatus();
  }
}

async function sendPushNotification () {
  const targetId = elements.targetUserId?.value;
  const message = elements.message?.value ?? '';
  console.log('sendPushNotification', { targetId, message });

  if (!targetId) {
    showAlert('Target userId cannot be empty');
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
  setText(elements.sendStatus, `(${response.status}) ${response.statusText} / ${new Date()}`);
}

function setText (element: HTMLElement | null, value: string | boolean) {
  if (!element) return;
  element.textContent = value.toString();
  element.classList.remove('t');
  element.classList.remove('f');
  typeof value === 'boolean' && element.classList.add(value ? 't' : 'f');
}

async function updateStatus () {
  setText(elements.currentUserId, userId as string);
  setText(elements.registration, !!store.serviceWorkerRegistration);
  setText(elements.pushSupport, store.pushSupport);
  setText(elements.notificationPermission, Notification.permission);
  setText(elements.subscription, JSON.stringify(store.pushSubscription, null, 2));
}

function showAlert(message: string) {
  console.warn(message);
  alert(message);
}

function logout () {
  localStorage.removeItem('userId');
  location.href = '/login.html';
}

window.onload = () => {
  elements.currentUserId = document.getElementById('current_user_id') as HTMLParagraphElement;
  elements.registration = document.getElementById('registration_status') as HTMLParagraphElement;
  elements.pushSupport = document.getElementById('push_support_status') as HTMLParagraphElement;
  elements.notificationPermission = document.getElementById('notification_permission_status') as HTMLParagraphElement;
  elements.subscription = document.getElementById('subscription') as HTMLPreElement;
  elements.sendStatus = document.getElementById('send_status') as HTMLParagraphElement;
  elements.message = document.getElementById('message') as HTMLInputElement;
  elements.targetUserId = document.getElementById('target_user_id') as HTMLInputElement;
  updateStatus();
}

registerServiceWorker();
