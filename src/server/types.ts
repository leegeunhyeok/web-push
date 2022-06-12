import { PushSubscription } from 'web-push';

export type UserSubscription = {
  userId: string;
  subscription: PushSubscription;
};

export type Store = {
  data: UserSubscription[];
};

export type PushMessage = {
  title: string;
  body: string;
};
